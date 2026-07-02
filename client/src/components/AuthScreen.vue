<!-- client/src/components/AuthScreen.vue -->
 <script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { login, register } = useAuth()

const activeTab = ref('login') // 'login' | 'register'
const submitting = ref(false)

const loginForm = ref({ identifier: '', password: '' })
const loginError = ref('')

const registerForm = ref({ username: '', email: '', password: '' })
const registerError = ref('')

function switchTab(tab) {
  activeTab.value = tab
  loginError.value = ''
  registerError.value = ''
}

async function handleLogin() {
  loginError.value = ''
  if (!loginForm.value.identifier || !loginForm.value.password) {
    loginError.value = 'กรุณากรอก username/email และ password'
    return
  }
  submitting.value = true
  try {
    await login(loginForm.value.identifier, loginForm.value.password)
  } catch (err) {
    loginError.value = err.message
  } finally {
    submitting.value = false
  }
}

async function handleRegister() {
  registerError.value = ''
  const { username, email, password } = registerForm.value
  if (!username || !email || !password) {
    registerError.value = 'กรุณากรอกให้ครบทุกช่อง'
    return
  }
  if (password.length < 6) {
    registerError.value = 'password ต้องมีอย่างน้อย 6 ตัวอักษร'
    return
  }
  submitting.value = true
  try {
    await register(username, email, password)
  } catch (err) {
    registerError.value = err.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-[480px] mx-auto">
    <div class="text-center mb-7">
      <svg class="w-[76px] h-auto mx-auto mb-1.5 animate-float drop-shadow-md" viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="55" rx="42" ry="32" fill="#FDFBF7" stroke="#F0E4D8" stroke-width="2"/>
        <ellipse cx="27" cy="40" rx="9" ry="9" fill="#FCE4E6" opacity="0.8"/>
        <ellipse cx="73" cy="40" rx="9" ry="9" fill="#E2F0D9" opacity="0.8"/>
        <circle cx="35" cy="53" r="3" fill="#4A3B32"/>
        <circle cx="65" cy="53" r="3" fill="#4A3B32"/>
        <path d="M40 63 Q50 70 60 63" stroke="#C98D8D" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </svg>
      <h1 class="font-display font-semibold text-[28px] tracking-wide text-mochi-text">Mochi To Do List</h1>
    </div>

    <div class="bg-mochi-card rounded-[24px] shadow-mochi-lg pt-2.5 px-6 pb-6">
      <div class="flex gap-1.5 my-1 mb-5">
        <button
          class="flex-1 font-display font-semibold text-sm py-3 rounded-full transition-all"
          :class="activeTab === 'login' ? 'bg-mochi-bg text-mochi-text shadow-[inset_0_0_0_1.5px_#EEE1D3]' : 'text-mochi-soft'"
          @click="switchTab('login')"
        >Login</button>
        <button
          class="flex-1 font-display font-semibold text-sm py-3 rounded-full transition-all"
          :class="activeTab === 'register' ? 'bg-mochi-bg text-mochi-text shadow-[inset_0_0_0_1.5px_#EEE1D3]' : 'text-mochi-soft'"
          @click="switchTab('register')"
        >Register</button>
      </div>

      <form v-if="activeTab === 'login'" class="flex flex-col gap-3" @submit.prevent="handleLogin">
        <input
          v-model="loginForm.identifier"
          type="text"
          placeholder="Username or email"
          autocomplete="username"
          class="w-full border-2 border-[#EEE1D3] bg-white rounded-2xl font-semibold text-sm text-mochi-text px-3.5 py-3 outline-none focus:border-lavender-deep transition-colors placeholder:text-[#c9b9ac] placeholder:font-medium"
        />
        <input
          v-model="loginForm.password"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          class="w-full border-2 border-[#EEE1D3] bg-white rounded-2xl font-semibold text-sm text-mochi-text px-3.5 py-3 outline-none focus:border-lavender-deep transition-colors placeholder:text-[#c9b9ac] placeholder:font-medium"
        />
        <p class="text-[#c0645f] text-xs font-semibold min-h-[14px] -mt-1">{{ loginError }}</p>
        <button
          type="submit"
          :disabled="submitting"
          class="font-display font-semibold text-[15px] text-white py-3.5 rounded-full mt-1 bg-gradient-to-br from-[#F6C9CE] to-sakura-deep shadow-[0_6px_14px_rgba(232,166,173,0.5)] hover:scale-[1.02] active:scale-[0.97] transition-transform disabled:opacity-60"
        >{{ submitting ? 'Logging in...' : 'Login' }}</button>
      </form>

      <form v-else class="flex flex-col gap-3" @submit.prevent="handleRegister">
        <input
          v-model="registerForm.username"
          type="text"
          placeholder="Username"
          autocomplete="username"
          class="w-full border-2 border-[#EEE1D3] bg-white rounded-2xl font-semibold text-sm text-mochi-text px-3.5 py-3 outline-none focus:border-lavender-deep transition-colors placeholder:text-[#c9b9ac] placeholder:font-medium"
        />
        <input
          v-model="registerForm.email"
          type="email"
          placeholder="Email"
          autocomplete="email"
          class="w-full border-2 border-[#EEE1D3] bg-white rounded-2xl font-semibold text-sm text-mochi-text px-3.5 py-3 outline-none focus:border-lavender-deep transition-colors placeholder:text-[#c9b9ac] placeholder:font-medium"
        />
        <input
          v-model="registerForm.password"
          type="password"
          placeholder="Password (min 6 characters)"
          autocomplete="new-password"
          class="w-full border-2 border-[#EEE1D3] bg-white rounded-2xl font-semibold text-sm text-mochi-text px-3.5 py-3 outline-none focus:border-lavender-deep transition-colors placeholder:text-[#c9b9ac] placeholder:font-medium"
        />
        <p class="text-[#c0645f] text-xs font-semibold min-h-[14px] -mt-1">{{ registerError }}</p>
        <button
          type="submit"
          :disabled="submitting"
          class="font-display font-semibold text-[15px] text-white py-3.5 rounded-full mt-1 bg-gradient-to-br from-[#F6C9CE] to-sakura-deep shadow-[0_6px_14px_rgba(232,166,173,0.5)] hover:scale-[1.02] active:scale-[0.97] transition-transform disabled:opacity-60"
        >{{ submitting ? 'Creating account...' : 'Create account' }}</button>
      </form>

      <p class="text-center text-[11px] text-[#c9b9ac] font-medium mt-4">little squishy tasks for a cozy day ⋆｡°✩</p>
    </div>
  </div>
</template>