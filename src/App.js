import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Nav from './components/common/Nav'
import MakeSong from './components/MakeSong'

function App() {
  
  return (
    <Router>
      <Nav />
      <Switch>
        <Route exact path='/' component={MakeSong}/>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
      </Switch>
    </Router>
  )
}

export default App
