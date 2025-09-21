<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Estado reactivo para controlar las animaciones
const isVisible = ref(false)
const chefSection = ref<HTMLElement>()

onMounted(() => {
  // Activar animaciones después de un breve delay
  setTimeout(() => {
    isVisible.value = true
  }, 300)

  // Intersection Observer para animaciones de scroll
  if (chefSection.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('chef--animate')
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(chefSection.value)
  }
})
</script>

<template>
  <section ref="chefSection" class="chef" :class="{ 'chef--visible': isVisible }">
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
// ===== CHEF SECTION - PROFESSIONAL CINEMATIC ANIMATIONS =====
.chef {
  padding: 8rem 0;
  background: 
    radial-gradient(ellipse at top left, rgba($purple-primary, 0.9) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba($purple-dark, 0.8) 0%, transparent 50%),
    linear-gradient(135deg, $purple-primary 0%, $purple-dark 100%);
  color: $white;
  position: relative;
  overflow: hidden;
  perspective: 2000px;
  transform-style: preserve-3d;

  // ===== ANIMATED BACKGROUND LAYERS =====
  &::before {
    content: '';
    position: absolute;
    top: -100%;
    left: -100%;
    width: 300%;
    height: 300%;
    background: 
      radial-gradient(circle at 20% 80%, rgba($white, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 80% 20%, rgba($purple-light, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba($white, 0.08) 0%, transparent 60%);
    animation: cosmicFloat 25s ease-in-out infinite;
    transform-origin: center center;
    will-change: transform;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      linear-gradient(45deg, transparent 30%, rgba($purple-light, 0.1) 50%, transparent 70%),
      linear-gradient(-45deg, transparent 30%, rgba($white, 0.05) 50%, transparent 70%);
    animation: shimmerWave 15s ease-in-out infinite;
    pointer-events: none;
  }

  // ===== PARALLAX PARTICLES =====
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 10;
    perspective: 1500px;
    transform-style: preserve-3d;

    &::before,
    &::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, rgba($white, 0.6) 0%, transparent 70%);
      animation: floatingParticles 20s linear infinite;
      pointer-events: none;
    }

    &::before {
      width: 4px;
      height: 4px;
      top: 20%;
      left: 10%;
      animation-delay: -5s;
    }

    &::after {
      width: 6px;
      height: 6px;
      top: 60%;
      right: 15%;
      animation-delay: -12s;
    }

    @media (min-width: 768px) {
      padding: 0 2rem;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }

  // ===== MAIN CONTENT GRID =====
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
    align-items: center;
    position: relative;
    transform-style: preserve-3d;

    @media (min-width: 1024px) {
      grid-template-columns: 2fr 1fr;
      gap: 6rem;
    }
  }

  // ===== TEXT SECTION =====
  &__text {
    position: relative;
    z-index: 5;
  }

  // ===== CINEMATIC TITLE =====
  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    background: 
      linear-gradient(135deg, $white 0%, rgba($white, 0.9) 50%, $white 100%),
      linear-gradient(45deg, transparent 30%, rgba($purple-light, 0.3) 50%, transparent 70%);
    background-size: 200% 200%, 100% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    transform: translateY(50px) rotateX(15deg);
    opacity: 0;
    transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1);
    animation: titleGlow 3s ease-in-out infinite alternate;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba($white, 0.4), transparent);
      transform: translateX(-100%);
      transition: transform 0.8s ease-out;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -15px;
      left: 0;
      width: 0;
      height: 4px;
      background: linear-gradient(90deg, $white, $purple-light, $white);
      border-radius: 2px;
      transition: width 1.5s cubic-bezier(0.23, 1, 0.32, 1) 0.5s;
      box-shadow: 0 0 20px rgba($white, 0.5);
    }

    @media (min-width: 768px) {
      font-size: 3.5rem;
      letter-spacing: 6px;
    }
  }

  // ===== SOPHISTICATED QUOTE =====
  &__quote {
    font-size: 1.2rem;
    line-height: 1.8;
    font-style: italic;
    margin-bottom: 2.5rem;
    padding: 2.5rem;
    border-left: 4px solid transparent;
    background: 
      linear-gradient(135deg, rgba($white, 0.08) 0%, rgba($white, 0.03) 100%),
      linear-gradient(90deg, $white, transparent);
    background-size: 100% 100%, 4px 100%;
    background-repeat: no-repeat;
    background-position: 0 0, 0 0;
    border-radius: 0 20px 20px 0;
    backdrop-filter: blur(20px);
    position: relative;
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba($white, 0.1),
      inset 0 -1px 0 rgba($white, 0.05);
    transform: translateX(-50px) rotateY(-10deg);
    opacity: 0;
    transition: all 1.4s cubic-bezier(0.23, 1, 0.32, 1) 0.3s;
    overflow: hidden;

    &::before {
      content: '"';
      position: absolute;
      top: -15px;
      left: 20px;
      font-size: 5rem;
      font-weight: 700;
      opacity: 0.2;
      line-height: 1;
      background: linear-gradient(135deg, $white, $purple-light);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: quoteFloat 4s ease-in-out infinite;
    }

    &::after {
      content: '"';
      position: absolute;
      bottom: -25px;
      right: 20px;
      font-size: 5rem;
      font-weight: 700;
      opacity: 0.2;
      line-height: 1;
      background: linear-gradient(135deg, $white, $purple-light);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: quoteFloat 4s ease-in-out infinite reverse;
    }

    @media (min-width: 768px) {
      font-size: 1.3rem;
      padding: 3rem;
    }
  }

  // ===== CHEF INFO =====
  &__info {
    text-align: left;
    transform: translateY(30px);
    opacity: 0;
    transition: all 1s cubic-bezier(0.23, 1, 0.32, 1) 0.8s;

    @media (max-width: 1023px) {
      text-align: center;
    }
  }

  &__name {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, $white 0%, rgba($white, 0.8) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, $purple-light, transparent);
      transition: width 0.8s ease-out 1.2s;

      @media (min-width: 1024px) {
        left: 0;
        transform: none;
      }
    }
  }

  &__role {
    font-size: 1.1rem;
    opacity: 0.9;
    font-weight: 300;
    letter-spacing: 1px;
  }

  // ===== 3D IMAGE SECTION =====
  &__image {
    text-align: center;
    position: relative;
    perspective: 1000px;
    transform-style: preserve-3d;

    // Outer ring with morphing animation
    &::before {
      content: '';
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      width: 340px;
      height: 340px;
      border: 2px solid rgba($white, 0.3);
      border-radius: 50%;
      z-index: 1;
      animation: morphingRing 8s ease-in-out infinite;
      background: conic-gradient(from 0deg, transparent, rgba($white, 0.1), transparent);

      @media (max-width: 767px) {
        width: 280px;
        height: 280px;
      }

      @media (max-width: 480px) {
        width: 240px;
        height: 240px;
      }
    }

    // Inner ring with pulsing glow
    &::after {
      content: '';
      position: absolute;
      top: -50px;
      left: 50%;
      transform: translateX(-50%);
      width: 380px;
      height: 380px;
      border: 1px solid rgba($white, 0.1);
      border-radius: 50%;
      z-index: 0;
      animation: pulsingGlow 6s ease-in-out infinite;
      background: radial-gradient(circle, transparent 60%, rgba($white, 0.05) 70%, transparent 80%);

      @media (max-width: 767px) {
        width: 320px;
        height: 320px;
      }

      @media (max-width: 480px) {
        width: 280px;
        height: 280px;
      }
    }
  }

  // ===== CHEF PHOTO WITH ADVANCED 3D EFFECTS =====
  &__photo {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    object-fit: cover;
    border: 6px solid $white;
    box-shadow:
      0 30px 80px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba($white, 0.2),
      inset 0 0 0 1px rgba($white, 0.1),
      0 0 100px rgba($purple-light, 0.3);
    position: relative;
    z-index: 5;
    transform: translateZ(50px) rotateY(-15deg) scale(0.8);
    opacity: 0;
    transition: all 1.6s cubic-bezier(0.23, 1, 0.32, 1) 0.6s;
    filter: brightness(1.1) contrast(1.1);

    &:hover {
      transform: translateZ(80px) rotateY(0deg) scale(1.05);
      box-shadow:
        0 40px 120px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba($white, 0.4),
        inset 0 0 0 1px rgba($white, 0.2),
        0 0 150px rgba($purple-light, 0.5);
      filter: brightness(1.2) contrast(1.2) saturate(1.1);
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

  // ===== VISIBILITY STATES =====
  &--visible {
    .chef__title {
      transform: translateY(0) rotateX(0);
      opacity: 1;

      &::before {
        transform: translateX(100%);
      }

      &::after {
        width: 80px;
      }
    }

    .chef__quote {
      transform: translateX(0) rotateY(0);
      opacity: 1;
    }

    .chef__info {
      transform: translateY(0);
      opacity: 1;

      .chef__name::after {
        width: 60px;

        @media (min-width: 1024px) {
          width: 40px;
        }
      }
    }

    .chef__photo {
      transform: translateZ(50px) rotateY(0) scale(1);
      opacity: 1;
    }
  }

  // ===== SCROLL ANIMATION STATE =====
  &--animate {
    .chef__title {
      animation-play-state: running;
    }

    .chef__quote::before,
    .chef__quote::after {
      animation-play-state: running;
    }
  }
}

// ===== ADVANCED KEYFRAME ANIMATIONS =====

@keyframes cosmicFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-30px) rotate(2deg) scale(1.02);
  }
  50% {
    transform: translateY(-15px) rotate(-1deg) scale(0.98);
  }
  75% {
    transform: translateY(-40px) rotate(1.5deg) scale(1.01);
  }
}

