<!-- client/src/components/TaskCard.vue -->
<script setup>
import { ref, computed } from 'vue'
import { urgencyMeta } from '../composables/useTasks'

const props = defineProps({ task: { type: Object, required: true } })
const emit = defineEmits(['toggle', 'delete', 'save'])

const isEditing = ref(false)
const editText = ref('')
const editUrgency = ref('low')

const meta = computed(() => urgencyMeta[props.task.urgency] || urgencyMeta.low)

function startEdit() {
  editText.value = props.task.text
  editUrgency.value = props.task.urgency
  isEditing.value = true
}

function commit() {
  if (!editText.value.trim()) { isEditing.value = false; return }
  emit('save', props.task.id, {
    text: editText.value.trim(),
    urgency: editUrgency.value,
  })
  isEditing.value = false
}

const borderColorClass = computed(() => {
  return {
    low: 'border-matcha-deep',
    medium: 'border-sakura-deep',
    high: 'border-lavender-deep',
  }[editUrgency.value]
})

const heartIconPath = 'M12 21s-7.5-4.6-10-9.3C.4 8.1 2.2 4.5 5.8 4c2.1-.3 4 .7 6.2 3 2.2-2.3 4.1-3.3 6.2-3 3.6.5 5.4 4.1 3.8 7.7C19.5 16.4 12 21 12 21z'
</script>

<template>
  <div
    class="bg-mochi-card rounded-[20px] p-4 pl-3.5 flex items-center gap-3 shadow-mochi transition-transform hover:-translate-y-0.5"
  >
    <!-- checkbox หัวใจ toggle เสร็จ/ไม่เสร็จ -->
    <button
      type="button"
      class="w-7 h-7 min-w-[28px] rounded-[10px] border-[2.5px] flex items-center justify-center flex-shrink-0 transition-all"
      :class="task.done ? 'bg-gradient-to-br from-[#F6C9CE] to-sakura-deep border-sakura-deep' : 'bg-white border-[#E4D6C8]'"
      @click="emit('toggle', task.id)"
      :aria-checked="task.done"
      role="checkbox"
    >
      <svg viewBox="0 0 24 24" fill="white" class="w-4 h-4 transition-all" :class="task.done ? 'opacity-100 scale-100' : 'opacity-0 scale-40'">
        <path :d="heartIconPath" />
      </svg>
    </button>

    <div class="flex-1 min-w-0">
      <!-- โหมดปกติ -->
      <template v-if="!isEditing">
        <div
          class="text-[15px] font-semibold break-words"
          :class="task.done ? 'text-[#c9b9ac] line-through decoration-[#d8c7bb]' : 'text-mochi-text'"
        >{{ task.text }}</div>

        <div class="flex items-center flex-wrap gap-2.5 mt-1.5">
          <span
            class="inline-block text-[11px] font-bold px-2.5 py-[3px] rounded-full tracking-wide"
            :class="{
              'bg-matcha text-[#5c7a4d]': task.urgency === 'low',
              'bg-sakura text-[#b06770]': task.urgency === 'medium',
              'bg-lavender text-[#7a5a95]': task.urgency === 'high',
            }"
          >{{ meta.label }}</span>
        </div>
      </template>

      <!-- โหมดแก้ไข -->
      <template v-else>
        <input
          v-model="editText"
          type="text"
          maxlength="80"
          class="w-full font-semibold text-[15px] text-mochi-text bg-white border-2 rounded-xl px-2.5 py-1.5 outline-none transition-colors"
          :class="borderColorClass"
          @keydown.enter.prevent="commit"
          @keydown.escape="isEditing = false"
        />
        <div class="flex items-center flex-wrap gap-2 mt-2">
          <select
            v-model="editUrgency"
            class="font-semibold text-xs text-mochi-text bg-white border-2 rounded-full px-3 py-1.5 outline-none cursor-pointer transition-colors"
            :class="borderColorClass"
            @keydown.enter.prevent="commit"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </template>
    </div>

    <div class="flex gap-1 flex-shrink-0">
      <button
        v-if="!isEditing"
        type="button"
        class="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[#d8c7bb] hover:bg-lavender hover:text-[#7a5a95] hover:scale-110 transition-all"
        aria-label="Edit task"
        @click="startEdit"
      >✎</button>
      <button
        v-else
        type="button"
        class="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[#d8c7bb] hover:bg-lavender hover:text-[#7a5a95] hover:scale-110 transition-all"
        aria-label="Save task"
        @click="commit"
      >✓</button>
      <button
        type="button"
        class="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[#d8c7bb] hover:bg-sakura hover:text-[#b06770] hover:rotate-[8deg] hover:scale-110 transition-all"
        aria-label="Delete task"
        @click="emit('delete', task.id)"
      >✕</button>
    </div>
  </div>
</template>