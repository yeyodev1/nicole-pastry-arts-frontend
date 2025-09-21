<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

  // Features Section with ScrollTrigger
  gsap.fromTo('.features__header', {
    y: 60,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.features',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    }
  })

  gsap.fromTo('.feature-highlight', {
    y: 80,
    rotationX: -15,
    opacity: 0
  }, {
    y: 0,
    rotationX: 0,
    opacity: 1,
    duration: 1.2,
    ease: 'power3.out',
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.features__showcase',
      start: 'top 75%',
      end: 'bottom 25%',
      toggleActions: 'play none none reverse'
    }
  })

  // Categories Section
  gsap.fromTo('.categories__header-content', {
    y: 60,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.categories',
      start: 'top 80%'
    }
  })

  gsap.fromTo('.floating-element', {
    scale: 0,
    opacity: 0,
    rotation: -180
  }, {
    scale: 1,
    opacity: 1,
    rotation: 0,
    duration: 1.5,
    ease: 'back.out(1.7)',
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.categories__header',
      start: 'top 85%'
    }
  })

  gsap.fromTo('.category-card', {
    scale: 0.8,
    opacity: 0,
    y: 60,
    rotationY: 15
  }, {
    scale: 1,
    opacity: 1,
    y: 0,
    rotationY: 0,
    duration: 1.2,
    ease: 'power3.out',
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.categories__grid',
      start: 'top 75%'
    }
  })

  gsap.fromTo('.categories__cta-content', {
    scale: 0.9,
    opacity: 0,
    y: 40
  }, {
    scale: 1,
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.categories__cta',
      start: 'top 80%'
    }
  })

  // Best Sellers Section
  gsap.fromTo('.best-sellers__header', {
    y: 50,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.best-sellers',
      start: 'top 80%'
    }
  })

  gsap.fromTo('.product-showcase', {
    y: 60,
    rotationX: -10,
    opacity: 0
  }, {
    y: 0,
    rotationX: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.best-sellers__carousel',
      start: 'top 75%'
    }
  })

  // Testimonials Section
  gsap.fromTo('.testimonials__header', {
    y: 50,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.testimonials',
      start: 'top 80%'
    }
  })

  gsap.fromTo('.testimonial-card', {
    y: 40,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.testimonials__grid',
      start: 'top 75%'
    }
  })

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
    <section class="features">
      <div class="features__container">
        <div class="features__header">
          <h2 class="features__title">¿Por qué elegir Nicole Pastry Arts?</h2>
          <p class="features__subtitle">Tres pilares fundamentales que nos distinguen en el mundo de la pastelería artesanal</p>
        </div>
        <div class="features__showcase">
          <div class="feature-highlight">
            <div class="feature-highlight__visual">
              <div class="feature-highlight__icon-wrapper">
                <i class="fas fa-cookie-bite"></i>
              </div>
              <div class="feature-highlight__decoration"></div>
            </div>
            <div class="feature-highlight__content">
              <span class="feature-highlight__number">01</span>
              <h3 class="feature-highlight__title">Artesanal</h3>
              <p class="feature-highlight__description">
                Cada producto es elaborado a mano con técnicas tradicionales y ingredientes premium seleccionados cuidadosamente
              </p>
              <div class="feature-highlight__badge">Hecho a mano</div>
            </div>
          </div>
          <div class="feature-highlight feature-highlight--reverse">
            <div class="feature-highlight__visual">
              <div class="feature-highlight__icon-wrapper">
                <i class="fas fa-heart"></i>
              </div>
              <div class="feature-highlight__decoration"></div>
            </div>
            <div class="feature-highlight__content">
              <span class="feature-highlight__number">02</span>
              <h3 class="feature-highlight__title">Delicioso</h3>
              <p class="feature-highlight__description">
                Sabores únicos y equilibrados que despiertan emociones y crean momentos inolvidables en cada bocado
              </p>
              <div class="feature-highlight__badge">Sabor único</div>
            </div>
          </div>
          <div class="feature-highlight">
            <div class="feature-highlight__visual">
              <div class="feature-highlight__icon-wrapper">
                <i class="fas fa-star"></i>
              </div>
              <div class="feature-highlight__decoration"></div>
            </div>
            <div class="feature-highlight__content">
              <span class="feature-highlight__number">03</span>
              <h3 class="feature-highlight__title">Calidad Premium</h3>
              <p class="feature-highlight__description">
                Solo utilizamos los mejores ingredientes del mercado para garantizar la excelencia en cada creación
              </p>
              <div class="feature-highlight__badge">Premium</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories">
      <div class="categories__container">
        <!-- Header con efecto parallax -->
        <div class="categories__header">
          <div class="categories__header-content">
            <span class="categories__badge">Nuestras Especialidades</span>
            <h2 class="categories__title">
              <span class="categories__title-line">Explora Nuestras</span>
              <span class="categories__title-accent">Categorías Premium</span>
            </h2>
            <p class="categories__subtitle">
              Cada categoría representa años de perfección artesanal. Desde pasteles que cuentan historias 
              hasta postres que despiertan emociones, descubre el universo de sabores que hemos creado para ti.
            </p>
          </div>
          <div class="categories__decorative-elements">
            <div class="floating-element floating-element--1"></div>
            <div class="floating-element floating-element--2"></div>
            <div class="floating-element floating-element--3"></div>
          </div>
        </div>

        <!-- Grid de categorías con diseño de collage -->
        <div class="categories__grid">
          <!-- Categoría Principal - Pasteles -->
          <article class="category-card category-card--hero" data-category="pasteles">
            <div class="category-card__background">
              <div class="category-card__image-overlay"></div>
              <div class="category-card__gradient"></div>
            </div>
            <div class="category-card__content">
              <div class="category-card__icon-wrapper">
                <div class="category-card__icon-bg"></div>
                <i class="fas fa-birthday-cake category-card__icon"></i>
                <div class="category-card__icon-glow"></div>
              </div>
              <div class="category-card__text">
                <div class="category-card__badge">
                  <i class="fas fa-crown"></i>
                  <span>Especialidad</span>
                </div>
                <h3 class="category-card__title">Pasteles Artesanales</h3>
                <p class="category-card__description">
                  Creaciones únicas que transforman celebraciones en momentos inolvidables. 
                  Cada pastel es una obra de arte comestible.
                </p>
                <div class="category-card__stats">
                  <div class="stat">
                    <span class="stat__number">25+</span>
                    <span class="stat__label">Variedades</span>
                  </div>
                  <div class="stat">
                    <span class="stat__number">★ 4.9</span>
                    <span class="stat__label">Rating</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="category-card__action">
              <button class="category-card__btn">
                <span>Explorar Pasteles</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
            <div class="category-card__particles">
              <div class="particle particle--1"></div>
              <div class="particle particle--2"></div>
              <div class="particle particle--3"></div>
            </div>
          </article>

          <!-- Galletas -->
          <article class="category-card category-card--secondary" data-category="galletas">
            <div class="category-card__background">
              <div class="category-card__image-overlay"></div>
              <div class="category-card__gradient"></div>
            </div>
            <div class="category-card__content">
              <div class="category-card__icon-wrapper">
                <div class="category-card__icon-bg"></div>
                <i class="fas fa-cookie category-card__icon"></i>
                <div class="category-card__icon-glow"></div>
              </div>
              <div class="category-card__text">
                <h3 class="category-card__title">Galletas Gourmet</h3>
                <p class="category-card__description">
                  Texturas perfectas y sabores únicos en cada bocado
                </p>
                <div class="category-card__count">18 variedades</div>
              </div>
            </div>
            <div class="category-card__action">
              <button class="category-card__btn category-card__btn--compact">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </article>

          <!-- Postres -->
          <article class="category-card category-card--secondary" data-category="postres">
            <div class="category-card__background">
              <div class="category-card__image-overlay"></div>
              <div class="category-card__gradient"></div>
            </div>
            <div class="category-card__content">
              <div class="category-card__icon-wrapper">
                <div class="category-card__icon-bg"></div>
                <i class="fas fa-ice-cream category-card__icon"></i>
                <div class="category-card__icon-glow"></div>
              </div>
              <div class="category-card__text">
                <div class="category-card__badge category-card__badge--new">
                  <i class="fas fa-sparkles"></i>
                  <span>Innovación</span>
                </div>
                <h3 class="category-card__title">Postres de Vanguardia</h3>
                <p class="category-card__description">
                  Técnicas modernas que reinventan la pastelería tradicional
                </p>
                <div class="category-card__count">32 creaciones</div>
              </div>
            </div>
            <div class="category-card__action">
              <button class="category-card__btn category-card__btn--compact">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </article>

          <!-- Bollería - Ahora al lado de Postres -->
          <article class="category-card category-card--secondary category-card--featured" data-category="bolleria">
            <div class="category-card__background">
              <div class="category-card__image-overlay"></div>
              <div class="category-card__gradient"></div>
            </div>
            <div class="category-card__content">
              <div class="category-card__icon-wrapper">
                <div class="category-card__icon-bg"></div>
                <i class="fas fa-bread-slice category-card__icon"></i>
                <div class="category-card__icon-glow"></div>
              </div>
              <div class="category-card__text">
                <div class="category-card__badge category-card__badge--fresh">
                  <i class="fas fa-clock"></i>
                  <span>Diario</span>
                </div>
                <h3 class="category-card__title">Bollería Artesanal</h3>
                <p class="category-card__description">
                  Horneado fresco cada mañana con ingredientes de primera calidad
                </p>
                <div class="category-card__features">
                  <span class="feature">Masa Madre</span>
                  <span class="feature">Sin Conservantes</span>
                  <span class="feature">Ingredientes Locales</span>
                </div>
              </div>
            </div>
            <div class="category-card__action">
              <button class="category-card__btn">
                <span>Ver Bollería</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </article>
        </div>

        <!-- Call to Action -->
        <div class="categories__cta">
          <div class="categories__cta-content">
            <h3 class="categories__cta-title">¿No encuentras lo que buscas?</h3>
            <p class="categories__cta-text">Creamos productos personalizados para ocasiones especiales</p>
            <button class="categories__cta-btn">
              <span>Solicitar Personalización</span>
              <i class="fas fa-magic"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Best Sellers Section -->
    <section class="best-sellers">
      <div class="best-sellers__container">
        <div class="best-sellers__header">
          <div class="best-sellers__badge">
            <i class="fas fa-crown"></i>
            <span>Best Sellers</span>
          </div>
          <h2 class="best-sellers__title">Nuestros Productos Estrella</h2>
          <p class="best-sellers__subtitle">
            Los sabores que han conquistado corazones, creados con pasión y técnicas artesanales de clase mundial
          </p>
        </div>
        
        <div class="best-sellers__carousel">
          <div class="carousel-navigation">
            <button class="carousel-nav carousel-nav--prev" aria-label="Producto anterior">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="carousel-nav carousel-nav--next" aria-label="Siguiente producto">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>

          <div class="carousel-container">
            <div class="carousel-track">
              <div class="product-showcase">
                <div class="product-showcase__visual">
                  <div class="product-showcase__image">
                    <i class="fas fa-heart"></i>
                  </div>
                  <div class="product-showcase__rating">
                    <div class="rating-stars">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </div>
                    <span class="rating-count">(127 reseñas)</span>
                  </div>
                </div>
                <div class="product-showcase__content">
                  <div class="product-showcase__category">Postres Especiales</div>
                  <h3 class="product-showcase__title">Chocolate & Frutos Rojos</h3>
                  <p class="product-showcase__description">
                    Perfecta combinación de chocolate y compota de frutos rojos a base de fresa, frambuesa, mora y arándanos. Una sinfonía de sabores que despierta todos los sentidos.
                  </p>
                  <div class="product-showcase__features">
                    <span class="feature-tag">Frutos Premium</span>
                    <span class="feature-tag">Chocolate Belga</span>
                    <span class="feature-tag">Artesanal</span>
                  </div>
                  <div class="product-showcase__footer">
                    <div class="product-showcase__price">
                      <span class="price-label">Desde</span>
                      <span class="price-amount">$5.36</span>
                    </div>
                    <button class="product-showcase__cta">
                      <span>Ordenar Ahora</span>
                      <i class="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="product-showcase">
                <div class="product-showcase__visual">
                  <div class="product-showcase__image">
                    <i class="fas fa-apple-alt"></i>
                  </div>
                  <div class="product-showcase__rating">
                    <div class="rating-stars">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </div>
                    <span class="rating-count">(89 reseñas)</span>
                  </div>
                </div>
                <div class="product-showcase__content">
                  <div class="product-showcase__category">Mousse Gourmet</div>
                  <h3 class="product-showcase__title">Flor de Manzana</h3>
                  <p class="product-showcase__description">
                    Mousse de crema inglesa, bizcocho de vainilla con núcleo de manzana y toffee salado, glaseado con brillo de caramelo. Una experiencia única de texturas y sabores.
                  </p>
                  <div class="product-showcase__features">
                    <span class="feature-tag">Toffee Salado</span>
                    <span class="feature-tag">Vainilla Madagascar</span>
                    <span class="feature-tag">Glaseado Artístico</span>
                  </div>
                  <div class="product-showcase__footer">
                    <div class="product-showcase__price">
                      <span class="price-label">Precio</span>
                      <span class="price-amount">$5.40</span>
                    </div>
                    <button class="product-showcase__cta">
                      <span>Ordenar Ahora</span>
                      <i class="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="product-showcase">
                <div class="product-showcase__visual">
                  <div class="product-showcase__image">
                    <i class="fas fa-seedling"></i>
                  </div>
                  <div class="product-showcase__rating">
                    <div class="rating-stars">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </div>
                    <span class="rating-count">(156 reseñas)</span>
                  </div>
                </div>
                <div class="product-showcase__content">
                  <div class="product-showcase__category">Postres de Avellana</div>
                  <h3 class="product-showcase__title">Hazzelnut Premium</h3>
                  <p class="product-showcase__description">
                    Postre de avellana caramelizada, bizcocho francés de chocolate y harina de almendra, cubierto de una mousse ligera de chocolate dark milk. Elegancia en cada bocado.
                  </p>
                  <div class="product-showcase__features">
                    <span class="feature-tag">Avellana Caramelizada</span>
                    <span class="feature-tag">Chocolate Dark Milk</span>
                    <span class="feature-tag">Técnica Francesa</span>
                  </div>
                  <div class="product-showcase__footer">
                    <div class="product-showcase__price">
                      <span class="price-label">Desde</span>
                      <span class="price-amount">$5.36</span>
                    </div>
                    <button class="product-showcase__cta">
                      <span>Ordenar Ahora</span>
                      <i class="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="product-showcase">
                <div class="product-showcase__visual">
                  <div class="product-showcase__image">
                    <i class="fas fa-leaf"></i>
                  </div>
                  <div class="product-showcase__rating">
                    <div class="rating-stars">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </div>
                    <span class="rating-count">(203 reseñas)</span>
                  </div>
                </div>
                <div class="product-showcase__content">
                  <div class="product-showcase__category">Sabores Únicos</div>
                  <h3 class="product-showcase__title">Pistacho y Mora</h3>
                  <p class="product-showcase__description">
                    Mousse a base de pasta de pistacho, núcleo de mora y bizcocho de vainilla, cubierto de un crocante de frutos secos. Una combinación exótica y sofisticada.
                  </p>
                  <div class="product-showcase__features">
                    <span class="feature-tag">Pasta de Pistacho</span>
                    <span class="feature-tag">Mora Fresca</span>
                    <span class="feature-tag">Crocante Artesanal</span>
                  </div>
                  <div class="product-showcase__footer">
                    <div class="product-showcase__price">
                      <span class="price-label">Precio</span>
                      <span class="price-amount">$6.40</span>
                    </div>
                    <button class="product-showcase__cta">
                      <span>Ordenar Ahora</span>
                      <i class="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="product-showcase">
                <div class="product-showcase__visual">
                  <div class="product-showcase__image">
                    <i class="fas fa-coffee"></i>
                  </div>
                  <div class="product-showcase__rating">
                    <div class="rating-stars">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </div>
                    <span class="rating-count">(178 reseñas)</span>
                  </div>
                </div>
                <div class="product-showcase__content">
                  <div class="product-showcase__category">Clásicos Italianos</div>
                  <h3 class="product-showcase__title">Tiramisú Artesanal</h3>
                  <p class="product-showcase__description">
                    Clásico postre italiano elaborado con café nacional, licor amaretto y mousse de queso mascarpone. La receta tradicional con un toque de excelencia artesanal.
                  </p>
                  <div class="product-showcase__features">
                    <span class="feature-tag">Café Nacional</span>
                    <span class="feature-tag">Licor Amaretto</span>
                    <span class="feature-tag">Receta Tradicional</span>
                  </div>
                  <div class="product-showcase__footer">
                    <div class="product-showcase__price">
                      <span class="price-label">Desde</span>
                      <span class="price-amount">$5.36</span>
                    </div>
                    <button class="product-showcase__cta">
                      <span>Ordenar Ahora</span>
                      <i class="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="product-showcase">
                <div class="product-showcase__visual">
                  <div class="product-showcase__image">
                    <i class="fas fa-lemon"></i>
                  </div>
                  <div class="product-showcase__rating">
                    <div class="rating-stars">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </div>
                    <span class="rating-count">(142 reseñas)</span>
                  </div>
                </div>
                <div class="product-showcase__content">
                  <div class="product-showcase__category">Postres Refrescantes</div>
                  <h3 class="product-showcase__title">Peach Melba Deluxe</h3>
                  <p class="product-showcase__description">
                    Postre refrescante y ligero, contiene durazno y frambuesa con un bizcocho de vainilla, cubierto de mousse a base de crema inglesa. Frescura y elegancia en perfecta armonía.
                  </p>
                  <div class="product-showcase__features">
                    <span class="feature-tag">Durazno Fresco</span>
                    <span class="feature-tag">Frambuesa Premium</span>
                    <span class="feature-tag">Crema Inglesa</span>
                  </div>
                  <div class="product-showcase__footer">
                    <div class="product-showcase__price">
                      <span class="price-label">Desde</span>
                      <span class="price-amount">$5.15</span>
                    </div>
                    <button class="product-showcase__cta">
                      <span>Ordenar Ahora</span>
                      <i class="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="carousel-indicators">
            <button class="indicator active" data-slide="0"></button>
            <button class="indicator" data-slide="1"></button>
            <button class="indicator" data-slide="2"></button>
            <button class="indicator" data-slide="3"></button>
            <button class="indicator" data-slide="4"></button>
            <button class="indicator" data-slide="5"></button>
          </div>
        </div>
      </div>
    </section>

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
      
      <div class="testimonials__container">
        <div class="testimonials__header">
          <div class="testimonials__badge">
            <i class="fas fa-heart"></i>
            <span>Testimonios</span>
          </div>
          <h2 class="testimonials__title">Historias que Nos Inspiran</h2>
          <p class="testimonials__subtitle">
            Cada sonrisa es nuestra mayor recompensa. Descubre las experiencias auténticas de quienes han vivido la magia de nuestras creaciones artesanales
          </p>
        </div>
        
        <div class="testimonials__masonry">
          <div class="testimonial-story testimonial-story--featured">
            <div class="testimonial-story__quote">
              <i class="fas fa-quote-left"></i>
            </div>
            <div class="testimonial-story__content">
              <div class="testimonial-story__rating">
                <div class="rating-stars">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
                <span class="rating-label">Experiencia Perfecta</span>
              </div>
              <p class="testimonial-story__text">
                "Un lugar con mucho encanto y tradición. Los postres son deliciosos y el café es muy bueno. Cada visita es una experiencia única que me transporta a las mejores pastelerías de París."
              </p>
              <div class="testimonial-story__details">
                <span class="detail-tag">Postres Artesanales</span>
                <span class="detail-tag">Experiencia Premium</span>
              </div>
            </div>
            <div class="testimonial-story__author">
              <img src="https://i.pravatar.cc/80?img=1" alt="Carolina Viteri" class="testimonial-story__avatar">
              <div class="testimonial-story__info">
                <h4 class="testimonial-story__name">Carolina Viteri</h4>
                <p class="testimonial-story__role">Directora de Marketing</p>
                <div class="testimonial-story__location">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>Quito, Ecuador</span>
                </div>
              </div>
              <div class="testimonial-story__verified">
                <i class="fas fa-check-circle"></i>
                <span>Verificado</span>
              </div>
            </div>
          </div>

          <div class="testimonial-story testimonial-story--compact">
            <div class="testimonial-story__content">
              <div class="testimonial-story__rating">
                <div class="rating-stars">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
              </div>
              <p class="testimonial-story__text">
                "La pastelería es un lujo para los sentidos. Cada pastel está meticulosamente elaborado. Definitivamente, una experiencia gourmet."
              </p>
            </div>
            <div class="testimonial-story__author">
              <img src="https://i.pravatar.cc/60?img=7" alt="Hanz Von Buchwald" class="testimonial-story__avatar">
              <div class="testimonial-story__info">
                <h4 class="testimonial-story__name">Hanz Von Buchwald</h4>
                <p class="testimonial-story__role">Crítico Gastronómico</p>
              </div>
            </div>
          </div>

          <div class="testimonial-story testimonial-story--visual">
            <div class="testimonial-story__image">
              <i class="fas fa-birthday-cake"></i>
              <div class="testimonial-story__overlay">
                <div class="rating-stars">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
              </div>
            </div>
            <div class="testimonial-story__content">
              <p class="testimonial-story__text">
                "Cada pastel es una obra de arte. La atención al detalle y la calidad de los ingredientes son sobresalientes."
              </p>
              <div class="testimonial-story__author">
                <img src="https://i.pravatar.cc/50?img=5" alt="Priscilla Granizo" class="testimonial-story__avatar">
                <div class="testimonial-story__info">
                  <h4 class="testimonial-story__name">Priscilla Granizo</h4>
                  <p class="testimonial-story__role">Amante de la Repostería</p>
                </div>
              </div>
            </div>
          </div>

          <div class="testimonial-story testimonial-story--quote">
            <div class="testimonial-story__large-quote">
              <i class="fas fa-quote-right"></i>
            </div>
            <div class="testimonial-story__content">
              <p class="testimonial-story__text">
                "Cada postre es una obra de arte comestible. La atención al detalle y la pasión se sienten en cada bocado."
              </p>
              <div class="testimonial-story__author">
                <img src="https://i.pravatar.cc/60?img=3" alt="María Elena Rosales" class="testimonial-story__avatar">
                <div class="testimonial-story__info">
                  <h4 class="testimonial-story__name">María Elena Rosales</h4>
                  <p class="testimonial-story__role">Chef Profesional</p>
                </div>
              </div>
            </div>
          </div>

          <div class="testimonial-story testimonial-story--stats">
            <div class="testimonial-story__content">
              <div class="testimonial-story__stat">
                <span class="stat-number">5.0</span>
                <span class="stat-label">Calificación Promedio</span>
                <div class="rating-stars">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
              </div>
              <p class="testimonial-story__text">
                "Pedí cupcakes para el baby shower de mi hermana y fueron el centro de atención. ¡Todos preguntaban dónde los habíamos conseguido!"
              </p>
              <div class="testimonial-story__author">
                <img src="https://i.pravatar.cc/60?img=9" alt="Andrea Morales" class="testimonial-story__avatar">
                <div class="testimonial-story__info">
                  <h4 class="testimonial-story__name">Andrea Morales</h4>
                  <p class="testimonial-story__role">Organizadora de Eventos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="testimonials__cta">
          <h3 class="testimonials__cta-title">¿Quieres ser parte de estas historias?</h3>
          <p class="testimonials__cta-text">Crea tu propia experiencia memorable con nuestras creaciones artesanales</p>
          <button class="testimonials__cta-button">
            <span>Hacer mi Pedido</span>
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
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

