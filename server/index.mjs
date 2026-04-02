/**
 * Local payment API layer: forwards to upstream (default playtonight.fun).
 * Set PAYMENT_API_UPSTREAM to override (no trailing slash).
 */
import express from 'express'
import cors from 'cors'

const UPSTREAM = (process.env.PAYMENT_API_UPSTREAM || 'https://playtonight.fun').replace(/\/$/, '')
const PORT = Number(process.env.PORT) || 8787

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use(cors({ origin: true }))

async function forwardFetch(targetUrl, init = {}) {
  const r = await fetch(targetUrl, {
    ...init,
    headers: {
      Accept: 'application/json, text/plain, */*',
      ...init.headers,
    },
  })
  const body = await r.text()
  const ct = r.headers.get('content-type') || 'application/json'
  return { status: r.status, body, contentType: ct }
}

app.get('/api/payment/getproductDetails', async (req, res) => {
  try {
    const q = new URLSearchParams(req.query).toString()
    const url = `${UPSTREAM}/api/payment/getproductDetails${q ? `?${q}` : ''}`
    const { status, body, contentType } = await forwardFetch(url)
    res.status(status).type(contentType).send(body)
  } catch (e) {
    console.error('[getproductDetails]', e)
    res.status(502).json({ error: 'Upstream request failed' })
  }
})

app.post('/api/payment/saveuserdataproduct', async (req, res) => {
  try {
    const url = `${UPSTREAM}/api/payment/saveuserdataproduct`
    const { status, body, contentType } = await forwardFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body ?? {}),
    })
    res.status(status).type(contentType).send(body)
  } catch (e) {
    console.error('[saveuserdataproduct]', e)
    res.status(502).json({ error: 'Upstream request failed' })
  }
})

app.post('/api/payment/checkout/:productId', async (req, res) => {
  try {
    const url = `${UPSTREAM}/api/payment/checkout/${encodeURIComponent(req.params.productId)}`
    const { status, body, contentType } = await forwardFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body ?? {}),
    })
    res.status(status).type(contentType).send(body)
  } catch (e) {
    console.error('[checkout]', e)
    res.status(502).json({ error: 'Upstream request failed' })
  }
})

app.listen(PORT, () => {
  console.log(`Payment API proxy listening on http://127.0.0.1:${PORT} → ${UPSTREAM}`)
})
