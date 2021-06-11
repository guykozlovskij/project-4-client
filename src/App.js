import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Home from './components/common/Home'
import Nav from './components/common/Nav'
import MakeSong from './components/MakeSong'

function App() {
  // React.useEffect(() => {
  //   const getData = async () => {
  //     const res = await fetch('/api/endpoint') // * <-- replace with your endpoint
  //     const data = await res.json()
  //     console.log(data)
  //   }
  //   getData()
  // })

  return (
    <Router>
      <Nav />
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <Route path='/make-song' component={MakeSong}/>
      </Switch>
    </Router>
  )
}

export default App
