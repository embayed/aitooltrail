# AI Directory

A plain HTML, CSS, and JavaScript directory. No database, dependencies, backend framework, or server-side application. The catalog includes 105 complete tool profiles across 24 categories: 85 populated from the supplied workbook and 20 from the supplied JSON research. Research verification dates are attributed to the sources, not presented as independent verification by the directory. See `docs/RESEARCH-IMPORT-REPORT.md` for the latest import.

## Files

- `dist/`: finished static website; publish only this folder.
- `assets/styles.css`: shared responsive design tokens and styles.
- `assets/app.js`: accessible menu, search, category/free-plan filters, and sorting.
- `data/site.json`: site name and production domain.
- `data/categories.json`: extensible category definitions.
- `data/tools.json`: tool records; `status: draft` entries show names/categories without unverified claims. Completed records use `status: published`.
- `data/tool-template.json`: blank reusable record; never published as a tool.
- `scripts/build.mjs`: dependency-free JavaScript authoring script that generates HTML and metadata.
- `scripts/check.mjs`: route, internal-link, asset, metadata, and structured-data checks.
- `scripts/tool-profile.mjs`: detailed research-profile layout.
- `data/workbook-import.json`: extracted workbook rows, preserved for traceability; not served publicly.
- `scripts/import-workbook.mjs`: maps those rows onto existing tools without deleting entries absent from the workbook.
- `docs/WORKBOOK-IMPORT-REPORT.md`: import coverage, source limitations, and editorial corrections.
- `docs/CONTENT-MODEL.md`: final field proposal and editorial guidance.
- `docs/SEO-ROADMAP.md`: launch requirements and future organic-search architecture.

## Build and preview

From this project directory, with Node.js 20 or newer installed:

```sh
node scripts/build.mjs
node scripts/check.mjs
```

For a local static preview, if Python is installed:

```sh
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://localhost:4173/ in your browser. This optional local file server is for preview only; the website has no server-side application. Root-relative links and clean directory URLs require an HTTP preview rather than double-clicking an HTML file.

## Add the next tool — one at a time

1. Receive the individual tool from the user. Research that tool using its official website, documentation, and current pricing page.
2. If the tool already exists as a draft, complete that record and set `status` to `published`. Otherwise copy the blank record from `data/tool-template.json`, fill verified fields, and append exactly that one record to `data/tools.json`.
3. Place permitted, optimized media in `assets/tools/<slug>/`. Use local paths such as `/assets/tools/<slug>/logo.webp` with descriptive ALT text.
4. Assign one primary category and any relevant additional categories. Add a category record only when needed. Alternative slugs must refer to existing published tools.
5. Write original descriptions and meaningful limitations. Record source URLs and the verification date. Unknown boolean values are `null`, never an invented `false`.
6. Run the build and checks. Review the tool page on desktop and mobile. Check pricing, source links, and any screenshots.

The generator creates `/tools/<slug>/index.html`, updates category membership, homepage collections, search cards, breadcrumbs, and sitemap eligibility from the same data. Do not edit generated HTML manually.

## Production

Set `origin` in `data/site.json` to the actual HTTPS origin, e.g. `https://your-domain.tld` (no trailing slash), then run:

```sh
node scripts/build.mjs --production
node scripts/check.mjs
```

The production build refuses to run without a domain. Preview builds use `noindex,follow` and have an empty sitemap. Production builds include eligible URLs in the sitemap; empty tool collections and the 404 remain `noindex` and excluded. Deploy `dist/` to any static host that supports directory index files. Configure the host to serve `404.html` with HTTP status 404 and redirect `/index.html` variants and non-trailing-slash routes consistently. No SPA fallback is needed.

No hosting account, tracking, external fonts, analytics, newsletter, paid placement, or affiliate relationship has been configured. The website stays local until you choose to publish it.
