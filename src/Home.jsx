import { useState, useEffect } from 'react'

function Home() {
  const [analyticsData, setAnalyticsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
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

  // Calcular estadísticas desde datos reales
  const stats = calculateStats(analyticsData)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center">
        <div className="text-xl">Cargando datos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Monitor your website performance in real-time</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Visits Card */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f]">
            <h3 className="text-sm text-gray-400 mb-4">Total Visits</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-500 text-2xl">📊</span>
              <span className="text-4xl font-bold text-white">{stats.totalVisits}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Unique IPs</p>
                <p className="font-semibold text-white">{stats.uniqueIPs}</p>
              </div>
              <div>
                <p className="text-gray-400">Avg. Duration</p>
                <p className="font-semibold text-white">{stats.avgDuration}s</p>
              </div>
            </div>
          </div>

          {/* Sessions Timeline */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f] lg:col-span-2">
            <h3 className="text-sm text-gray-400 mb-4">Visits Over Time (Last 24h)</h3>
            <div className="mb-4">
              <p className="text-2xl font-bold text-white">{stats.last24Hours} visits</p>
            </div>
            <div className="h-32 flex items-end gap-1">
              {stats.hourlyChart.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-cyan-500 rounded-t transition-all hover:bg-cyan-400"
                  style={{ height: `${value}%` }}
                  title={`Hour ${index}: ${Math.round(value)}%`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>24h ago</span>
              <span>12h ago</span>
              <span>Now</span>
            </div>
          </div>

          {/* Average Load Time Card */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f]">
            <h3 className="text-sm text-gray-400 mb-4">Avg. Page Duration</h3>
            <div className="mb-2">
              <span className="text-5xl font-bold text-white">{stats.avgDuration}</span>
              <span className="text-2xl text-gray-400">s</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">Average time on page</p>
            <div className="flex items-center gap-1 text-sm">
              {stats.durationTrend >= 0 ? (
                <>
                  <span className="text-green-500">▲</span>
                  <span className="text-green-500">+{stats.durationTrend}s vs average</span>
                </>
              ) : (
                <>
                  <span className="text-red-500">▼</span>
                  <span className="text-red-500">{stats.durationTrend}s vs average</span>
                </>
              )}
            </div>
          </div>

          {/* Top Pages Chart */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f] lg:col-span-2">
            <h3 className="text-sm text-gray-400 mb-4">Top Pages by Duration</h3>
            <div className="h-40 relative">
              <div className="absolute inset-0 flex items-end gap-2">
                {stats.topPagesByDuration.slice(0, 10).map((page, index) => (
                  <div key={index} className="flex-1 flex flex-col justify-end items-center group">
                    <div
                      className="w-full rounded-t transition-all"
                      style={{
                        height: `${page.percentage}%`,
                        backgroundColor: getColorForIndex(index)
                      }}
                    />
                    <span className="text-xs text-gray-400 mt-1 truncate w-full text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {page.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mt-4 text-xs flex-wrap">
              {stats.topPagesByDuration.slice(0, 3).map((page, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getColorForIndex(index) }}
                  />
                  <span className="text-gray-400">{page.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Most Popular Pages */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f] lg:col-span-3">
            <h3 className="text-sm text-gray-400 mb-4">Most Popular Pages (All Time)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.popularPages.slice(0, 10).map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-white font-medium">{page.name}</span>
                      <span className="text-xs text-gray-500">({page.visits} visits)</span>
                    </div>
                    <div className="h-2 bg-[#2d2d5f] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                        style={{ width: `${page.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-semibold text-white min-w-[60px] text-right">
                    {page.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Visitors */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f] lg:col-span-2">
            <h3 className="text-sm text-gray-400 mb-4">Recent Visitors</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stats.recentVisits.map((visit, index) => (
                <div key={index} className="flex items-center justify-between text-sm border-b border-[#2d2d5f] pb-2">
                  <div className="flex-1">
                    <p className="text-white font-medium truncate">{visit.url}</p>
                    <p className="text-gray-500 text-xs">{visit.ip}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-cyan-400">{visit.duration}s</p>
                    <p className="text-gray-500 text-xs">{visit.timeAgo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-[#1a1a3e] rounded-xl p-6 border border-[#2d2d5f]">
            <div className="mb-6">
              <div className="mb-2">
                <span className="text-5xl font-bold text-white">{stats.uniqueIPs}</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">Unique visitors</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-green-500">▲</span>
                <span className="text-green-500">Active tracking</span>
              </div>
            </div>
            <div className="border-t border-[#2d2d5f] pt-6">
              <div className="mb-2">
                <span className="text-5xl font-bold text-white">{stats.totalPages}</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">Pages tracked</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-cyan-500">📄</span>
                <span className="text-cyan-500">Different URLs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className="mt-8 flex items-center justify-between bg-[#1a1a3e] rounded-xl p-4 border border-[#2d2d5f]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center animate-pulse">
              <span className="text-white text-sm">✓</span>
            </div>
            <span className="text-sm font-semibold text-white">Monitoring Active</span>
            <span className="text-xs text-gray-400">• Last update: {new Date().toLocaleTimeString()}</span>
          </div>
          <button 
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-medium transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate statistics from real data
function calculateStats(data) {
  if (!data || data.length === 0) {
    return {
      totalVisits: 0,
      uniqueIPs: 0,
      avgDuration: '0.0',
      last24Hours: 0,
      hourlyChart: Array(24).fill(0),
      durationTrend: 0,
      topPagesByDuration: [],
      popularPages: [],
      recentVisits: [],
      totalPages: 0
    }
  }

  const totalVisits = data.length
  
  // Calcular IPs únicas
  const uniqueIPs = new Set(data.map(v => v.ip_address)).size
  
  // Calcular duración promedio
  const avgDuration = (data.reduce((sum, v) => sum + (v.duration_seconds || 0), 0) / totalVisits).toFixed(1)
  
  // Calcular visitas en las últimas 24 horas
  const now = new Date()
  const last24h = data.filter(v => {
    const visitDate = new Date(v.date)
    return (now - visitDate) < 24 * 60 * 60 * 1000
  }).length
  
  // Crear gráfico por horas (últimas 24 horas)
  const hourlyData = Array(24).fill(0)
  data.forEach(visit => {
    const visitDate = new Date(visit.date)
    const hoursAgo = Math.floor((now - visitDate) / (60 * 60 * 1000))
    if (hoursAgo < 24) {
      hourlyData[23 - hoursAgo]++
    }
  })
  const maxHourly = Math.max(...hourlyData, 1)
  const hourlyChart = hourlyData.map(count => (count / maxHourly) * 100)
  
  // Agrupar por URL para páginas populares
  const pageStats = {}
  data.forEach(visit => {
    const url = visit.url || 'unknown'
    if (!pageStats[url]) {
      pageStats[url] = { visits: 0, totalDuration: 0 }
    }
    pageStats[url].visits++
    pageStats[url].totalDuration += visit.duration_seconds || 0
  })
  
  // Páginas más populares por visitas
  const popularPages = Object.entries(pageStats)
    .map(([url, stats]) => ({
      name: extractPageName(url),
      visits: stats.visits,
      percentage: (stats.visits / totalVisits) * 100
    }))
    .sort((a, b) => b.visits - a.visits)
  
  // Páginas con mayor duración promedio
  const topPagesByDuration = Object.entries(pageStats)
    .map(([url, stats]) => ({
      name: extractPageName(url),
      avgDuration: stats.totalDuration / stats.visits,
      percentage: 0
    }))
    .sort((a, b) => b.avgDuration - a.avgDuration)
  
  // Normalizar porcentajes para el gráfico
  const maxDuration = Math.max(...topPagesByDuration.map(p => p.avgDuration), 1)
  topPagesByDuration.forEach(page => {
    page.percentage = (page.avgDuration / maxDuration) * 100
  })
  
  // Visitas recientes
  const recentVisits = data.slice(0, 10).map(visit => ({
    url: extractPageName(visit.url),
    ip: visit.ip_address,
    duration: visit.duration_seconds.toFixed(1),
    timeAgo: getTimeAgo(new Date(visit.date))
  }))
  
  // Calcular tendencia de duración
  const recentAvg = data.slice(0, Math.floor(totalVisits / 2))
    .reduce((sum, v) => sum + v.duration_seconds, 0) / Math.max(Math.floor(totalVisits / 2), 1)
  const olderAvg = data.slice(Math.floor(totalVisits / 2))
    .reduce((sum, v) => sum + v.duration_seconds, 0) / Math.max(totalVisits - Math.floor(totalVisits / 2), 1)
  const durationTrend = (recentAvg - olderAvg).toFixed(1)
  
  return {
    totalVisits,
    uniqueIPs,
    avgDuration,
    last24Hours: last24h,
    hourlyChart,
    durationTrend: parseFloat(durationTrend),
    topPagesByDuration,
    popularPages,
    recentVisits,
    totalPages: Object.keys(pageStats).length
  }
}

// Extraer nombre de página de URL
function extractPageName(url) {
  if (!url) return 'unknown'
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname
    if (path === '/' || path === '') return 'homepage'
    const parts = path.split('/').filter(Boolean)
    return parts[parts.length - 1] || 'homepage'
  } catch {
    return url.split('/').filter(Boolean).pop() || 'homepage'
  }
}

// Calcular tiempo transcurrido
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// Obtener color para índice
function getColorForIndex(index) {
  const colors = [
    '#ec4899', // pink
    '#a855f7', // purple
    '#eab308', // yellow
    '#06b6d4', // cyan
    '#10b981', // green
    '#f97316', // orange
    '#8b5cf6', // violet
    '#14b8a6', // teal
    '#f43f5e', // rose
    '#84cc16', // lime
  ]
  return colors[index % colors.length]
}

export default Home
