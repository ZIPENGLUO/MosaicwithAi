<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="svg-icon"
  >
    <path v-for="d in paths" :key="d" :d="d" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
}>()

const iconMap: Record<string, string[]> = {
  home: [
    'M3 10.5 12 3l9 7.5',
    'M5.5 9.5V21h13V9.5',
    'M9 21v-7h6'
  ],
  scan: [
    'M8 3H4v4M16 3h4v4M20 17v4h-4M8 21H4v-4M7 12h10'
  ],
  calendar: [
    'M5 3v3M19 3v3M3.5 9h17',
    'M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2Z'
  ],
  receipt: [
    'M6 3h12v18l-3-2-3 2-3-2-3 2V3Z',
    'M9 8h6M9 12h6'
  ],
  chart: [
    'M4 20V10M10 20V4M16 20v-7M22 20H2'
  ],
  family: [
    'M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2',
    'M16 5a3 3 0 0 1 0 6'
  ],
  settings: [
    'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
    'M19 15a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2l-1-2-2 1-2-1-2 1-2-1-1 2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2l1 2 2-1 2 1 2-1 1 2Z'
  ],
  bell: [
    'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4'
  ],
  plus: [
    'M12 5v14M5 12h14'
  ],
  camera: [
    'M4 7h4l1.5-2h5L16 7h4v12H4V7Z',
    'M12 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'
  ],
  chevron: [
    'm9 18 6-6-6-6'
  ],
  leaf: [
    'M20 4C11 4 5 8 5 15c0 3 2 5 5 5 7 0 10-8 10-16Z',
    'M4 21c3-6 7-9 12-12'
  ],
  wallet: [
    'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1',
    'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4'
  ],
  shield: [
    'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
  ]
}

const paths = computed(() => iconMap[props.name] || iconMap.receipt)
</script>
