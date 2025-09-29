<script setup lang="ts">
import { inject, type Ref } from 'vue'
import TestimonialsSection from '@/components/globals/TestimonialsSection.vue'
import CategoriesSection from '@/components/globals/CategoriesSection.vue'
import FeaturesSection from '@/components/globals/FeaturesSection.vue'
import BestSellersSection from '@/components/globals/BestSellersSection.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import ChefSection from '@/components/ChefSection.vue'

// Inyectar el estado global de carga desde App.vue
const isLoaded = inject<Ref<boolean>>('isAppLoaded')
const showLoadingScreen = inject<Ref<boolean>>('showLoadingScreen')
const handleLoadingComplete = inject<() => void>('handleGlobalLoadingComplete')
</script>

<template>
  <!-- Loading Screen - Solo se muestra cuando showLoadingScreen es true -->
  <LoadingScreen 
    v-if="showLoadingScreen" 
    :on-loading-complete="() => handleLoadingComplete?.()" 
  />

  <div v-show="!showLoadingScreen" class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__background">
        <div class="hero__overlay"></div>
      </div>
      <div class="hero__container">
        <div class="hero__content">
          <div class="hero__badge">
            <span class="hero__badge-text">Pastelería Artesanal</span>
          </div>
          <h1 class="hero__title">
            <span class="hero__title-main">Nicole Pastry Arts</span>
            <span class="hero__title-sub">Donde cada dulce cuenta una historia</span>
          </h1>
          <p class="hero__description">
            Creamos experiencias únicas con pastelería artesanal de la más alta calidad. 
            Cada producto es elaborado con amor, dedicación y los mejores ingredientes.
          </p>
          <div class="hero__stats">
            <div class="hero__stat">
              <span class="hero__stat-number">5+</span>
              <span class="hero__stat-label">Años de experiencia</span>
            </div>
            <div class="hero__stat">
              <span class="hero__stat-number">1000+</span>
              <span class="hero__stat-label">Clientes felices</span>
            </div>
            <div class="hero__stat">
              <span class="hero__stat-number">100%</span>
              <span class="hero__stat-label">Artesanal</span>
            </div>
          </div>
          <div class="hero__actions">
            <router-link to="/productos" class="btn btn--primary btn--hero">
              <span>Explorar Productos</span>
              <svg class="btn__icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </router-link>
            <router-link to="/contacto" class="btn btn--secondary btn--hero">
              <span>Contactar</span>
            </router-link>
          </div>
        </div>
        <div class="hero__image">
          <div class="hero__image-frame">
            <div class="hero__image-content">
              <div class="hero__floating-card hero__floating-card--1">
                <span>🍰</span>
                <span>Pasteles</span>
              </div>
              <div class="hero__floating-card hero__floating-card--2">
                <span>🧁</span>
                <span>Cupcakes</span>
              </div>
              <div class="hero__floating-card hero__floating-card--3">
                <span>🍪</span>
                <span>Galletas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <FeaturesSection />

    <!-- Categories Section -->
    <CategoriesSection />

    <!-- Best Sellers Section -->
    <BestSellersSection />

    <!-- Chef Section -->
    <ChefSection />

    <!-- Testimonials Section -->
    <TestimonialsSection />

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta__container">
        <h2 class="cta__title">¿Listo para endulzar tu día?</h2>
        <p class="cta__subtitle">
          Contáctanos para crear algo especial juntos
        </p>
        <router-link to="/contacto" class="btn btn--primary btn--large">
          Hacer Pedido
        </router-link>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
}

