FROM python:3.11-slim

WORKDIR /app/backend

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/backend/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/backend/requirements.txt

COPY src /app/backend/src

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8080"]
