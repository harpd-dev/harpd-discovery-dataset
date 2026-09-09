# Harpd Discovery Snapshot — September 2026

> Short, citable research brief derived from the Harpd Product Discovery Index (2026-09-09
> snapshot). Every figure below is computed from `coverage/discovery-index.json` in this
> repository. No figure is estimated, modelled or inferred — the brief is a transparent summary of
> the published records.

---

## One-sentence version

Harpd's September 2026 Discovery Index records **8,637 software, AI and developer products**
discovered on public launch and directory boards and verified from their own homepages — 22% of
which are developer tools, and 9% of which link an open-source repository on their homepage.

## 50-word version

Harpd's Discovery Index (CC BY 4.0) documents 8,637 products harvested from 10,537 public launch
and directory candidates. Each record is enriched from the product's own homepage: title,
description, language and linked repository. Developer tools are the largest classifiable group
(1,918); 778 products link GitHub. It is coverage data, independent of Harpd's paid Rank board.

---

## Key numbers (computed from the dataset)

| Metric | Value | Notes |
| --- | ---: | --- |
| Qualified products | **8,637** | Passed the verifiable-text qualification gate |
| Candidates harvested | 10,537 | From public launch/directory boards |
| Homepages fetched & verified | 9,570 | One fetch per domain |
| Records with a substantive description (≥40 chars) | 8,561 | Product's own meta description |
| Records with any description | 8,629 | |
| Records linking a GitHub repo | 778 | Only when actually linked on the homepage |
| Distinct categories | 28 | Harpd keyword-evidence taxonomy |
| Snapshot date | 2026-09-09 | `generated_at` |

## Category distribution (top 12 of 28)

| Category | Products | Share | GitHub-linked |
| --- | ---: | ---: | ---: |
| other (no keyword match) | 2,548 | 29.5% | — |
| developer | 1,918 | 22.2% | 199 |
| ai-media | 359 | 4.2% | — |
| agents | 334 | 3.9% | 71 |
| audio | 311 | 3.6% | — |
| seo | 308 | 3.6% | — |
| productivity | 290 | 3.4% | — |
| security | 246 | 2.8% | 30 |
| sales | 238 | 2.8% | — |
| social | 229 | 2.7% | — |
| hiring | 211 | 2.4% | — |
| marketing | 199 | 2.3% | — |

> **"other" is deliberate.** ~29% of records matched no category keyword and are published as
> `other` with empty `classification_evidence` rather than being forced into a wrong bucket. The
> corpus includes novelty and advertising pages (pixel billboards, one-shot gimmicks) that fit no
> product category. Do not silently drop "other" from totals.

## Language distribution

English is dominant: 7,373 records declare `en`, plus 750 with a regional variant (`en-US`,
`en-GB`, `en-us`, …), for **8,123 English-declaring records total**. 8,434 of 8,637 records declare
a language; 203 do not. The most common non-English language families (incl. regional variants) are
French (55), German (44), Spanish (41), Chinese (32), Indonesian (24), Japanese (20) and Portuguese
(17). 311 records declare a language outside the English family.

## What this does and does not show

- **Does show:** breadth of products actively being promoted on public launch/directory boards in
  September 2026; how many of them self-describe with category keywords; how many link open-source
  repositories from their homepages.
- **Does not show:** market size (absence means nothing — the index reflects monitored boards, not a
  census); product quality (nothing here is an evaluation); trends (one snapshot is not a trend —
  compare future `generatedAt` releases).

---

## How to cite

Plain text:

> Harpd. "Harpd Discovery Snapshot — September 2026." Harpd Product Discovery Index. Retrieved
> 2026-09-09. CC BY 4.0. https://github.com/harpd-dev/harpd-discovery-dataset

BibTeX:

```bibtex
@misc{harpd:discovery:2026-09,
  title  = {Harpd Discovery Snapshot -- September 2026},
  author = {{Harpd}},
  year   = {2026},
  month  = {sep},
  url    = {https://github.com/harpd-dev/harpd-discovery-dataset},
  note   = {Retrieved: 2026-09-09. License: CC BY 4.0. Derived from the Harpd Product Discovery Index.}
}
```

---

## Reproduce every number

```bash
git clone https://github.com/harpd-dev/harpd-discovery-dataset
cd harpd-discovery-dataset
node -e "const d=require('./coverage/discovery-index.json');
  console.log('qualified', d.counts.qualified);
  console.log('developer', d.category_counts.developer);
  console.log('github-linked', d.products.filter(p=>p.github_url).length);"
```
