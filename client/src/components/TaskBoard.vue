<!-- client/src/components/TaskBoard.vue -->
 <script setup>
import { computed } from 'vue'
import TaskCard from './TaskCard.vue'
import { urgencyMeta, urgencyOrder } from '../composables/useTasks'

const props = defineProps({
  tasks: { type: Array, required: true },
  urgencyFilter: { type: String, default: 'all' },
  emptyHint: { type: String, default: 'ไม่มีงาน' },
})
const emit = defineEmits(['toggle', 'delete', 'save'])

const columns = computed(() =>
  props.urgencyFilter === 'all' ? urgencyOrder : [props.urgencyFilter]
)

function groupFor(level) {
  return props.tasks.filter((t) => t.urgency === level)
}
</script>

<template>
  <div class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }">
    <div
      v-for="level in columns"
      :key="level"
      class="bg-mochi-card rounded-[20px] p-4 shadow-mochi flex flex-col gap-2.5 min-w-0"
    >
      <div class="flex flex-col items-center gap-1 pb-2 mb-0.5 border-b border-dashed border-[#EEE1D3]">
        <span class="w-[9px] h-[9px] rounded-full" :class="{
          'bg-lavender-deep': level === 'high',
          'bg-sakura-deep': level === 'medium',
          'bg-matcha-deep': level === 'low',
        }"></span>
        <span class="font-display font-semibold text-[12.5px] text-mochi-text">{{ urgencyMeta[level].label }}</span>
        <span class="font-semibold text-[10.5px] text-mochi-soft bg-mochi-bg px-2 py-[1px] rounded-full">{{ groupFor(level).length }}</span>
      </div>

      <p v-if="groupFor(level).length === 0" class="text-[11px] text-[#c9b9ac] font-medium text-center py-2.5">{{ emptyHint }}</p>

      <TaskCard
        v-for="task in groupFor(level)"
        :key="task.id"
        :task="task"
        @toggle="(id) => emit('toggle', id)"
        @delete="(id) => emit('delete', id)"
        @save="(id, payload) => emit('save', id, payload)"
      />
    </div>
  </div>
</template>