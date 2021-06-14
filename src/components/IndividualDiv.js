import React from 'react'

export default function IndividualDiv({ note, buttonsSelected, setAllNotes, allNotes, synth }) {


  const handleClick = (e) => {
    if (!buttonsSelected[e.target.value]) synth.triggerAttackRelease(e.target.innerHTML, '8n')
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
      {/* <button value={0} className={buttonsSelected[0] ? 'clicked' : ''} onClick={handleClick}>{note}</button>
      <button value={1} className={buttonsSelected[1] ? 'clicked' : ''} onClick={handleClick}>{note}</button>
      <button value={2} className={buttonsSelected[2] ? 'clicked' : ''} onClick={handleClick}>{note}</button>
      <button value={3} className={buttonsSelected[3] ? 'clicked' : ''} onClick={handleClick}>{note}</button> */}
    </div> 
  )
}