//client/src/api/auth.js
import { apiFetch } from './http'

export function registerUser(username, email, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
}

export function loginUser(identifier, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  })
}