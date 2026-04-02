import { useState, useEffect } from 'react'
import { getAnalyticsData, clearAnalytics } from '../utils/analytics'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const loadData = () => {
      setData(getAnalyticsData())
    }
    loadData()

    // Auto-refresh every 5 seconds
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [refreshKey])

  const handleRefresh = () => {
    setData(getAnalyticsData())
  }

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all analytics data?')) {
      clearAnalytics()
      setRefreshKey(prev => prev + 1)
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d1a' }}>
        <div style={{ color: '#b0b0b0' }}>Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#0d0d1a' }}>
      {/* Header */}
      <div className="py-4 px-6" style={{ background: '#000047' }}>
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">
            Dashboard – <span className="font-normal">PlayTonight</span>
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Real-time page click tracking</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-md text-sm transition"
            style={{ background: 'rgba(42,42,42,0.85)', border: '1px solid rgba(255,107,53,0.3)', color: '#e0e0e0' }}
          >
            ↻ Refresh
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-md text-sm transition"
            style={{ background: 'rgba(42,42,42,0.85)', border: '1px solid rgba(255,107,53,0.3)', color: '#ff6b35' }}
          >
            Clear Data
          </button>
        </div>

        {/* Overview Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg p-5" style={{ background: 'rgba(42,42,42,0.85)', border: '1px solid rgba(255,107,53,0.2)' }}>
              <p className="text-sm mb-1" style={{ color: '#b0b0b0' }}>Total Page Views</p>
              <p className="text-3xl font-bold" style={{ color: '#f7931e' }}>{data.totalPageViews}</p>
            </div>
            <div className="rounded-lg p-5" style={{ background: 'rgba(42,42,42,0.85)', border: '1px solid rgba(255,107,53,0.2)' }}>
              <p className="text-sm mb-1" style={{ color: '#b0b0b0' }}>Tracked Pages</p>
              <p className="text-3xl font-bold" style={{ color: '#f7931e' }}>{data.totalTrackedPages}</p>
            </div>
            <div className="rounded-lg p-5" style={{ background: 'rgba(42,42,42,0.85)', border: '1px solid rgba(255,107,53,0.2)' }}>
              <p className="text-sm mb-1" style={{ color: '#b0b0b0' }}>Button Clicks (All)</p>
              <p className="text-3xl font-bold" style={{ color: '#f7931e' }}>{data.totalButtonClicks}</p>
            </div>
          </div>
        </div>

        {/* Page Views by Route */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white">Page Views by Route</h2>
          <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(42,42,42,0.85)', border: '1px solid rgba(255,107,53,0.2)' }}>
            <table className="w-full">
              <thead style={{ background: 'rgba(0,0,71,0.6)', borderBottom: '1px solid rgba(255,107,53,0.2)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#b0b0b0' }}>Page</th>
                  <th className="px-6 py-3 text-center text-sm font-medium" style={{ color: '#b0b0b0' }}>Path</th>
                  <th className="px-6 py-3 text-right text-sm font-medium" style={{ color: '#b0b0b0' }}>Clicks</th>
                </tr>
              </thead>
              <tbody>
                {data.pageViews.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-sm" style={{ color: '#666' }}>
                      No page views recorded yet. Navigate around the site to see stats here.
                    </td>
                  </tr>
                ) : (
                  data.pageViews.map((page, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,107,53,0.1)' }}>
                      <td className="px-6 py-4 text-sm" style={{ color: '#ff6b35' }}>{page.name}</td>
                      <td className="px-6 py-4 text-sm text-center" style={{ color: '#b0b0b0' }}>{page.path}</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-white">{page.clicks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Page Views Timeline */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white">Page Views Timeline (per hour)</h2>
          <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(42,42,42,0.85)', border: '1px solid rgba(255,107,53,0.2)' }}>
            <table className="w-full">
              <thead style={{ background: 'rgba(0,0,71,0.6)', borderBottom: '1px solid rgba(255,107,53,0.2)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#b0b0b0' }}>Hour (UTC)</th>
                  <th className="px-6 py-3 text-right text-sm font-medium" style={{ color: '#b0b0b0' }}>Page Views</th>
                </tr>
              </thead>
              <tbody>
                {data.pageTimeline.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-sm" style={{ color: '#666' }}>
                      No page views recorded yet.
                    </td>
                  </tr>
                ) : (
                  data.pageTimeline.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,107,53,0.1)' }}>
                      <td className="px-6 py-4 text-sm" style={{ color: '#ff6b35' }}>{item.hour}</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-white">{item.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Button Clicks */}
        <div className="mb-2">
          <h2 className="text-lg font-semibold mb-4 text-white">Button Clicks</h2>
          <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(42,42,42,0.85)', border: '1px solid rgba(255,107,53,0.2)' }}>
            <table className="w-full">
              <thead style={{ background: 'rgba(0,0,71,0.6)', borderBottom: '1px solid rgba(255,107,53,0.2)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#b0b0b0' }}>Button</th>
                  <th className="px-6 py-3 text-right text-sm font-medium" style={{ color: '#b0b0b0' }}>Clicks</th>
                </tr>
              </thead>
              <tbody>
                {data.buttonClicks.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-sm" style={{ color: '#666' }}>
                      No button clicks recorded yet.
                    </td>
                  </tr>
                ) : (
                  data.buttonClicks.map((btn, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,107,53,0.1)' }}>
                      <td className="px-6 py-4 text-sm text-white">{btn.label}</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-white">{btn.clicks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs mb-8" style={{ color: '#555' }}>
          Counts are stored in the browser and updated immediately whenever a tracked button is clicked.
        </p>

        {/* Button Click Timeline */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-white">Button Click Timeline (per hour)</h2>
          <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(42,42,42,0.85)', border: '1px solid rgba(255,107,53,0.2)' }}>
            <table className="w-full">
              <thead style={{ background: 'rgba(0,0,71,0.6)', borderBottom: '1px solid rgba(255,107,53,0.2)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium" style={{ color: '#b0b0b0' }}>Hour (UTC)</th>
                  <th className="px-6 py-3 text-right text-sm font-medium" style={{ color: '#b0b0b0' }}>Button Clicks</th>
                </tr>
              </thead>
              <tbody>
                {data.buttonTimeline.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-sm" style={{ color: '#666' }}>
                      No button clicks recorded yet.
                    </td>
                  </tr>
                ) : (
                  data.buttonTimeline.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,107,53,0.1)' }}>
                      <td className="px-6 py-4 text-sm" style={{ color: '#ff6b35' }}>{item.hour}</td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-white">{item.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard