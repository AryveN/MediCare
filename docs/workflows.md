# Pracovní workflow MediCare

## Větve
- `main` – stabilní verze připravená k nasazení.
- `dev` – integrační větev pro běžný vývoj.
- `feature/<kratky-popis>` – každá nová funkcionalita nebo oprava.

Vždy vytvářej PR z feature větve do `dev`.

## Pull Request
- Každý PR musí projít review – automaticky je vyžadován vlastník z `CODEOWNERS` (`@AryveN`).
- CI pipeline (lint + testy) běží na push/PR proti `dev` a `main`. Opravit chyby je povinnost autora.

### Doporučený proces
1. Vytvoř větev `feature/<kratky-popis>`.
2. Udělej změny + přidej testy.
3. Spusť lokálně `npm run lint` a `npm run test`.
4. Aktualizuj dokumentaci, pokud se změnilo chování.
5. Otevři PR proti `dev` a vyplň šablonu.

### Checklist před PR
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] Dokumentace/README aktualizované (pokud je potřeba)

## Commity
Doporučujeme používat [Conventional Commits](https://www.conventionalcommits.org/) pro čitelnou historii (např. `feat: add user module`). Není to povinné, ale reviewer to ocení.

## Release
- Sloučení `dev` → `main` provádějí pouze maintaineři.
- Tagování verzí probíhá podle potřeby týmu.
