# StellaServe Backend

🌙 FastAPI backend for the StellaServe food delivery platform.

## Getting Started

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment config
cp .env.example .env

# Run development server
uvicorn app.main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── main.py        # FastAPI entry point
│   ├── config.py      # Settings management
│   ├── routers/       # API route handlers
│   ├── models/        # Database models
│   ├── schemas/       # Pydantic schemas
│   └── services/      # Business logic
├── requirements.txt
├── Dockerfile
└── .env.example
```
