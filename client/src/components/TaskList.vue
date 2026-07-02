<script setup>
import TaskItem from './TaskItem.vue';

const props = defineProps({
  tasks: { type: Array, required: true },
  filter: { type: String, required: true },
});
defineEmits(['toggle', 'edit', 'delete']);
</script>

<template>
  <div class="flex flex-col gap-3">
    <div v-if="tasks.length === 0" class="text-center py-12 px-5 text-ink-soft">
      <svg viewBox="0 0 100 90" width="100" class="mx-auto mb-3.5 opacity-90 animate-float">
        <ellipse cx="50" cy="55" rx="42" ry="32" fill="#FDFBF7" stroke="#F0E4D8" stroke-width="2" />
        <ellipse cx="27" cy="40" rx="9" ry="9" fill="#E8DAEF" opacity="0.7" />
        <ellipse cx="73" cy="40" rx="9" ry="9" fill="#FCE4E6" opacity="0.7" />
        <path d="M32 53 Q35 50 38 53" stroke="#4A3B32" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <path d="M62 53 Q65 50 68 53" stroke="#4A3B32" stroke-width="2.2" fill="none" stroke-linecap="round" />
        <ellipse cx="50" cy="65" rx="6" ry="4" fill="#C98D8D" opacity="0.6" />
      </svg>
      <p class="font-semibold text-sm m-0">All squishy and quiet here~</p>
      <span class="text-xs text-ink-faint">
        {{ filter === 'done' ? 'nothing finished yet' : 'add a little task above' }}
      </span>
    </div>

    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @toggle="(id) => $emit('toggle', id)"
      @edit="(id, text) => $emit('edit', id, text)"
      @delete="(id) => $emit('delete', id)"
    />
  </div>
</template>
