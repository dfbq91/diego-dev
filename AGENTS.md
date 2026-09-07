## Dev server

Start in background mode so other tools can use the port:

```
astro dev --background
```

Manage with `astro dev stop`, `astro dev status`, `astro dev logs`.

## Build

`npm run build` runs a `prebuild` script that generates the RAG index (`src/data/rag-index.json`) from `src/content/rag-source.md` via the Cloudflare Workers AI REST API. This requires:

- `CF_EMBEDDINGS_API_TOKEN` (or `CLOUDFLARE_API_TOKEN`)
- `CLOUDFLARE_ACCOUNT_ID`

Without these env vars, `npm run build` fails. For local dev (`astro dev`) this is not needed.

## Testing

Playwright e2e only — no unit tests. Config at `playwright.config.ts`, specs in `e2e/`.

```
npm test
```

Playwright auto-starts the dev server on `localhost:4321` (see `webServer` in config). If a dev server is already running on that port, Playwright reuses it.

## i18n

Locale is query-param based, not file-based: `?lang=en` or `?lang=es`. Default is Spanish. See `src/i18n/i18n.ts`. When adding pages or links, always include the `?lang=` param.

Pages are server-rendered per request, so `?lang=` is honored at runtime. `Base.astro` sets `<html lang>`/`data-locale` server-side — do not add a client-side i18n text override (it causes mixed-language output). Blog post pages resolve their slug per request in `src/pages/blog/[post].astro` (no `getStaticPaths`).

## Architecture

- **Server-rendered site** (`output: 'server'`): every page is rendered per request by the Cloudflare Worker, which is what makes the query-param locale work at runtime. Dynamic API endpoints: `src/pages/api/chat.ts` and `src/pages/api/email/send.ts` (`export const prerender = false`).
- **Cloudflare adapter** (`@astrojs/cloudflare`) — output is server mode; the whole site runs as a Cloudflare Worker using `env.AI` (Workers AI), `env.CHAT_RATE_LIMIT` (KV), and the `ASSETS` binding for static files. Build output: `dist/server` (worker with generated `wrangler.json` carrying all bindings) + `dist/client` (static assets).
- **RAG pipeline**: `src/content/rag-source.md` is chunked and embedded at build time (`scripts/build-rag-index.ts`). At runtime, `/api/chat` embeds the question, retrieves top-K chunks via cosine similarity (`src/lib/rag/retrieval.ts`), builds a prompt, and streams the answer.
- **Content collections**: Blog posts in `src/content/blog/` (`.md`/`.mdx`), schema in `src/content.config.ts`.
- **Tailwind v4** via `@tailwindcss/vite` plugin (not PostCSS).

## Wrangler

`wrangler.toml` intentionally omits `pages_build_output_dir` — adding it would force Pages project validation on the Worker the adapter generates. Do not add it. Deploy the built worker from `dist/server` (e.g. `npx wrangler deploy --name diego-dev`); the adapter's generated `wrangler.json` there carries the runtime bindings.

## Node

Requires Node >= 22.12.0 (see `engines` in `package.json`).

