const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function handleResponse(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return body.data;
}

export default {
  // แสดงรายการงาน
  list() {
    return fetch(`${BASE_URL}/tasks`).then(handleResponse);
  },

  // เพิ่มรายการงาน
  create({ text, tag }) {
    return fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, tag }),
    }).then(handleResponse);
  },

  // แก้ไขรายการงาน
  update(id, payload) {
    return fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse);
  },

  // สลับสถานะ เสร็จ/ยังไม่เสร็จ
  toggle(id) {
    return fetch(`${BASE_URL}/tasks/${id}/toggle`, { method: 'PATCH' }).then(handleResponse);
  },

  // ลบรายการงาน
  remove(id) {
    return fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' }).then(handleResponse);
  },
};
