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
          <i class="fas fa-search"></i>
        </div>
      </div>

      <!-- Contenido -->
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
            Ir al Inicio
          </button>
          
          <button 
            @click="goToProducts"
            class="not-found__button not-found__button--secondary"
          >
            <i class="fas fa-shopping-bag"></i>
            Ver Productos
          </button>
          
          <button 
            @click="goBack"
            class="not-found__button not-found__button--outline"
          >
            <i class="fas fa-arrow-left"></i>
            Volver Atrás
          </button>
        </div>

        <!-- Enlaces útiles -->
        <div class="not-found__links">
          <h3 class="not-found__links-title">Enlaces útiles:</h3>
          <ul class="not-found__links-list">
            <li>
              <router-link to="/" class="not-found__link">
                <i class="fas fa-home"></i>
                Página Principal
              </router-link>
            </li>
            <li>
              <router-link to="/products" class="not-found__link">
                <i class="fas fa-shopping-bag"></i>
                Nuestros Productos
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="not-found__link">
                <i class="fas fa-envelope"></i>
                Contacto
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="not-found__link">
                <i class="fas fa-info-circle"></i>
                Acerca de Nosotros
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Decoración -->
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
  padding: 2rem;
  position: relative;
  overflow: hidden;

  // Elementos decorativos de fondo
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
    animation: float 20s ease-in-out infinite;
  }

  &__container {
    background: rgba($white, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 3rem;
    text-align: center;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 20px 60px rgba($text-dark, 0.1);
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
      padding: 2rem;
      margin: 1rem;
    }
  }

  &__illustration {
    margin-bottom: 2rem;
    position: relative;

    .error-code {
      font-size: 8rem;
      font-weight: 900;
      background: linear-gradient(135deg, $purple-primary, $purple-dark);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin-bottom: 1rem;
      animation: bounce 2s ease-in-out infinite;

      @media (max-width: 768px) {
        font-size: 6rem;
      }
    }

    .illustration-icon {
      font-size: 3rem;
      color: $purple-primary;
      margin-bottom: 1rem;
      animation: pulse 2s ease-in-out infinite;
    }
  }

  &__content {
    h1 {
      font-size: 2.5rem;
      color: $text-dark;
      margin-bottom: 1rem;
      font-weight: 700;

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    p {
      font-size: 1.2rem;
      color: $text-light;
      margin-bottom: 2.5rem;
      line-height: 1.6;

      @media (max-width: 768px) {
        font-size: 1.1rem;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;

    .btn {
      padding: 1rem 2rem;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      position: relative;
      overflow: hidden;

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
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba($purple-primary, 0.4);
        }
      }

      &--secondary {
        background: transparent;
        color: $purple-primary;
        border: 2px solid $purple-primary;

        &:hover {
          background: $purple-primary;
          color: $white;
          transform: translateY(-3px);
        }
      }

      &--outline {
        background: transparent;
        color: $text-light;
        border: 2px solid $border-light;

        &:hover {
          background: $gray-100;
          border-color: $gray-300;
          transform: translateY(-3px);
        }
      }
    }
  }

  &__links {
    h3 {
      font-size: 1.2rem;
      color: $gray-700;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;

      li {
        a {
          color: $purple-primary;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: $purple-primary;
            transition: width 0.3s ease;
          }

          &:hover {
            color: $purple-dark;

            &::after {
              width: 100%;
            }
          }
        }
      }
    }
  }

  &__decorations {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    .decoration {
      position: absolute;
      background: rgba($white, 0.1);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;

      &:nth-child(1) {
        width: 80px;
        height: 80px;
        top: 10%;
        left: 10%;
        animation-delay: 0s;
      }

      &:nth-child(2) {
        width: 120px;
        height: 120px;
        top: 20%;
        right: 10%;
        animation-delay: 2s;
      }

      &:nth-child(3) {
        width: 60px;
        height: 60px;
        bottom: 20%;
        left: 20%;
        animation-delay: 4s;
      }

      &:nth-child(4) {
        width: 100px;
        height: 100px;
        bottom: 10%;
        right: 20%;
        animation-delay: 1s;
      }
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
    transform: translateY(-10px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}
</style>