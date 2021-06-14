import { Link, useHistory, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isAuthenticated, removeToken } from '../../lib/auth'
import { getUser } from '../../lib/api'

export default function Nav() {
  const [navbarClicked, setNavbarClicked] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated())
  const user = async () => {
    try {
      const { data } = await getUser()
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
  }, [location.pathname])
  const handleClick = () => {
    setNavbarClicked(!navbarClicked)
  }
  const handleLogout = () => {
    setNavbarClicked(!navbarClicked)
    removeToken()
    history.push('/')
  }
  return (
    <nav>
      <Link className='homeLink' to='/'>Music-Maker</Link>
      <div className={`menuButton ${navbarClicked ? 'open' : ''}`} onClick={handleClick}>
        <div className='burger'>
        </div>
      </div>
      <div className={`contents ${navbarClicked ? 'display' : ''}`}>
        <div className='profileData'>
          <img src='https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg' alt='userName' />
          <h3>Username</h3>
          <Link onClick={handleClick} to='/'>Your Songs</Link>
          <Link onClick={handleClick} to='/'>Liked Songs</Link>
          <Link onClick={handleClick} to='/make-song'>Make a song</Link>
        </div>
        <div className='otherLinks'>
          <Link onClick={handleClick} to='/login'>Login</Link>
          <Link onClick={handleClick} to='/register'>Register</Link>
          <Link onClick={handleLogout} to='/'>Logout</Link>
        </div>
      </div>
    </nav>
  )
}