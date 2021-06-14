import axios from 'axios'
import { useEffect } from 'react'
import * as Tone from 'tone'

export default function Home() {
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get('/api/songs/')
      console.log(response.data)
    }
    getData()
  }, [])

  const synth = new Tone.Synth().toDestination()
  const notes = ['C4', 'E4', 'G4', 'C5', 'E5', 'G5']
  let index = 0
  Tone.Transport.scheduleRepeat(time => {
    repeat(time)
  }, '8n')

  function repeat(time) {
    const note = notes[index % notes.length]
    synth.triggerAttackRelease(note, '8n', time)
    index ++
  }

  Tone.Transport.start()
  
  setTimeout(() => {
    Tone.Transport.stop()
  }, 2000)

  return (
    <h1>Home Page</h1>
  )
}