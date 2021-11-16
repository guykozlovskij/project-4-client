import { useState } from 'react'
import { useHistory } from 'react-router'
import { createSong } from '../lib/api'

export default function SaveSong({ bpm, allNotes, handleSave, selectedSynth }) {
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
      synth: selectedSynth,
    }
    try {
      await createSong(songToSubmit)
      history.push('/songs')
    } catch (error) {
      setError(error.response.data.name)
    }
  }
  return (
    <div className='songUpload'>
      <label>Name Your Masterpiece:</label>
      <input type='text' maxLength='20' onInput={handleInput} />
      <h3>{error ? error : `Remaining Characters: ${20 - name.length}`}</h3>
      <div className="confirm-cancel">
        <button onClick={confirmSave}>Confirm</button>
        <button onClick={handleSave}>Cancel</button>
      </div>
    </div>
  )
}