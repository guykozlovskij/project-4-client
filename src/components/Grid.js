import IndividualDiv from './IndividualDiv.js'

export default function Grid() {
  const notes = ['C1', 'C2', 'C3', 'C4']


  return (
    <div>
      <h1>Grid Stuff</h1>
      <div className='testDiv'>
        {notes.map(note => {
          return (
            <IndividualDiv key={note} note={note} />
          )
        })}
      </div>
    </div>
  )
}