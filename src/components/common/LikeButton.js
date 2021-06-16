import { likeSong } from '../../lib/api'

export default function Like({ id, update, setUpdate }) {

  const handleClick = async () => {
    try {
      await likeSong(id)

      setUpdate(!update)
    } catch (error) {
      console.log(error.response.data)
    }
  }

  return (
    <button onClick={handleClick}>Like</button>
  )
}