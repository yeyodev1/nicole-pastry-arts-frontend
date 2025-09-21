<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Referencias reactivas
const featuresSection = ref<HTMLElement>()
const isVisible = ref(false)

// Intersection Observer para detectar cuando la sección es visible
let observer: IntersectionObserver | null = null

// Detectar si es dispositivo móvil
const isMobile = () => {
  return window.innerWidth <= 768 || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

onMounted(() => {
  if (featuresSection.value) {
    // Configuración optimizada para móvil vs desktop
    const mobileConfig = {
      threshold: [0.1, 0.2, 0.3], // Múltiples thresholds para mejor detección
      rootMargin: '0px 0px -20px 0px' // Menos margen en móvil
    }
    
    const desktopConfig = {
      threshold: 0.3,
      rootMargin: '-50px 0px'
    }
    
    const config = isMobile() ? mobileConfig : desktopConfig
    
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // En móvil, activar con menor threshold
          const activationThreshold = isMobile() ? 0.1 : 0.3
          
          if (entry.isIntersecting && entry.intersectionRatio >= activationThreshold) {
            isVisible.value = true
            // Una vez que se activa, ya no necesitamos observar más
            observer?.disconnect()
          }
        })
      },
      config
    )
    
    observer.observe(featuresSection.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <!-- Features Section -->
  <section ref="featuresSection" class="features" :class="{ 'features--visible': isVisible }">
    <div class="features__container">
      <div class="features__header">
        <h2 class="features__title">¿Por qué elegir Nicole Pastry Arts?</h2>
        <p class="features__subtitle">Tres pilares fundamentales que nos distinguen en el mundo de la pastelería artesanal</p>
      </div>
      <div class="features__showcase">
        <div class="feature-highlight feature-highlight--animate-1">
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
        <div class="feature-highlight feature-highlight--reverse feature-highlight--animate-2">
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
        <div class="feature-highlight feature-highlight--animate-3">
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
  padding: 4rem 0;
  background: linear-gradient(135deg, $white 0%, $background-cream 50%, $white 100%);
  position: relative;
  overflow: hidden;
  
  // Optimizaciones de rendimiento para móvil
  transform: translateZ(0);
  will-change: auto;
  contain: layout style paint;

  @media (min-width: 768px) {
    padding: 6rem 0;
  }

  @media (min-width: 1024px) {
    padding: 8rem 0;
  }

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
    margin-bottom: 3rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: 768px) {
      margin-bottom: 4rem;
    }

    @media (min-width: 1024px) {
      margin-bottom: 5rem;
    }
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1rem;
    line-height: 1.2;
    opacity: 0;
    transform: translateY(30px);

    @media (min-width: 480px) {
      font-size: 2.4rem;
      margin-bottom: 1.2rem;
    }

    @media (min-width: 768px) {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      transform: translateY(40px);
    }

    @media (min-width: 1024px) {
      font-size: 3.5rem;
    }
  }

  &__subtitle {
    font-size: 1rem;
    color: $text-light;
    line-height: 1.5;
    font-weight: 400;
    opacity: 0;
    transform: translateY(20px);

    @media (min-width: 480px) {
      font-size: 1.1rem;
      line-height: 1.6;
    }

    @media (min-width: 768px) {
      font-size: 1.2rem;
      transform: translateY(30px);
    }

    @media (min-width: 1024px) {
      font-size: 1.3rem;
    }
  }

  // Animaciones que se activan cuando la sección es visible
  &--visible {
    .features__title {
      animation: fadeInUp 1.2s ease-out 0.2s forwards;
    }

    .features__subtitle {
      animation: fadeInUp 1s ease-out 0.6s forwards;
    }
  }

  &__showcase {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media (min-width: 768px) {
      gap: 3rem;
    }

    @media (min-width: 1024px) {
      gap: 4rem;
    }

    @media (min-width: 1200px) {
      gap: 6rem;
    }
  }
}

