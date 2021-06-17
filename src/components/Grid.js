import { useState, useRef } from 'react'
import IndividualButton from './IndividualButton.js'
import * as Tone from 'tone'
import noNotes from '../hooks/noNotes.js'
import { getSavedSong, isAuthenticated, setSavedSong, setSongId } from '../lib/auth.js'
import SaveSong from './SaveSong.js'
import { useHistory } from 'react-router'



export default function Grid() {
  const savedSong = getSavedSong()
  if (savedSong) Tone.Transport.bpm.value = savedSong.bpm
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(savedSong ? savedSong.bpm : 120)
  const history = useHistory()
  const [isSaving, setIsSaving] = useState(false)
  let stepper = 0
  const [whichBox, setWhichBox] = useState(0)
  const transportEventId = useRef(null)
  const [allNotes, setAllNotes] = useState(savedSong ? savedSong.allNotes : noNotes)
  const gain = new Tone.Gain(0.1)
  const gainTwo = new Tone.Gain(0.1)
  const gainThree = new Tone.Gain(0.1)
  const gainFour = new Tone.Gain(0.1)
  gainTwo.toDestination()
  gainThree.toDestination()
  gainFour.toDestination()
  gain.toDestination()
  
  const synths = new Tone.PolySynth().connect(gain)
  const synthsTwo = new Tone.PolySynth().connect(gainTwo)
  const synthsThree = new Tone.PolySynth().connect(gainThree)
  const synthsFour = new Tone.PolySynth().connect(gainFour)
  

  const notes = Object.keys(allNotes)

  const repeat = (time) => {
    const step = stepper % 16
    // console.log('step', step)
    setWhichBox(step)
    notes.forEach((note) => {
      if (allNotes[note][step]) {
        if (step <= 3) synths.triggerAttackRelease(note, '8n', time)
        else if (step <= 7) synthsTwo.triggerAttackRelease(note, '8n', time)
        else if (step <= 11) synthsThree.triggerAttackRelease(note, '8n', time)
        else synthsFour.triggerAttackRelease(note, '8n', time)
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
    setIsSaving(!isSaving)
    setIsPlaying(false)
  }
  const handleSaveNotLoggedIn = async () => {
    setSavedSong(allNotes, bpm)
    history.push('/login')
  }
  return (
    <section className="grid-parent">
      <div className="grid">
        <h1>Grid Stuff</h1>
        {notes.map(note => {
          return (
            <IndividualButton key={note} note={note} buttonsSelected={allNotes[note]} setAllNotes={setAllNotes} allNotes={allNotes} isPlaying={isPlaying} synth={synths}
              step={whichBox}
            />
          )
        })}
        <button className="play-button" onClick={handlePlay}>{!isPlaying ? 'Play' : 'Stop'}</button>
        <button onClick={handleClear}>Clear notes</button>
        <input type='range' min='10' max='200' value={bpm} onChange={handleBpm} />
        <h3 id='bpm' >{bpm}</h3>
        <button onClick={isAuthenticated() ? handleSave : handleSaveNotLoggedIn}>Save Song</button>
        {/* <p id='counter'>{counter}</p> */}
      </div>
      {isSaving && <SaveSong bpm={bpm} allNotes={allNotes} handleSave={handleSave} />}
    </section>
  )
}


// setTimeout(function increaseCounter() {
//   const button = document.getElementsByClassName('play-button')
//   const count = Number(document.getElementById('counter').innerHTML)
//   if (count >= 0) {
//     setCounter(count + 1)
//   }
//   if (button[0]) {
//     if (button[0].innerHTML === 'Stop') setTimeout(increaseCounter, (60000 / (document.getElementById('bpm').innerHTML * 2)))
//   }
// }, (60000 / (document.getElementById('bpm').innerHTML * 2)))