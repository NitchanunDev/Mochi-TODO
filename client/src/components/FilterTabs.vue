<script setup>
defineProps({
  modelValue: { type: String, required: true },
});
const emit = defineEmits(['update:modelValue']);

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'To-Do' },
  { key: 'done', label: 'Done' },
];
</script>

<template>
  <div class="flex gap-2 justify-center mb-5">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="border-none font-bold text-[13px] px-4.5 py-2 rounded-full cursor-pointer transition-all"
      :class="
        modelValue === tab.key
          ? 'bg-card text-ink shadow-soft'
          : 'bg-transparent text-ink-soft hover:text-ink'
      "
      @click="emit('update:modelValue', tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
