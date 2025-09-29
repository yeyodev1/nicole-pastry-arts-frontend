<script setup lang="ts">
const openYeyoDev = () => {
  window.open('https://yeyo.dev/', '_blank')
}
</script>

<template>
  <div class="yeyo-trademark">
    <button 
      @click="openYeyoDev"
      class="yeyo-trademark__link"
      title="Desarrollado por YeyoDev"
      aria-label="Visitar sitio web de YeyoDev"
    >
      <span class="yeyo-trademark__text">Desarrollado por</span>
      <span class="yeyo-trademark__brand">YeyoDev</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.yeyo-trademark {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid $border-light;
  margin-top: 1.5rem;

  @media (min-width: 768px) {
    padding: 1.25rem 0;
    margin-top: 2rem;
  }
}

.yeyo-trademark__link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: rgba($purple-primary, 0.05);
    transform: translateY(-1px);

    .yeyo-trademark__brand {
      color: $purple-primary;
      transform: scale(1.05);
    }

    &::before {
      transform: translateX(0);
    }
  }

  &:focus {
    outline: 2px solid $purple-primary;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba($purple-primary, 0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
    pointer-events: none;
  }
}

.yeyo-trademark__text {
  @include interface-font(400);
  font-size: 0.8rem;
  color: $text-light;
  transition: color 0.3s ease;

  @media (min-width: 768px) {
    font-size: 0.85rem;
  }
}

.yeyo-trademark__brand {
  @include accent-font(600);
  font-size: 0.85rem;
  color: $gray-700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, $purple-primary, $purple-light);
    transition: width 0.3s ease;
  }

  .yeyo-trademark__link:hover &::after {
    width: 100%;
  }
}

// Animación sutil de entrada
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.yeyo-trademark {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}
</style>