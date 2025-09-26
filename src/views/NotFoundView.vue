<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}

const goToProducts = () => {
  router.push('/products')
}
</script>

<template>
  <div class="not-found">
    <div class="not-found__container">
      <!-- Ilustración 404 -->
      <div class="not-found__illustration">
        <div class="not-found__number">404</div>
        <div class="not-found__icon">
          <i class="fas fa-cake-candles"></i>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="not-found__content">
        <h1 class="not-found__title">¡Oops! Página no encontrada</h1>
        <p class="not-found__description">
          La página que estás buscando no existe o ha sido movida. 
          Pero no te preocupes, ¡tenemos muchas cosas deliciosas esperándote!
        </p>

        <!-- Botones de acción -->
        <div class="not-found__actions">
          <button 
            @click="goHome"
            class="not-found__button not-found__button--primary"
          >
            <i class="fas fa-home"></i>
            <span>Ir al Inicio</span>
          </button>
          
          <button 
            @click="goToProducts"
            class="not-found__button not-found__button--secondary"
          >
            <i class="fas fa-shopping-bag"></i>
            <span>Ver Productos</span>
          </button>
          
          <button 
            @click="goBack"
            class="not-found__button not-found__button--outline"
          >
            <i class="fas fa-arrow-left"></i>
            <span>Volver Atrás</span>
          </button>
        </div>

        <!-- Enlaces útiles -->
        <div class="not-found__links">
          <h3 class="not-found__links-title">Enlaces útiles:</h3>
          <ul class="not-found__links-list">
            <li>
              <router-link to="/" class="not-found__link">
                <i class="fas fa-home"></i>
                <span>Página Principal</span>
              </router-link>
            </li>
            <li>
              <router-link to="/products" class="not-found__link">
                <i class="fas fa-cupcake"></i>
                <span>Nuestros Productos</span>
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="not-found__link">
                <i class="fas fa-envelope"></i>
                <span>Contacto</span>
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="not-found__link">
                <i class="fas fa-info-circle"></i>
                <span>Acerca de Nosotros</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Decoración temática -->
      <div class="not-found__decoration">
        <div class="not-found__decoration-item not-found__decoration-item--1">
          <i class="fas fa-birthday-cake"></i>
        </div>
        <div class="not-found__decoration-item not-found__decoration-item--2">
          <i class="fas fa-cookie-bite"></i>
        </div>
        <div class="not-found__decoration-item not-found__decoration-item--3">
          <i class="fas fa-ice-cream"></i>
        </div>
        <div class="not-found__decoration-item not-found__decoration-item--4">
          <i class="fas fa-candy-cane"></i>
        </div>
        <div class="not-found__decoration-item not-found__decoration-item--5">
          <i class="fas fa-cookie"></i>
        </div>
        <div class="not-found__decoration-item not-found__decoration-item--6">
          <i class="fas fa-muffin"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $purple-primary 0%, $purple-dark 100%);
  padding: 1rem;
  position: relative;
  overflow: hidden;

  // Patrón de fondo sutil
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 25% 25%, rgba($white, 0.1) 2px, transparent 2px),
                      radial-gradient(circle at 75% 75%, rgba($white, 0.05) 1px, transparent 1px);
    background-size: 50px 50px, 30px 30px;
    animation: float 20s ease-in-out infinite;
  }

  &__container {
    background: rgba($white, 0.98);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 3rem;
    text-align: center;
    max-width: 600px;
    width: 100%;
    box-shadow: 
      0 20px 60px rgba($purple-primary, 0.15),
      0 8px 32px rgba($purple-primary, 0.1);
    position: relative;
    z-index: 1;
    border: 1px solid rgba($white, 0.2);

    @media (max-width: 768px) {
      padding: 2rem 1.5rem;
      margin: 0 1rem;
      border-radius: 20px;
    }

    @media (max-width: 480px) {
      padding: 1.5rem 1rem;
    }
  }

  &__illustration {
    margin-bottom: 2.5rem;
    position: relative;
  }

  &__number {
    font-size: 8rem;
    font-weight: 900;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin-bottom: 1rem;
    animation: bounce 2s ease-in-out infinite;
    font-family: 'Arial Black', sans-serif;

    @media (max-width: 768px) {
      font-size: 6rem;
    }

    @media (max-width: 480px) {
      font-size: 4.5rem;
    }
  }

  &__icon {
    font-size: 3rem;
    color: $purple-primary;
    margin-bottom: 1rem;
    animation: pulse 2s ease-in-out infinite;

    @media (max-width: 480px) {
      font-size: 2.5rem;
    }
  }

  &__content {
    margin-bottom: 2rem;
  }

  &__title {
    font-size: 2.5rem;
    color: $text-dark;
    margin-bottom: 1rem;
    font-weight: 700;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }

  &__description {
    font-size: 1.2rem;
    color: $text-light;
    margin-bottom: 2.5rem;
    line-height: 1.6;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;

    @media (max-width: 768px) {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 3rem;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
  }

  &__button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    min-width: 140px;

    @media (max-width: 480px) {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }

    i {
      font-size: 1.1rem;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba($white, 0.2), transparent);
      transition: left 0.5s;
    }

    &:hover::before {
      left: 100%;
    }

    &--primary {
      background: linear-gradient(135deg, $purple-primary, $purple-dark);
      color: $white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba($purple-primary, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &--secondary {
      background: linear-gradient(135deg, $cream-primary, $background-light);
      color: $purple-primary;
      border: 2px solid $purple-primary;

      &:hover {
        background: $purple-primary;
        color: $white;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba($purple-primary, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }

    &--outline {
      background: transparent;
      color: $purple-primary;
      border: 2px solid $purple-primary;

      &:hover {
        background: $purple-primary;
        color: $white;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba($purple-primary, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  &__links {
    text-align: left;
    max-width: 400px;
    margin: 0 auto;

    @media (max-width: 480px) {
      text-align: center;
    }
  }

  &__links-title {
    font-size: 1.2rem;
    color: $text-dark;
    margin-bottom: 1rem;
    font-weight: 600;

    @media (max-width: 480px) {
      font-size: 1.1rem;
    }
  }

  &__links-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.75rem;

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: $text-light;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    background: rgba($purple-primary, 0.05);

    @media (max-width: 480px) {
      justify-content: center;
    }

    i {
      color: $purple-primary;
      font-size: 1.1rem;
      width: 20px;
      text-align: center;
    }

    &:hover {
      background: rgba($purple-primary, 0.1);
      color: $purple-primary;
      transform: translateX(5px);

      @media (max-width: 480px) {
        transform: translateY(-2px);
      }
    }
  }

  &__decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 0;
  }

  &__decoration-item {
    position: absolute;
    color: rgba($white, 0.1);
    font-size: 2rem;
    animation: float 6s ease-in-out infinite;

    &--1 {
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    &--2 {
      top: 20%;
      right: 15%;
      animation-delay: 1s;
    }

    &--3 {
      bottom: 30%;
      left: 5%;
      animation-delay: 2s;
    }

    &--4 {
      bottom: 15%;
      right: 10%;
      animation-delay: 3s;
    }

    &--5 {
      top: 50%;
      left: 2%;
      animation-delay: 4s;
    }

    &--6 {
      top: 60%;
      right: 5%;
      animation-delay: 5s;
    }

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
}

// Animaciones
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(5deg);
  }
  66% {
    transform: translateY(5px) rotate(-3deg);
  }
}
</style>