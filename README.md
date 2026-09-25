# Oakridge Academy

Standalone HTML, CSS and JavaScript school website with responsive public pages, interactive campus and learning experiences, admissions previews and family workflows.

## Run locally

Use Node.js 24.x. From the repository root:

```sh
npm start
```

The static preview defaults to http://127.0.0.1:4177; set PORT to change it. No dependency install is required for this preview.

## Build

```sh
npm run build
```

The deployable website is generated in `dist/`. Source, test and local presentation files are not published as website pages.

## Deploy on Vercel

Import this GitHub repository as its own Vercel project. Use the repository root (`./`) as Root Directory. The checked-in `vercel.json` sets:

| Setting | Value |
| --- | --- |
| Framework | Other |
| Node.js | 24.x (set in package.json) |
| Install command | Skipped (the static build uses only Node.js built-ins) |
| Build command | `npm run build` |
| Output directory | `dist` |

Pages use their existing .html/.htm URLs; no SPA rewrite is needed.

No environment variables or API keys are needed for the current frontend demo. This repository is prepared for deployment; importing it in Vercel creates the actual hosted project.

Configuration references: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite), [project configuration](https://vercel.com/docs/project-configuration/vercel-json).

## Project scope

This is a fictional school frontend demonstration. Role selection, school records, forms, payments, bookings and AI-style assistance are local previews or curated examples where present. Real authentication, private storage, ERP/provider connections and model-backed AI need server implementation. Retain the demo labels when showcasing the current version.

## Development checks

Run npm install to install optional browser-test tools, start the preview server, then run npm test. Browser tests expect Google Chrome.

## Assets and licenses

[Asset sources](shared/assets/SOURCES.md) records supplied media provenance. Retain the license files included with the source and fonts. Original school photographs are illustrative; they are not a claim about a real campus.
