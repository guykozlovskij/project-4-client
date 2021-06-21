export default function IndividualButton({ note, buttonsSelected, setAllNotes, allNotes, isPlaying, synth, step, performance }) {
  const handleClick = (e) => {
    if (!isPlaying) synth.triggerAttackRelease(note, '8n')
    buttonsSelected[e.target.value] = !buttonsSelected[e.target.value]
    setAllNotes({ ...allNotes, [note]: buttonsSelected })
  }

  return (
    <div className='testDiv'>
      {buttonsSelected.map((isOn, index) => {
        return (
          <button key={index} value={index} className={`music-button ${isOn ? 'clicked' : ''} ${index === step && isPlaying && !performance && isOn ? 'isPlaying' : ''} ${note}`} onClick={handleClick}>
          </button>
        )
      })}
    </div>
  )
}


