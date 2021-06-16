import { useHistory } from 'react-router'
import useForm from '../../hooks/useForm'
import { addCommentToSong, deleteCommentInSong } from '../../lib/api'
import { getPayload, isAuthenticated, isOwner, setSavedSong } from '../../lib/auth'
import Like from '../common/LikeButton'

export default function Expanding({ songs, expandingId, playSong, id, setUpdate, update, handleExpand }) {
  const { sub } = getPayload()
  const history = useHistory()
  const { formData, handleChange } = useForm({
    content: '',
  })
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

  const handleCopy = () => {
    setSavedSong(songs[expandingId].notes, 1)
    history.push('/')

  }

  return (
    <div className="expanded-view">
      <h1>{songs[expandingId].name}</h1>
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
      <button onClick={handleExpand}>Close</button>
      <button onClick={handleCopy}>Copy Song</button>
    </div>
  )
}