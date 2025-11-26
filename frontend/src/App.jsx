import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p className='text-red-400'>This is good.</p>
      You are inside app.
    </>
  )
}

export default App
