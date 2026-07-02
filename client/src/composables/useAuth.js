//client/src/composables/useAuth.js
import { ref } from 'vue'
import { registerUser, loginUser } from '../api/auth'

// เก็บเป็น module-level ref (นอกฟังก์ชัน) เพื่อให้ทุก component ที่เรียก useAuth()
// ใช้ state เดียวกันร่วมกัน (แบบเดียวกับ global store เล็กๆ)
const token = ref(localStorage.getItem('mochi_token') || null)
const user = ref(JSON.parse(localStorage.getItem('mochi_user') || 'null'))

function persistSession(newToken, newUser) {
  token.value = newToken
  user.value = newUser
  localStorage.setItem('mochi_token', newToken)
  localStorage.setItem('mochi_user', JSON.stringify(newUser))
}

export function useAuth() {
  async function login(identifier, password) {
    const data = await loginUser(identifier, password)
    persistSession(data.token, data.user)
  }

  async function register(username, email, password) {
    await registerUser(username, email, password)
    // สมัครสำเร็จแล้ว auto-login ต่อเลย ผู้ใช้ไม่ต้องกรอกซ้ำ
    await login(username, password)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('mochi_token')
    localStorage.removeItem('mochi_user')
  }

  return { token, user, login, register, logout }
}