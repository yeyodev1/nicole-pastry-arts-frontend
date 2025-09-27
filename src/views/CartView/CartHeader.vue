<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps({
  isEmpty: {
    type: Boolean,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
})

const router = useRouter()

// Navegar a productos
const goToProducts = () => {
  router.push('/products')
}
</script>

<template>
  <div class="cart-header">
    <!-- Header principal -->
    <div class="cart-header__main">
      <h1 class="cart-header__title">
        <i class="fas fa-shopping-cart"></i>
        Mi Carrito
      </h1>
      <p class="cart-header__subtitle" v-if="!isEmpty">
        {{ totalItems }} {{ totalItems === 1 ? 'producto' : 'productos' }} en tu carrito
      </p>
    </div>

    <!-- Estado vacío -->
    <div v-if="isEmpty" class="cart-header__empty">
      <div class="cart-header__empty-icon">
        <i class="fas fa-shopping-cart"></i>
      </div>
      <h2 class="cart-header__empty-title">Tu carrito está vacío</h2>
      <p class="cart-header__empty-description">
        ¡Descubre nuestros deliciosos productos y añade algunos a tu carrito!
      </p>
      <button 
        @click="goToProducts"
        class="cart-header__empty-button"
      >
        <i class="fas fa-shopping-bag"></i>
        Ver Productos
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Header principal - Mobile First
.cart-header {
  &__main {
    text-align: center;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      margin-bottom: 2.5rem;
    }
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;

    @media (min-width: 768px) {
      font-size: 2rem;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    i {
      color: $NICOLE-PRIMARY;
      font-size: 1.5rem;

      @media (min-width: 768px) {
        font-size: 1.75rem;
      }
    }
  }

  &__subtitle {
    font-size: 1rem;
    color: $text-light;
    font-weight: 500;

    @media (min-width: 768px) {
      font-size: 1.1rem;
    }
  }

  // Estado vacío - Mobile First
  &__empty {
    text-align: center;
    padding: 3rem 1.5rem;
    background-color: $white;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba($NICOLE-PRIMARY, 0.08);

    @media (min-width: 768px) {
      padding: 4rem 3rem;
      border-radius: 16px;
    }
  }

  &__empty-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, $NICOLE-PRIMARY, $purple-light);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;

    @media (min-width: 768px) {
      width: 100px;
      height: 100px;
      margin-bottom: 2rem;
    }

    i {
      font-size: 2rem;
      color: $white;

      @media (min-width: 768px) {
        font-size: 2.5rem;
      }
    }
  }

  &__empty-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      font-size: 1.75rem;
      margin-bottom: 1.25rem;
    }
  }

  &__empty-description {
    font-size: 1rem;
    color: $text-light;
    margin-bottom: 2rem;
    line-height: 1.6;

    @media (min-width: 768px) {
      font-size: 1.1rem;
      margin-bottom: 2.5rem;
    }
  }

  &__empty-button {
    background: linear-gradient(135deg, $NICOLE-PRIMARY, $purple-light);
    color: $white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 16px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 52px;

    @media (min-width: 768px) {
      padding: 1.25rem 2.5rem;
      border-radius: 12px;
      font-size: 1.125rem;
      gap: 0.5rem;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($NICOLE-PRIMARY, 0.3);
    }

    &:active {
      transform: translateY(0);
    }

    i {
      font-size: 1.1rem;

      @media (min-width: 768px) {
        font-size: 1.2rem;
      }
    }
  }
}
</style>