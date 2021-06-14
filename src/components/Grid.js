import { useState, useRef } from 'react'
import IndividualDiv from './IndividualDiv.js'
import * as Tone from 'tone'



export default function Grid() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)
  let stepper = 0
  const transportEventId = useRef(null)
  // const [songStarted, setSongStarted] = useState(false)
  const [numberOfActive, setNumberOfActive] = useState(0)
  const [allNotes, setAllNotes] = useState(
    {
      C4: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      D4: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      E4: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      F4: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      G4: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      A4: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      B4: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    })

  const gain = new Tone.Gain(0.1)
  gain.toDestination()

  const synths = new Tone.PolySynth().connect(gain)

  // const synth2 = new Tone.Synth({
  //   oscillator: {
  //     volume: 5,
  //     count: 3,
  //     spread: 40,
  //     type: 'fatsawtooth',
  //   }
  // }).toDestination()

  if (numberOfActive) synths.volume.value = 1 / numberOfActive

  const notes = Object.keys(allNotes)
  console.log('Outside FUNCTION')
  console.log('numberOFACTIVE', numberOfActive)

  const repeat = (time) => {
    const step = stepper % 16
    notes.forEach((note) => {
      if (allNotes[note][step]) {
        // synth.volume.value = 1 / numberOfActive
        console.log('Inside Function')
        console.log(1 / numberOfActive)
        console.log(numberOfActive)
        synths.triggerAttackRelease(note, '8n', time)
      }
    })
    stepper++
  }


  const handlePlay = async () => {
    if (!isPlaying) {
      // if (!songStarted) {
      const eventId = await Tone.Transport.scheduleRepeat(repeat, '8n')
      transportEventId.current = eventId
      await Tone.Time('1m')

      // }
      // setSongStarted(true)
      await Tone.Transport.start()
      setIsPlaying(!isPlaying)

    } else {
      await Tone.Transport.stop()
      await Tone.Transport.clear(transportEventId.current)
      // await Tone.Transport.dispose()
      setIsPlaying(!isPlaying)
      // setAllNotes(false)
    }
  }
  const handleBpm = (e) => {
    setBpm(e.target.value)
    Tone.Transport.bpm.value = e.target.value
  }
  return (
    <div>
      <h1>Grid Stuff</h1>
      {notes.map(note => {
        return (
          <IndividualDiv key={note} note={note} buttonsSelected={allNotes[note]} setAllNotes={setAllNotes} allNotes={allNotes} setNumberOfActive={setNumberOfActive} numberOfActive={numberOfActive} />
        )
      })}
      <button onClick={handlePlay}>{!isPlaying ? 'Play' : 'Stop'}</button>
      <input type='range' min='10' max='200' value={bpm} onChange={handleBpm} />
      <h3>{bpm}</h3>
    </div>
  )
}