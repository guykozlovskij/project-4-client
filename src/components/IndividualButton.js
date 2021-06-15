import React from 'react'

export default function IndividualButton({ note, buttonsSelected, setAllNotes, allNotes, setNumberOfActive, numberOfActive, isPlaying, synth }) {
  const handleClick = (e) => {
    if (buttonsSelected[e.target.value]) {
      setNumberOfActive(numberOfActive - 1)
    } else {
      if (!isPlaying) synth.triggerAttackRelease(note, '8n')
      setNumberOfActive(numberOfActive + 1)

    }
    buttonsSelected[e.target.value] = !buttonsSelected[e.target.value]
    setAllNotes({ ...allNotes, [note]: buttonsSelected })
  }

  return (
    <div className='testDiv'>
      {buttonsSelected.map((isOn, index) => {
        return (
          <button  key={index} value={index} className={`music-button ${isOn ? 'clicked' : ''}`} onClick={handleClick}>{note}</button>
        )
      })}
    </div> 
  )
}