// Features Section
.features {
  padding: 8rem 0;
  background: linear-gradient(135deg, $white 0%, $background-cream 50%, $white 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23f8f4f0" opacity="0.3"/><circle cx="75" cy="75" r="1" fill="%23f8f4f0" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.5;
    pointer-events: none;
  }

  &__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 1;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: 5rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  &__title {
    font-size: 2.8rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1.5rem;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 3.5rem;
    }
  }

  &__subtitle {
    font-size: 1.2rem;
    color: $text-light;
    line-height: 1.6;
    font-weight: 400;

    @media (min-width: 768px) {
      font-size: 1.3rem;
    }
  }

  &__showcase {
    display: flex;
    flex-direction: column;
    gap: 4rem;

    @media (min-width: 1024px) {
      gap: 6rem;
    }
  }
}

.feature-highlight {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  padding: 3rem 2rem;
  background: rgba($white, 0.8);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba($purple-primary, 0.1);
  position: relative;
  overflow: hidden;
  // Removed transition - using GSAP for animations

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 2fr;
    gap: 4rem;
    padding: 4rem 3rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba($purple-primary, 0.05), transparent);
    // Removed transition - using GSAP for animations
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba($purple-primary, 0.15);
    border-color: rgba($purple-primary, 0.2);

    &::before {
      left: 100%;
    }

    .feature-highlight__icon-wrapper {
      transform: scale(1.1) rotate(5deg);
    }

    .feature-highlight__decoration {
      transform: scale(1.2) rotate(180deg);
    }
  }

  &--reverse {
    @media (min-width: 1024px) {
      grid-template-columns: 2fr 1fr;

      .feature-highlight__visual {
        order: 2;
      }

      .feature-highlight__content {
        order: 1;
      }
    }
  }

  &__visual {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 200px;

    @media (min-width: 1024px) {
      min-height: 250px;
    }
  }

  &__icon-wrapper {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: $white;
    position: relative;
    z-index: 2;
    // Removed transition - using GSAP for animations
    box-shadow: 0 10px 30px rgba($purple-primary, 0.3);

    @media (min-width: 1024px) {
      width: 140px;
      height: 140px;
      font-size: 3.5rem;
    }

    &::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: linear-gradient(135deg, $purple-light, $purple-primary);
      border-radius: 50%;
      z-index: -1;
      opacity: 0.3;
    }
  }

  &__decoration {
    position: absolute;
    width: 200px;
    height: 200px;
    border: 2px solid rgba($purple-primary, 0.2);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // Removed transition - using GSAP for animations

    &::before {
      content: '';
      position: absolute;
      top: -20px;
      left: -20px;
      right: -20px;
      bottom: -20px;
      border: 1px solid rgba($purple-primary, 0.1);
      border-radius: 50%;
    }
  }

  &__content {
    text-align: center;

    @media (min-width: 1024px) {
      text-align: left;
    }
  }

  &__number {
    display: inline-block;
    font-size: 1rem;
    font-weight: 700;
    color: $purple-primary;
    background: rgba($purple-primary, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    margin-bottom: 1rem;
    letter-spacing: 1px;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: $purple-primary;
    margin-bottom: 1.5rem;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 2.2rem;
    }
  }

  &__description {
    font-size: 1.1rem;
    color: $text-light;
    line-height: 1.7;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      font-size: 1.15rem;
    }
  }

  &__badge {
    display: inline-block;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    color: $white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 15px rgba($purple-primary, 0.3);
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

// Categories Section
.categories {
  padding: 10rem 0;
  background: 
    radial-gradient(ellipse at top, rgba($purple-primary, 0.05) 0%, transparent 70%),
    linear-gradient(135deg, $background-cream 0%, $white 50%, $background-cream 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 20% 30%, rgba($purple-primary, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba($purple-primary, 0.06) 0%, transparent 40%),
      radial-gradient(circle at 40% 80%, rgba($purple-primary, 0.04) 0%, transparent 40%);
    animation: float 25s ease-in-out infinite;
    pointer-events: none;
  }

  &__container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 1;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: 8rem;
    position: relative;
  }

  &__header-content {
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, rgba($purple-primary, 0.1), rgba($purple-primary, 0.05));
    color: $purple-primary;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 2rem;
    border: 2px solid rgba($purple-primary, 0.2);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba($purple-primary, 0.1);
  }

  &__title {
    font-size: 3.2rem;
    font-weight: 800;
    color: $text-dark;
    margin-bottom: 2rem;
    letter-spacing: -1px;
    line-height: 1.1;

    @media (min-width: 768px) {
      font-size: 4.5rem;
    }

    @media (min-width: 1024px) {
      font-size: 5.2rem;
    }
  }

  &__title-line {
    display: block;
    color: $text-light;
    font-weight: 400;
  }

  &__title-accent {
    display: block;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 6px;
      background: linear-gradient(90deg, $purple-primary, transparent);
      border-radius: 3px;
      opacity: 0.3;
    }
  }

  &__subtitle {
    font-size: 1.3rem;
    color: $text-light;
    line-height: 1.8;
    max-width: 800px;
    margin: 0 auto;

    @media (min-width: 768px) {
      font-size: 1.4rem;
    }
  }

  &__decorative-elements {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, auto);
      gap: 2.5rem;

      // Layout de collage específico
      .category-card--hero {
        grid-column: 1 / 3;
        grid-row: 1 / 3;
      }

      .category-card[data-category="galletas"] {
        grid-column: 3;
        grid-row: 1;
      }

      .category-card[data-category="postres"] {
        grid-column: 4;
        grid-row: 1;
      }

      .category-card[data-category="bolleria"] {
        grid-column: 3 / 5;
        grid-row: 2;
      }
    }

    @media (min-width: 1024px) {
      gap: 3rem;
    }

    @media (max-width: 1200px) and (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
      
      .category-card--hero {
        grid-column: 1 / 3;
        grid-row: 1;
      }

      .category-card[data-category="galletas"] {
        grid-column: 3;
        grid-row: 1;
      }

      .category-card[data-category="postres"] {
        grid-column: 1;
        grid-row: 2;
      }

      .category-card[data-category="bolleria"] {
        grid-column: 2 / 4;
        grid-row: 2;
      }
    }
  }

  &__cta {
    margin-top: 8rem;
    text-align: center;
  }

  &__cta-content {
    background: linear-gradient(135deg, rgba($white, 0.9), rgba($background-cream, 0.9));
    backdrop-filter: blur(20px);
    border: 1px solid rgba($purple-primary, 0.1);
    border-radius: 30px;
    padding: 4rem 2rem;
    max-width: 600px;
    margin: 0 auto;
    box-shadow: 0 20px 60px rgba($purple-primary, 0.1);
  }

  &__cta-title {
    font-size: 2rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      font-size: 2.4rem;
    }
  }

  &__cta-text {
    font-size: 1.1rem;
    color: $text-light;
    margin-bottom: 2.5rem;
    line-height: 1.6;
  }

  &__cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    color: $white;
    padding: 1.2rem 2.5rem;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 30px rgba($purple-primary, 0.3);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba($purple-primary, 0.4);
    }

    i {
      transition: transform 0.3s ease;
    }

    &:hover i {
      transform: translateX(5px);
    }
  }
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba($purple-primary, 0.1), rgba($purple-primary, 0.05));
  animation: floatSlow 15s ease-in-out infinite;

  &--1 {
    width: 120px;
    height: 120px;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  &--2 {
    width: 80px;
    height: 80px;
    top: 20%;
    right: 15%;
    animation-delay: 5s;
  }

  &--3 {
    width: 60px;
    height: 60px;
    bottom: 30%;
    left: 20%;
    animation-delay: 10s;
  }
}

