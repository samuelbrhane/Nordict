# ml/data/run_fetch.py

"""
Run this script to fetch all historical data from Binance.

Usage:
    python -m ml.data.run_fetch
"""

import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from ml.data.fetcher import fetch_all_coins
from ml.data.storage import create_markets, save_all_data


def main():
    print("=" * 50)
    print("STEP 1: Creating markets in database")
    print("=" * 50)
    create_markets()
    
    print("\n" + "=" * 50)
    print("STEP 2: Fetching historical data from Binance")
    print("=" * 50)
    all_data = fetch_all_coins(years=5)
    
    print("\n" + "=" * 50)
    print("STEP 3: Saving data to database")
    print("=" * 50)
    save_all_data(all_data)
    
    print("\n" + "=" * 50)
    print("COMPLETE!")
    print("=" * 50)


if __name__ == '__main__':
    main()