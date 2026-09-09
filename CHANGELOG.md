# Changelog

All published snapshots of the Harpd Product Discovery Index. Snapshots are immutable once
committed; the latest is always in `coverage/` and described by `manifest.json`.

## 2026-09-09 — initial public release

- **8,637** qualified records (28 categories) from **10,537** harvested candidates.
- Homepages fetched & verified: **9,570**; records with a real homepage description: **8,561**.
- Published with full rejection transparency: no_fetch 967 / below_threshold 874 / duplicate 174 /
  out_of_scope 24; 35 excluded as already canonical on the Harpd Rank board.
- CC BY 4.0. Pipeline: harvest (public boards) → homepage enrichment → keyword-evidence
  classification → qualification gate. See METHODOLOGY.md.
