import { useState } from 'react'
import { createSong } from '../../lib/api'

export default function SaveSong({ bpm, allNotes }) {
  const [name, setName] = useState('')
  const handleInput = (e) => {
    setName(e.target.value)
  }
  const confirmSave = async () => {
    const songToSubmit = {
      name: name,
      tempo: bpm,
      notes: allNotes,
      likes: 0,
    }
    try {
      const { data } = await createSong(songToSubmit)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <label>Name Your Master Piece</label>
      <input type='text' maxLength='20' onInput={handleInput}/>
      <h3>Remaining Characters: {20 - name.length}</h3>
      <button onClick={confirmSave}>Confirm</button>
    </div>
  )
}