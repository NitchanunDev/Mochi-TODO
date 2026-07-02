// client/src/api/tasks.js
import { apiFetch } from './http'

export const fetchTasks = () => apiFetch('/tasks')

export const createTask = (payload) =>
  apiFetch('/tasks', { method: 'POST', body: JSON.stringify(payload) })

export const updateTask = (id, payload) =>
  apiFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) })

export const toggleTask = (id) =>
  apiFetch(`/tasks/${id}/toggle`, { method: 'PATCH' })

export const deleteTask = (id) =>
  apiFetch(`/tasks/${id}`, { method: 'DELETE' })