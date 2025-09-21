<script setup lang="ts">
// Componente estático sin animaciones GSAP
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