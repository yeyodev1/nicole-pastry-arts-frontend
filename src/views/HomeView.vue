<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TestimonialsSection from '@/components/globals/TestimonialsSection.vue'
import CategoriesSection from '@/components/globals/CategoriesSection.vue'
import FeaturesSection from '@/components/globals/FeaturesSection.vue'
import BestSellersSection from '@/components/globals/BestSellersSection.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import ChefSection from '@/components/ChefSection.vue'

// Vista principal de Nicole Pastry Arts
const isLoaded = ref(false)
let ctx: gsap.Context

// Función que se ejecuta cuando la pantalla de carga termina
const handleLoadingComplete = () => {
  isLoaded.value = true
  setupAnimations()
}

onMounted(() => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger)

  // Create GSAP context for proper cleanup
  ctx = gsap.context(() => {
    // Testimonials animations are now handled in the TestimonialsSection component
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})

const setupAnimations = () => {
  // Hero Section Animations
  const heroTl = gsap.timeline()

  // Set initial states
  gsap.set('.hero__title-line', { yPercent: 100, opacity: 0 })
  gsap.set('.hero__title-accent', { yPercent: 100, opacity: 0 })
  gsap.set('.hero__subtitle', { y: 30, opacity: 0 })
  gsap.set('.hero__actions .btn', { y: 30, opacity: 0 })

  heroTl
    .to('.hero__title-line', {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.1
    })
    .to('.hero__title-accent', {
      yPercent: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.8')
    .to('.hero__subtitle', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5')
    .to('.hero__actions .btn', {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1
    }, '-=0.3')




  // Testimonials Section - Handled in onMounted context









  // 3D Tilt Effects for Interactive Cards
  const tiltElements = document.querySelectorAll('.feature-highlight, .category-tile, .product-showcase, .testimonial-card')

  tiltElements.forEach(element => {
    const tiltElement = element as HTMLElement

    tiltElement.addEventListener('mouseenter', () => {
      gsap.to(tiltElement, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    tiltElement.addEventListener('mousemove', (e) => {
      const rect = tiltElement.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) / (rect.width / 2)
      const deltaY = (e.clientY - centerY) / (rect.height / 2)

      gsap.to(tiltElement, {
        rotationY: deltaX * 8,
        rotationX: -deltaY * 8,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    tiltElement.addEventListener('mouseleave', () => {
      gsap.to(tiltElement, {
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      })
    })
  })

  // Magnetic Button Effects
  const magneticButtons = document.querySelectorAll('.btn, .product-showcase__cta, .carousel-nav')

  magneticButtons.forEach(button => {
    const magneticButton = button as HTMLElement

    magneticButton.addEventListener('mousemove', (e) => {
      const rect = magneticButton.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      if (distance < 80) {
        const strength = (80 - distance) / 80
        gsap.to(magneticButton, {
          x: deltaX * strength * 0.3,
          y: deltaY * strength * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    })

    magneticButton.addEventListener('mouseleave', () => {
      gsap.to(magneticButton, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      })
    })
  })
}
</script>

<template>
  <!-- Loading Screen -->
  <LoadingScreen :on-loading-complete="handleLoadingComplete" />

  <div v-show="isLoaded" class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__container">
        <div class="hero__content">
          <h1 class="hero__title">
            <span class="hero__title-line">Bienvenidos a </span>
            <span class="hero__title-accent">Nicole Pastry Arts</span>
          </h1>
          <p class="hero__subtitle">
            Creamos dulces momentos con pastelería artesanal de la más alta calidad
          </p>
          <div class="hero__actions">
            <router-link to="/productos" class="btn btn--primary">
              Ver Productos
            </router-link>
            <router-link to="/contacto" class="btn btn--secondary">
              Contactanos
            </router-link>
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
    <section class="testimonials">
      <div class="testimonials__background">
        <div class="testimonials__parallax-layer testimonials__parallax-layer--1"></div>
        <div class="testimonials__parallax-layer testimonials__parallax-layer--2"></div>
        <div class="testimonials__parallax-layer testimonials__parallax-layer--3"></div>
      </div>
      
      <TestimonialsSection />
    </section>

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
  background: linear-gradient(135deg, $background-cream 0%, $white 100%);
  padding: 4rem 0 6rem;
  min-height: 70vh;
  display: flex;
  align-items: center;

  @media (min-width: 768px) {
    padding: 6rem 0 8rem;
    min-height: 80vh;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }

  &__content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1.5rem;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 3.5rem;
    }

    @media (min-width: 1024px) {
      font-size: 4rem;
    }
  }

  &__title-accent {
    color: $purple-primary;
    display: block;

    @media (min-width: 768px) {
      display: inline;
    }
  }

  &__subtitle {
    font-size: 1.2rem;
    color: $text-light;
    margin-bottom: 2.5rem;
    line-height: 1.6;

    @media (min-width: 768px) {
      font-size: 1.4rem;
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: center;
      gap: 1.5rem;
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
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  // Removed transition - using GSAP for magnetic effects
  border: 2px solid transparent;
  cursor: pointer;

  &--primary {
    background-color: $purple-primary;
    color: $white;

    &:hover {
      background-color: $purple-hover;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($purple-primary, 0.3);
    }
  }

  &--secondary {
    background-color: transparent;
    color: $purple-primary;
    border-color: $purple-primary;

    &:hover {
      background-color: $purple-primary;
      color: $white;
      transform: translateY(-2px);
    }
  }

  &--large {
    padding: 1.25rem 2.5rem;
    font-size: 1.1rem;
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

// Removed conflicting keyframes - now using GSAP for all animations


</style>