<script setup lang="ts">
const flakes = Array.from({ length: 70 }, (_, i) => i)
</script>

<template>
  <div class="snowfall" aria-hidden="true">
    <span
      v-for="i in flakes"
      :key="i"
      class="snowfall__flake"
      :style="{
        '--x': `${Math.random() * 100}`,
        '--size': `${Math.random() * 4 + 2}`,
        '--delay': `${Math.random() * 10}`,
        '--duration': `${Math.random() * 12 + 8}`,
        '--opacity': `${Math.random() * 0.6 + 0.3}`
      }"
    />
  </div>
  
</template>

<style lang="scss" scoped>
.snowfall {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

.snowfall__flake {
  position: absolute;
  top: -10px;
  left: calc(var(--x) * 1vw);
  width: calc(var(--size) * 1px);
  height: calc(var(--size) * 1px);
  border-radius: 50%;
  background: radial-gradient(circle, rgba($white, 1) 0%, rgba($white, 0.9) 60%, rgba($white, 0) 100%);
  border: 1px solid rgba($gray-300, 0.35);
  box-shadow: 0 2px 6px rgba($gray-700, 0.15);
  mix-blend-mode: screen;
  opacity: var(--opacity);
  transform: translate3d(0, -20px, 0);
  animation: snowfall-fall linear infinite;
  animation-duration: calc(var(--duration) * 1s);
  animation-delay: calc(var(--delay) * 1s);
  will-change: transform;
}

@keyframes snowfall-fall {
  to {
    transform: translate3d(0, 100vh, 0);
  }
}

@media (min-width: 768px) {
  .snowfall__flake {
    animation-duration: calc(var(--duration) * 1s);
  }
}
</style>