<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
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
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
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
</template>

<style lang="scss" scoped>
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
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

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
    transition: left 0.6s ease;
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
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

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
</style>