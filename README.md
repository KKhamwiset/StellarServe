# 🌙 StellaServe

A food delivery platform that focuses on **night-time** dining.

## Architecture

| Folder       | Technology            | Purpose                   |
| ------------ | --------------------- | ------------------------- |
| `main/`      | React Native (Expo)   | Mobile app (user & restaurant) |
| `backend/`   | Python (FastAPI)      | REST API backend          |

## Getting Started

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Mobile App (Expo)

```bash
cd main
npm install
npx expo start
```

## Tech Stack

- **Mobile**: React Native 0.81 + Expo 54 + Expo Router
- **Backend**: FastAPI + Pydantic + SQLAlchemy
- **Theme**: Night-focused dark UI with amber/gold accents

## API Endpoints

| Method | Endpoint                       | Description           |
| ------ | ------------------------------ | --------------------- |
| GET    | `/health`                      | Health check          |
| GET    | `/api/restaurants`              | List all restaurants  |
| GET    | `/api/restaurants/{id}`         | Get a restaurant      |
| GET    | `/api/menu/{restaurant_id}`     | Get restaurant menu   |
| POST   | `/api/orders`                   | Create a new order    |
| GET    | `/api/orders`                   | List all orders       |
| GET    | `/api/orders/{id}`              | Get a specific order  |
| POST   | `/api/auth/register`            | Register (placeholder)|
| POST   | `/api/auth/login`               | Login (placeholder)   |

---

> Built with 🌙 for night owls who love good food.
