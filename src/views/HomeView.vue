<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TestimonialsSection from '@/components/globals/TestimonialsSection.vue'
import CategoriesSection from '@/components/globals/CategoriesSection.vue'
import FeaturesSection from '@/components/globals/FeaturesSection.vue'
import BestSellersSection from '@/components/globals/BestSellersSection.vue'

// Vista principal de Nicole Pastry Arts
const isLoaded = ref(false)
let ctx: gsap.Context

onMounted(() => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger)

  // Create GSAP context for proper cleanup
  ctx = gsap.context(() => {
    // Loading screen animation
    const loadingTl = gsap.timeline()
    loadingTl
      .to('.loading-screen__progress-fill', {
        width: '100%',
        duration: 2,
        ease: 'power2.out'
      })
      .to('.loading-screen__text', {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.inOut'
      }, '-=0.5')
      .to('.loading-screen', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          isLoaded.value = true
          setupAnimations()
        }
      })

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

  // Chef Section - Advanced Premium Animations
  const chefMainTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.chef',
      start: 'top 85%',
      end: 'bottom 15%',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        // Trigger background animation
        gsap.to('.chef::before', {
          scale: 1.2,
          opacity: 0.8,
          duration: 2,
          ease: 'power2.out'
        })
      }
    }
  })

  // Enhanced chef content entrance with sophisticated reveals
  chefMainTimeline
    .fromTo('.chef__title', {
      y: 80,
      opacity: 0,
      rotationX: -20,
      transformOrigin: 'center bottom',
      filter: 'blur(10px)'
    }, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'power3.out'
    })
    .fromTo('.chef__title::after', {
      scaleX: 0,
      opacity: 0
    }, {
      scaleX: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')
    .fromTo('.chef__quote', {
      y: 60,
      opacity: 0,
      scale: 0.9,
      rotationX: -10,
      filter: 'blur(8px)'
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotationX: 0,
      filter: 'blur(0px)',
      duration: 1.4,
      ease: 'power2.out'
    }, '-=0.8')
    .fromTo('.chef__quote::before, .chef__quote::after', {
      scale: 0,
      opacity: 0,
      rotation: -45
    }, {
      scale: 1,
      opacity: 0.3,
      rotation: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      stagger: 0.1
    }, '-=0.6')
    .fromTo('.chef__info', {
      y: 40,
      opacity: 0,
      scale: 0.95
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.6')
    .fromTo('.chef__image', {
      x: 100,
      opacity: 0,
      rotationY: -25,
      scale: 0.8,
      filter: 'blur(15px)'
    }, {
      x: 0,
      opacity: 1,
      rotationY: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.6,
      ease: 'power3.out'
    }, '-=1.2')
    .fromTo('.chef__image::before, .chef__image::after', {
      scale: 0,
      opacity: 0,
      rotation: 180
    }, {
      scale: 1,
      opacity: 1,
      rotation: 0,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.2
    }, '-=0.8')

  // Advanced floating animation with multiple layers
  const floatingTl = gsap.timeline({ repeat: -1 })
  floatingTl
    .to('.chef__photo', {
      y: -15,
      rotation: 2,
      duration: 4,
      ease: 'power1.inOut'
    })
    .to('.chef__photo', {
      y: 0,
      rotation: -1,
      duration: 3,
      ease: 'power1.inOut'
    })
    .to('.chef__photo', {
      y: -8,
      rotation: 0,
      duration: 3.5,
      ease: 'power1.inOut'
    })

  // Multi-layer parallax effects
  gsap.to('.chef__image', {
    y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '.chef',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  })

  gsap.to('.chef__text', {
    y: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.chef',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.8
    }
  })

  // Background elements parallax
  gsap.to('.chef::before', {
    y: -40,
    rotation: 5,
    ease: 'none',
    scrollTrigger: {
      trigger: '.chef',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2
    }
  })

  gsap.to('.chef::after', {
    y: -20,
    rotation: -3,
    ease: 'none',
    scrollTrigger: {
      trigger: '.chef',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2
    }
  })

  // Progressive reveal on scroll
  gsap.fromTo('.chef__container', {
    clipPath: 'inset(0 0 100% 0)'
  }, {
    clipPath: 'inset(0 0 0% 0)',
    duration: 1.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.chef',
      start: 'top 90%',
      end: 'top 60%',
      scrub: 1
    }
  })

  // Advanced interactive effects for chef section
  const chefSection = document.querySelector('.chef__content') as HTMLElement
  const chefPhoto = document.querySelector('.chef__photo') as HTMLElement

  if (chefSection && chefPhoto) {
    // Enhanced hover effects with 3D transforms
    chefSection.addEventListener('mouseenter', () => {
      const hoverTl = gsap.timeline()
      hoverTl
        .to('.chef__photo', {
          scale: 1.08,
          rotationY: 8,
          rotationX: 3,
          z: 50,
          boxShadow: '0 30px 100px rgba(0, 0, 0, 0.5)',
          duration: 0.8,
          ease: 'power2.out'
        })
        .to('.chef__quote', {
          scale: 1.03,
          y: -5,
          boxShadow: '0 15px 50px rgba(255, 255, 255, 0.1)',
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.4')
        .to('.chef__title', {
          scale: 1.02,
          y: -3,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.3')
        .to('.chef__image::before, .chef__image::after', {
          scale: 1.1,
          opacity: 0.8,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.6')
    })

    chefSection.addEventListener('mouseleave', () => {
      const leaveTl = gsap.timeline()
      leaveTl
        .to('.chef__photo', {
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          z: 0,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          duration: 0.8,
          ease: 'power2.out'
        })
        .to('.chef__quote', {
          scale: 1,
          y: 0,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.4')
        .to('.chef__title', {
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.3')
        .to('.chef__image::before, .chef__image::after', {
          scale: 1,
          opacity: 0.3,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.6')
    })

    // Mouse movement parallax effect
    chefSection.addEventListener('mousemove', (e) => {
      const rect = chefSection.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      gsap.to('.chef__photo', {
        rotationY: x * 15,
        rotationX: -y * 10,
        duration: 0.3,
        ease: 'power2.out'
      })

      gsap.to('.chef__quote', {
        x: x * 10,
        y: y * 5,
        duration: 0.4,
        ease: 'power2.out'
      })

      gsap.to('.chef__title', {
        x: x * 8,
        y: y * 3,
        duration: 0.5,
        ease: 'power2.out'
      })
    })
  }

  // Scroll-based text reveal animation
  gsap.fromTo('.chef__quote', {
    backgroundPosition: '0% 50%'
  }, {
    backgroundPosition: '100% 50%',
    duration: 2,
    ease: 'none',
    scrollTrigger: {
      trigger: '.chef__quote',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    }
  })

  // Advanced scroll-triggered morphing effects
  gsap.to('.chef__container', {
    borderRadius: '0px',
    ease: 'none',
    scrollTrigger: {
      trigger: '.chef',
      start: 'top center',
      end: 'bottom center',
      scrub: 2
    }
  })

  // Dynamic color shifting on scroll
  gsap.to('.chef', {
    filter: 'hue-rotate(10deg) brightness(1.1)',
    ease: 'none',
    scrollTrigger: {
      trigger: '.chef',
      start: 'top center',
      end: 'bottom center',
      scrub: 1.5
    }
  })

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
  <div v-if="!isLoaded" class="loading-screen">
    <div class="loading-screen__content">
      <div class="loading-screen__logo">
        <i class="fas fa-birthday-cake"></i>
      </div>
      <div class="loading-screen__text">Nicole Pastry Arts</div>
      <div class="loading-screen__progress">
        <div class="loading-screen__progress-fill"></div>
      </div>
    </div>
  </div>

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
    <section class="chef">
      <div class="chef__container">
        <div class="chef__content">
          <div class="chef__text">
            <h2 class="chef__title">PASTRY CHEF</h2>
            <blockquote class="chef__quote">
              "Como pastelera, cada capa, cada sabor y cada técnica reflejan las lecciones valiosas que hemos aprendido de aquellos que compartieron generosamente su conocimiento. Entre ellos, los mentores que más han influido en mi trayectoria hasta el día de hoy son; Joaquim Prat, Albert Adriá, Jose Romero, Olivier Fernandez, Fabrizio Donatone, Rodrigo Fontana y Antonio Bachour."
            </blockquote>
            <div class="chef__info">
              <h3 class="chef__name">Nicole Robalino</h3>
              <p class="chef__role">CoFounder | Pastry Chef</p>
            </div>
          </div>
          <div class="chef__image">
            <img 
              src="/src/assets/team/nicole/nicole-ropa-negra.jpeg" 
              alt="Nicole Robalino - Pastry Chef" 
              class="chef__photo"
            />
          </div>
        </div>
      </div>
    </section>

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





// Loading Screen Styles
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, $purple-primary 0%, $purple-dark 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  &__content {
    text-align: center;
    color: $white;
  }

  &__logo {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.9;

    i {
      animation: pulse 2s ease-in-out infinite;
    }
  }

  &__text {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    letter-spacing: 2px;
  }

  &__progress {
    width: 200px;
    height: 4px;
    background: rgba($white, 0.2);
    border-radius: 2px;
    overflow: hidden;
    margin: 0 auto;
  }

  &__progress-fill {
    width: 0%;
    height: 100%;
    background: $white;
    border-radius: 2px;
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.9;
  }

  50% {
    opacity: 0.6;
  }
}

// Chef Section
.chef {
  padding: 8rem 0;
  background: linear-gradient(135deg, $purple-primary 0%, $purple-dark 100%);
  color: $white;
  position: relative;
  overflow: hidden;

  // Animated background elements
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 70%, rgba($white, 0.1) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 20%;
    right: -20%;
    width: 40%;
    height: 40%;
    background: radial-gradient(circle, rgba($purple-light, 0.2) 0%, transparent 70%);
    border-radius: 50%;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 2;
    perspective: 1200px;
    transform-style: preserve-3d;
    will-change: transform, clip-path, border-radius;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
    align-items: center;
    position: relative;
    transform-style: preserve-3d;
    will-change: transform;

    @media (min-width: 1024px) {
      grid-template-columns: 2fr 1fr;
      gap: 5rem;
    }
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    background: linear-gradient(135deg, $white 0%, rgba($white, 0.8) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    will-change: transform, filter, scale;
    transform-style: preserve-3d;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, $white, transparent);
      border-radius: 2px;
    }

    @media (min-width: 768px) {
      font-size: 3.2rem;
      letter-spacing: 4px;
    }
  }

  &__quote {
    font-size: 1.2rem;
    line-height: 1.8;
    font-style: italic;
    margin-bottom: 2.5rem;
    padding: 2rem;
    border-left: 4px solid $white;
    background: rgba($white, 0.05);
    border-radius: 0 12px 12px 0;
    backdrop-filter: blur(10px);
    position: relative;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    will-change: transform, scale, box-shadow, background-position;
    transform-style: preserve-3d;

    &::before {
      content: '"';
      position: absolute;
      top: -10px;
      left: 15px;
      font-size: 4rem;
      font-weight: 700;
      opacity: 0.3;
      line-height: 1;
    }

    &::after {
      content: '"';
      position: absolute;
      bottom: -20px;
      right: 15px;
      font-size: 4rem;
      font-weight: 700;
      opacity: 0.3;
      line-height: 1;
    }

    @media (min-width: 768px) {
      font-size: 1.3rem;
      padding: 2.5rem;
    }
  }

  &__info {
    text-align: left;
    will-change: transform, scale;
    transform-style: preserve-3d;

    @media (max-width: 1023px) {
      text-align: center;
    }
  }

  &__name {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  &__role {
    font-size: 1.1rem;
    opacity: 0.9;
  }

  &__image {
    text-align: center;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 320px;
      height: 320px;
      border: 2px solid rgba($white, 0.3);
      border-radius: 50%;
      z-index: 1;

      @media (max-width: 767px) {
        width: 260px;
        height: 260px;
      }

      @media (max-width: 480px) {
        width: 220px;
        height: 220px;
      }
    }

    &::after {
      content: '';
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      width: 360px;
      height: 360px;
      border: 1px solid rgba($white, 0.1);
      border-radius: 50%;
      z-index: 0;

      @media (max-width: 767px) {
        width: 300px;
        height: 300px;
      }

      @media (max-width: 480px) {
        width: 260px;
        height: 260px;
      }
    }
  }

  &__photo {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    object-fit: cover;
    border: 6px solid $white;
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba($white, 0.1),
      inset 0 0 0 1px rgba($white, 0.1);
    position: relative;
    z-index: 2;
    // Removed transition - using GSAP for animations

    &:hover {
      transform: scale(1.05);
      box-shadow:
        0 25px 80px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba($white, 0.2),
        inset 0 0 0 1px rgba($white, 0.2);
    }

    @media (max-width: 767px) {
      width: 220px;
      height: 220px;
      border-width: 4px;
    }

    @media (max-width: 480px) {
      width: 180px;
      height: 180px;
      border-width: 3px;
    }
  }
}

// Testimonials styles are now handled in the TestimonialsSection component

// Removed conflicting keyframes - now using GSAP for all animations

// Float animation for chef section background
@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  33% {
    transform: translateY(-20px) rotate(1deg);
  }

  66% {
    transform: translateY(-10px) rotate(-1deg);
  }
}
</style>