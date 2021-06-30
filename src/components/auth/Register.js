import React from 'react'
import useForm from '../../hooks/useForm'
import { useHistory } from 'react-router-dom'
import { registerUser } from '../../lib/api'
import ImageUpload from '../ImageUpload'


export default function Register() {
  const history = useHistory()
  const { formData, formErrors, setFormdata, handleChange, setFormErrors } = useForm({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    profileImage: '',
  })


  const handleSubmit = async event => {
    event.preventDefault()
    try {
      if (formData.profileImage === '') formData.profileImage = 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg'
      await registerUser(formData)
      history.push('/login')
    } catch (err) {
      setFormErrors({ ...formErrors, ...err.response.data })
      console.log(err.response.data)
    }
  }

  const handleUpload = file => {
    setFormdata({ ...formData, profileImage: file })
  }


  return (
    <div className='formBackground'>
      <section className={`register-section ${formData.profileImage ? 'hasImage' : ''}`}>
        <h1>Register</h1>

        <form className='register-form' onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            maxLength="15"
            placeholder="Username"
            onChange={handleChange}
            name="username"
            value={formData.username}
          />
          {formErrors.username && (
            <p className='error'>{formErrors.username}</p>
          )}
          <label>Email</label>
          <input
            placeholder="Email"
            onChange={handleChange}
            name="email"
            value={formData.email}
          />
          {formErrors.email && <p className='error'>{formErrors.email}</p>}
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            onChange={handleChange}
            name="password"
            value={formData.password}
          />
          {formErrors.password && (
            <p className='error'>{formErrors.password}</p>
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
            <p className='error'>{formErrors.passwordConfirmation}</p>
          )}
          <ImageUpload onUpload={handleUpload} />
          <button type="submit">
            Register
          </button>
        </form>
      </section>
    </div>
  )
}