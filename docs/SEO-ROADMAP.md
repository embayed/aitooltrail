# SEO architecture and growth

## Included now

- Static HTML for all content: homepage, tool index, category index, 18 category routes, About, FAQ, and 404. Tool routes are generated only for actual records.
- Unique titles/descriptions, canonical URLs, Open Graph and Twitter/X metadata, language and viewport metadata.
- Semantic landmarks, one H1 per page, logical heading sections, skip navigation, form labels, focus states, expandable FAQ, mobile navigation, and reduced-motion support.
- WebSite/WebPage/CollectionPage, BreadcrumbList, and factual SoftwareApplication JSON-LD for published profiles. Do not assume schema guarantees rich results.
- Production sitemap and robots file. Empty categories remain accessible to people but are noindex and excluded from the sitemap. Local previews are entirely noindex.
- One canonical tool URL even when a tool belongs to several categories. Query-string search/filter variants canonicalize to `/tools/`; do not promote them as landing pages.
- No external scripts, fonts, framework bundle, or database. Shared CSS/JS, native lazy-loaded images, and fixed image dimensions support fast delivery.

Google recommends accessible links, descriptive metadata, and crawlable content. This project writes those into the initial HTML: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

Canonical/sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

Application schema: https://schema.org/SoftwareApplication and https://developers.google.com/search/docs/appearance/structured-data/software-app

FAQ content helps readers. We do not promise Google FAQ rich results or invent aggregate ratings to satisfy application rich-result requirements.

## Before public launch

1. Set the final HTTPS origin and run a production build. Preview canonical URLs intentionally use localhost and must not be published unchanged.
2. Configure trailing-slash/index redirects, an actual HTTP 404, compression, and asset caching on the static host. Use revalidation or versioned filenames when setting long cache lifetimes.
3. Add real tool content and improve each active category with specific selection criteria and useful comparisons. Do not index dozens of empty or near-identical filter pages.
4. Verify the deployed canonical domain, robots directives, sitemap URLs, redirects, and mobile layout. Use Search Console, URL Inspection, Rich Results Test, and PageSpeed Insights after launch.
5. Add the chosen logo/social card if supplied. Titles and descriptions are already supported; no invented social image is included.

## Additional pages worth building later

| Route family | Publish when | Value |
|---|---|---|
| `/compare/tool-a-vs-tool-b/` | Both tools are reviewed using equivalent criteria | Answer a concrete choice with plan limits, testing, and explicit tradeoffs. |
| `/alternatives/tool-name/` | Several credible alternatives exist | Match alternatives to reasons for switching, rather than copying tool summaries. |
| `/guides/ai-tools-for-task/` | There is original task-based evaluation | Attract focused search intent with real examples and selection criteria. |
| `/free-ai-tools/` | Enough verified free plans exist | Provide an editorial collection with meaningful limits and restrictions. |
| `/guides/` | Several useful guides are complete | Create an organized learning hub linked to relevant tools and categories. |
| Reviewer/editorial pages | Real reviewers and processes are established | Make authorship, testing methods, corrections, and update practices traceable. |
| Privacy/contact/disclosure pages | Actual operator details or data collection exist | Explain real policies and provide a working feedback channel. |

Avoid mass-produced combinations and year-based URLs. Change titles for updated content only when the content was actually reviewed. Do not manufacture 100 listings merely to reach a number.

## Functionality as the catalog grows

The current in-browser search is suitable for an initial catalog of 100+ concise cards. Measure the HTML payload as it grows. For a much larger catalog, generate crawlable pagination with real HTML links and a separate compact search index; do not replace crawlable pages with infinite scrolling alone.

Useful next steps include side-by-side comparison, a device-local shortlist, task and platform filters, and a visible report-an-error workflow when a real contact channel exists. Add only when supported by reliable data. Ratings and popularity need authentic evidence; no made-up counters.

Content quality, topical coverage, source maintenance, and original evaluations matter beyond technical SEO. This architecture enables organic discovery; it does not guarantee rankings or traffic.
