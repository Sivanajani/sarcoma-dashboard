FROM python:3.11-slim

# Qualitäts-of-life: schnellere, saubere Python-Container
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# 1) Nur Requirements zuerst kopieren -> maximaler Cache-Hit
COPY requirements.txt ./

# 2) Dependencies installieren (mit BuildKit Cache-Mount = schnelle Rebuilds)
#    BuildKit ist in Docker Desktop i. d. R. aktiv; sonst: DOCKER_BUILDKIT=1 setzen.
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# 3) Jetzt erst den restlichen Code (invalidiert nicht den Install-Layer)
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]