.category-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba($white, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba($purple-primary, 0.1);
  box-shadow: 0 8px 32px rgba($purple-primary, 0.08);

  &--hero {
    @media (min-width: 768px) {
      grid-column: span 2;
      min-height: 500px;
    }

    @media (min-width: 1024px) {
      min-height: 550px;
    }
  }

  &--secondary {
    min-height: 350px;

    @media (min-width: 768px) {
      min-height: 400px;
    }
  }

  &--wide {
    @media (min-width: 768px) {
      grid-column: span 3;
      min-height: 300px;
    }

    @media (min-width: 1024px) {
      min-height: 320px;
    }
  }

  &--featured {
    background: linear-gradient(135deg, rgba($white, 0.95), rgba($background-cream, 0.9));
    border: 2px solid rgba($purple-primary, 0.15);
    box-shadow: 0 12px 40px rgba($purple-primary, 0.12);

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 60px rgba($purple-primary, 0.2);
    }

    .category-card__features {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;

      .feature {
        background: linear-gradient(135deg, rgba($purple-primary, 0.1), rgba($purple-primary, 0.05));
        color: $purple-primary;
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        border: 1px solid rgba($purple-primary, 0.2);
      }
    }
  }

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 30%, rgba($purple-primary, 0.1) 0%, transparent 60%),
      radial-gradient(circle at 70% 70%, rgba($purple-primary, 0.05) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  &__gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba($purple-primary, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  &__content {
    position: relative;
    z-index: 2;
    padding: 2.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (min-width: 1024px) {
      padding: 3rem;
    }

    .category-card--hero & {
      justify-content: center;
      text-align: center;

      @media (min-width: 768px) {
        text-align: left;
        justify-content: flex-end;
      }
    }
  }

  &__icon-wrapper {
    position: relative;
    width: fit-content;
    margin-bottom: 2rem;

    .category-card--hero & {
      margin: 0 auto 2rem;

      @media (min-width: 768px) {
        margin: 0 0 2rem 0;
      }
    }
  }

  &__icon-bg {
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(135deg, rgba($purple-primary, 0.1), rgba($purple-primary, 0.05));
    border-radius: 50%;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__icon {
    position: relative;
    z-index: 2;
    width: 80px;
    height: 80px;
    background: rgba($white, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.2rem;
    color: $purple-primary;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 25px rgba($purple-primary, 0.15);

    .category-card--hero & {
      width: 100px;
      height: 100px;
      font-size: 2.8rem;
    }
  }

  &__icon-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba($purple-primary, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.6s ease;

    .category-card--hero & {
      width: 140px;
      height: 140px;
    }
  }

  &__text {
    flex: 1;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    color: $white;
    padding: 0.6rem 1.2rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 15px rgba($purple-primary, 0.3);
    width: fit-content;

    &--new {
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    }

    &--fresh {
      background: linear-gradient(135deg, #00d2d3, #54a0ff);
    }

    i {
      font-size: 0.9rem;
    }
  }

  &__title {
    font-size: 1.8rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1rem;
    line-height: 1.2;

    .category-card--hero & {
      font-size: 2.4rem;
      margin-bottom: 1.5rem;

      @media (min-width: 1024px) {
        font-size: 2.8rem;
      }
    }
  }

  &__description {
    font-size: 1.1rem;
    color: $text-light;
    line-height: 1.6;
    margin-bottom: 1.5rem;

    .category-card--hero & {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }
  }

  &__stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  &__count {
    font-size: 0.9rem;
    color: $purple-primary;
    font-weight: 600;
    background: rgba($purple-primary, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 15px;
    width: fit-content;
  }

  &__features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-bottom: 1.5rem;

    .feature {
      font-size: 0.85rem;
      color: $purple-primary;
      background: rgba($purple-primary, 0.1);
      padding: 0.4rem 0.8rem;
      border-radius: 12px;
      font-weight: 500;
    }
  }

  &__action {
    margin-top: auto;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    color: $white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 6px 20px rgba($purple-primary, 0.3);

    &--compact {
      width: 50px;
      height: 50px;
      padding: 0;
      border-radius: 50%;
      justify-content: center;

      i {
        font-size: 1.2rem;
      }
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba($purple-primary, 0.4);
    }

    i {
      transition: transform 0.3s ease;
    }

    &:hover i {
      transform: translateX(3px);
    }
  }

  &__particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 60px rgba($purple-primary, 0.2);

    .category-card__image-overlay,
    .category-card__gradient {
      opacity: 1;
    }

    .category-card__icon {
      transform: scale(1.1);
      color: $white;
      background: linear-gradient(135deg, $purple-primary, $purple-dark);
    }

    .category-card__icon-bg {
      transform: scale(1.2);
      background: linear-gradient(135deg, rgba($purple-primary, 0.2), rgba($purple-primary, 0.1));
    }

    .category-card__icon-glow {
      opacity: 1;
    }

    .category-card__particles {
      opacity: 1;
    }
  }
}

.stat {
  text-align: center;

  &__number {
    display: block;
    font-size: 1.8rem;
    font-weight: 700;
    color: $purple-primary;
    line-height: 1;
  }

  &__label {
    font-size: 0.9rem;
    color: $text-light;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 0.3rem;
  }
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: $purple-primary;
  border-radius: 50%;
  animation: particleFloat 3s ease-in-out infinite;

  &--1 {
    top: 20%;
    left: 20%;
    animation-delay: 0s;
  }

  &--2 {
    top: 60%;
    right: 30%;
    animation-delay: 1s;
  }

  &--3 {
    bottom: 30%;
    left: 60%;
    animation-delay: 2s;
  }
}

@keyframes floatSlow {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0px);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-15px);
    opacity: 1;
  }
}

