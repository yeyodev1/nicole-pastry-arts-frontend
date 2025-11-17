<script setup lang="ts">
</script>

<template>
  <div class="santa-sleigh" aria-hidden="true">
    <div class="santa-sleigh__runner">
      <i class="fas fa-sleigh santa-sleigh__icon"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.santa-sleigh {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 120;
}

.santa-sleigh__runner {
  position: absolute;
  top: 45vh;
  left: 0;
  transform: translateX(-20vw) scaleX(1);
  animation: sleigh-run 26s linear infinite;
}

.santa-sleigh__icon {
  color: $white;
  font-size: 2.2rem;
  text-shadow: 0 2px 12px rgba($white, 0.6);
  filter: drop-shadow(0 2px 6px rgba($gray-900, 0.25));
  animation: sleigh-bob 2.4s ease-in-out infinite;
}

@keyframes sleigh-run {
  0% { transform: translateX(-20vw) scaleX(1); }
  50% { transform: translateX(110vw) scaleX(1); }
  50.001% { transform: translateX(110vw) scaleX(-1); }
  100% { transform: translateX(-20vw) scaleX(-1); }
}

@keyframes sleigh-bob {
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}

@media (max-width: 768px) {
  .santa-sleigh__runner { top: 35vh; }
  .santa-sleigh__icon { font-size: 1.8rem; }
}
</style>