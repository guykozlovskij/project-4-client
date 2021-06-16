import axios from 'axios'
import { getToken } from './auth'
const baseUrl = '/api'

function headers() {
  return {
    headers: { Authorization: `Bearer ${getToken()}` },
  }
}

//? Authentication requests
export function registerUser(formData) {
  return axios.post(`${baseUrl}/auth/register/`, formData)
}

export function loginUser(formData) {
  return axios.post(`${baseUrl}/auth/login/`, formData)
}

export function getUser(userId) {
  return axios.get(`${baseUrl}/auth/profile/${userId}/`)
}

//? Song Requests
export function createSong(formData) {
  return axios.post(`${baseUrl}/songs/`, formData, headers())
}

export function getAllSongs(){
  return axios.get(`${baseUrl}/songs/`)
}

export function likeSong(id) {
  return axios.post(`${baseUrl}/songs/${id}/like/`, '', headers())
}

//? Comment Requests 
export function addCommentToSong(formdata, id){
  return axios.post(`${baseUrl}/songs/${id}/comments/`, formdata, headers())
}