// Best Sellers Section
.best-sellers {
  padding: 8rem 0;
  background: linear-gradient(135deg, $white 0%, $background-cream 50%, $white 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background:
      radial-gradient(circle at 25% 25%, rgba($purple-primary, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba($purple-primary, 0.03) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
    pointer-events: none;
  }

  &__container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 1;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: 6rem;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    color: $white;
    padding: 0.8rem 1.5rem;
    border-radius: 30px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2rem;
    box-shadow: 0 8px 25px rgba($purple-primary, 0.3);

    i {
      font-size: 1rem;
    }
  }

  &__title {
    font-size: 3rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1.5rem;
    letter-spacing: 2px;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 3.8rem;
    }
  }

  &__subtitle {
    font-size: 1.2rem;
    color: $text-light;
    line-height: 1.7;
    max-width: 700px;
    margin: 0 auto;

    @media (min-width: 768px) {
      font-size: 1.3rem;
    }
  }

  &__carousel {
    position: relative;
  }
}

.carousel-navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 3;
  pointer-events: none;

  @media (max-width: 767px) {
    display: none;
  }
}

.carousel-nav {
  width: 60px;
  height: 60px;
  background: rgba($white, 0.95);
  border: 2px solid rgba($purple-primary, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  // Removed transition - using GSAP for animations
  backdrop-filter: blur(10px);
  pointer-events: all;
  box-shadow: 0 8px 25px rgba($purple-primary, 0.15);

  i {
    font-size: 1.2rem;
    color: $purple-primary;
    // Removed transition - using GSAP for animations
  }

  &:hover {
    background: $purple-primary;
    border-color: $purple-primary;
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba($purple-primary, 0.3);

    i {
      color: $white;
      transform: scale(1.1);
    }
  }

  &--prev {
    margin-left: -30px;
  }

  &--next {
    margin-right: -30px;
  }
}

.carousel-container {
  overflow: hidden;
  border-radius: 20px;
  margin: 0 2rem;

  @media (max-width: 767px) {
    margin: 0;
  }
}

.carousel-track {
  display: flex;
  // Removed transition - using GSAP for animations
}

.product-showcase {
  min-width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  padding: 3rem;
  background: linear-gradient(135deg, $white 0%, rgba($background-cream, 0.5) 100%);
  border-radius: 20px;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1.5fr;
    gap: 4rem;
    padding: 4rem;
  }

  @media (min-width: 1024px) {
    gap: 5rem;
    padding: 5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, rgba($purple-primary, 0.05), transparent);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }

  &__visual {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 2;
  }

  &__image {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    color: $white;
    margin-bottom: 2rem;
    position: relative;
    box-shadow: 0 20px 60px rgba($purple-primary, 0.3);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

    @media (min-width: 768px) {
      width: 250px;
      height: 250px;
      font-size: 5rem;
    }

    &::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: linear-gradient(135deg, rgba($purple-primary, 0.2), rgba($purple-dark, 0.2));
      border-radius: 50%;
      z-index: -1;
      opacity: 0;
      transition: all 0.6s ease;
    }
  }

  &__rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .rating-stars {
    display: flex;
    gap: 0.3rem;

    i {
      color: #ffd700;
      font-size: 1.2rem;
    }
  }

  .rating-count {
    font-size: 0.9rem;
    color: $text-light;
    font-weight: 500;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
  }

  &__category {
    font-size: 0.9rem;
    color: $purple-primary;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 2.2rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1.5rem;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 2.8rem;
    }
  }

  &__description {
    font-size: 1.1rem;
    color: $text-light;
    line-height: 1.7;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      font-size: 1.2rem;
    }
  }

  &__features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-bottom: 2.5rem;
  }

  .feature-tag {
    background: rgba($purple-primary, 0.1);
    color: $purple-primary;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid rgba($purple-primary, 0.2);
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    @media (max-width: 767px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__price {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    @media (max-width: 767px) {
      align-items: center;
    }

    .price-label {
      font-size: 0.9rem;
      color: $text-light;
      font-weight: 500;
      margin-bottom: 0.3rem;
    }

    .price-amount {
      font-size: 2rem;
      font-weight: 700;
      color: $purple-primary;
    }
  }

  &__cta {
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    color: $white;
    border: none;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    // Removed transition - using GSAP for animations
    box-shadow: 0 8px 25px rgba($purple-primary, 0.3);
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
      // Removed transition - using GSAP for animations
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba($purple-primary, 0.4);

      &::before {
        left: 100%;
      }

      i {
        transform: translateX(5px);
      }
    }

    i {
      // Removed transition - using GSAP for animations
    }
  }

  &:hover {
    .product-showcase__image {
      transform: scale(1.05) rotate(5deg);

      &::before {
        opacity: 1;
      }
    }
  }
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba($purple-primary, 0.3);
  background: transparent;
  cursor: pointer;
  // Removed transition - using GSAP for animations

  &.active,
  &:hover {
    background: $purple-primary;
    border-color: $purple-primary;
    transform: scale(1.2);
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

// Testimonials Section
// Testimonials Section
.testimonials {
  position: relative;
  padding: 8rem 0;
  background: linear-gradient(135deg,
      rgba($purple-primary, 0.03) 0%,
      rgba($background-cream, 0.8) 50%,
      rgba($purple-primary, 0.05) 100%);
  overflow: hidden;

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &__parallax-layer {
    position: absolute;
    width: 100%;
    height: 120%;
    opacity: 0.1;

    &--1 {
      background: radial-gradient(circle at 20% 30%, $purple-primary 2px, transparent 2px);
      background-size: 60px 60px;
      animation: parallaxFloat1 20s ease-in-out infinite;
    }

    &--2 {
      background: radial-gradient(circle at 80% 70%, $purple-light 1px, transparent 1px);
      background-size: 40px 40px;
      animation: parallaxFloat2 25s ease-in-out infinite reverse;
    }

    &--3 {
      background: radial-gradient(circle at 50% 50%, rgba($purple-primary, 0.3) 1px, transparent 1px);
      background-size: 80px 80px;
      animation: parallaxFloat3 30s ease-in-out infinite;
    }
  }

  &__container {
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    z-index: 2;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: 5rem;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, $purple-primary, $purple-light);
    color: $white;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 15px rgba($purple-primary, 0.3);

    i {
      font-size: 1rem;
    }
  }

  &__title {
    font-size: 2.8rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1.5rem;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 3.5rem;
    }
  }

  &__subtitle {
    font-size: 1.2rem;
    color: $text-light;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }

  &__masonry {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }
  }

  &__cta {
    text-align: center;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, rgba($white, 0.9), rgba($purple-primary, 0.05));
    border-radius: 24px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba($purple-primary, 0.1);
  }

  &__cta-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1rem;
  }

  &__cta-text {
    font-size: 1.1rem;
    color: $text-light;
    margin-bottom: 2rem;
  }

  &__cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    color: $white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba($purple-primary, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($purple-primary, 0.4);
    }

    i {
      // Removed transition - using GSAP for animations
    }

    &:hover i {
      transform: translateX(4px);
    }
  }
}

