import React from 'react'
import * as Tone from 'tone'
import { getAllSongs } from '../lib/api'
import { isAuthenticated, setSongId } from '../lib/auth'
import Like from './common/LikeButton'

export default function SongIndex() {
  const [songs, setSongs] = React.useState(null)
  const [id, setId] = React.useState(null)
  const transportEventId = React.useRef(null)
  const [update, setUpdate] = React.useState(false)
  let stepper = 0
  const gain = new Tone.Gain(0.1)
  gain.toDestination()


  React.useEffect(() => {
    const getData = async () => {
      const resposne = await getAllSongs()
      setSongs(resposne.data)
    }
    getData()
  }, [update])


  const synths = new Tone.PolySynth().connect(gain)
  let allNotes

  const playSong = async (e) => {
    await Tone.Transport.stop()
    await Tone.Transport.clear(transportEventId.current)
    let newPlay = false

    allNotes = { ...songs[e.target.name].notes }
    const notes = Object.keys(allNotes)

    if (id === songs[e.target.name].id) {
      setId(null)
    } else {
      newPlay = true
      setId(songs[e.target.name].id)
      await Tone.Transport.stop()
      await Tone.Transport.clear(transportEventId.current)

    }


    if (newPlay) {
      const repeat = (time) => {
        const step = stepper % 16
        notes.forEach((note) => {
          if (allNotes[note][step]) {
            synths.triggerAttackRelease(note, '8n', time)
          }
        })
        stepper++
      }

      const eventId = await Tone.Transport.scheduleRepeat(repeat, '8n')
      Tone.Transport.bpm.value = songs[e.target.name].tempo
      transportEventId.current = eventId
      setSongId(transportEventId.current)

      await Tone.Time('1m')
      await Tone.Transport.start()
    }
  }
  if (document.getElementById('select')) {
    const select = document.getElementById('select')
    console.log(select.value)
  }
  if (songs) {
    songs.sort((a, b) => a.name.localeCompare(b.name))
  }
  return (
    <section className="song-index-page">
      <h1>Songs</h1>
      <select id='select'>
        <option>All</option>
        <option >Your Songs</option>
        <option selected>Liked Songs</option>
      </select>
      <section className="song-grid">
        {songs && (songs.map((song, index) => {
          return (
            <div className="song-card" key={song.id}>
              <h3>{song.name}</h3>
              <h4>Created by: {song.owner.username}</h4>
              <h4>Likes: {song.likedBy.length}</h4>
              <button name={index} onClick={playSong}>
                {id === song.id ? 'Stop' : 'Play'}
              </button>
              {isAuthenticated() && <Like id={song.id} setUpdate={setUpdate} update={update} />}
            </div>
          )
        }))}
      </section>
    </section >
  )
}