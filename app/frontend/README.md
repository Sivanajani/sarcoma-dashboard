# Datenqualitäts-Dashboard – Frontend

Dieses Repository enthält das **Frontend** des Projekts zur Überwachung der **Datenqualität von PROMs und CROMs** in der Sarkomversorgung. Die Anwendung basiert auf **React**, **TypeScript** und **Vite**.

## 📦 Technologien

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/) (Codequalität)
- [Material UI](https://mui.com/)

## 📁 Projektstruktur

```

frontend/
├── public/              # Statische Assets
├── src/
│   ├── assets/          # Bilder, Icons, Logos
│   ├── components/      # Wiederverwendbare UI-Komponenten
│   ├── pages/           # Hauptseiten des Dashboards
│   └── App.tsx          # Einstiegspunkt
├── index.html
├── tsconfig.json
├── vite.config.ts
└── .gitignore

````

---

## 🚀 Projekt lokal starten

### 1. Repository klonen

```bash
git clone https://gitlab.com/<BENUTZERNAME>/datenqualitaet-frontend.git
cd datenqualitaet-frontend
````

### 2. Abhängigkeiten installieren

Empfohlen für ein sauberes Setup (nutzt `package-lock.json`):

```bash
npm ci
```

Alternativ (wenn du Pakete manuell ergänzt oder `package-lock.json` nicht nutzt):

```bash
npm install
```

### 3. Entwicklungsserver starten

```bash
npm run dev
```

Frontend ist jetzt erreichbar unter:

```
http://localhost:5173/
```

---

## 🛠️ Entwicklung

### Codequalität

* `npm run lint` – führt ESLint-Prüfungen aus
* `npm run format` – (optional) für Prettier

### TypeScript

* Strikte Typisierung aktiv
* Konfiguration: `tsconfig.app.json`

---

## 📄 Lizenz

Dieses Projekt ist Teil der Bachelorarbeit im Studiengang **Medizininformatik** an der **FHNW** und unterliegt keiner öffentlichen Lizenz (nur Forschungszwecke).

---

## 👩‍💻 Autorin

Sivanajani Sivakumar