.testimonial-story {
  background: $white;
  border-radius: 20px;
  overflow: hidden;
  // Removed transition - using GSAP for animations
  border: 1px solid rgba($purple-primary, 0.08);
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba($purple-primary, 0.15);
    border-color: rgba($purple-primary, 0.2);
  }

  &--featured {
    grid-row: span 2;

    @media (min-width: 1024px) {
      grid-column: span 2;
    }
  }

  &--visual {
    .testimonial-story__image {
      height: 120px;
      background: linear-gradient(135deg, $purple-light, $purple-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      i {
        font-size: 3rem;
        color: $white;
        opacity: 0.8;
      }

      .testimonial-story__overlay {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba($white, 0.9);
        padding: 0.5rem;
        border-radius: 8px;
      }
    }
  }

  &--quote {
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    color: $white;

    .testimonial-story__large-quote {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 3rem;
      opacity: 0.3;
    }

    .testimonial-story__text {
      color: $white;
      font-size: 1.1rem;
    }

    .testimonial-story__name {
      color: $white;
    }

    .testimonial-story__role {
      color: rgba($white, 0.8);
    }
  }

  &--stats {
    .testimonial-story__stat {
      text-align: center;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: linear-gradient(135deg, rgba($purple-primary, 0.05), rgba($purple-light, 0.1));
      border-radius: 12px;

      .stat-number {
        display: block;
        font-size: 2.5rem;
        font-weight: 700;
        color: $purple-primary;
        line-height: 1;
      }

      .stat-label {
        font-size: 0.9rem;
        color: $text-light;
        margin-bottom: 0.5rem;
        display: block;
      }
    }
  }

  &--minimal {
    padding: 1.5rem;

    .testimonial-story__text {
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }

    .testimonial-story__author {
      .testimonial-story__avatar {
        width: 40px;
        height: 40px;
      }

      .testimonial-story__name {
        font-size: 0.9rem;
      }

      .testimonial-story__role {
        font-size: 0.8rem;
      }
    }
  }

  &__quote {
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-size: 2rem;
    color: $purple-primary;
    opacity: 0.3;
  }

  &__content {
    padding: 2rem;
    flex: 1;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;

    .rating-stars {
      display: flex;
      gap: 0.25rem;

      i {
        color: #ffd700;
        font-size: 0.9rem;
      }
    }

    .rating-label {
      font-size: 0.8rem;
      color: $text-light;
      font-weight: 600;
    }
  }

  &__text {
    font-size: 1rem;
    line-height: 1.6;
    color: $text-light;
    margin-bottom: 1.5rem;
    font-style: italic;
  }

  &__details {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;

    .detail-tag {
      background: rgba($purple-primary, 0.1);
      color: $purple-primary;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0 2rem 2rem;
  }

  &__avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid $purple-primary;
    transition: all 0.3s ease;
    flex-shrink: 0;

    &:hover {
      transform: scale(1.05);
      border-color: $purple-dark;
    }
  }

  &__info {
    flex: 1;
  }

  &__name {
    font-size: 1rem;
    font-weight: 600;
    color: $purple-primary;
    margin-bottom: 0.25rem;
  }

  &__role {
    font-size: 0.9rem;
    color: $text-light;
    margin-bottom: 0.25rem;
  }

  &__location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: $text-light;
    opacity: 0.8;

    i {
      font-size: 0.7rem;
    }
  }

  &__verified {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba($purple-primary, 0.1);
    color: $purple-primary;
    padding: 0.5rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;

    i {
      font-size: 0.9rem;
    }
  }
}

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