import React from 'react'
import * as Tone from 'tone'
import { getAllSongs } from '../lib/api'
import noNotes from '../hooks/noNotes'

export default function SongIndex() {
  const [songs, setSongs] = React.useState(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [allNotes, setAllNotes] = React.useState(noNotes)
  const [numberOfActive, setNumberOfActive] = React.useState(0)
  const transportEventId = React.useRef(null)
  let stepper = 0
  const gain = new Tone.Gain(0.1)
  gain.toDestination()




  React.useEffect(() => {
    const getData = async () => {
      const resposne = await getAllSongs()
      setSongs(resposne.data)
    }
    getData()
  }, [])




  const synths = new Tone.PolySynth().connect(gain)

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



  const playSong = async (e) => {
    setAllNotes({ ...noNotes, ...songs[e.target.name].notes })

    console.log('button is pressed')
    if (!isPlaying) {
      const eventId = await Tone.Transport.scheduleRepeat(repeat, '8n')
      Tone.Transport.bpm.value = songs[e.target.name].tempo 
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



  return (
    <section className="song-index-page">
      <h1>Songs</h1>
      <section className="song-grid">
        {songs && (songs.map((song, index) => {
          return (
            <div className="song-card" key={song.id}>
              <h3>{song.name}</h3>
              <h4>Created by: {song.owner.username}</h4>
              <h4>Likes: {song.likes}</h4>
              <button name={index} onClick={playSong}>
                Play
              </button>
            </div>
          )
        }))}
      </section>
    </section >
  )

}