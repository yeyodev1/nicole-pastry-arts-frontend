<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
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
})
</script>

<template>
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
</template>

<style lang="scss" scoped>
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