<script setup>
defineProps({
  stats: { type: Object, required: true }, // { total, left, done }
});
</script>

<template>
  <div class="flex justify-center gap-2.5 mb-5 flex-wrap">
    <div class="flex items-center gap-1.5 bg-card rounded-full px-4 py-2 text-[13px] font-semibold shadow-soft">
      <span class="w-2 h-2 rounded-full bg-matcha-deep"></span>
      {{ stats.total }} total
    </div>
    <div class="flex items-center gap-1.5 bg-card rounded-full px-4 py-2 text-[13px] font-semibold shadow-soft">
      <span class="w-2 h-2 rounded-full bg-sakura-deep"></span>
      {{ stats.left }} left
    </div>
    <div class="flex items-center gap-1.5 bg-card rounded-full px-4 py-2 text-[13px] font-semibold shadow-soft">
      <span class="w-2 h-2 rounded-full bg-lavender-deep"></span>
      {{ stats.done }} done
    </div>
  </div>
</template>