@keyframes shimmerWave {
  0%, 100% {
    opacity: 0.3;
    transform: translateX(-100%) skewX(0deg);
  }
  50% {
    opacity: 0.7;
    transform: translateX(100%) skewX(15deg);
  }
}

@keyframes floatingParticles {
  0% {
    transform: translateY(100vh) translateX(0px) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translateY(90vh) translateX(10px) scale(1);
  }
  90% {
    opacity: 1;
    transform: translateY(-10vh) translateX(-10px) scale(1);
  }
  100% {
    transform: translateY(-20vh) translateX(0px) scale(0);
    opacity: 0;
  }
}

@keyframes titleGlow {
  0% {
    text-shadow: 0 0 20px rgba($white, 0.5);
    background-position: 0% 50%;
  }
  100% {
    text-shadow: 0 0 40px rgba($white, 0.8), 0 0 60px rgba($purple-light, 0.4);
    background-position: 100% 50%;
  }
}

@keyframes quoteFloat {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-5px) scale(1.05);
    opacity: 0.4;
  }
}

@keyframes morphingRing {
  0%, 100% {
    border-radius: 50%;
    transform: translateX(-50%) rotate(0deg) scale(1);
  }
  25% {
    border-radius: 45% 55% 60% 40%;
    transform: translateX(-50%) rotate(90deg) scale(1.02);
  }
  50% {
    border-radius: 60% 40% 45% 55%;
    transform: translateX(-50%) rotate(180deg) scale(0.98);
  }
  75% {
    border-radius: 40% 60% 55% 45%;
    transform: translateX(-50%) rotate(270deg) scale(1.01);
  }
}

@keyframes pulsingGlow {
  0%, 100% {
    box-shadow: 
      0 0 50px rgba($white, 0.2),
      inset 0 0 50px rgba($purple-light, 0.1);
    transform: translateX(-50%) scale(1);
  }
  50% {
    box-shadow: 
      0 0 100px rgba($white, 0.4),
      inset 0 0 100px rgba($purple-light, 0.2);
    transform: translateX(-50%) scale(1.05);
  }
}

// ===== RESPONSIVE ADJUSTMENTS =====
@media (max-width: 768px) {
  .chef {
    padding: 6rem 0;

    &__content {
      gap: 3rem;
    }

    &__title {
      font-size: 2.2rem;
      letter-spacing: 3px;
    }

    &__quote {
      font-size: 1.1rem;
      padding: 2rem;
    }
  }
}

@media (max-width: 480px) {
  .chef {
    padding: 4rem 0;

    &__title {
      font-size: 1.8rem;
      letter-spacing: 2px;
    }

    &__quote {
      font-size: 1rem;
      padding: 1.5rem;
    }
  }
}
</style>