import { likeSong } from '../../lib/api'

export default function Like({ id, update, setUpdate, alreadyLiked }) {
  const handleClick = async () => {
    try {
      await likeSong(id)

      setUpdate(!update)
    } catch (error) {
      console.log(error.response.data)
    }
  }

  return (
    <i onClick={handleClick} className={`${alreadyLiked ? 'fas' : 'far'} fa-2x fa-heart`}></i >
  )
}