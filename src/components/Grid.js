import { useState, useRef, useEffect } from 'react'
import IndividualButton from './IndividualButton.js'
import * as Tone from 'tone'
import noNotes from '../hooks/noNotes.js'
import { getSavedSong, isAuthenticated, setSavedSong, setSongId } from '../lib/auth.js'
import SaveSong from './SaveSong.js'
import { useHistory } from 'react-router'



export default function Grid() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)
  const history = useHistory()
  const [isSaving, setIsSaving] = useState(false)
  let stepper = 0
  const [whichBox, setWhichBox] = useState(0)
  const transportEventId = useRef(null)
  const [numberOfActive, setNumberOfActive] = useState(0)
  const [allNotes, setAllNotes] = useState(noNotes)
  const gain = new Tone.Gain(0.1)
  gain.toDestination()
  const synths = new Tone.PolySynth().connect(gain)
  useEffect(() => {
    if (window.localStorage.getItem('savedSong')) {
      const savedSong = getSavedSong()
      setAllNotes(savedSong.allNotes)
      setNumberOfActive(savedSong.numberOfActive)
    }
  }, [])

  if (numberOfActive) synths.volume.value = 1 / numberOfActive

  const notes = Object.keys(allNotes)
  const repeat = (time) => {
    const step = stepper % 16
    // console.log('step', step)
    setWhichBox(step)
    notes.forEach((note) => {
      if (allNotes[note][step]) {
        synths.triggerAttackRelease(note, '8n', time)
      }
    })
    stepper++
  }
  console.log('stepper', stepper)
  console.log('yes')
  const handlePlay = async () => {
    if (!isPlaying) {

      const eventId = await Tone.Transport.scheduleRepeat(repeat, '8n')
      setSongId(eventId)
      transportEventId.current = eventId
      await Tone.Time('1m')



      await Tone.Transport.start()
      setIsPlaying(!isPlaying)

    } else {
      await Tone.Transport.stop()
      await Tone.Transport.clear(transportEventId.current)
      await Tone.Transport.dispose()
      setIsPlaying(!isPlaying)

    }
  }
  const handleBpm = (e) => {
    setBpm(e.target.value)
    Tone.Transport.bpm.value = e.target.value
  }

  const handleClear = async () => {
    setAllNotes(noNotes)
    setIsPlaying(false)
    await Tone.Transport.stop()
    await Tone.Transport.clear(transportEventId.current)

  }
  const handleSave = async () => {
    await Tone.Transport.stop()
    await Tone.Transport.clear(transportEventId.current)
    setIsSaving(!isSaving)
    setIsPlaying(false)
  }
  const handleSaveNotLoggedIn = async () => {
    setSavedSong(allNotes, numberOfActive)
    history.push('/login')
  }
  return (
    <section className="grid-parent">
      <div className="grid">
        <h1>Grid Stuff</h1>
        {notes.map(note => {
          return (
            <IndividualButton key={note} note={note} buttonsSelected={allNotes[note]} setAllNotes={setAllNotes} allNotes={allNotes} setNumberOfActive={setNumberOfActive} numberOfActive={numberOfActive} isPlaying={isPlaying} synth={synths}
              step={whichBox}
            />
          )
        })}
        <button className="play-button" onClick={handlePlay}>{!isPlaying ? 'Play' : 'Stop'}</button>
        <button onClick={handleClear}>Clear notes</button>
        <input type='range' min='10' max='200' value={bpm} onChange={handleBpm} />
        <h3>{bpm}</h3>
        {isAuthenticated() && numberOfActive > 0 && <button onClick={handleSave}>Save Song</button>}
        {!isAuthenticated() && numberOfActive > 0 && <button onClick={handleSaveNotLoggedIn}>Save Song</button>}
      </div>
      {isSaving && <SaveSong bpm={bpm} allNotes={allNotes} handleSave={handleSave} />}
    </section>
  )
}