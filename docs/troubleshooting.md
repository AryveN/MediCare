# MediCare Troubleshooting

Pokud nastane problém, který zde není popsaný, komunikuj ho na týmovém kanálu nebo přímo maintainerovi.

## Port už je obsazený
- `3000` (backend) nebo `5173` (frontend) mohou být blokované jinou aplikací.
- Řešení: ukonči proces (`lsof -i :3000` / `kill <pid>`) nebo změň port v konfiguraci (`.env`, `vite.config.ts`).

## Frontend nevidí backend
- Zkontroluj, že běží backend (např. `npm run dev` nebo `npm run dev:backend+db`).
- Ujisti se, že v `.env`/`.env.example` máš správné `VITE_API_BASE`.
- Podívej se do konzole prohlížeče – případné CORS chyby jsou tam vidět.

## Swagger hlásí chybu 404
- Ověř, že backend běží a otevři `http://localhost:3000/api-docs`.

## MongoDB není dostupné
- Zkontroluj, že `mongod` běží (např. `ps aux | grep mongod`).
- Ověř, že `MONGO_URI` v `.env` ukazuje na běžící instanci.
- Podívej se do logu MongoDB (výstup `mongod`), případně službu restartuj.

## CORS chyba
- Backend standardně povoluje CORS. Pokud jsi přidal vlastní konfiguraci, zkontroluj `main.ts`.
- Ujisti se, že frontend volá správný protokol (`http` vs `https`).

## Chyby při `npm run setup`
- Ujisti se, že máš Node 20 (`nvm use`).
- Pokud se instalace přeruší, smaž `node_modules` a `package-lock.json` a spusť `npm install` znovu.

## Backend startuje pomalu
- Zkontroluj log backendu v terminálu (`npm run dev`, `npm run dev:backend+db` nebo `npm run dev:all`).
- Ujisti se, že je MongoDB připravené přijímat připojení a že síťové připojení není blokované firewallem.
