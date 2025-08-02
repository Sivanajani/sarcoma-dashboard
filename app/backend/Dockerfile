FROM python:3.11-slim

WORKDIR /app
COPY . .

RUN pip install fastapi uvicorn sqlalchemy psycopg2-binary pymysql requests httpx pydantic[email] python-jose[cryptography] apscheduler





CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

EXPOSE 8000