// Hero Section
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 1rem 0;

  @media (min-width: 768px) {
    padding: 4rem 0;
  }

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('@/assets/background/NPR42.JPG');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    z-index: 1;

    // Optimización para móvil
    @media (max-width: 767px) {
      background-attachment: scroll;
    }

    @media (min-width: 768px) {
      background-attachment: fixed;
    }
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.2) 25%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.15) 75%,
      rgba(0, 0, 0, 0.25) 100%
    );
    z-index: 2;
  }

  &__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 3;
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;

    @media (min-width: 768px) {
      padding: 0 2rem;
      gap: 4rem;
    }

    @media (min-width: 1024px) {
      grid-template-columns: 1.2fr 1fr;
      padding: 0 3rem;
      gap: 6rem;
    }
  }

  &__content {
    text-align: center;
    opacity: 0;
    transform: translateY(50px);
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    animation: heroContentSlideUp 1.2s ease-out 0.3s forwards;

    @media (min-width: 768px) {
      padding: 2.5rem;
      border-radius: 20px;
    }

    @media (min-width: 1024px) {
      text-align: left;
      padding: 3rem;
      border-radius: 24px;
    }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50px;
    margin-bottom: 1.5rem;
    opacity: 0;
    transform: translateY(20px);
    animation: badgeFadeIn 1s ease-out 0.6s forwards;
    
    &::before {
      content: '✨';
      font-size: 0.875rem;
    }

    @media (min-width: 768px) {
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      margin-bottom: 2rem;

      &::before {
        font-size: 1rem;
      }
    }
  }

  &__badge-text {
    font-size: 0.9rem;
    font-weight: 600;
    color: $white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }

  &__title {
    margin-bottom: 1.5rem;
    line-height: 1.1;

    @media (min-width: 768px) {
      margin-bottom: 2rem;
    }
  }

  &__title-main {
    display: block;
    font-size: 3rem;
    font-weight: 800;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
    margin-bottom: 0.5rem;
    opacity: 0;
    transform: translateX(-50px);
    animation: titleMainSlideIn 1s ease-out 0.9s forwards;

    @media (min-width: 768px) {
      font-size: 4rem;
    }

    @media (min-width: 1024px) {
      font-size: 4.5rem;
    }
  }

  &__title-sub {
    display: block;
    font-size: 1.2rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
    opacity: 0;
    transform: translateX(50px);
    animation: titleSubSlideIn 1s ease-out 1.2s forwards;

    @media (min-width: 768px) {
      font-size: 1.4rem;
    }
  }

  &__description {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
    line-height: 1.6;
    margin-bottom: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    opacity: 0;
    transform: translateY(30px);
    animation: descriptionFadeIn 1s ease-out 1.5s forwards;

    @media (min-width: 768px) {
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 3rem;
    }

    @media (min-width: 1024px) {
      font-size: 1.2rem;
      margin-left: 0;
      margin-right: 0;
    }
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-bottom: 2rem;
    opacity: 0;
    transform: translateY(30px);
    animation: statsFadeIn 1s ease-out 1.8s forwards;

    @media (min-width: 480px) {
      gap: 1rem;
    }

    @media (min-width: 768px) {
      gap: 2rem;
      margin-bottom: 3rem;
    }
  }

  &__stat {
    text-align: center;
    padding: 0.75rem 0.5rem;
    background: rgba($white, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba($white, 0.2);
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      background: rgba($white, 0.15);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    @media (min-width: 480px) {
      padding: 1rem 0.75rem;
      border-radius: 14px;
    }

    @media (min-width: 768px) {
      padding: 1.5rem 1rem;
      border-radius: 16px;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      }
    }

    @media (min-width: 1024px) {
      text-align: left;
    }
  }

  &__stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 800;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
    margin-bottom: 0.25rem;

    @media (min-width: 480px) {
      font-size: 1.75rem;
      margin-bottom: 0.375rem;
    }

    @media (min-width: 768px) {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
  }

  &__stat-label {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
    font-weight: 500;
    line-height: 1.2;

    @media (min-width: 480px) {
      font-size: 0.8rem;
    }

    @media (min-width: 768px) {
      font-size: 0.9rem;
      line-height: 1.4;
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    opacity: 0;
    transform: translateY(30px);
    animation: actionsFadeIn 1s ease-out 2.1s forwards;

    @media (min-width: 768px) {
      flex-direction: row;
      gap: 1.5rem;
    }

    @media (min-width: 1024px) {
      justify-content: flex-start;
    }
  }

  &__image {
    position: relative;
    display: block;
    opacity: 0;
    transform: scale(0.8);
    animation: imageZoomIn 1.2s ease-out 2.4s forwards;
    margin-top: 2rem;

    @media (min-width: 768px) {
      margin-top: 0;
    }

    @media (min-width: 1024px) {
      margin-top: 0;
    }
  }

  &__image-frame {
    position: relative;
    width: 100%;
    height: 200px;
    background: rgba($white, 0.1);
    backdrop-filter: blur(15px);
    border: 1px solid rgba($white, 0.2);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

    @media (min-width: 480px) {
      height: 250px;
      border-radius: 18px;
    }

    @media (min-width: 768px) {
      height: 350px;
      border: 2px solid rgba($white, 0.2);
      border-radius: 20px;
      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.25);
    }

    @media (min-width: 1024px) {
      height: 500px;
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
  }

  &__image-content {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba($purple-primary, 0.1) 0%,
      rgba($background-cream, 0.2) 50%,
      rgba($purple-primary, 0.1) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    color: rgba($white, 0.3);
  }

  &__floating-card {
    position: absolute;
    padding: 0.5rem 0.75rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: $white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
    animation: floatingCard 3s ease-in-out infinite;
    transition: all 0.3s ease;

    span:first-child {
      font-size: 1rem;
    }

    span:last-child {
      font-size: 0.7rem;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    @media (min-width: 480px) {
      padding: 0.75rem 1rem;
      border-radius: 14px;
      gap: 0.625rem;

      span:first-child {
        font-size: 1.25rem;
      }

      span:last-child {
        font-size: 0.8rem;
      }
    }

    @media (min-width: 768px) {
      padding: 1rem 1.5rem;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      gap: 0.75rem;

      span:first-child {
        font-size: 1.5rem;
      }

      span:last-child {
        font-size: 0.9rem;
      }

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
      }
    }

    &--1 {
      top: 10%;
      left: -5%;
      animation-delay: 0s;

      @media (min-width: 768px) {
        top: 20%;
        left: -10%;
      }
    }

    &--2 {
      top: 50%;
      right: -8%;
      animation-delay: 1s;

      @media (min-width: 768px) {
        top: 60%;
        right: -15%;
      }
    }

    &--3 {
      bottom: 10%;
      left: 5%;
      animation-delay: 2s;

      @media (min-width: 768px) {
        bottom: 15%;
        left: 10%;
      }
    }
  }
}


