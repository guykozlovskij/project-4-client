import axios from 'axios'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get('/api/songs/')
      console.log(response.data)
    }
    getData()
  }, [])

  return (
    <h1>Home Page</h1>
  )
}