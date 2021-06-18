import React from 'react'
import * as Tone from 'tone'
import { isAuthenticated, setSongId, getSelect, setSelect, getPayload } from '../../lib/auth'
import Like from '../common/LikeButton'
import { getAllSongs } from '../../lib/api'
import Expanding from './Expanding'

function filteredSongs(songs, filter) {
  const { sub } = getPayload()
  const beenFiltered = songs.filter(song => {
    let found = false
    if (getSelect() === 'all') found = true
    if (getSelect() === 'composed') {
      found = song.owner.id === sub
    }
    if (getSelect() === 'liked') {
      found = song.likedBy.some(like => like.id === sub)
    }
    return (
      song.name.toLowerCase().includes(filter.toLowerCase()) && found
    )
  })
  return beenFiltered.sort((a, b) => a.name.localeCompare(b.name))
}



export default function SongIndex() {
  const { sub } = getPayload()
  const [songs, setSongs] = React.useState(null)
  const [id, setId] = React.useState(null)
  const [expandingId, setExpandingId] = React.useState(null)
  const transportEventId = React.useRef(null)
  const [update, setUpdate] = React.useState(false)
  let stepper = 0
  const [filter, setFilter] = React.useState('')
  const gain = new Tone.Gain(0.1)
  gain.toDestination()
  if (!getSelect()) setSelect('All')

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

    allNotes = { ...filteredSongs(songs, filter)[e.target.name].notes }
    const notes = Object.keys(allNotes)

    if (id === filteredSongs(songs, filter)[e.target.name].id) {
      setId(null)
    } else {
      newPlay = true
      setId(filteredSongs(songs, filter)[e.target.name].id)
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
      Tone.Transport.bpm.value = filteredSongs(songs, filter)[e.target.name].tempo
      transportEventId.current = eventId
      setSongId(transportEventId.current)

      await Tone.Time('1m')
      await Tone.Transport.start()
    }
  }


  const handleExpand = async (e) => {
    setExpandingId(e.target.name)
  }


  const handleFilter = (e) => {
    setFilter(e.target.value)
  }


  return (
    <section className="song-index-page">
      <input className="search-bar" placeholder="Search..." type='text' onChange={handleFilter} />
      <section className="song-grid">
        {songs && (filteredSongs(songs, filter).map((song, index) => {
          return (
            <div className="song-card" key={song.id}>
              <h3>{song.name}</h3>
              <div className='playAndLike'>
                <button name={index} onClick={playSong} className={`playButton ${id === song.id ? 'pause' : ''}`}>
                </button>
                {isAuthenticated() && <Like id={song.id} setUpdate={setUpdate} update={update} alreadyLiked={song.likedBy.some(like => like.id === sub)}/>}
              </div>
              <button name={index} onClick={handleExpand} className='expand'></button>
            </div>
          )
        }))}
      </section>
      {expandingId && <Expanding songs={filteredSongs(songs, filter)} expandingId={expandingId} playSong={playSong} id={id} setUpdate={setUpdate} update={update} handleExpand={handleExpand} setExpandingId={setExpandingId} />}
    </section >
  )
}