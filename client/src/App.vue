<script setup>
import { ref, onMounted } from 'vue'

const products = ref([])

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/products')
    products.value = await res.json()
  } catch (err) {
    console.error('เชื่อมต่อ server ไม่ได้:', err)
  }
})
</script>

<template>
  <div>
    <h1>ทดสอบเชื่อมต่อ Server</h1>
    <ul>
      <li v-for="p in products" :key="p.id">
        {{ p.name }}
      </li>
    </ul>
  </div>
</template>