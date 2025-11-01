import { useState, useEffect } from 'react'

function Home() {
  const [analyticsData, setAnalyticsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/data')
      const data = await response.json()
      setAnalyticsData(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  // Calcular estadísticas
  const stats = calculateStats(analyticsData)

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Monitor your website performance</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Uptime Card */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f]">
            <h3 className="text-sm text-gray-400 mb-4">Uptime</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-500 text-2xl">▲</span>
              <span className="text-4xl font-bold text-green-500">Up</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Last downtime</p>
                <p className="font-semibold">{stats.lastDowntime}</p>
              </div>
              <div>
                <p className="text-gray-400">Response time</p>
                <p className="font-semibold">{stats.responseTime}</p>
              </div>
            </div>
          </div>

          {/* Sessions Card */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f] lg:col-span-2">
            <h3 className="text-sm text-gray-400 mb-4">Sessions</h3>
            <div className="mb-4">
              <p className="text-2xl font-bold">{stats.totalSessions}</p>
            </div>
            <div className="h-32 flex items-end gap-1">
              {/* Simple chart visualization */}
              {stats.sessionChart.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-cyan-500 rounded-t"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>1 Feb</span>
              <span>3 Feb</span>
              <span>5 Feb</span>
              <span>7 Feb</span>
            </div>
          </div>

          {/* Load Time Card */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f]">
            <h3 className="text-sm text-gray-400 mb-4">Load time</h3>
            <div className="mb-2">
              <span className="text-5xl font-bold">{stats.avgLoadTime}</span>
              <span className="text-2xl text-gray-400">s</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">Avg. page load time</p>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-red-500">▲</span>
              <span className="text-red-500">{stats.loadTimeChange}</span>
            </div>
          </div>

          {/* Key Pages Chart */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f] lg:col-span-2">
            <h3 className="text-sm text-gray-400 mb-4">Key pages</h3>
            <div className="h-40 relative">
              <div className="absolute inset-0 flex items-end gap-1">
                {stats.keyPagesChart.map((page, index) => (
                  <div key={index} className="flex-1 flex flex-col justify-end">
                    <div
                      className="rounded-t"
                      style={{
                        height: `${page.value}%`,
                        backgroundColor: page.color
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <span className="text-gray-400">homepage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-gray-400">payment page</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-gray-400">product</span>
              </div>
            </div>
          </div>

          {/* Conversions Card */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f] lg:col-span-3">
            <h3 className="text-sm text-gray-400 mb-4">Conversions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#2d2d5f] rounded-lg p-6">
                <div className="mb-2">
                  <span className="text-5xl font-bold">75</span>
                  <span className="text-3xl text-gray-400">%</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">Shopping cart abandonment rate</p>
              </div>
              <div className="bg-[#2d2d5f] rounded-lg p-6">
                <div className="mb-2">
                  <span className="text-5xl font-bold">3.3</span>
                  <span className="text-3xl text-gray-400">%</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">Website conversion rate</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-red-500">▼</span>
                  <span className="text-red-500">0.9% vs last week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Most Popular Pages */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f] lg:col-span-2">
            <h3 className="text-sm text-gray-400 mb-4">Most popular pages (7 days)</h3>
            <div className="space-y-3">
              {stats.popularPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{page.name}</span>
                    </div>
                    <div className="mt-1 h-1 bg-[#2d2d5f] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${page.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-semibold">{page.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Query Answered & Pages per Session */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f]">
            <div className="mb-6">
              <div className="mb-2">
                <span className="text-5xl font-bold">75</span>
                <span className="text-3xl text-gray-400">%</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">Query answered</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-green-500">▲</span>
                <span className="text-green-500">7% vs last week</span>
              </div>
            </div>
            <div className="border-t border-[#2d2d5f] pt-6">
              <div className="mb-2">
                <span className="text-5xl font-bold">1.9</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">pages per session</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-green-500">▲</span>
                <span className="text-green-500">27% vs last week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className="mt-8 flex items-center justify-between bg-[#1a1a3e] rounded-xl p-4 border border-[#2d2d5f]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <span className="text-sm font-semibold">Website launch</span>
          </div>
          <span className="text-sm text-gray-400">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate statistics
function calculateStats(data) {
  const totalVisits = data.length
  
  // Calculate average duration
  const avgDuration = data.length > 0
    ? (data.reduce((sum, visit) => sum + visit.duration_seconds, 0) / data.length).toFixed(1)
    : '0.0'

  // Count unique pages
  const pageViews = {}
  data.forEach(visit => {
    const url = visit.url || 'unknown'
    pageViews[url] = (pageViews[url] || 0) + 1
  })

  // Get top pages
  const sortedPages = Object.entries(pageViews)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, views]) => ({
      name: name.split('/').pop() || 'homepage',
      views,
      percentage: totalVisits > 0 ? (views / totalVisits) * 100 : 0
    }))

  // Generate mock chart data
  const sessionChart = Array.from({ length: 20 }, () => Math.random() * 100)
  
  const keyPagesChart = [
    { value: 80, color: '#ec4899' },
    { value: 60, color: '#a855f7' },
    { value: 40, color: '#eab308' },
  ]

  return {
    totalSessions: totalVisits.toLocaleString(),
    lastDowntime: '7904 4h',
    responseTime: '184ms',
    avgLoadTime: avgDuration,
    loadTimeChange: '0.1s',
    sessionChart,
    keyPagesChart,
    popularPages: sortedPages.length > 0 ? sortedPages : [
      { name: 'homepage', views: 56025, percentage: 100 },
      { name: 'shoes', views: 9568, percentage: 17 },
      { name: 'coats', views: 8596, percentage: 15 },
      { name: 'menswear', views: 7458, percentage: 13 },
      { name: 'socks', views: 7325, percentage: 13 },
      { name: 'winter', views: 5489, percentage: 10 },
      { name: 'checkout', views: 2156, percentage: 4 },
      { name: 'blog', views: 1025, percentage: 2 },
      { name: 'returns', views: 895, percentage: 2 },
    ]
  }
}

export default Home
