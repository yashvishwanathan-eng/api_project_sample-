# FastAPI Product Inventory API

A full-stack product inventory management system built with FastAPI (backend) and React (frontend).

## Tech Stack

**Backend**
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL

**Frontend**
- React
- CSS

## Features

- View all products
- Add a new product
- Update an existing product
- Delete a product
- React frontend connected to FastAPI backend

## Project Structure
## Getting Started

### Backend

```bash
# Create virtual environment
python -m venv .venv
.venv\Scripts\Activate.ps1

# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary

# Run the server
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /products | Get all products |
| GET | /products/{id} | Get product by ID |
| POST | /products | Add a new product |
| PUT | /products/{id} | Update a product |
| DELETE | /products/{id} | Delete a product |

## Author

Yash Vishwanathan
