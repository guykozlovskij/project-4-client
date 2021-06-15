import React from 'react'
import { useHistory } from 'react-router'
import { loginUser } from '../../lib/api'
import { setToken } from '../../lib/auth'
import useForm from '../../hooks/useForm'
import { Link } from 'react-router-dom'

function Login() {
  const history = useHistory()
  const [isError, setIsError] = React.useState(false)
  const { formData, handleChange } = useForm({
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const log = []

    try {
      const res = await loginUser(formData)
      setToken(res.data.token)
      log.push(res.data)
      history.push('/')

    } catch (err) {
      setIsError(true)
      console.log(err)
    }
  }

  return (
    <>
      <section className="login-section">
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <h1>Login</h1>
          <label>Email</label>
          <input
            className="input"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <button type="submit">
            Log In
          </button>
          {isError && (
            <p>Either email or password were incorrect</p>
          )}
        </form>
        <Link to='/register'>Register an account here</Link>
      </section>
    </>
  )
}

export default Login