import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Execute() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [wi, setWi] = useState(null)
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${API_BASE}/api/instructions/${id}`)
        if (!res.ok) throw new Error('Failed to load instruction')
        const data = await res.json()
        setWi(data)
        setIndex(0)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const next = () => {
    if (wi && index < wi.steps.length - 1) setIndex(i => i + 1)
  }
  const prev = () => {
    if (index > 0) setIndex(i => i - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-3xl mx-auto p-6">
        <header className="py-6 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded">Back</button>
          <h1 className="text-xl font-semibold">Execute Instruction</h1>
          <div />
        </header>

        <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-6 min-h-[300px] flex items-center justify-center">
          {loading && <p className="text-blue-200">Loading...</p>}
          {error && <p className="text-red-300">{error}</p>}
          {!loading && wi && wi.steps.length > 0 && (
            <div className="w-full">
              <div className="mb-6">
                <p className="text-sm text-blue-300">{wi.title}</p>
                <h2 className="text-2xl font-bold">Step {index + 1}: {wi.steps[index].title}</h2>
                <p className="text-blue-200 mt-2">{wi.steps[index].description}</p>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={prev} disabled={index === 0} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50">Previous</button>
                <div className="text-sm text-blue-300">{index + 1} / {wi.steps.length}</div>
                <button onClick={next} disabled={index === wi.steps.length - 1} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
          {!loading && wi && wi.steps.length === 0 && <p className="text-blue-200">This instruction has no steps.</p>}
        </div>
      </div>
    </div>
  )
}
