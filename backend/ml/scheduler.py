# ml/scheduler.py

"""
Master scheduler for all ML tasks.

Usage:
    python -m ml.scheduler --task hourly
    python -m ml.scheduler --task daily
    python -m ml.scheduler --task weekly
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from datetime import datetime


def run_hourly_tasks():
    """
    Run every hour.
    - Update actual prices for past predictions
    """
    print(f"\n{'='*60}")
    print(f"HOURLY TASKS - {datetime.utcnow().isoformat()}")
    print(f"{'='*60}")
    
    from ml.prediction.performance import update_all_actuals
    
    print("\n[1/1] Updating actual prices...")
    update_all_actuals()
    
    print("\n✅ Hourly tasks complete")


def run_6hourly_tasks():
    """
    Run every 6 hours (00:00, 06:00, 12:00, 18:00 UTC).
    - Generate 24H forecasts
    """
    print(f"\n{'='*60}")
    print(f"6-HOURLY TASKS - {datetime.utcnow().isoformat()}")
    print(f"{'='*60}")
    
    from ml.prediction.predictor import generate_all_forecasts
    
    print("\n[1/1] Generating 24H forecasts...")
    try:
        generate_all_forecasts('24H')
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n✅ 6-hourly tasks complete")


def run_daily_tasks():
    """
    Run daily at midnight UTC.
    - Fetch new hourly candles
    - Aggregate data
    - Generate 30D, 12W, 12M forecasts
    - Update performance metrics
    """
    print(f"\n{'='*60}")
    print(f"DAILY TASKS - {datetime.utcnow().isoformat()}")
    print(f"{'='*60}")
    
    from ml.data.update_fetch import update_all_markets
    from ml.data.aggregator import aggregate_all_markets
    from ml.prediction.predictor import generate_all_forecasts
    from ml.prediction.performance import update_all_actuals, generate_all_backtests
    
    # Step 1: Fetch new data
    print("\n[1/5] Fetching new market data...")
    update_all_markets()
    
    # Step 2: Aggregate
    print("\n[2/5] Aggregating data...")
    aggregate_all_markets(full=False)
    
    # Step 3: Generate forecasts
    print("\n[3/5] Generating 30D forecasts...")
    try:
        generate_all_forecasts('30D')
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n[4/5] Generating 12W forecasts...")
    try:
        generate_all_forecasts('12W')
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n[5/5] Generating 12M forecasts...")
    try:
        generate_all_forecasts('12M')
    except Exception as e:
        print(f"Error: {e}")
    
    # Step 4: Update actuals
    print("\n[6/6] Updating performance metrics...")
    update_all_actuals()
    generate_all_backtests()
    
    print("\n✅ Daily tasks complete")


def run_weekly_tasks():
    """
    Run weekly (Sunday midnight UTC).
    - Retrain all models
    """
    print(f"\n{'='*60}")
    print(f"WEEKLY TASKS - {datetime.utcnow().isoformat()}")
    print(f"{'='*60}")
    
    from ml.training.retrain import retrain_all_models
    
    print("\n[1/1] Retraining models...")
    retrain_all_models()
    
    print("\n✅ Weekly tasks complete")


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='ML Scheduler')
    parser.add_argument('--task', type=str, required=True, 
                        choices=['hourly', '6hourly', 'daily', 'weekly'],
                        help='Task to run')
    args = parser.parse_args()
    
    if args.task == 'hourly':
        run_hourly_tasks()
    elif args.task == '6hourly':
        run_6hourly_tasks()
    elif args.task == 'daily':
        run_daily_tasks()
    elif args.task == 'weekly':
        run_weekly_tasks()