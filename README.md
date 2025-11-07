# MediCare Monorepo Overview

MediCare kombinuje Nest.js backend, React (Vite) frontend a sdílené TypeScript typy. Vše se spouští z kořene pomocí npm skriptů.

## Rychlý start

```bash
npm run setup
npm run dev:all
```

- `npm run setup` vytvoří `.env` (pokud chybí) a nainstaluje všechny závislosti.
- `npm run dev:all` spustí MongoDB (lokálně přes `mongod`), backend i frontend v jednom terminálu.
- Pokud chceš pouze backend s databází, použij `npm run dev:backend+db`.
- `npm run dev` zůstává dostupný pro samostatné spuštění frontend + backend (když už máš MongoDB spuštěné zvlášť).

Interaktivní menu s nejčastějšími příkazy spustíš přes `npm run menu`.

## Struktura repozitáře

```
.
├─ apps/           # Aplikace (backend, frontend)
├─ packages/       # Sdílené balíčky (TypeScript typy)
├─ scripts/        # Pomocné skripty (setup, menu)
├─ docs/           # Dokumentace (CZ)
└─ ...             # Konfigurace a CI
```

## Důležité skripty

| Příkaz | Popis |
| --- | --- |
| `npm run setup` | Připraví prostředí (instalace + `.env`). |
| `npm run menu` | Textové menu s nejčastějšími úkoly. |
| `npm run mongo` | Spustí lokální `mongod` s daty v `./data/mongodb`. |
| `npm run dev` | Spustí backend i frontend (vyžaduje předem spuštěnou MongoDB). |
| `npm run dev:backend+db` | Spustí MongoDB a backend dohromady. |
| `npm run dev:all` | Spustí MongoDB, backend a frontend v jednom kroku. |
| `npm run lint` | ESLint pro frontend i backend. |
| `npm run test` | Jest testy backendu. |

## Dokumentace
- [docs/onboarding.md](docs/onboarding.md)
- [docs/architecture.md](docs/architecture.md)
- [docs/workflows.md](docs/workflows.md)
- [docs/troubleshooting.md](docs/troubleshooting.md)
- [docs/glossary.md](docs/glossary.md)

## Licence
Repozitář používá licenci [MIT](LICENSE).