// CTA Section
.cta {
  background: linear-gradient(135deg, $purple-primary 0%, $purple-dark 100%);
  padding: 6rem 0;
  color: $white;

  &__container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;

    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }

  &__subtitle {
    font-size: 1.2rem;
    margin-bottom: 2.5rem;
    opacity: 0.9;

    @media (min-width: 768px) {
      font-size: 1.4rem;
    }
  }
}

// Botones
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
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
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &--primary {
    background: linear-gradient(135deg, $purple-primary 0%, $purple-hover 100%);
    color: $white;
    box-shadow: 0 4px 15px rgba($purple-primary, 0.3);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba($purple-primary, 0.4);
    }

    &:active {
      transform: translateY(-1px);
    }
  }

  &--secondary {
    background: rgba($white, 0.1);
    color: $white;
    border: 2px solid rgba($white, 0.3);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba($white, 0.2);
      border-color: rgba($white, 0.5);
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
    }

    &:active {
      transform: translateY(-1px);
    }
  }

  &--hero {
    padding: 1.25rem 2.5rem;
    font-size: 1.1rem;
    border-radius: 16px;
    font-weight: 700;
  }

  &--large {
    padding: 1.25rem 2.5rem;
    font-size: 1.1rem;
  }

  &__icon {
    transition: transform 0.3s ease;
  }

  &:hover &__icon {
    transform: translateX(3px);
  }

  // Botón blanco para la sección CTA
  .cta & {
    &--primary {
      background-color: $white;
      color: $purple-primary;

      &:hover {
        background-color: $background-cream;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba($white, 0.3);
      }
    }
  }
}









// Testimonials styles are now handled in the TestimonialsSection component

// Hero animations
@keyframes heroContentSlideUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes badgeFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes titleMainSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes titleSubSlideIn {
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes descriptionFadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes statsFadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes actionsFadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes imageZoomIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes floatingCard {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}


</style>