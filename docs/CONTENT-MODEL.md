# Tool information model

One record per tool; one permanent slug; one canonical profile. Category membership does not duplicate a profile. The blank template is separate from the published dataset. JSON is the content format; JavaScript generates the HTML before deployment, never on the server.

## Fields supported by the initial template

| Field | Format and purpose |
|---|---|
| `slug`, `name` | Required. Stable lowercase hyphenated identifier and official display name. Avoid years and pricing in slugs. |
| `shortDescription` | Required. Clear summary for cards; usually 120–180 characters. |
| `description` | Required. Original detailed explanation. Separate paragraphs with two newline characters. Plain text is escaped safely. |
| `officialUrl` | Required HTTPS official product URL. |
| `logo` | Optional `{src, alt}`. Local optimized asset with meaningful ALT text; do not invent or hotlink branding. |
| `primaryCategory`, `categories` | Required valid category slugs. The category array must include the primary category. |
| `subcategories`, `tags` | Editorial classification and task synonyms; tags feed search. Only categories currently generate landing pages. |
| `bestFor` | Required one-sentence explanation of the strongest fit. Also searchable. |
| `features`, `useCases`, `audiences` | Required nonempty arrays. Distinguish capabilities from tasks and intended users. |
| `pricing.model` | Required: free, freemium, subscription, usage-based, one-time, enterprise, or unknown. |
| `pricing.freePlan`, `pricing.freeTrial` | Separate `true`, `false`, or `null` values. Null means unverified. Free filter only includes a confirmed free plan. |
| `pricing.startingPrice`, `currency`, `billingPeriod` | Optional numeric amount, ISO currency, and billing unit. Do not imply a monthly rate without specifying annual commitment when applicable. |
| `pricing.url`, `notes` | Official pricing source and practical caveats: caps, credits, trial duration, cancellation, annual billing, and taxes when relevant. |
| `platforms` | Required array such as Web, Windows, macOS, Android, iOS, or browser extension. |
| `api` | `{availability: yes/no/unknown, url, notes}`. Availability appears in the facts panel; keep documentation URL and limits for verification. |
| `integrations`, `languages` | Verified supported integrations and languages, displayed when present. |
| `advantages`, `limitations` | Required nonempty arrays with useful tradeoffs; avoid repeating marketing language. |
| `alternatives` | Existing published tool slugs only. No dead links to future profiles. |
| `screenshots` | Array of `{src, alt, width, height, caption}`; local assets, useful context, correct dimensions, permission to reuse. |
| `faqs` | Required array of `{question, answer}` specific to the tool and supported by sources. |
| `privacy` | `{policyUrl, notes, trainingOptOut}`. Privacy notes display; preserve policy evidence. Unknown opt-out status is null. |
| `testing` | `{method, notes}`; disclose documentation-only review versus actual hands-on testing. Never imply testing that did not happen. |
| `sources` | Required array of `{label, url}` linking to official documentation and pricing. |
| `dateAdded`, `lastVerified` | Required ISO dates: YYYY-MM-DD. Update verification dates only after reviewing actual facts. |
| `seoTitle`, `metaDescription` | Required original metadata. Aim for descriptive, concise copy; avoid rigid character rules at the expense of clarity. |
| `featured` | Explicit editorial choice; false by default. |
| `popularityEvidence` | Null by default. Document a source, metric, and date before enabling popular placement. No fabricated ranking. |

Canonical URL, Open Graph and Twitter metadata, breadcrumbs, and SoftwareApplication structured data are derived rather than manually maintained. Schema uses visible facts; no invented ratings or reviews. A verified numeric starting price may generate an Offer. Optional fields are omitted from the page when absent rather than filled with dummy content.

## Additional useful fields to introduce as evidence becomes available

| Proposed extension | Why maintain it |
|---|---|
| Vendor/company, launch year, product status | Identify ownership and mark renamed, discontinued, or waitlisted products. |
| Plan-level limits and price verification date | Compare credits, seats, upload sizes, context windows, and effective costs on equivalent terms. |
| Input/output formats and export ownership | Explain whether results fit the reader's workflow. |
| Account/card requirements and setup difficulty | Reduce surprises before signup; distinguish easy evaluation from sales-led access. |
| Region restrictions and interface/output languages | Separate actual availability from general multilingual claims. |
| Privacy retention, data training, deployment options | Document evidence for sensitive-data decisions, including local or self-hosted operation. |
| Accessibility observations | Explain keyboard, screen-reader, caption, and language support based on actual checks. |
| Reviewer, review method, tested version, test date | Make authorship and evidence traceable; later supports real author pages. |
| Benchmark task, result, limitations, sample output | Add original evaluation that makes comparisons valuable. |
| Changelog and next verification date | Prioritize editorial maintenance as the directory grows. |
| Disclosure and sponsorship status | Maintain clear commercial transparency if monetization is introduced. |
| Comparison criteria and task-specific fit | Support future comparisons and alternatives pages with consistent evidence. |

These extensions are proposals, not unused promises in the interface. Add rendering and validation when adopting them. SEO keywords belong in editorial research and useful tags; do not generate a meta-keywords tag or repeat keywords unnaturally.

## Reusable page order

Breadcrumb → tool name and summary → official-site CTA and facts → detailed overview and best fit → features → use cases → audience → pricing → advantages → limitations → integrations/languages → privacy/review method → screenshots → published alternatives → FAQs → sources and verification date.

Required fields establish consistency, but editorial review is still necessary. A valid record is not automatically a high-quality review. Publish only after the content helps someone evaluate a real task.
