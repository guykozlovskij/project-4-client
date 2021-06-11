import { useState } from 'react'
import IndividualDiv from './IndividualDiv.js'

export default function Grid() {
  const [allNotes, setAllNotes] = useState(
    {
      C1: [false, false, false, false],
      C2: [true, true, true, true],
      C3: [false, false, false, false],
      C4: [true, false, false, false],
      A1: [true, true, true, true],
    })
  const notes = Object.keys(allNotes)
  return (
    <div>
      <h1>Grid Stuff</h1>
      {notes.map(note => {
        return (
          <IndividualDiv key={note} note={note} buttonsSelected={allNotes[note]} setAllNotes={setAllNotes} allNotes={allNotes}/>
        )
      })}
    </div>
  )
}