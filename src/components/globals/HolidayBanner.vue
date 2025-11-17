<script setup lang="ts">
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'holidayBannerDismissed'
const visible = ref(true)

const dismiss = () => {
  visible.value = false
  try {
    localStorage.setItem(STORAGE_KEY, 'true')
  } catch {}
}

onMounted(() => {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'true') visible.value = false
  } catch {}
})
</script>

<template>
  <div v-if="visible" class="holiday-banner">
    <div class="holiday-banner__content">
      <div class="holiday-banner__info">
        <i class="fas fa-tree holiday-banner__icon" aria-hidden="true"></i>
        <span class="holiday-banner__text">
          ¡Se acerca la Navidad! Realiza tus pedidos anticipados.
        </span>
      </div>
      <div class="holiday-banner__actions">
        <router-link to="/products" class="holiday-banner__cta">
          Explorar productos
        </router-link>
        <button class="holiday-banner__close" aria-label="Cerrar" @click="dismiss">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.holiday-banner {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  z-index: 900;
  background: linear-gradient(135deg, $purple-primary, $purple-dark);
  color: $white;
  border-bottom: 1px solid rgba($white, 0.12);
  box-shadow: 0 6px 20px rgba($gray-900, 0.12);

  @media (min-width: 768px) {
    top: 80px;
  }
}

.holiday-banner__content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 768px) {
    padding: 0.5rem 2rem;
  }
}

.holiday-banner__info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.holiday-banner__icon {
  font-size: 1rem;
}

.holiday-banner__text {
  font-family: $font-secondary;
  font-size: 0.9rem;
}

.holiday-banner__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.holiday-banner__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba($white, 0.25), rgba($white, 0.35));
  color: $white;
  border: 1px solid rgba($white, 0.3);
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba($white, 0.35), rgba($white, 0.45));
    transform: translateY(-1px);
  }
}

.holiday-banner__close {
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
  transition: all 0.2s ease;

  &:hover {
    background: rgba($white, 0.15);
  }
}

@media (max-width: 480px) {
  .holiday-banner__text {
    font-size: 0.85rem;
  }
  .holiday-banner__cta {
    display: none;
  }
}
</style>