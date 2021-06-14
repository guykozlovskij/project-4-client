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
      C1: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      D1: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      E1: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      F1: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      G1: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      A1: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      B1: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      C2: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      C3: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      C4: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    })

  const gain = new Tone.Gain(0.1)
  gain.toDestination()

  const synths = [
    new Tone.Synth().connect(gain),
    new Tone.Synth().connect(gain),
    new Tone.Synth().connect(gain),
    new Tone.Synth().connect(gain),
    new Tone.Synth().connect(gain),
    new Tone.Synth().connect(gain),
    new Tone.Synth().connect(gain),
    new Tone.Synth().connect(gain),
    new Tone.Synth().connect(gain),
    new Tone.Synth().connect(gain),
    new Tone.Synth().connect(gain),
    new Tone.Synth().connect(gain)
  ]

  const synth2 = new Tone.Synth({
    oscillator: {
      volume: 5,
      count: 3,
      spread: 40,
      type: 'fatsawtooth',
    }
  }).toDestination()

  synths.map(synth => (
    synth.value()
  ))


  const notes = Object.keys(allNotes)
  console.log('Outside FUNCTION')
  console.log('numberOFACTIVE', numberOfActive)

  const repeat = (time) => {
    const step = stepper % 16
    notes.forEach((note, index) => {
      if (allNotes[note][step]) {
        const synth = synths[index]
        synth.volume.value = 1 / numberOfActive
        console.log('Inside Function')
        console.log(1 / numberOfActive)
        console.log(synth.volume.value)
        console.log(numberOfActive)
        synth.triggerAttackRelease(note, '8n', time)
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