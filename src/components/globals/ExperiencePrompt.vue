<script setup lang="ts">
import { ref, onMounted } from 'vue'
import musicSrc from '@/assets/music/We Wish You A Merry Christmas.mp3'

const visible = ref(true)
const isPlaying = ref(false)
const showToggle = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

const close = () => {
  visible.value = false
  showToggle.value = true
  if (audioRef.value) {
    audioRef.value.pause()
    isPlaying.value = false
  }
}

const startExperience = async () => {
  if (!audioRef.value) return
  if (isPlaying.value) return
  audioRef.value.volume = 0
  try {
    await audioRef.value.play()
    isPlaying.value = true
    visible.value = false
    showToggle.value = true
    const target = 0.6
    const durationMs = 6000
    const stepMs = 100
    const steps = Math.floor(durationMs / stepMs)
    const increment = target / steps
    let current = 0
    const interval = setInterval(() => {
      current = Math.min(target, current + increment)
      if (audioRef.value) audioRef.value.volume = current
      if (current >= target) clearInterval(interval)
    }, stepMs)
  } catch {}
}

const toggleAudio = async () => {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
    return
  }
  try {
    audioRef.value.volume = 0
    await audioRef.value.play()
    isPlaying.value = true
    const target = 0.6
    const durationMs = 2000
    const stepMs = 100
    const steps = Math.floor(durationMs / stepMs)
    const increment = target / steps
    let current = 0
    const interval = setInterval(() => {
      current = Math.min(target, current + increment)
      if (audioRef.value) audioRef.value.volume = current
      if (current >= target) clearInterval(interval)
    }, stepMs)
  } catch {}
}

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = 0
    audioRef.value.loop = true
  }
})
</script>

<template>
  <audio ref="audioRef" :src="musicSrc" preload="auto" playsinline></audio>
  <div v-if="visible" class="xp-bar">
    <div class="xp-bar__content">
      <div class="xp-bar__text">
        ¿Quieres toda la experiencia? Presiona aquí
      </div>
      <div class="xp-bar__actions">
        <button class="xp-bar__btn" @click="startExperience">
          Activar música
        </button>
        <button class="xp-bar__close" aria-label="Cerrar" @click="close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
  <button
    v-if="showToggle"
    class="xp-toggle"
    :class="{ 'xp-toggle--playing': isPlaying }"
    @click="toggleAudio"
    aria-label="Activar/Desactivar música navideña"
  >
    <i class="fas fa-snowflake"></i>
  </button>
</template>

<style lang="scss" scoped>
@use 'sass:color';
.xp-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 16px;
  z-index: 950;
}

.xp-bar__content {
  max-width: 960px;
  margin: 0 auto;
  background: linear-gradient(135deg, $purple-primary, $purple-dark);
  color: $white;
  border: 1px solid rgba($white, 0.15);
  border-radius: 16px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 12px 30px rgba($gray-900, 0.18);
}

.xp-bar__text {
  font-family: $font-secondary;
  font-size: 0.95rem;
}

.xp-bar__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.xp-bar__btn {
  background: linear-gradient(135deg, rgba($white, 0.25), rgba($white, 0.35));
  color: $white;
  border: 1px solid rgba($white, 0.3);
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.xp-bar__btn:hover {
  background: linear-gradient(135deg, rgba($white, 0.35), rgba($white, 0.45));
  transform: translateY(-1px);
}

.xp-bar__close {
  background: transparent;
  border: none;
  color: $white;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  cursor: pointer;
}

.xp-bar__close:hover {
  background: rgba($white, 0.15);
}

@media (max-width: 480px) {
  .xp-bar__content {
    margin: 0 12px;
    padding: 0.6rem 0.8rem;
    border-radius: 14px;
  }
  .xp-bar__text { font-size: 0.85rem; }
  .xp-bar__btn { font-size: 0.85rem; }
}
</style>
<style lang="scss" scoped>
.xp-toggle {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, $purple-primary, $purple-dark);
  color: $white;
  box-shadow: 0 10px 24px rgba($gray-900, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 960;
  transition: transform 0.2s ease;
}

.xp-toggle:hover { transform: translateY(-2px); }

.xp-toggle--playing { animation: toggle-pulse 2s ease-in-out infinite; }

@keyframes toggle-pulse {
  0% { box-shadow: 0 0 0 0 rgba($purple-primary, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba($purple-primary, 0); }
  100% { box-shadow: 0 0 0 0 rgba($purple-primary, 0); }
}
</style>