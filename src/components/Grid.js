import { useState } from 'react'
import IndividualDiv from './IndividualDiv.js'
import * as Tone from 'tone'



export default function Grid() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [counter, setCounter] = useState(0)
  let stepper = 0
  const [allNotes, setAllNotes] = useState(
    {
      C1: [false, false, false, false],
      C2: [true, false, false, false],
      C3: [false, false, false, false],
      C4: [false, false, false, false],
      A1: [false, false, false, false],
    })
  const synths = [
    new Tone.Synth().toDestination(),
    new Tone.Synth().toDestination(),
    new Tone.Synth().toDestination(),
    new Tone.Synth().toDestination(),
    new Tone.Synth().toDestination()
  ]

  const notes = Object.keys(allNotes)

  function repeat(time) {
    const step = stepper % 4
    notes.forEach((note, index) => {
      console.log(note, index, step)
      if (allNotes[note][step]) {
        console.log('here')
        const synth = synths[index]
        synth.triggerAttackRelease(note, '8n', time)
      } else {
        console.log('anything')
      }
    })
    // const newCounter = counter + 1
    // console.log(newCounter)
    // setCounter(newCounter)
    // console.log('countere here')
    // console.log(counter)
    stepper ++
  }

  const handlePlay = () => {
    if (!isPlaying) {
      Tone.Transport.scheduleRepeat(repeat, '8n')
      Tone.Transport.start()
      setIsPlaying(!isPlaying)
    } else {
      Tone.Transport.stop()
      setCounter(0)
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div>
      <h1>Grid Stuff</h1>
      {notes.map((note, index)=> {
        return (
          <IndividualDiv key={note} note={note} buttonsSelected={allNotes[note]} setAllNotes={setAllNotes} allNotes={allNotes} synth={synths[index]}/>
        )
      })}
      <button onClick={handlePlay}>Play</button>
    </div>
  )
}