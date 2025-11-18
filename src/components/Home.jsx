import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/instructions`)
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setItems(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <header className="flex items-center justify-between py-6">
          <h1 className="text-2xl font-bold">Work Instructions</h1>
          <Link to="/create" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">Create</Link>
        </header>

        <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Available Instructions</h2>
            <button onClick={load} className="text-sm px-3 py-1 bg-slate-700 rounded hover:bg-slate-600">Refresh</button>
          </div>

          {loading && <p className="text-blue-200">Loading...</p>}
          {error && <p className="text-red-300">{error}</p>}

          {!loading && items.length === 0 && (
            <p className="text-blue-200">No instructions yet. Click Create to add one.</p>
          )}

          <ul className="divide-y divide-slate-700">
            {items.map(it => (
              <li key={it.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{it.title}</p>
                </div>
                <Link to={`/execute/${it.id}`} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded">Execute</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
