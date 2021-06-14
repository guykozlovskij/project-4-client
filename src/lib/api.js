import axios from 'axios'
// import { getToken } from './auth'
const baseUrl = '/api'

// function headers() {
//   return {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   }
// }

//? Authentication requests
export function registerUser(formData) {
  return axios.post(`${baseUrl}/auth/register/`, formData)
}

export function loginUser(formData) {
  return axios.post(`${baseUrl}/auth/login/`, formData)
}

export function getUser(userId) {
  return axios.post(`${baseUrl}/auth/profile/${userId}/`)
}