# Jak přispívat

## Před začátkem
- Založ issue nebo se domluv s týmem, aby nedošlo k duplicitě práce.
- Vytvoř větev `feature/<kratky-popis>`.

## Commit zprávy
- Doporučený formát jsou Conventional Commits (např. `feat: add onboarding docs`).
- Drž popisy krátké a výstižné, aby reviewer rychle pochopil obsah změny.

## Pull Request
- Cíl PR je vždy větev `dev`.
- Vyplň PR šablonu (`co`, `proč`, `jak testovat`).
- Před odesláním PR spusť lokálně:
  - `npm run lint`
  - `npm run test`
- Přidej odkazy na relevantní issue nebo dokumentaci.

## Code review
- Reviewer (CODEOWNER) očekává:
  - Přehlednou strukturu commitu/PR.
  - Testy, pokud dává smysl je přidat.
  - Aktualizovanou dokumentaci, pokud se mění chování.
