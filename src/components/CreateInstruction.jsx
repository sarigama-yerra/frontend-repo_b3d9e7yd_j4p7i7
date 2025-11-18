import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function CreateInstruction() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [steps, setSteps] = useState([{ title: '', description: '', order: 0 }])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const addStep = () => {
    setSteps(prev => [...prev, { title: '', description: '', order: prev.length }])
  }
  const updateStep = (idx, field, value) => {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value, order: i } : s))
  }
  const removeStep = (idx) => {
    setSteps(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i })))
  }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = { title, steps: steps.map((s, i) => ({ ...s, order: i })) }
      const res = await fetch(`${API_BASE}/api/instructions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to save')
      const data = await res.json()
      navigate(`/execute/${data.id}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-3xl mx-auto p-6">
        <header className="py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Work Instruction</h1>
          <button onClick={() => navigate('/')} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded">Back</button>
        </header>

        <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm text-blue-200 mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Assemble Widget A" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Steps</h2>
              <button onClick={addStep} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded">Add Step</button>
            </div>

            {steps.map((s, i) => (
              <div key={i} className="p-4 rounded-lg bg-slate-900 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-300">Step {i + 1}</span>
                  <button onClick={() => removeStep(i)} className="text-sm text-red-300 hover:text-red-200">Remove</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={s.title} onChange={e => updateStep(i, 'title', e.target.value)} placeholder="Step title" className="bg-slate-950 border border-slate-700 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                  <input value={s.description} onChange={e => updateStep(i, 'description', e.target.value)} placeholder="Step description" className="bg-slate-950 border border-slate-700 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-red-300">{error}</p>}

          <div className="flex gap-3">
            <button onClick={save} disabled={saving || !title || steps.some(s => !s.title)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded disabled:opacity-50">{saving ? 'Saving...' : 'Save & Execute'}</button>
            <button onClick={() => navigate('/')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
