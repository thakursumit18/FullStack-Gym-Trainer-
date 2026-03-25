import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('Connecting...')

  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Failed to connect to backend'))
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Gym Trainer</h1>
      <p>Backend: {message}</p>
    </div>
  )
}

export default App
