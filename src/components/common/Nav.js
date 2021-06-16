import { Link, useHistory, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPayload, getSongId, isAuthenticated, removeToken, setSelect } from '../../lib/auth'
import { getUser } from '../../lib/api'
import * as Tone from 'tone'

export default function Nav() {
  const [navbarClicked, setNavbarClicked] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const { sub } = getPayload()
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated())

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
    const getData = async () => {
      if (getSongId()) {
        await Tone.Transport.stop()
        await Tone.Transport.clear(getSongId())
      }
      try {
        const { data } = await getUser(sub)
        setUser(data)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [location.pathname, sub])

  const handleClick = (e) => {
    setNavbarClicked(!navbarClicked)
    if (e.target.name === 'updateStorage') setSelect(e.target.innerHTML)
  }
  const handleLogout = () => {
    setNavbarClicked(!navbarClicked)
    removeToken()
    history.push('/')
    setUser(null)
  }
  return (
    <nav>
      <Link className='homeLink' to='/'>Music-Maker</Link>
      <div className={`menuButton ${navbarClicked ? 'open' : ''}`} onClick={handleClick}>
        <div className='burger'>
        </div>
      </div>
      <div className={`contents ${navbarClicked ? 'display' : ''}`}>
        {user && <div className='profileData'>
          <img src={user.profileImage} alt={user.username} />
          <h3>{user.username}</h3>
          <div className='mainLinks'>
            <Link name='updateStorage' className='navLink' onClick={handleClick} to='/songs'>Your Songs</Link>
            <Link name='updateStorage' className='navLink' onClick={handleClick} to='/songs'>Liked Songs</Link>
            <Link name='updateStorage' className='navLink' onClick={handleClick} to='/songs'>All Songs</Link>
            <Link className='navLink' onClick={handleClick} to='/'>Make a song</Link>
          </div>
        </div>}
        <div className='otherLinks'>
          {!isLoggedIn ?
            <>
              <Link className='navLink' onClick={handleClick} to='/login'>Login</Link>
              <Link className='navLink' onClick={handleClick} to='/register'>Register</Link>
            </>
            :
            <Link className='navLink' onClick={handleLogout} to='/'>Logout</Link>
          }
        </div>
      </div>
    </nav>
  )
}