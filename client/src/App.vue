<script setup>
import { onMounted } from 'vue';
import { useTasks } from './composables/useTasks';
import TaskInput from './components/TaskInput.vue';
import FilterTabs from './components/FilterTabs.vue';
import StatsBar from './components/StatsBar.vue';
import TaskList from './components/TaskList.vue';

const {
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
} = useTasks();

onMounted(loadTasks);
</script>

<template>
  <div class="min-h-screen flex justify-center px-5 py-12 pb-24 relative overflow-x-hidden">
    <div class="w-full max-w-[480px] relative">
      <!-- header -->
      <div class="text-center mb-7">
        <svg viewBox="0 0 100 90" class="w-[76px] mx-auto mb-1.5 block drop-shadow animate-float">
          <ellipse cx="50" cy="55" rx="42" ry="32" fill="#FDFBF7" stroke="#F0E4D8" stroke-width="2" />
          <ellipse cx="27" cy="40" rx="9" ry="9" fill="#FCE4E6" opacity="0.8" />
          <ellipse cx="73" cy="40" rx="9" ry="9" fill="#E2F0D9" opacity="0.8" />
          <circle cx="35" cy="53" r="3" fill="#4A3B32" />
          <circle cx="65" cy="53" r="3" fill="#4A3B32" />
          <path d="M40 63 Q50 70 60 63" stroke="#C98D8D" stroke-width="2.5" fill="none" stroke-linecap="round" />
        </svg>
        <h1 class="font-display font-semibold text-[28px] m-0 tracking-wide">もち Mochi List</h1>
        <div class="text-sm text-ink-soft font-medium">little squishy tasks for a cozy day ⋆｡°✩</div>
      </div>

      <StatsBar :stats="stats" />

      <TaskInput @add="({ text, tag }) => addTask(text, tag)" />

      <FilterTabs v-model="filter" />

      <div v-if="loading" class="text-center py-12 text-ink-soft text-sm font-semibold">
        Warming up the mochi…
      </div>
      <div v-else-if="errorMsg" class="text-center py-12 text-sakura-text text-sm font-semibold">
        {{ errorMsg }}
      </div>
      <TaskList
        v-else
        :tasks="filteredTasks"
        :filter="filter"
        @toggle="toggleTask"
        @edit="editTask"
        @delete="deleteTask"
      />

      <div class="text-center text-[11px] text-ink-faint font-semibold mt-5 min-h-[14px] transition-opacity">
        {{ statusMsg }}
      </div>
    </div>

    <!-- corner mascot -->
    <svg viewBox="0 0 100 90" class="fixed bottom-4.5 right-4.5 w-16 opacity-90 pointer-events-none animate-float">
      <ellipse cx="50" cy="55" rx="38" ry="30" fill="#FDFBF7" stroke="#F0E4D8" stroke-width="2" />
      <ellipse cx="30" cy="42" rx="8" ry="8" fill="#E8DAEF" opacity="0.8" />
      <ellipse cx="70" cy="42" rx="8" ry="8" fill="#FCE4E6" opacity="0.8" />
      <circle cx="38" cy="54" r="2.6" fill="#4A3B32" />
      <circle cx="62" cy="54" r="2.6" fill="#4A3B32" />
      <path d="M42 62 Q50 67 58 62" stroke="#C98D8D" stroke-width="2.2" fill="none" stroke-linecap="round" />
    </svg>
  </div>
</template>
