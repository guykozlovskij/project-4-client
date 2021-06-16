import React from 'react'
import * as Tone from 'tone'
import { getAllSongs } from '../lib/api'
import noNotes from '../hooks/noNotes'

import { setSongId } from '../lib/auth'

export default function SongIndex() {
  const [songs, setSongs] = React.useState(null)
  const [id, setId] = React.useState(null)
  const [isExpanding, setIsExpanding] = React.useState(null)


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


  const handleExpand = async () => {
    setIsExpanding(!isExpanding)
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
              <h4>Likes: {song.likedBy.length}</h4>
              <button name={index} onClick={playSong}>
                {id === song.id ? 'Stop' : 'Play'}
              </button>
              <button name={index} onClick={handleExpand}>EXPAND</button>

            </div>
          )
        }))}
      </section>
      {isExpanding &&
        <div className="expanded-view">
          {songs[index].comments.map(comment => {
            return (
              <div key={comment.id} className="comment-div">
                <h5>{comment.owner.username}</h5>
                <h4>{comment.content}</h4>
              </div>
            )
          })}
          <button onClick={handleExpand}>Close</button>
        </div>}
    </section >
  )
}