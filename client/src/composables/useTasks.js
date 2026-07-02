//client/src/composables/useTasks.js
import { ref } from 'vue'
import * as tasksApi from '../api/tasks'

const tasks = ref([])
const loading = ref(false)

export const urgencyMeta = {
  high: { label: 'High', color: 'lavender' },
  medium: { label: 'Medium', color: 'sakura' },
  low: { label: 'Low', color: 'matcha' },
}
export const urgencyOrder = ['high', 'medium', 'low']

export function useTasks() {
  async function loadTasks() {
    loading.value = true
    try {
      tasks.value = await tasksApi.fetchTasks()
    } finally {
      loading.value = false
    }
  }

  async function addTask({ text, urgency, dueDate }) {
    const newTask = await tasksApi.createTask({ text, urgency, dueDate: dueDate || null })
    tasks.value.unshift(newTask)
  }

  async function editTask(id, { text, urgency, dueDate }) {
    const updated = await tasksApi.updateTask(id, { text, urgency, dueDate: dueDate || null })
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx !== -1) tasks.value[idx] = updated
  }

  async function toggleDone(id) {
    const updated = await tasksApi.toggleTask(id)
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx !== -1) tasks.value[idx] = updated
  }

  async function removeTask(id) {
    await tasksApi.deleteTask(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  function reset() {
    tasks.value = []
  }

  return { tasks, loading, loadTasks, addTask, editTask, toggleDone, removeTask, reset }
}