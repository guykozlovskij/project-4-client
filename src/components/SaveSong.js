import { useState } from 'react'
import { useHistory } from 'react-router'
import { createSong } from '../lib/api'

export default function SaveSong({ bpm, allNotes, handleSave }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const history = useHistory()
  const handleInput = (e) => {
    setName(e.target.value)
    setError('')
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
      history.push('/songs')
    } catch (error) {
      setError(error.response.data.name)
    }
  }
  return (
    <div className='songUpload'>
      <label>Name Your Masterpiece:</label>
      <input type='text' maxLength='20' onInput={handleInput}/>
      <h3>{error ? error : `Remaining Characters: ${20 - name.length}`}</h3>

      <button onClick={confirmSave}>Confirm</button>
      <button onClick={handleSave}>Cancel</button>
    </div>
  )
}