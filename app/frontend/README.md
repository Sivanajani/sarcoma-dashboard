# SSN Datenqualitäts‑Dashboard – Frontend


## Tech‑Stack

- **React**, **TypeScript**, **Vite**
- **Material UI (MUI)**
- **i18next** (DE/EN/FR)
- **Axios** (API‑Client)
- **Recharts** / Chart‑Komponenten
- **Keycloak** (Auth über `AuthProvider`)

---

## Installation & lokale Entwicklung

Voraussetzungen: **Node.js ≥ 18**

```bash
# im Ordner app/frontend/
npm install
npm run dev
````

Standard‑Ports:

* Vite Dev‑Server: **[http://localhost:5173/](http://localhost:5173/)**
* Backend (FastAPI): **[http://localhost:8000/](http://localhost:8000/)** (siehe `.env`)

---

## Environment

Erstelle eine `.env` (oder `.env.local`) im Projekt‑Root von `app/frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

> **Hinweis:** Für produktive Deployments kannst du `VITE_API_BASE_URL` auf die öffentlich erreichbare Backend‑URL setzen (z. B. Reverse‑Proxy‑Pfad).

Optionale Variablen:

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=dashboard
VITE_KEYCLOAK_CLIENT_ID=dashboard-client
```

---

## Build & Preview (ohne Docker)

```bash
npm run build     # erzeugt ./dist
npm run preview   # lokaler Preview-Server (Vite)
```

---

## Docker

Dieses Frontend wird in zwei Phasen gebaut: **Build** → **Runtime** (statisch via `serve`).

**Dockerfile (bereits enthalten)**

```dockerfile
# ---- Stage 1: Build ----
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --progress=false
COPY . .
RUN npm run build

# ---- Stage 2: Runtime (klein & schnell) ----
FROM node:20-slim AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Build & Run**

```bash
# im Ordner app/frontend/
docker build -t ssn-dashboard-frontend .
docker run --rm -p 3000:3000 \
  --env VITE_API_BASE_URL=http://localhost:8000 \
  ssn-dashboard-frontend
```

Aufruf: **[http://localhost:3000](http://localhost:3000)**

> **Achtung (Ports):** Dev‑Mode = 5173, Docker‑Runtime = 3000.

---

## API‑Konfiguration

Der API‑Client (`useApi.ts`) liest `VITE_API_BASE_URL`.
Typische Endpunkte (Beispiele):

* `GET /api/patients` – Listenansicht
* `GET /api/patients/by-external-code/{external_code}/{module}/details` – Modul‑Details
* `POST /api/alerts` / `GET /api/alerts` – Alert‑Management

---

## Internationalisierung (i18n)

* Übersetzungen in `src/i18n/de.json`, `en.json`, `fr.json`.
* Komponenten referenzieren ausschliesslich i18n‑Keys (keine Hardcodes).
* Neue Texte zuerst in **de.json** ergänzen, dann `en.json`/`fr.json` angleichen.

---

## Wichtige Komponenten (Kurzreferenz)

* **AlertsPage.tsx** – Tabellarische Alerts, Status‑Icons, nutzt `AlertForm`.
* **AlertForm.tsx** – Alert‑Typen:

  * *Threshold*, *field\_check* (is\_null, Mehrfachfelder → mehrere Alerts),
  * *Value‑Compare* (==, <, >, true/false) – UI je Feldtyp.
* **PatientQualityTable.tsx** – Tabs *Alle/CROMs/PROMs*, Filter, KPI‑Spalten.
* **PatientDetailView\.tsx** – Modul‑Details, Tabellen + Charts, Deep‑Link via Route.
* **Eq5dChart.tsx** / **BiopsyChartRadar.tsx** – Interaktive Diagramme, Zeitraum, Export.
* **UploadSection.tsx** – PDF/Text Upload, optionale Zusammenfassung (Gemini‑Button).
* **SavedReports.tsx** – LocalStorage, Anzeige **DD.MM.YYYY** (intern **YYYY‑MM‑DD**), Duplikat‑Schutz.

---

## Troubleshooting

* **CORS / Netzwerkfehler**: Stelle sicher, dass das Backend `http://localhost:8000` erlaubt (CORS‑Headers) und `VITE_API_BASE_URL` korrekt gesetzt ist.
* **Port‑Konflikte**: Vite (5173) bzw. Docker‑Runtime (3000) ggf. anpassen.
* **TypeScript `IPromise` vs `Promise` (ts(2345))**:
  Vermeide inkompatible Promise‑Typen (z. B. aus Fremdlibs). Kapsle Rückgaben in native `Promise`:

  ```ts
  const wrap = <T>(p: any) => new Promise<T>((resolve, reject) =>
    p.then(resolve).catch(reject)
  );
  // oder: await/async nutzen und den Fremdtyp nicht weiterreichen
  ```
* **Leere Tabellen/Charts**: Prüfe Filter, Patient‑/Modul‑Parameter und Backend‑Antwort (`/details`‑Endpoints).
* **Datum**: Anzeige erfolgt **DD.MM.YYYY** (util `dateUtils.ts`), Speicherung **YYYY‑MM‑DD**.

---

## Scripts (NPM)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---