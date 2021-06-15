import React from 'react'
import useForm from '../../hooks/useForm'
import { useHistory } from 'react-router-dom'
import { registerUser } from '../../lib/api'


export default function Register() {
  const history = useHistory()
  const { formData, formErrors, handleChange, setFormErrors } = useForm({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })


  const handleSubmit = async event => {
    event.preventDefault()
    try {
      await registerUser(formData)
      history.push('/login')

    } catch (err) {
      setFormErrors({ ...formErrors, ...err.response.data })
      console.log(err.response.data)
    }
  }



  return (
    <>
      <section className="register-section">

        <form className="register-form" onSubmit={handleSubmit}>
          <h1>Register</h1>
          <label>Username</label>
          <input
            placeholder="Username"
            onChange={handleChange}
            name="username"
            value={formData.username}
          />
          {formErrors.username && (
            <p>{formErrors.username}</p>
          )}
          <label>Email</label>
          <input
            placeholder="Email"
            onChange={handleChange}
            name="email"
            value={formData.email}
          />
          {formErrors.email && <p>{formErrors.email}</p>}
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            onChange={handleChange}
            name="password"
            value={formData.password}
          />
          {formErrors.password && (
            <p>{formErrors.password}</p>
          )}
          <label>Password Confirmation</label>
          <input
            type="password"
            placeholder="Password Confirmation"
            onChange={handleChange}
            name="passwordConfirmation"
            value={formData.passwordConfirmation}
          />
          {formErrors.passwordConfirmation && (
            <p>{formErrors.passwordConfirmation}</p>
          )}
          <button type="submit">
            Register
          </button>
        </form>
      </section>
    </>
  )
}