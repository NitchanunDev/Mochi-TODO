<script setup>
import { ref } from 'vue';

const emit = defineEmits(['add']);

const text = ref('');
const tag = ref('matcha');
const bounce = ref(false);

function submit() {
  if (!text.value.trim()) return;
  emit('add', { text: text.value, tag: tag.value });
  text.value = '';

  bounce.value = true;
  setTimeout(() => (bounce.value = false), 120);
}
</script>

<template>
  <div
    class="flex items-center gap-2.5 bg-card rounded-mochi-lg pl-5 pr-2 py-2 shadow-soft-lg mb-5 transition-all focus-within:shadow-[0_12px_32px_rgba(74,59,50,0.12)] focus-within:-translate-y-px"
  >
    <input
      v-model="text"
      type="text"
      maxlength="80"
      placeholder="Add a soft little task..."
      class="flex-1 border-none outline-none bg-transparent font-body text-[15px] font-semibold text-ink placeholder:text-ink-faint placeholder:font-medium py-3"
      @keydown.enter="submit"
    />

    <select
      v-model="tag"
      class="border-none outline-none bg-lavender text-ink font-bold text-xs rounded-full px-2.5 py-2 cursor-pointer text-center appearance-none"
    >
      <option value="matcha">🍵 Matcha</option>
      <option value="sakura">🌸 Sakura</option>
      <option value="lavender">💜 Lavender</option>
    </select>

    <button
      class="w-11 h-11 min-w-11 rounded-full text-white text-2xl font-bold flex items-center justify-center shadow-[0_6px_14px_rgba(232,166,173,0.5)] transition-transform"
      :class="bounce ? 'scale-90' : 'hover:scale-110'"
      style="background: linear-gradient(135deg, #F6C9CE, #E8A6AD)"
      aria-label="Add task"
      @click="submit"
    >
      +
    </button>
  </div>
</template>
