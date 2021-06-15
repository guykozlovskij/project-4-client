import React from 'react'
import { Tone } from 'tone/build/esm/core/Tone'
import { getAllSongs } from '../lib/api'

export default function SongIndex() {
  const [songs, setSongs] = React.useState(null)

  React.useEffect(() => {
    const getData = async () => {
      const resposne = await getAllSongs()
      setSongs(resposne.data)
    }
    getData()
  }, [])
  console.log(songs)


  // const playSong = async () => {
  //   const eventId = await Tone.Transport.scheduleRepeat(repeat, '8n')
  //   transportEventId.current = eventId
  //   await Tone.Time('1m')

  // }


  return (
    <section className="song-index-page">
      <h1>Songs</h1>
      <section className="song-grid">
        {songs && (songs.map(song => {
          return (
            <div className="song-card" key={song.id}>
              <h3>{song.name}</h3>
              <h4>Created by: {song.owner.username}</h4>
              <h4>Likes: {song.likes}</h4>
              <button>
                Play
              </button>
            </div>
          )
        }))}
      </section>
    </section>
  )

}