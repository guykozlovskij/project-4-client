import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Nav from './components/common/Nav'
import Grid from './components/Grid'
import SongIndex from './components/index/SongIndex'

function App() {

  return (
    <>
      <Router>
        <Nav />
        <Switch>
          <Route exact path='/' component={Grid} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/songs' component={SongIndex} />
          <Route path='/:songId/:name' component={Grid} />
        </Switch>
      </Router>
      <h1 className='phoneRotate'>ROTATE YOUR PHONE</h1>
    </>
  )
}

export default App
