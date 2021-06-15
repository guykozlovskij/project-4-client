import { useState, useRef } from 'react'
import IndividualButton from './IndividualButton.js'
import * as Tone from 'tone'
import noNotes from '../hooks/noNotes.js'
import { isAuthenticated } from '../lib/auth.js'
import SaveSong from './common/SaveSong.js'



export default function Grid() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [isSaving, setIsSaving] = useState(false)
  let stepper = 0
  const transportEventId = useRef(null)
  // const [songStarted, setSongStarted] = useState(false)
  const [numberOfActive, setNumberOfActive] = useState(0)
  const [allNotes, setAllNotes] = useState(noNotes)
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

  const repeat = (time) => {
    const step = stepper % 16
    notes.forEach((note) => {
      if (allNotes[note][step]) {
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

      const eventId = await Tone.Transport.scheduleRepeat(repeat, '8n')
      transportEventId.current = eventId
      await Tone.Time('1m')



      await Tone.Transport.start()
      setIsPlaying(!isPlaying)

    } else {
      await Tone.Transport.stop()
      await Tone.Transport.clear(transportEventId.current)
      // await Tone.Transport.dispose()
      setIsPlaying(!isPlaying)

    }
  }
  const handleBpm = (e) => {
    setBpm(e.target.value)
    Tone.Transport.bpm.value = e.target.value
  }

  console.log(allNotes)
  console.log(JSON.stringify(allNotes))
  const handleClear = async () => {
    setAllNotes(noNotes)
    setIsPlaying(false)
    await Tone.Transport.stop()
    await Tone.Transport.clear(transportEventId.current)

  }

  const handleSave = () => {
    setIsSaving(true)
  }
  return (
    <section className="grid-parent">
      <div className="grid">
        <h1>Grid Stuff</h1>
        {notes.map(note => {
          return (
            <IndividualButton key={note} note={note} buttonsSelected={allNotes[note]} setAllNotes={setAllNotes} allNotes={allNotes} setNumberOfActive={setNumberOfActive} numberOfActive={numberOfActive} isPlaying={isPlaying} synth={synths}/>
          )
        })}
        <button className="play-button" onClick={handlePlay}>{!isPlaying ? 'Play' : 'Stop'}</button>
        <button onClick={handleClear}>Clear notes</button>
        <input type='range' min='10' max='200' value={bpm} onChange={handleBpm} />
        <h3>{bpm}</h3>
        {isAuthenticated() && <button onClick={handleSave}>Save Song</button>}
      </div>
      {isSaving && <SaveSong bpm={bpm} allNotes={allNotes}/>}
    </section>
  )
}