# MediCare Onboarding

Tento postup popisuje nastavení lokálního prostředí pro projekt MediCare pouze s lokálně instalovaným Node.js a MongoDB.

## 1. Příprava prostředí
- Nainstaluj Node.js LTS 20 (lze použít `nvm` – viz `.nvmrc`).
- Stáhni a nainstaluj MongoDB Community Edition (obsahuje `mongod` i `mongosh`).
- Klonuj repozitář a otevři ho ve VS Code.

## 2. První start
V kořeni repozitáře spusť:

```bash
npm install
npm run setup
```

První příkaz nainstaluje závislosti v kořenovém workspace. Skript `npm run setup` následně zkontroluje existenci `.env` a nainstaluje závislosti ve všech workspacích.

## 3. Projektové menu
Pro rychlý přístup k nejčastějším úkonům použij interaktivní menu:

```bash
npm run menu
```

Menu vypíše dostupné příkazy a spustí vybraný krok po zadání čísla.

## 4. Spuštění aplikací

Nejrychlejší je spustit vše najednou v jednom terminálu:

```bash
npm run dev:all
```

Příkaz spustí `mongod` (data ukládá do `./data/mongodb`), backend i frontend. Ujisti se, že máš nainstalovanou MongoDB Community Edition a že příkaz `mongod` je v `PATH`.

Alternativně můžeš použít jednotlivé kroky:

```bash
npm run mongo            # pouze databáze
npm run dev:backend+db   # databáze + backend
npm run dev              # backend + frontend (vyžaduje běžící MongoDB)
```

- Backend (Nest.js) běží na `http://localhost:3000`.
- Frontend (Vite) běží na `http://localhost:5173`.
- MongoDB standardně běží na `mongodb://localhost:27017` (lze změnit v `MONGO_URI`).

## 5. Užitečné příkazy

| Příkaz | Popis |
| --- | --- |
| `npm run mongo` | Spustí pouze MongoDB (data v `./data/mongodb`). |
| `npm run dev` | Spustí frontend a backend ve watch módu (čeká na běžící MongoDB). |
| `npm run dev:backend+db` | Spustí backend spolu s MongoDB. |
| `npm run dev:all` | Spustí MongoDB, backend i frontend najednou. |
| `npm run lint` | Spustí ESLint ve všech workspacích. |
| `npm run test` | Spustí Jest testy backendu. |

Veškeré detaily ohledně architektury a workflow jsou popsány v souborech v adresáři `docs/`.