.feature-highlight {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: center;
  padding: 2rem 1.5rem;
  background: rgba($white, 0.9);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba($purple-primary, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(40px) scale(0.98);
  
  // Optimizaciones de rendimiento para móvil
  transform: translateZ(0) translateY(40px) scale(0.98);
  will-change: transform, opacity, box-shadow;
  backface-visibility: hidden;
  perspective: 1000px;

  @media (min-width: 480px) {
    padding: 2.5rem 2rem;
    gap: 2rem;
    border-radius: 20px;
    transform: translateY(50px) scale(0.96);
  }

  @media (min-width: 768px) {
    padding: 3rem 2.5rem;
    gap: 2.5rem;
    border-radius: 24px;
    transform: translateY(60px) scale(0.95);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 2fr;
    gap: 3rem;
    padding: 3.5rem 3rem;
  }

  @media (min-width: 1200px) {
    gap: 4rem;
    padding: 4rem 3rem;
  }

  // Animaciones escalonadas optimizadas para móvil y desktop
  .features--visible & {
    &--animate-1 {
      animation: featureSlideIn 0.8s ease-out 0.6s forwards;

      @media (min-width: 768px) {
        animation: featureSlideIn 1s ease-out 0.8s forwards;
      }

      @media (min-width: 1024px) {
        animation: featureSlideIn 1.2s ease-out 1s forwards;
      }
    }

    &--animate-2 {
      animation: featureSlideIn 0.8s ease-out 0.9s forwards;

      @media (min-width: 768px) {
        animation: featureSlideIn 1s ease-out 1.1s forwards;
      }

      @media (min-width: 1024px) {
        animation: featureSlideIn 1.2s ease-out 1.4s forwards;
      }
    }

    &--animate-3 {
      animation: featureSlideIn 0.8s ease-out 1.2s forwards;

      @media (min-width: 768px) {
        animation: featureSlideIn 1s ease-out 1.4s forwards;
      }

      @media (min-width: 1024px) {
        animation: featureSlideIn 1.2s ease-out 1.8s forwards;
      }
    }
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

  // Efectos hover optimizados para móvil y desktop
  @media (hover: hover) and (pointer: fine) {
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
  }

  // Efectos touch para móvil
  @media (hover: none) and (pointer: coarse) {
    &:active {
      transform: translateY(-4px) scale(0.98);
      box-shadow: 0 10px 30px rgba($purple-primary, 0.12);
      border-color: rgba($purple-primary, 0.15);
      transition: all 0.2s ease-out;

      .feature-highlight__icon-wrapper {
        transform: scale(1.05) rotate(2deg);
      }

      .feature-highlight__decoration {
        transform: scale(1.1) rotate(90deg);
      }
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
    min-height: 140px;

    @media (min-width: 480px) {
      min-height: 160px;
    }

    @media (min-width: 768px) {
      min-height: 180px;
    }

    @media (min-width: 1024px) {
      min-height: 200px;
    }

    @media (min-width: 1200px) {
      min-height: 250px;
    }
  }

  &__icon-wrapper {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: $white;
    position: relative;
    z-index: 2;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 6px 20px rgba($purple-primary, 0.3);
    opacity: 0;
    transform: scale(0.6) rotate(-90deg);
    
    // Optimizaciones de rendimiento para móvil
    transform: translateZ(0) scale(0.6) rotate(-90deg);
    will-change: transform, opacity;
    backface-visibility: hidden;

    @media (min-width: 480px) {
      width: 100px;
      height: 100px;
      font-size: 2.5rem;
      box-shadow: 0 8px 25px rgba($purple-primary, 0.3);
      transform: scale(0.5) rotate(-120deg);
    }

    @media (min-width: 768px) {
      width: 120px;
      height: 120px;
      font-size: 3rem;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 10px 30px rgba($purple-primary, 0.3);
      transform: scale(0.5) rotate(-180deg);
    }

    @media (min-width: 1024px) {
      width: 130px;
      height: 130px;
      font-size: 3.2rem;
    }

    @media (min-width: 1200px) {
      width: 140px;
      height: 140px;
      font-size: 3.5rem;
    }

    &::before {
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      background: linear-gradient(135deg, $purple-light, $purple-primary);
      border-radius: 50%;
      z-index: -1;
      opacity: 0.3;

      @media (min-width: 768px) {
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
      }
    }
  }

  &__decoration {
    position: absolute;
    width: 140px;
    height: 140px;
    border: 1px solid rgba($purple-primary, 0.2);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    
    // Optimizaciones de rendimiento para móvil
    transform: translateZ(0) translate(-50%, -50%) scale(0);
    will-change: transform, opacity;
    backface-visibility: hidden;

    @media (min-width: 480px) {
      width: 160px;
      height: 160px;
      border-width: 1.5px;
    }

    @media (min-width: 768px) {
      width: 180px;
      height: 180px;
      border-width: 2px;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (min-width: 1024px) {
      width: 200px;
      height: 200px;
    }

    &::before {
      content: '';
      position: absolute;
      top: -15px;
      left: -15px;
      right: -15px;
      bottom: -15px;
      border: 1px solid rgba($purple-primary, 0.1);
      border-radius: 50%;

      @media (min-width: 768px) {
        top: -20px;
        left: -20px;
        right: -20px;
        bottom: -20px;
      }
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
    font-size: 0.85rem;
    font-weight: 700;
    color: $purple-primary;
    background: rgba($purple-primary, 0.1);
    padding: 0.4rem 0.8rem;
    border-radius: 16px;
    margin-bottom: 0.8rem;
    letter-spacing: 0.5px;
    opacity: 0;
    transform: translateX(-20px);

    @media (min-width: 480px) {
      font-size: 0.9rem;
      padding: 0.45rem 0.9rem;
      border-radius: 18px;
      margin-bottom: 0.9rem;
      letter-spacing: 0.8px;
      transform: translateX(-25px);
    }

    @media (min-width: 768px) {
      font-size: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      margin-bottom: 1rem;
      letter-spacing: 1px;
      transform: translateX(-30px);
    }
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $purple-primary;
    margin-bottom: 1rem;
    line-height: 1.2;
    opacity: 0;
    transform: translateY(15px);

    @media (min-width: 480px) {
      font-size: 1.7rem;
      margin-bottom: 1.2rem;
      transform: translateY(18px);
    }

    @media (min-width: 768px) {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      transform: translateY(20px);
    }

    @media (min-width: 1024px) {
      font-size: 2.1rem;
    }

    @media (min-width: 1200px) {
      font-size: 2.2rem;
    }
  }

  &__description {
    font-size: 0.95rem;
    color: $text-light;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    opacity: 0;
    transform: translateY(15px);

    @media (min-width: 480px) {
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 1.7rem;
      transform: translateY(18px);
    }

    @media (min-width: 768px) {
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 2rem;
      transform: translateY(20px);
    }

    @media (min-width: 1024px) {
      font-size: 1.12rem;
    }

    @media (min-width: 1200px) {
      font-size: 1.15rem;
    }
  }

  &__badge {
    display: inline-block;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    color: $white;
    padding: 0.6rem 1.2rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    box-shadow: 0 3px 12px rgba($purple-primary, 0.3);
    opacity: 0;
    transform: translateY(15px) scale(0.95);

    @media (min-width: 480px) {
      padding: 0.65rem 1.3rem;
      border-radius: 22px;
      font-size: 0.85rem;
      letter-spacing: 0.4px;
      box-shadow: 0 3px 13px rgba($purple-primary, 0.3);
      transform: translateY(18px) scale(0.92);
    }

    @media (min-width: 768px) {
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 15px rgba($purple-primary, 0.3);
      transform: translateY(20px) scale(0.9);
    }
  }

  // Animaciones internas optimizadas para móvil y desktop
  .features--visible & {
    &--animate-1,
    &--animate-2,
    &--animate-3 {
      .feature-highlight__icon-wrapper {
        animation: iconSpinIn 0.6s ease-out 0.2s forwards;

        @media (min-width: 768px) {
          animation: iconSpinIn 0.8s ease-out 0.25s forwards;
        }

        @media (min-width: 1024px) {
          animation: iconSpinIn 1s ease-out 0.3s forwards;
        }
      }

      .feature-highlight__decoration {
        animation: decorationGrow 0.8s ease-out 0.3s forwards;

        @media (min-width: 768px) {
          animation: decorationGrow 1s ease-out 0.4s forwards;
        }

        @media (min-width: 1024px) {
          animation: decorationGrow 1.2s ease-out 0.5s forwards;
        }
      }

      .feature-highlight__number {
        animation: slideInLeft 0.5s ease-out 0.4s forwards;

        @media (min-width: 768px) {
          animation: slideInLeft 0.6s ease-out 0.5s forwards;
        }

        @media (min-width: 1024px) {
          animation: slideInLeft 0.8s ease-out 0.7s forwards;
        }
      }

      .feature-highlight__title {
        animation: fadeInUp 0.5s ease-out 0.5s forwards;

        @media (min-width: 768px) {
          animation: fadeInUp 0.6s ease-out 0.6s forwards;
        }

        @media (min-width: 1024px) {
          animation: fadeInUp 0.8s ease-out 0.9s forwards;
        }
      }

      .feature-highlight__description {
        animation: fadeInUp 0.5s ease-out 0.6s forwards;

        @media (min-width: 768px) {
          animation: fadeInUp 0.6s ease-out 0.7s forwards;
        }

        @media (min-width: 1024px) {
          animation: fadeInUp 0.8s ease-out 1.1s forwards;
        }
      }

      .feature-highlight__badge {
        animation: badgePopIn 0.4s ease-out 0.7s forwards;

        @media (min-width: 768px) {
          animation: badgePopIn 0.5s ease-out 0.8s forwards;
        }

        @media (min-width: 1024px) {
          animation: badgePopIn 0.6s ease-out 1.3s forwards;
        }
      }
    }
  }
}

// Keyframes para las animaciones
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes featureSlideIn {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes iconSpinIn {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-180deg);
  }
  70% {
    transform: scale(1.1) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes decorationGrow {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(360deg);
  }
}

@keyframes slideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes badgePopIn {
   0% {
     opacity: 0;
     transform: translateY(20px) scale(0.9);
   }
   50% {
     transform: translateY(-5px) scale(1.05);
   }
   100% {
     opacity: 1;
     transform: translateY(0) scale(1);
   }
 }
</style>