# ml/training/retrain.py

"""
Weekly model retraining.

Retrains all models, validates, and promotes if better.

Usage:
    python -m ml.training.retrain
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from datetime import datetime
from forecasts.models import MLModel
from ml.training.trainer import train_model, promote_model


# Minimum improvement required to promote new model (percentage)
MIN_IMPROVEMENT = 2.0  # 2% better


def get_current_production_metrics(horizon: str) -> dict:
    """Get metrics from current production model."""
    
    model = MLModel.objects.filter(
        horizon=horizon,
        status=MLModel.Status.PRODUCTION
    ).first()
    
    if not model:
        return None
    
    return {
        'mae': model.mae,
        'rmse': model.rmse,
        'mape': model.mape,
        'directional_accuracy': model.directional_accuracy,
    }


def is_better_model(old_metrics: dict, new_metrics: dict) -> tuple:
    """
    Compare old and new model metrics.
    
    Returns:
        (is_better, improvement_pct, reason)
    """
    if not old_metrics:
        return True, 100.0, "No existing production model"
    
    # Compare directional accuracy (higher is better)
    old_da = old_metrics.get('directional_accuracy', 0)
    new_da = new_metrics.get('directional_accuracy', 0)
    
    if old_da > 0:
        da_improvement = ((new_da - old_da) / old_da) * 100
    else:
        da_improvement = 100 if new_da > 0 else 0
    
    # Compare RMSE (lower is better)
    old_rmse = old_metrics.get('rmse', float('inf'))
    new_rmse = new_metrics.get('rmse', float('inf'))
    
    if old_rmse > 0:
        rmse_improvement = ((old_rmse - new_rmse) / old_rmse) * 100
    else:
        rmse_improvement = 0
    
    # Average improvement
    avg_improvement = (da_improvement + rmse_improvement) / 2
    
    is_better = avg_improvement >= MIN_IMPROVEMENT
    
    reason = f"DA: {old_da:.1f}% → {new_da:.1f}% ({da_improvement:+.1f}%), "
    reason += f"RMSE: {old_rmse:.6f} → {new_rmse:.6f} ({rmse_improvement:+.1f}%)"
    
    return is_better, avg_improvement, reason


def retrain_horizon(horizon: str, auto_promote: bool = True) -> dict:
    """
    Retrain model for a specific horizon.
    
    Args:
        horizon: '24H', '30D', '12W', '12M'
        auto_promote: Automatically promote if better
    
    Returns:
        Result dict
    """
    print(f"\n{'='*50}")
    print(f"RETRAINING {horizon}")
    print(f"{'='*50}")
    
    # Get current production metrics
    old_metrics = get_current_production_metrics(horizon)
    
    if old_metrics:
        print(f"\nCurrent production model:")
        print(f"  DA: {old_metrics['directional_accuracy']:.2f}%")
        print(f"  RMSE: {old_metrics['rmse']:.6f}")
    else:
        print("\nNo current production model")
    
    # Train new model
    try:
        model, new_metrics, model_path, db_model = train_model(
            horizon=horizon,
            use_tuned_params=True,
            save_model=True,
        )
    except Exception as e:
        return {
            'horizon': horizon,
            'success': False,
            'error': str(e),
        }
    
    # Compare
    is_better, improvement, reason = is_better_model(old_metrics, new_metrics)
    
    print(f"\nComparison: {reason}")
    print(f"Improvement: {improvement:+.2f}%")
    print(f"Better: {'Yes' if is_better else 'No'}")
    
    result = {
        'horizon': horizon,
        'success': True,
        'model_id': db_model.id,
        'is_better': is_better,
        'improvement': improvement,
        'reason': reason,
        'promoted': False,
    }
    
    # Auto-promote if better
    if is_better and auto_promote:
        print(f"\n🚀 Promoting model {db_model.id} to production...")
        promote_model(db_model.id)
        result['promoted'] = True
    elif not is_better:
        print(f"\n⏸️ Keeping current production model (new model not better enough)")
        db_model.status = MLModel.Status.DEPRECATED
        db_model.save(update_fields=['status'])
    
    return result


def retrain_all_models(auto_promote: bool = True) -> list:
    """
    Retrain all horizon models.
    
    Returns:
        List of results
    """
    print(f"\n{'='*60}")
    print(f"WEEKLY MODEL RETRAINING - {datetime.utcnow().isoformat()}")
    print(f"{'='*60}")
    
    results = []
    
    for horizon in ['24H', '30D', '12W', '12M']:
        result = retrain_horizon(horizon, auto_promote)
        results.append(result)
    
    # Summary
    print(f"\n{'='*60}")
    print("RETRAINING SUMMARY")
    print(f"{'='*60}")
    
    for result in results:
        status = "✅ Promoted" if result.get('promoted') else "⏸️ Kept old" if result.get('success') else "❌ Failed"
        improvement = result.get('improvement', 0)
        print(f"  {result['horizon']}: {status} ({improvement:+.2f}%)")
    
    return results


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Retrain models')
    parser.add_argument('--horizon', type=str, help='Specific horizon to retrain')
    parser.add_argument('--all', action='store_true', help='Retrain all horizons')
    parser.add_argument('--no-promote', action='store_true', help='Do not auto-promote')
    args = parser.parse_args()
    
    auto_promote = not args.no_promote
    
    if args.horizon:
        retrain_horizon(args.horizon, auto_promote)
    elif args.all:
        retrain_all_models(auto_promote)
    else:
        print("Usage:")
        print("  python -m ml.training.retrain --horizon 24H")
        print("  python -m ml.training.retrain --all")
        print("  python -m ml.training.retrain --all --no-promote")
