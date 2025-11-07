# MediCare Frontend (React + Vite)

Tento adresář obsahuje jednoduchý React frontend vytvořený pomocí Vite.

## Rychlý start

```bash
npm run setup
npm run dev
```

- Frontend poběží na `http://localhost:5173`
- Automaticky volá health endpoint backendu (`/health`).

## Struktura

- `src/App.tsx` – hlavní komponenta s ukázkou volání API.
- `src/main.tsx` – vstupní bod React aplikace.
- `public/` – statické soubory (favicon).

## Build a náhled

- `npm run build` – produkční build.
- `npm run preview` – lokální náhled buildu.
