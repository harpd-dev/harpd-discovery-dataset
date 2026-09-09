#!/usr/bin/env node
/**
 * Sync the Harpd Product Discovery Index from harpd.com into this repository.
 *
 *   node scripts/sync.mjs            # fetch and write
 *   node scripts/sync.mjs --check    # validate what is already committed
 *   node scripts/sync.mjs --origin=http://localhost:4322
 *
 * Zero dependencies (Node 18+ global fetch). No credentials: everything this
 * script reads is already public at https://harpd.com/data/.
 *
 * Safety rules, because a public dataset that silently publishes an empty or
 * degraded snapshot is worse than one that is a week stale:
 *   1. Every endpoint must return 200 AND a non-empty record set. Otherwise
 *      the run aborts and nothing is written.
 *   2. `discovery-index.json` must not shrink by more than 25% versus the
 *      previous committed copy. A drop that large means the upstream pipeline
 *      is degraded, not that products disappeared.
 *   3. The JSON Schema is copied verbatim from the live endpoint so it can
 *      never drift from the data it describes.
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const CHECK_ONLY = args.includes('--check')
const ORIGIN = (args.find((a) => a.startsWith('--origin=')) || '').split('=')[1] || 'https://harpd.com'

/** endpoint path -> where it lands in this repo. */
const TARGETS = [
  ['/data/discovery-index.json', 'coverage/discovery-index.json'],
  ['/data/discovery-index.csv', 'coverage/discovery-index.csv'],
  ['/data/discovery-index.schema.json', 'methodology/discovery-index.schema.json'],
]

const readJson = async (path) => {
  try {
    return JSON.parse(await readFile(join(ROOT, path), 'utf8'))
  } catch {
    return null
  }
}

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex')

const manifestPath = 'manifest.json'
const loadManifest = () => readJson(manifestPath)
const entriesFromTargets = async () => {
  const entries = []
  for (const [endpoint, dest] of TARGETS) {
    const buffer = await readFile(join(ROOT, dest))
    entries.push({ path: dest, bytes: buffer.length, sha256: sha256(buffer) })
  }
  return entries
}

const main = async () => {
  if (CHECK_ONLY) {
    const manifest = await loadManifest()
    if (!manifest) throw new Error('manifest.json missing — run sync once first')
    const expected = await entriesFromTargets()
    let ok = true
    for (const entry of expected) {
      const recorded = manifest.files.find((f) => f.path === entry.path)
      if (!recorded || recorded.sha256 !== entry.sha256) {
        console.error(`  MISMATCH ${entry.path}`)
        ok = false
      }
    }
    if (!ok) {
      console.error('Integrity check FAILED — committed files do not match manifest.json')
      process.exit(1)
    }
    console.log(`Integrity OK: ${expected.length} files match manifest (${expected.reduce((n, f) => n + f.bytes, 0)} bytes)`)
    return
  }

  // Fetch each target.
  const fetched = {}
  for (const [endpoint, dest] of TARGETS) {
    const url = ORIGIN + endpoint
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${endpoint} -> HTTP ${response.status} (aborting, nothing written)`)
    const buffer = Buffer.from(await response.arrayBuffer())
    if (!buffer.length) throw new Error(`${endpoint} -> empty body (aborting)`)
    fetched[dest] = buffer
  }

  // Guard: the JSON dataset must not shrink >25% vs the committed copy.
  const jsonDest = 'coverage/discovery-index.json'
  const committed = await readJson(jsonDest)
  const fresh = JSON.parse(fetched[jsonDest].toString('utf8'))
  const freshCount = fresh?.counts?.qualified ?? fresh?.products?.length ?? 0
  if (committed) {
    const oldCount = committed.counts?.qualified ?? committed.products?.length ?? 0
    if (oldCount > 0 && freshCount < oldCount * 0.75) {
      throw new Error(
        `qualified dropped ${oldCount} -> ${freshCount} (>25%). Aborting — upstream pipeline likely degraded.`,
      )
    }
  }
  if (!freshCount) throw new Error('fetched dataset has zero qualified products (aborting)')

  // Write.
  for (const [, dest] of TARGETS) {
    const full = join(ROOT, dest)
    await mkdir(dirname(full), { recursive: true })
    await writeFile(full, fetched[dest])
  }

  // Manifest.
  const manifest = {
    generatedAt: fresh.generated_at || new Date().toISOString(),
    origin: ORIGIN,
    qualified: freshCount,
    categories: fresh.category_counts ? Object.keys(fresh.category_counts).length : undefined,
    files: TARGETS.map(([, dest]) => {
      const buffer = fetched[dest]
      return { path: dest, bytes: buffer.length, sha256: sha256(buffer) }
    }),
  }
  await writeFile(join(ROOT, manifestPath), JSON.stringify(manifest, null, 2) + '\n')

  console.log(`Synced: qualified=${freshCount} files=${TARGETS.length}`)
}

main().catch((error) => {
  console.error(`sync failed: ${error.message}`)
  process.exit(1)
})
