import React from 'react'
import * as Tone from 'tone'

function App() {
  const synth = new Tone.Synth().toDestination()

  const handleClick = () => {
    synth.triggerAttackRelease('C4', '8n')
  }
  React.useEffect(() => {
    const getData = async () => {
      const res = await fetch('/api/endpoint') // * <-- replace with your endpoint
      const data = await res.json()
      console.log(data)
    }
    getData()
  })

  return (
    <>
      <h1>Hello World</h1>
      <button onClick={handleClick}>Play</button>
    </>
  )
}

export default App
