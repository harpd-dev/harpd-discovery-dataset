# Harpd Product Discovery Index

An open, machine-readable **coverage dataset** of software, AI and developer products that Harpd
discovered on public launch and directory boards — published as a versioned public mirror so
researchers, journalists, developers and AI systems can cite a stable snapshot.

> **What this is:** a record of *what exists and what can be verified*. Harpd harvested candidate
> product domains from public sources, fetched each product's own homepage once, and recorded only
> what that page actually contained: title, meta description, language and any linked repository.
> 8,637 products across 28 categories, each with the homepage text and the keyword evidence behind
> its category assignment.
>
> **What this is NOT:** an evaluation, ranking, review or endorsement. Inclusion requires no
> payment and confers no placement. This index is **independent of Harpd Rank Points** — the
> promotional ranking board where position is bought with Credits. We say this plainly, in the data
> and in every derived asset, so the numbers are not misread.

The data is published under **CC BY 4.0**. The sync scripts in `scripts/` are **MIT**.

---

## At a glance (2026-09 snapshot)

| | |
| --- | --- |
| Products indexed | **8,637** |
| Candidate domains harvested | **10,537** |
| Categories | **28** |
| Homepages fetched & verified | **9,570** |
| Records with a real homepage description | **8,561** |
| Data last generated | see `manifest.json` → `generatedAt` |
| License | **CC BY 4.0** |
| Source of truth | `https://harpd.com/data/discovery-index.json` |
| Methodology / human page | `https://harpd.com/discovery/` |

**Largest categories** (by product count, from `coverage/discovery-index.json`):

| Category | Products | Share | Notes |
| --- | --- | --- | --- |
| Developer | 1,918 | 22.2% | dev tools, APIs, SDKs, devops, observability |
| AI media | 359 | 4.2% | image/video/voice generation |
| Agents | 334 | 3.9% | AI agents, agent orchestration |
| Audio | 311 | 3.6% | podcast, transcription, sound |
| Productivity | 289 | 3.3% | task, notes, calendar |

> **A note on "other":** 2,548 records (~29%) carry `category: "other"`. That is an honest result,
> not a gap: categories are assigned by keyword evidence found on the product's own homepage, and
> records with no matched evidence stay `other` with an empty `classification_evidence` array and
> `category_confidence: 0`. The corpus includes novelty and advertising pages (pixel billboards,
> one-shot gimmicks, conference sites) that genuinely fit no product category. See
> [METHODOLOGY.md](METHODOLOGY.md) before drawing any conclusion from category counts.

---

## Files

| Path | Contents |
| --- | --- |
| `coverage/discovery-index.json` | Full dataset — one object per product: id, name, domain, url, category, category_confidence, classification_evidence, title, description, h1, lang, github_url, discovered_from, completeness, on_rank_board, observed_at |
| `coverage/discovery-index.csv` | Flat CSV of the same records (subset of fields) |
| `methodology/discovery-index.schema.json` | JSON Schema for the dataset, copied verbatim from the live endpoint |
| `manifest.json` | Snapshot metadata + SHA-256 of every file (integrity) |
| `METHODOLOGY.md` | Human-readable method: harvest, enrichment, classification, rejection |
| `DATA_DICTIONARY.md` | Field-by-field definition of every column |
| `CHANGELOG.md` | History of published snapshots |
| `scripts/sync.mjs` | Fetches the latest snapshot from harpd.com and re-validates |

---

## How to use

**Fetch the latest snapshot** (no credentials, reads only public harpd.com data):

```bash
node scripts/sync.mjs          # fetch + write + update manifest.json
node scripts/sync.mjs --check  # verify committed files match manifest
```

**Read a record** (real example from this snapshot):

```json
{
  "id": "5ire",
  "name": "5ire",
  "domain": "5ire.app",
  "url": "https://5ire.app/",
  "category": "developer",
  "category_confidence": 0.67,
  "classification_evidence": ["open source", "cli"],
  "description": "An Open Source Cross-platform Desktop AI Assistant and MCP (Model Context Protocol) client...",
  "github_url": "https://github.com/nanbingxyz/5ire",
  "discovered_from": "uneed.best",
  "on_rank_board": false,
  "observed_at": "2026-09-09T05:33:10.983Z"
}
```

**CSV quick peek:**

```bash
head -5 coverage/discovery-index.csv
```

---

## How to cite

Plain text:

> Harpd. "Harpd Product Discovery Index." Retrieved 2026-09-09. CC BY 4.0. https://github.com/harpd-dev/harpd-discovery-dataset

BibTeX:

```bibtex
@misc{harpd:discovery,
  title  = {Harpd Product Discovery Index},
  author = {{Harpd}},
  year   = {2026},
  url    = {https://github.com/harpd-dev/harpd-discovery-dataset},
  note   = {Retrieved: 2026-09-09. License: CC BY 4.0.}
}
```

---

## Limitations

State these alongside any figure you quote:

1. **Coverage is discovery, not market size.** The dataset describes products Harpd discovered on
   public launch/directory boards and verified from their homepages. It is not a census of the
   software market, and absence from it means nothing.
2. **Category membership is Harpd's keyword classification.** It is assigned from the product's own
   homepage text, not by the vendor and not by a human editor. `classification_evidence` shows the
   exact tokens that produced the assignment.
3. **"other" is a real category.** ~29% of records matched no category keyword and are labelled
   `other` honestly — do not silently drop them from totals.
4. **Descriptions are the product's own words.** Each description is the product's published meta
   description / title, retrieved from its homepage once. Products change their copy; the snapshot
   records what was observed at `observed_at`.
5. **Not an evaluation.** No record here is a rating, review or endorsement. Rank Points on the
   Harpd Rank board measure promotional activity (optional Credit spend), not product quality, and
   this index is fully separate from that board.
6. **One snapshot is not a trend.** Compare `generatedAt` across releases before claiming growth or
   decline.

---

## License

Data: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — attribution to Harpd required.
Scripts: MIT. The dataset is a factual compilation of publicly listed products and their own
published descriptions; individual product names and trademarks belong to their respective owners.

---

## Related

- Harpd — <https://harpd.com/>
- Discovery Index (human page) — <https://harpd.com/discovery/>
- Machine access hub — <https://harpd.com/ai/>
- Rank dataset (separate, promotional placement) — <https://github.com/harpd-dev/harpd-rank-dataset>
