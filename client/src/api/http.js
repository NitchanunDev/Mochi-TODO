//client/src/api/http.js
const API_BASE = 'http://localhost:3000/api'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('mochi_token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  let data = {}
  try {
    data = await res.json()
  } catch (err) {
    // response ไม่มี body (เช่นบาง error กรณีพิเศษ) ปล่อยเป็น object ว่างไป
  }

  if (!res.ok) {
    throw new Error(data.message || `เกิดข้อผิดพลาด (${res.status})`)
  }

  return data
}