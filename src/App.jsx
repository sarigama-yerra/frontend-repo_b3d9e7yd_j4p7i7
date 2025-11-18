import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Execute from './components/Execute'
import CreateInstruction from './components/CreateInstruction'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/execute/:id" element={<Execute />} />
      <Route path="/create" element={<CreateInstruction />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
