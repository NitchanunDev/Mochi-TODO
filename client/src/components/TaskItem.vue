<script setup>
import { ref, nextTick } from 'vue';

const props = defineProps({
  task: { type: Object, required: true },
});
const emit = defineEmits(['toggle', 'edit', 'delete']);

const isEditing = ref(false);
const draft = ref(props.task.text);
const isRemoving = ref(false);
const editInput = ref(null);

const tagLabel = { matcha: 'Matcha', sakura: 'Sakura', lavender: 'Lavender' };
const tagClasses = {
  matcha: 'bg-matcha text-matcha-text',
  sakura: 'bg-sakura text-sakura-text',
  lavender: 'bg-lavender text-lavender-text',
};

async function startEdit() {
  draft.value = props.task.text;
  isEditing.value = true;
  await nextTick();
  editInput.value?.focus();
}

function commitEdit() {
  if (draft.value.trim() && draft.value.trim() !== props.task.text) {
    emit('edit', props.task.id, draft.value.trim());
  }
  isEditing.value = false;
}

function cancelEdit() {
  isEditing.value = false;
}

function handleDelete() {
  isRemoving.value = true;
  setTimeout(() => emit('delete', props.task.id), 250);
}
</script>

<template>
  <div
    class="flex items-center gap-3 bg-card rounded-mochi px-4 py-4 shadow-soft transition-all animate-pop-in hover:-translate-y-0.5 hover:shadow-soft-lg"
    :class="isRemoving ? 'opacity-0 scale-90 translate-x-8' : ''"
  >
    <!-- checkbox -->
    <div
      role="checkbox"
      tabindex="0"
      :aria-checked="task.done"
      class="w-7 h-7 min-w-7 rounded-[10px] border-[2.5px] bg-white cursor-pointer flex items-center justify-center transition-all flex-shrink-0"
      :class="task.done ? 'border-sakura-deep animate-squish' : 'border-[#E4D6C8]'"
      :style="task.done ? 'background: linear-gradient(135deg, #F6C9CE, #E8A6AD)' : ''"
      @click="emit('toggle', task.id)"
      @keydown.enter.prevent="emit('toggle', task.id)"
      @keydown.space.prevent="emit('toggle', task.id)"
    >
      <svg
        v-if="task.done"
        viewBox="0 0 24 24"
        fill="white"
        class="w-4 h-4"
      >
        <path
          d="M12 21s-7.5-4.6-10-9.3C.4 8.1 2.2 4.5 5.8 4c2.1-.3 4 .7 6.2 3 2.2-2.3 4.1-3.3 6.2-3 3.6.5 5.4 4.1 3.8 7.7C19.5 16.4 12 21 12 21z"
        />
      </svg>
    </div>

    <!-- body -->
    <div class="flex-1 min-w-0">
      <div
        v-if="!isEditing"
        class="text-[15px] font-semibold break-words transition-all"
        :class="task.done ? 'text-ink-faint line-through' : 'text-ink'"
      >
        {{ task.text }}
      </div>
      <input
        v-else
        ref="editInput"
        v-model="draft"
        type="text"
        maxlength="80"
        class="w-full font-body text-[15px] font-semibold text-ink bg-white border-2 border-lavender-deep rounded-xl px-2.5 py-1.5 outline-none"
        @keydown.enter="commitEdit"
        @keydown.esc="cancelEdit"
        @blur="commitEdit"
      />
      <span
        class="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide"
        :class="[tagClasses[task.tag], isEditing ? 'mt-2' : 'mt-1.5']"
      >
        {{ tagLabel[task.tag] }}
      </span>
    </div>

    <!-- actions -->
    <div class="flex gap-1 flex-shrink-0">
      <button
        v-if="!isEditing"
        class="w-[30px] h-[30px] rounded-full text-ink-faint text-[15px] flex items-center justify-center transition-all hover:bg-lavender hover:text-lavender-text hover:scale-110"
        aria-label="Edit task"
        @click="startEdit"
      >
        ✎
      </button>
      <button
        v-else
        class="w-[30px] h-[30px] rounded-full text-ink-faint text-[15px] flex items-center justify-center transition-all hover:bg-lavender hover:text-lavender-text hover:scale-110"
        aria-label="Save task"
        @click="commitEdit"
      >
        ✓
      </button>
      <button
        class="w-[30px] h-[30px] rounded-full text-ink-faint text-lg flex items-center justify-center transition-all hover:bg-sakura hover:text-sakura-text hover:rotate-[8deg] hover:scale-110"
        aria-label="Delete task"
        @click="handleDelete"
      >
        ✕
      </button>
    </div>
  </div>
</template>
