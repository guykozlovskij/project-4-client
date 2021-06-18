import React from 'react'
import { useHistory } from 'react-router'
import useForm from '../../hooks/useForm'
import { addCommentToSong, deleteCommentInSong, editSong, deleteSong } from '../../lib/api'
import { getPayload, isAuthenticated, isOwner, setSavedSong } from '../../lib/auth'
import Like from '../common/LikeButton'

export default function Expanding({ songs, expandingId, playSong, id, setUpdate, update, handleExpand, setExpandingId }) {
  const { sub } = getPayload()
  const [isDeleting, setIsDeleting] = React.useState(false)
  const history = useHistory()
  const { formData, handleChange } = useForm({
    content: '',
  })
  const [name, setName] = React.useState(songs[expandingId].name)
  const [edit, setEdit] = React.useState(false)
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
  const handleDeleteConfirmationWindow = async () => {
    setIsDeleting(!isDeleting)

  }

  const handleDeleteSong = async (event) => {
    const songId = event.target.value
    try {
      await deleteSong(songId)
      history.push('/songs')
      setUpdate(!update)
      setExpandingId(null)
    } catch (err) {
      console.log(err.response.data)
    }
  }


  return (
    <div className="expanded-view">
      <div className="song-title-div">
        {!edit ?
          <h1>{songs[expandingId].name}</h1>
          :
          <input className="song-name" type='text' value={name} maxLength='20' onChange={changeName} />
        }
        {isOwner(songs[expandingId].owner.id) && <button onClick={handleEdit} className='editName'>{!edit ? <i className='fas fa-pen'></i> : <i className='fas fa-save'></i>}</button>}
      </div>
      <h3>Created by: {songs[expandingId].owner.username}</h3>
      <div className="expanded-like-and-play-button-div">
        <button className={`playButton ${id === songs[expandingId].id ? 'pause' : ''}`} name={expandingId} onClick={playSong}>
        </button>
        <h2>Likes: {songs[expandingId].likedBy.length}</h2>
        {isAuthenticated() && <Like id={songs[expandingId].id} setUpdate={setUpdate} update={update} alreadyLiked={songs[expandingId].likedBy.some(like => like.id === sub)} />}
        
      </div>
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
      {isOwner(songs[expandingId].owner.id) &&
        <>
          <button onClick={handleDeleteConfirmationWindow}>DELETE SONG</button>
          {isDeleting &&
            <div className="delete-confirm">
              <span>Delete Song?</span>
              <button value={songs[expandingId].id} onClick={handleDeleteSong}>Yes</button>
              <button onClick={handleDeleteConfirmationWindow}>No</button>
            </div>
          }
        </>
      }
    </div>
  )
}