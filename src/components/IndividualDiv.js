import * as Tone from 'tone'
import React from 'react'

export default function IndividualDiv({ note }) {
  const synth = new Tone.Synth().toDestination()
  const [buttonClicked, setButtonClicked] = React.useState([false, false, false, false])

  const handleClick = (e) => {
    console.log(e.target.innerHTML)
    console.log(e.target.value)
    buttonClicked[e.target.value] = !buttonClicked[e.target.value]
    synth.triggerAttackRelease(e.target.innerHTML, '8n')
    console.log(buttonClicked)
    setButtonClicked(buttonClicked)
  }
  console.log(buttonClicked)
  return (
    <div className={note}>
      <button value={0} className={buttonClicked[0] ? 'clicked' : ''} onClick={handleClick}>{note}</button>
      <button value={1} className={buttonClicked[1] ? 'clicked' : ''} onClick={handleClick}>{note}</button>
      <button value={2} className={buttonClicked[2] ? 'clicked' : ''} onClick={handleClick}>{note}</button>
      <button value={3} className={buttonClicked[3] ? 'clicked' : ''} onClick={handleClick}>{note}</button>
    </div>
  )
}