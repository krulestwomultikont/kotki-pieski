# Kotki i Pieski 🐱🐶

Strona o kotkach i pieskach, hostowana na **Cloudflare Workers** i automatycznie
wdrażana z tego repozytorium (Cloudflare Workers Builds).

## Jak to działa

- `public/` — statyczna strona (HTML/CSS/JS).
- `src/index.js` — Worker:
  - `GET /api/animal` zwraca losową ciekawostkę i zdjęcie kotka lub pieska
    (zdjęcia z publicznych API `thecatapi.com` / `dog.ceo`, z awaryjnym
    fallbackiem `cataas.com` / `placedog.net`).
  - pozostałe żądania trafiają do statycznych plików przez binding `ASSETS`.
- `wrangler.jsonc` — konfiguracja Workera.

## Uruchomienie lokalnie

```sh
npm install
npx wrangler dev
```

## Wdrożenie

Repo jest połączone z Cloudflare przez **Workers Builds** — każdy push do gałęzi
`main` uruchamia build (`npx wrangler deploy`) i publikuje nową wersję.

Ręczne wdrożenie:

```sh
npx wrangler deploy
```
