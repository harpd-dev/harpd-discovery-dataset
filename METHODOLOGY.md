# Methodology — Harpd Product Discovery Index

> Source of truth: `methodology/discovery-index.schema.json` (copied verbatim from
> `https://harpd.com/data/discovery-index.schema.json`). This document is the human-readable gloss.
> The pipeline that produces the dataset runs from the Harpd marketing repository
> (`marketing/scripts/discovery/`); this repository only mirrors the published output.

## What the index is

A **coverage dataset**: "this product exists, and here is what its own website says it is." It is
deliberately **not** a ranking, an evaluation or a market-size estimate. Its relationship to the
Harpd Rank board is one of strict separation:

| | Harpd Rank board | Harpd Product Discovery Index |
| --- | --- | --- |
| Inclusion | Submitted by the product; Rank Points are bought with Credits | Discovered on public launch/directory sources; no payment possible |
| Position | Ordered by Rank Points (promotional placement) | No position — records are not ordered |
| Meaning | Promotional activity, not quality | Coverage, not quality |
| Payment effect | Direct | None (independent pipeline) |

## Pipeline

1. **Harvest** — candidate domains come from public pay-to-rank boards and launch directories
   (uneed.best, outbid.lol, whatlaunched.today, appsumo.com, lastspot.lol, …; the full list is in
   `source_urls` of the dataset). Each candidate is a domain + the name/url/email/tier the source
   published. Harpd treats every row as *unenriched*: nothing is published from the harvest alone.
2. **Enrichment** — each candidate's homepage is fetched once (HTTP GET, browser User-Agent that
   identifies Harpd and links back to harpd.com/discovery). Only first-party observable facts are
   recorded: `<title>`/`og:title`, meta description, `<h1>`, `lang`, and any GitHub repository
   actually linked on the page. **Nothing is inferred, synthesized or guessed.** A homepage with no
   description yields an empty description, never invented copy.
3. **Classification** — category assignment is a keyword-evidence classifier run over the product's
   own title + h1 + description. Strong signal tokens weight 3, weak tokens weight 1. The exact
   tokens that matched are stored per record in `classification_evidence`, so every assignment can
   be audited. Confidence = `min(1, matched_weight / 6)` and is published with the explicit caveat
   that it is not a probability. No matched evidence → `category: "other"`, `confidence: 0`.
4. **Qualification gate** — a record is published only when it has enough verifiable text to be
   useful. Rows with no fetched HTML, no identity, out-of-scope content, or sub-threshold
   completeness are rejected — and **the rejection counts are published** in `counts.rejected`,
   because a pipeline that hides its losses cannot be audited.
5. **Canonical separation** — candidates that are already canonical on the Harpd Rank board are
   excluded from this dataset. One entity must not exist at two URLs. The exclusion count is
   published (`counts.already_on_rank_board`).

## Why there are no per-product pages

The dataset covers thousands of records. Publishing a per-product HTML page for each would (a)
breach the Cloudflare Workers static-asset ceiling and (b) create thousands of near-thin pages
whose only content is the product's own meta description — the definition of a doorway farm. So the
Discovery Index is delivered as a **dataset with one human hub** (`https://harpd.com/discovery/`),
a machine hub (`https://harpd.com/ai/`), and this versioned mirror. Records deliberately carry no
`profile_url`.

## Refresh cadence

The upstream dataset regenerates on the monthly pipeline (incremental: only newly harvested rows
are fetched and classified; previously successful fetches are not repeated). Each regeneration
produces a fresh `generated_at` and a new snapshot in this repository's history. A snapshot is
immutable once committed — compare `generatedAt` in `manifest.json` or the git history.

## Limitations

1. **Discovery ≠ market.** The corpus reflects which launch/directory boards Harpd monitors, not
   the whole product market.
2. **One fetch, one moment.** Descriptions are observed once at `observed_at`; product copy changes
   and snapshots age.
3. **Categories are Harpd's taxonomy**, produced by keyword evidence, not by vendors or editors.
4. **`other` is honest.** ~29% of records match no category keyword; they are published as `other`
   with empty evidence rather than forced into a wrong bucket.
5. **GitHub URLs are only recorded when actually linked from the homepage.** A missing
   `github_url` means "not linked", not "has no repository". (Auto-attributing repos was tested and
   found wrong >40% of the time, so it is not done.)
6. **Not an evaluation.** Nothing here rates quality; absence of a product means nothing.

## Citation

```bibtex
@misc{harpd:discovery,
  title  = {Harpd Product Discovery Index},
  author = {{Harpd}},
  year   = {2026},
  url    = {https://github.com/harpd-dev/harpd-discovery-dataset},
  note   = {Retrieved: <access date>. License: CC BY 4.0.}
}
```
