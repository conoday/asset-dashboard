"""
test_services.js — Automated verification for Asset Dashboard
=============================================================
Run this AFTER `npm run dev` is running in the asset-dashboard folder.

Usage (from asset-dashboard root):
    node tests/test_services.js

Requires Node.js. No extra dependencies — uses built-in fetch (Node 18+).
"""

const FRONTEND = 'http://localhost:5173'
const API      = 'http://localhost:4000'

let passed = 0
let failed = 0

function check(name, ok, detail = '') {
  const icon = ok ? '✓' : '✗'
  const msg  = detail ? `  ${icon} ${name} — ${detail}` : `  ${icon} ${name}`
  console.log(msg)
  ok ? passed++ : failed++
}

function section(title) {
  console.log(`\n${'='.repeat(55)}`)
  console.log(`  ${title}`)
  console.log('='.repeat(55))
}

async function run() {
  // ── 1. Frontend ──────────────────────────────────────────
  section('1. Frontend Reachability')
  try {
    const r = await fetch(FRONTEND)
    check(`GET ${FRONTEND} returns 200`, r.status === 200, `status=${r.status}`)
  } catch (e) {
    check(`Frontend at ${FRONTEND}`, false, e.message)
    console.log(`\n  [ERROR] Frontend not reachable. Run: npm run dev\n`)
    process.exit(1)
  }

  // ── 2. Mock API ──────────────────────────────────────────
  section('2. Mock API — GET /api/assets')
  try {
    const r = await fetch(`${API}/api/assets`)
    check('GET /api/assets returns 200', r.status === 200, `status=${r.status}`)
    if (r.status === 200) {
      const data = await r.json()
      check('Response is an array', Array.isArray(data), `type=${typeof data}`)
      if (Array.isArray(data) && data.length > 0) {
        const asset = data[0]
        check("Asset has 'id' field",   'id'   in asset)
        check("Asset has 'name' field", 'name' in asset)
        check("Asset has 'type' field", 'type' in asset)
      }
    }
  } catch (e) {
    check('Mock API reachable', false, e.message)
    console.log(`  [ERROR] Cannot reach mock API at ${API}`)
    console.log(`  Make sure 'npm run dev' is running (starts both Vite + Express).\n`)
  }

  // ── 3. POST /api/assets ──────────────────────────────────
  section('3. Mock API — POST /api/assets (Create)')
  const testAsset = {
    name:        'Test Asset Auto',
    type:        'Framework',
    status:      'Active',
    description: 'Created by automated test',
    owner:       'test-script',
  }
  let createdId = null
  try {
    const r = await fetch(`${API}/api/assets`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(testAsset),
    })
    check('POST /api/assets returns 201', r.status === 201, `status=${r.status}`)
    if (r.status === 201) {
      const created = await r.json()
      createdId = created.id
      check("Created asset has 'id'",   !!created.id)
      check("Created asset name matches", created.name === testAsset.name)
    }
  } catch (e) {
    check('POST /api/assets', false, e.message)
  }

  // ── 4. DELETE /api/assets/:id ────────────────────────────
  section('4. Mock API — DELETE /api/assets/:id (Cleanup)')
  if (createdId) {
    try {
      const r = await fetch(`${API}/api/assets/${createdId}`, { method: 'DELETE' })
      check(`DELETE /api/assets/${createdId} returns 200`, r.status === 200, `status=${r.status}`)
    } catch (e) {
      check('DELETE /api/assets', false, e.message)
    }
  } else {
    console.log('  ⚠  Skipped — no asset was created in step 3')
  }

  // ── 5. Export endpoint ───────────────────────────────────
  section('5. Mock API — GET /api/assets/export (CSV)')
  try {
    const r = await fetch(`${API}/api/assets/export`)
    check('GET /api/assets/export returns 200', r.status === 200, `status=${r.status}`)
    const ct = r.headers.get('content-type') || ''
    check('Response is CSV content-type', ct.includes('csv') || ct.includes('text'), `content-type=${ct}`)
  } catch (e) {
    check('Export endpoint', false, e.message)
  }

  // ── Summary ──────────────────────────────────────────────
  section('Summary')
  console.log(`\n  Tests passed: ${passed}/${passed + failed}`)
  if (failed > 0) {
    console.log(`  Tests FAILED: ${failed}\n`)
    process.exit(1)
  } else {
    console.log('  All tests passed! ✓\n')
    process.exit(0)
  }
}

run().catch(e => {
  console.error('Unexpected error:', e)
  process.exit(1)
})
