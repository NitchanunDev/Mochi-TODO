import { ref, computed } from 'vue';
import api from '../services/api';

export function useTasks() {
  const tasks = ref([]);
  const filter = ref('all'); // all | active | done
  const loading = ref(true);
  const errorMsg = ref('');
  const statusMsg = ref('');

  function flashStatus(msg, ms = 1500) {
    statusMsg.value = msg;
    if (ms) setTimeout(() => (statusMsg.value = ''), ms);
  }

  const filteredTasks = computed(() => {
    if (filter.value === 'active') return tasks.value.filter((t) => !t.done);
    if (filter.value === 'done') return tasks.value.filter((t) => t.done);
    return tasks.value;
  });

  const stats = computed(() => {
    const total = tasks.value.length;
    const done = tasks.value.filter((t) => t.done).length;
    return { total, done, left: total - done };
  });

  // โหลดรายการงานทั้งหมด
  async function loadTasks() {
    loading.value = true;
    errorMsg.value = '';
    try {
      tasks.value = await api.list();
    } catch (err) {
      errorMsg.value = 'โหลดข้อมูลไม่สำเร็จ ลองใหม่อีกครั้งนะ';
    } finally {
      loading.value = false;
    }
  }

  // เพิ่มรายการงาน
  async function addTask(text, tag) {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      const newTask = await api.create({ text: trimmed, tag });
      tasks.value.unshift(newTask);
      flashStatus('✓ added');
    } catch (err) {
      flashStatus("couldn't save, try again");
    }
  }

  // แก้ไขรายการงาน
  async function editTask(id, text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      const updated = await api.update(id, { text: trimmed });
      const idx = tasks.value.findIndex((t) => t.id === id);
      if (idx !== -1) tasks.value[idx] = updated;
      flashStatus('✓ saved');
    } catch (err) {
      flashStatus("couldn't save, try again");
    }
  }

  // สลับสถานะเสร็จ/ยังไม่เสร็จ (optimistic update)
  async function toggleTask(id) {
    const task = tasks.value.find((t) => t.id === id);
    if (!task) return;
    task.done = !task.done; // optimistic
    try {
      const updated = await api.toggle(id);
      Object.assign(task, updated);
    } catch (err) {
      task.done = !task.done; // rollback
      flashStatus("couldn't update, try again");
    }
  }

  // ลบรายการงาน
  async function deleteTask(id) {
    try {
      await api.remove(id);
      tasks.value = tasks.value.filter((t) => t.id !== id);
      flashStatus('✓ deleted');
    } catch (err) {
      flashStatus("couldn't delete, try again");
    }
  }

  return {
    tasks,
    filter,
    loading,
    errorMsg,
    statusMsg,
    filteredTasks,
    stats,
    loadTasks,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
  };
}
