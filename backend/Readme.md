# Nordict Backend

Django REST API for the Nordict market forecasting platform.

## Tech Stack

- **Framework**: Django 5.x + Django REST Framework
- **Database**: PostgreSQL (SQLite for development)
- **Authentication**: JWT (SimpleJWT)
- **Documentation**: drf-spectacular (OpenAPI/Swagger)
- **Deployment**: Docker + Gunicorn

## Project Structure

```
nordict-backend/
├── config/             # Django project settings
├── core/               # Shared utilities
├── users/              # User management & auth
├── markets/            # Market data & tracking
├── forecasts/          # ML models & predictions
├── alerts/             # User alerts
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

## Quick Start

### Local Development (SQLite)

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### Docker Development (PostgreSQL)

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

## API Documentation

Once running, visit:

- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

## API Endpoints

### Authentication

- `POST /api/v1/auth/register/` - Register new user
- `POST /api/v1/auth/login/` - Login (returns JWT)
- `POST /api/v1/auth/logout/` - Logout (blacklist token)
- `POST /api/v1/auth/token/refresh/` - Refresh JWT
- `GET /api/v1/auth/me/` - Get current user profile

### Markets

- `GET /api/v1/markets/` - List markets
- `GET /api/v1/markets/{symbol}/` - Get market details
- `GET /api/v1/markets/{symbol}/data/` - Get price data
- `GET /api/v1/markets/user/tracked/` - User's watchlist
- `POST /api/v1/markets/user/tracked/` - Add to watchlist

### Forecasts

- `GET /api/v1/forecasts/` - List latest forecasts
- `GET /api/v1/forecasts/{symbol}/` - Get forecast for market
- `GET /api/v1/forecasts/{symbol}/history/` - Forecast history
- `GET /api/v1/forecasts/models/` - List ML models
- `GET /api/v1/forecasts/performance/` - Backtest results

### Alerts

- `GET /api/v1/alerts/` - List user alerts
- `POST /api/v1/alerts/` - Create alert
- `GET /api/v1/alerts/{id}/` - Get alert details
- `PATCH /api/v1/alerts/{id}/` - Update alert
- `DELETE /api/v1/alerts/{id}/` - Delete alert

## Subscription Plans

Plans are defined in `config/settings.py`:

| Feature          | Pro     | Premium   | Teams     |
| ---------------- | ------- | --------- | --------- |
| Markets          | 5       | Unlimited | Unlimited |
| Alerts           | 5       | Unlimited | Unlimited |
| Horizons         | Daily   | All       | All       |
| API Access       | ❌      | ✅        | ✅        |
| Backtest History | 30 days | Full      | Full      |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=nordict
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

## Running Tests

```bash
pytest
```

## License

Proprietary - All rights reserved
