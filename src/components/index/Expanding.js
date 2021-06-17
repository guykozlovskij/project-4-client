import { useHistory } from 'react-router'
import { useState } from 'react'
import useForm from '../../hooks/useForm'
import { addCommentToSong, deleteCommentInSong, editSong } from '../../lib/api'
import { getPayload, isAuthenticated, isOwner, setSavedSong } from '../../lib/auth'
import Like from '../common/LikeButton'

export default function Expanding({ songs, expandingId, playSong, id, setUpdate, update, handleExpand, setExpandingId }) {
  const { sub } = getPayload()
  const history = useHistory()
  const { formData, handleChange } = useForm({
    content: '',
  })
  const [name, setName] = useState(songs[expandingId].name)
  const [edit, setEdit] = useState(false)
  const handleAddComment = async (event) => {
    event.preventDefault()
    formData.owner = sub
    try {
      await addCommentToSong(formData, event.target.id)
      setUpdate(!update)
    } catch (err) {
      if (err.repsonse) {
        console.log(err.repsonse.data)
      } else {
        console.log(err)
      }
    }
  }

  const handleDeleteComment = async (event) => {
    const commentId = event.target.value
    console.log('comment', commentId)
    try {
      await deleteCommentInSong(event.target.name, commentId)
      setUpdate(!update)
    } catch (err) {
      console.log(err?.response.data)
    }
  }

  const handleCopyAndEdit = (e) => {
    setSavedSong(songs[expandingId].notes, songs[expandingId].tempo)
    if (e.target.innerHTML === 'Edit Song') {
      history.push(`/${songs[expandingId].id}/${songs[expandingId].name}`)
    } else {
      history.push('/')
    }
  }

  const handleEdit = async () => {
    if (!edit) setEdit(true)
    else {
      const songToSubmit = {
        name: name,
        tempo: songs[expandingId].tempo,
        notes: songs[expandingId].notes,
      }
      try {
        await editSong(songToSubmit, songs[expandingId].id)
        setUpdate(!update)
        setEdit(false)
        setExpandingId(null)
      } catch (error) {
        console.log(error.response.data)
      }
    }
  }
  const changeName = (e) => {
    setName(e.target.value)
  }
  return (
    <div className="expanded-view">
      {!edit ?
        <h1>{songs[expandingId].name}</h1>
        :
        <input type='text' value={name} maxLength='20' onChange={changeName}/>
      }
      <button onClick={handleEdit}>{!edit ? 'Edit Name' : 'Save Name'}</button>
      <h2>Created by: {songs[expandingId].owner.username}</h2>
      <h2>Likes :{songs[expandingId].likedBy.length}</h2>
      <button name={expandingId} onClick={playSong}>
        {id === songs[expandingId].id ? 'Stop' : 'Play'}
      </button>
      {isAuthenticated() && <Like id={songs[expandingId].id} setUpdate={setUpdate} update={update} />}
      <div className="comment-scroll">
        {songs[expandingId].comments.map(comment => {
          return (
            <div key={comment.id} className="comment-div">
              <h5>{comment.owner.username}</h5>
              <h4>{comment.content}</h4>
              {isOwner(comment.owner.id) &&
                <span>
                  <button name={songs[expandingId].id} value={comment.id} onClick={handleDeleteComment}>Delete</button>
                </span>
              }
            </div>
          )
        })}
      </div>
      {isAuthenticated() &&
        <section className="add-comment">
          <form id={songs[expandingId].id} onSubmit={handleAddComment}>
            <input
              className="input"
              type="input"
              placeholder="Add a comment"
              name="content"
              value={formData.content}
              onChange={handleChange}
            />
            <button type="submit">Add a comment</button>
          </form>
        </section>
      }
      <button onClick={handleCopyAndEdit}>{isOwner(songs[expandingId].owner.id) ? 'Edit Song' : 'Copy Song'}</button>
      <button onClick={handleExpand}>Close</button>
    </div>
  )
}