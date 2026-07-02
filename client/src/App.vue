<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AuthScreen from './components/AuthScreen.vue'
import TaskBoard from './components/TaskBoard.vue'
import { useAuth } from './composables/useAuth'
import { useTasks } from './composables/useTasks'

const { token, user, logout } = useAuth()
const { tasks, loading, loadTasks, addTask, editTask, toggleDone, removeTask, reset } = useTasks()

const filter = ref('all')          // all | active(Un-complete) | done(Complete)
const urgencyFilter = ref('all')   // all | high | medium | low

const newText = ref('')
const newUrgency = ref('low')
const addError = ref('')

const isLoggedIn = computed(() => !!token.value)

watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) loadTasks()
  else reset()
}, { immediate: true })

const total = computed(() => tasks.value.length)
const doneCount = computed(() => tasks.value.filter((t) => t.done).length)

const visibleTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter((t) => !t.done)
  if (filter.value === 'done') return tasks.value.filter((t) => t.done)
  return tasks.value
})

const emptyHint = computed(() => {
  if (filter.value === 'active') return 'ไม่มีงานค้าง'
  if (filter.value === 'done') return 'ยังไม่มีงานเสร็จ'
  return 'ไม่มีงาน'
})

function selectFilter(f) {
  filter.value = f
  urgencyFilter.value = 'all'
}

async function handleAdd() {
  addError.value = ''
  if (!newText.value.trim()) return
  try {
    await addTask({ text: newText.value.trim(), urgency: newUrgency.value, dueDate: null })
    newText.value = ''
  } catch (err) {
    addError.value = err.message
  }
}

async function handleToggle(id) {
  try { await toggleDone(id) } catch (err) { console.error(err) }
}
async function handleDelete(id) {
  try { await removeTask(id) } catch (err) { console.error(err) }
}
async function handleSave(id, payload) {
  try { await editTask(id, payload) } catch (err) { console.error(err) }
}
</script>

<template>
  <div class="min-h-screen flex justify-center px-5 pt-12 pb-24">
    <AuthScreen v-if="!isLoggedIn" />

    <div v-else class="w-full max-w-[1180px] mx-auto">
      <div class="text-center mb-7 relative">
        <button
          class="absolute top-1 right-1 bg-mochi-card text-mochi-soft font-bold text-[11px] px-3.5 py-1.5 rounded-full shadow-mochi hover:text-[#b06770] transition-colors"
          @click="logout"
        >Logout</button>

        <svg class="w-[76px] h-auto mx-auto mb-1.5 animate-float drop-shadow-md" viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="55" rx="42" ry="32" fill="#FDFBF7" stroke="#F0E4D8" stroke-width="2"/>
          <ellipse cx="27" cy="40" rx="9" ry="9" fill="#FCE4E6" opacity="0.8"/>
          <ellipse cx="73" cy="40" rx="9" ry="9" fill="#E2F0D9" opacity="0.8"/>
          <circle cx="35" cy="53" r="3" fill="#4A3B32"/>
          <circle cx="65" cy="53" r="3" fill="#4A3B32"/>
          <path d="M40 63 Q50 70 60 63" stroke="#C98D8D" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </svg>
        <h1 class="font-display font-semibold text-[28px] tracking-wide text-mochi-text">Mochi To Do List</h1>
        <p class="text-[13px] text-mochi-soft font-medium mt-0.5">welcome back, {{ user?.username }} ⋆｡°✩</p>
      </div>

      <div class="flex justify-center gap-2.5 mb-5 flex-wrap">
        <div class="bg-mochi-card rounded-full px-4 py-2 text-[13px] font-semibold shadow-mochi flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-matcha-deep"></span>{{ total }} total
        </div>
        <div class="bg-mochi-card rounded-full px-4 py-2 text-[13px] font-semibold shadow-mochi flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-sakura-deep"></span>{{ total - doneCount }} left
        </div>
        <div class="bg-mochi-card rounded-full px-4 py-2 text-[13px] font-semibold shadow-mochi flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-lavender-deep"></span>{{ doneCount }} done
        </div>
      </div>

      <form class="bg-mochi-card rounded-[22px] p-2 pl-5 flex flex-wrap items-center gap-2.5 shadow-mochi-lg mb-5" @submit.prevent="handleAdd">
        <input
          v-model="newText"
          type="text"
          placeholder="Add a soft little task..."
          maxlength="80"
          class="flex-1 min-w-[160px] border-none outline-none bg-transparent font-semibold text-[15px] text-mochi-text py-3 placeholder:text-[#c9b9ac] placeholder:font-medium"
        />
        <select v-model="newUrgency" class="border-none outline-none bg-lavender text-mochi-text font-bold text-xs rounded-full px-2.5 py-2 cursor-pointer text-center">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          class="border-none bg-gradient-to-br from-[#F6C9CE] to-sakura-deep text-white w-11 h-11 min-w-[44px] rounded-full text-xl font-bold flex items-center justify-center shadow-[0_6px_14px_rgba(232,166,173,0.5)] hover:scale-105 active:scale-90 transition-transform"
          aria-label="Add task"
        >+</button>
      </form>
      <p v-if="addError" class="text-[#c0645f] text-xs font-semibold text-center -mt-3 mb-4">{{ addError }}</p>

      <div class="flex gap-2 justify-center mb-5">
        <button
          v-for="f in [{ key: 'all', label: 'All' }, { key: 'active', label: 'Un-complete' }, { key: 'done', label: 'Complete' }]"
          :key="f.key"
          class="border-none font-bold text-[13px] px-[18px] py-2 rounded-full transition-all"
          :class="filter === f.key ? 'bg-mochi-card text-mochi-text shadow-mochi' : 'bg-transparent text-mochi-soft'"
          @click="selectFilter(f.key)"
        >{{ f.label }}</button>
      </div>

      <div class="flex gap-1.5 justify-center flex-wrap mb-5">
        <button
          v-for="u in [{ key: 'all', label: 'All' }, { key: 'high', label: 'High' }, { key: 'medium', label: 'Medium' }, { key: 'low', label: 'Low' }]"
          :key="u.key"
          class="border-[1.5px] border-transparent font-bold text-[11.5px] px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-all"
          :class="[
            urgencyFilter === u.key && u.key === 'high' ? 'border-lavender-deep bg-lavender text-[#7a5a95]' : '',
            urgencyFilter === u.key && u.key === 'medium' ? 'border-sakura-deep bg-sakura text-[#b06770]' : '',
            urgencyFilter === u.key && u.key === 'low' ? 'border-matcha-deep bg-matcha text-[#5c7a4d]' : '',
            urgencyFilter === u.key && u.key === 'all' ? 'border-[#E4D6C8] text-mochi-text bg-mochi-card' : '',
            urgencyFilter !== u.key ? 'bg-mochi-card text-mochi-soft' : '',
          ]"
          @click="urgencyFilter = u.key"
        >{{ u.label }}</button>
      </div>

      <p v-if="loading" class="text-center text-sm text-mochi-soft font-medium">Warming up the mochi…</p>
      <TaskBoard
        v-else
        :tasks="visibleTasks"
        :urgency-filter="urgencyFilter"
        :empty-hint="emptyHint"
        @toggle="handleToggle"
        @delete="handleDelete"
        @save="handleSave"
      />
    </div>
  </div>
</template>