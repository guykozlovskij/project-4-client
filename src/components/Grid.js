import { useState, useRef } from 'react'
import IndividualButton from './IndividualButton.js'
import * as Tone from 'tone'
import noNotes from '../hooks/noNotes.js'
import { getSavedSong, isAuthenticated, setSavedSong, setSongId } from '../lib/auth.js'
import SaveSong from './SaveSong.js'
import { useHistory, useParams } from 'react-router'
import { editSong } from '../lib/api.js'



export default function Grid() {
  const savedSong = getSavedSong()
  if (savedSong) Tone.Transport.bpm.value = savedSong.bpm
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(savedSong ? savedSong.bpm : 120)
  const history = useHistory()
  const { songId, name } = useParams()
  const [isSaving, setIsSaving] = useState(false)
  let stepper = 0
  const [whichBox, setWhichBox] = useState(0)
  const transportEventId = useRef(null)
  const [allNotes, setAllNotes] = useState(savedSong ? savedSong.allNotes : noNotes)
  const gain = new Tone.Gain(0.1)
  gain.toDestination()
  
  const synths = new Tone.PolySynth().connect(gain)

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
    if (!songId) {
      setIsSaving(!isSaving)
      setIsPlaying(false)
    } else {
      const songToSubmit = {
        name: name,
        tempo: bpm,
        notes: allNotes,
      }
      try {
        await editSong(songToSubmit, songId)
        history.push('/songs')

      } catch (error) {
        console.log(error.response.data)
      }
    }
  }
  const handleSaveNotLoggedIn = async () => {
    setSavedSong(allNotes, bpm)
    history.push('/login')
  }





  return (
    <section className="grid-parent">
      <div className="grid">
        {notes.map(note => {
          return (
            <IndividualButton key={note} note={note} buttonsSelected={allNotes[note]} setAllNotes={setAllNotes} allNotes={allNotes} isPlaying={isPlaying} synth={synths}
              step={whichBox}
            />
          )
        })}
        <button className={`playButton ${isPlaying ? 'pause' : ''}`} onClick={handlePlay}></button>
        <button onClick={handleClear}>Clear notes</button>
        <input type='range' min='1' max='180' value={bpm} onChange={handleBpm} />
        <h3 id='bpm' >{bpm}</h3>
        <button onClick={isAuthenticated() ? handleSave : handleSaveNotLoggedIn}>Save Song</button>
      </div>
      {isSaving && <SaveSong bpm={bpm} allNotes={allNotes} handleSave={handleSave} />}
    </section>
  )
}