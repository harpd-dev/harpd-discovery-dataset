# Data Dictionary — Harpd Product Discovery Index

Every field in `coverage/discovery-index.json`, one row per product record.

## Identity

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Stable slug identifier (`^[a-z0-9][a-z0-9-]*$`). Derived from the domain; stable across snapshots unless the product moves domain. |
| `name` | string | Product name. Taken from the homepage `<title>` / `og:title` at observation time (≤200 chars). |
| `domain` | string | Registered domain the candidate was harvested from. Primary key in the upstream harvest table. |
| `url` | string | Canonical homepage URL fetched for enrichment (https). |

## Classification

| Field | Type | Description |
| --- | --- | --- |
| `category` | string | One of 28 Harpd category keys (e.g. `developer`, `agents`, `ai-media`, `seo`, `marketing` …) or `other` when no keyword evidence matched. |
| `category_confidence` | number (0–1) | Bounded function of matched keyword weight. **Not a probability.** `0` means no evidence matched. |
| `classification_evidence` | string[] | Exact tokens matched on the product's own homepage text that produced the category. Empty when `other`. |

## Observed homepage content (verbatim, not inferred)

| Field | Type | Description |
| --- | --- | --- |
| `title` | string | `<title>` / `og:title` from the homepage at fetch time (≤200 chars). |
| `description` | string | Meta `description` / `og:description` from the homepage (≤500 chars). The product's own words. |
| `h1` | string | First `<h1>` on the homepage (≤200 chars). |
| `lang` | string | `lang` attribute of `<html>` (≤12 chars, e.g. `en`, `ja`). Empty if absent. |
| `github_url` | string | First GitHub repository link found on the page, or empty. Only recorded when actually linked from the homepage — never auto-attributed. |
| `http_status` | number | HTTP status of the enrichment fetch (200 for every published record). |
| `completeness` | number (0–1) | Fraction of observable fields that carried text (title/description/h1/lang). Used by the qualification gate. |

## Provenance

| Field | Type | Description |
| --- | --- | --- |
| `discovered_from` | string | The public source the domain was first harvested from (e.g. `uneed.best`, `appsumo.com`, `whatlaunched.today`). |
| `on_rank_board` | boolean | Whether the product also has a canonical profile on the Harpd Rank board. Records on the Rank board are **excluded** from this dataset (one entity, one canonical URL). |
| `rank_profile_url` | string | The product's Harpd Rank profile URL when `on_rank_board` is true; empty otherwise. |
| `profile_url` | string | Always empty in this dataset: discovery records deliberately have no per-product page (see Methodology). A URL that 404s is worse than no URL. |
| `observed_at` | string | ISO timestamp of the homepage fetch. |
| `lead_tier` | number | Harvest-tier signal from the upstream corpus (1 = paid for placement on a pay-to-rank board; 2 = submitted to a launch/directory site). Internal provenance, not a quality score. |

## Dataset-level metadata

| Field | Description |
| --- | --- |
| `generated_at` | ISO timestamp of dataset generation. |
| `counts.candidates_harvested` | Total candidate domains harvested (10,537 in the 2026-09 snapshot). |
| `counts.candidates_fetched` | Candidates whose homepage fetch returned usable HTML (9,570). |
| `counts.qualified` | Records published after the quality gate (8,637). |
| `counts.already_on_rank_board` | Candidates excluded because they are canonical on the Rank board (35). |
| `counts.rejected` | Rejection breakdown: `no_fetch`, `no_identity`, `out_of_scope`, `below_threshold`, `duplicate`. Rejection counts are published on purpose — a transparent pipeline shows its losses. |
| `category_counts` | Qualified records per category. |
| `source_urls` | The public sources candidates were harvested from (derived from the rows themselves). |
