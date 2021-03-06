export function setToken(token) {
  window.localStorage.setItem('token', token)
}

export function getToken() {
  return window.localStorage.getItem('token')
}

export function removeToken() {
  window.localStorage.removeItem('token')
}

export function setSavedSong(allNotes, bpm) {
  const savedSong = {
    allNotes: allNotes,
    bpm: bpm,
  }
  window.localStorage.setItem('savedSong', JSON.stringify(savedSong))
}

export function getSavedSong() {
  const savedSong = JSON.parse(window.localStorage.getItem('savedSong'))
  window.localStorage.removeItem('savedSong')
  return savedSong
}

export function setSongId(eventId) {
  window.localStorage.setItem('eventId', eventId)
}

export function getSongId() {
  return window.localStorage.getItem('eventId')
}

export function setSelect(select) {
  window.localStorage.setItem('select', select)
}

export function getSelect() {
  return window.localStorage.getItem('select')
}

export function getPayload() {
  const token = getToken()
  if (!token) return false
  const parts = token.split('.')
  if (parts.length < 3) return false
  return JSON.parse(atob(parts[1])) 
}

export function isAuthenticated() {
  const payload = getPayload()
  if (!payload) return false
  const now = Math.round(Date.now() / 1000)
  return now < payload.exp
}

export function isOwner(userId) {
  const payload = getPayload()
  if (!payload) return false
  return userId === payload.sub
}