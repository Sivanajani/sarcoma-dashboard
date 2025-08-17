# ---- Stage 1: Build ----
FROM node:20 AS build

WORKDIR /app

# 1) Nur die Manifeste kopieren -> Cache für npm ci
COPY package.json package-lock.json ./
# Optional: Wenn du yarn/pnpm nutzt, entsprechend ersetzen

# 2) Abhängigkeiten installieren mit Cache-Mount (schneller bei Rebuilds)
#    benötigt BuildKit (Docker Desktop: standardmässig an)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --progress=false

# 3) Jetzt erst den Rest des Codes kopieren
COPY . .

# 4) Build erzeugen
RUN npm run build

# ---- Stage 2: Runtime (klein & schnell) ----
FROM node:20-slim AS runtime
WORKDIR /app

# nur das Build-Resultat übernehmen
COPY --from=build /app/dist ./dist

# leichter Webserver für statische Auslieferung
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]