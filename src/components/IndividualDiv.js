import React from 'react'

export default function IndividualDiv({ note, buttonsSelected, setAllNotes, allNotes }) {


  const handleClick = (e) => {
    buttonsSelected[e.target.value] = !buttonsSelected[e.target.value]
    setAllNotes({ ...allNotes, [note]: buttonsSelected })
  }

  return (
    <div className='testDiv'>
      {buttonsSelected.map((isOn, index) => {
        return (
          <button key={index} value={index} className={isOn ? 'clicked' : ''} onClick={handleClick}>{note}</button>
        )
      })}
    </div> 
  )
}