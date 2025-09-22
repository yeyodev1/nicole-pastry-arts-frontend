<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Estado reactivo para animaciones
const isVisible = ref(false)
const categoriesSection = ref<HTMLElement>()
const animationTriggered = ref(false)

onMounted(() => {
  // Activar animaciones después de un breve delay
  setTimeout(() => {
    isVisible.value = true
  }, 200)

  // Intersection Observer para animaciones de scroll
  if (categoriesSection.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationTriggered.value) {
            animationTriggered.value = true
            entry.target.classList.add('categories--animate')
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(categoriesSection.value)
  }
})
</script>

<template>
  <!-- Categories Section -->
  <section 
    ref="categoriesSection"
    class="categories"
    :class="{ 'categories--visible': isVisible }"
  >
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
        <div class="categories__cta-background">
          <div class="categories__cta-overlay"></div>
          <div class="categories__cta-particles">
            <div class="particle particle--1"></div>
            <div class="particle particle--2"></div>
            <div class="particle particle--3"></div>
            <div class="particle particle--4"></div>
          </div>
        </div>
        <div class="categories__cta-content">
          <div class="categories__cta-badge">
            <i class="fas fa-star"></i>
            <span>Eventos Especiales</span>
          </div>
          <h3 class="categories__cta-title">¿Tienes un evento especial?</h3>
          <p class="categories__cta-text">Contáctanos y te ayudamos a hacer de tu celebración algo inolvidable con nuestras creaciones artesanales</p>
          <div class="categories__cta-actions">
            <button class="categories__cta-btn categories__cta-btn--primary">
              <span>Escríbenos Aquí</span>
              <i class="fas fa-envelope"></i>
            </button>
            <button class="categories__cta-btn categories__cta-btn--secondary">
              <span>Ver Galería</span>
              <i class="fas fa-images"></i>
            </button>
          </div>
          <div class="categories__cta-features">
            <div class="feature">
              <i class="fas fa-heart"></i>
              <span>Diseños Únicos</span>
            </div>
            <div class="feature">
              <i class="fas fa-clock"></i>
              <span>Entrega Puntual</span>
            </div>
            <div class="feature">
              <i class="fas fa-award"></i>
              <span>Calidad Premium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// ===== KEYFRAMES CINEMATOGRÁFICOS =====
@keyframes cinematicReveal {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.8);
    filter: blur(20px);
  }
  50% {
    opacity: 0.7;
    transform: translateY(20px) scale(0.95);
    filter: blur(5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes titleTypewriter {
  0% {
    width: 0;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 1;
  }
}

@keyframes parallaxFloat {
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  25% {
    transform: translate3d(20px, -30px, 10px) rotate(2deg);
  }
  50% {
    transform: translate3d(-15px, -60px, 20px) rotate(-1deg);
  }
  75% {
    transform: translate3d(-25px, -30px, 15px) rotate(1.5deg);
  }
}

@keyframes cardMorphing {
  0% {
    transform: perspective(1000px) rotateX(45deg) rotateY(-15deg) translateZ(-100px);
    opacity: 0;
    filter: blur(10px);
  }
  60% {
    transform: perspective(1000px) rotateX(10deg) rotateY(-5deg) translateZ(20px);
    opacity: 0.8;
    filter: blur(2px);
  }
  100% {
    transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px);
    opacity: 1;
    filter: blur(0);
  }
}

@keyframes particleOrbit {
  0% {
    transform: rotate(0deg) translateX(50px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: rotate(360deg) translateX(50px) rotate(-360deg);
    opacity: 0.3;
  }
}

@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba($purple-primary, 0.3);
    filter: brightness(1);
  }
  50% {
    box-shadow: 0 0 40px rgba($purple-primary, 0.6), 0 0 60px rgba($purple-primary, 0.4);
    filter: brightness(1.2);
  }
}

@keyframes backgroundShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// ===== SECCIÓN PRINCIPAL =====
.categories {
  padding: 12rem 0;
  background: 
    radial-gradient(ellipse at top left, rgba($purple-primary, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, rgba($purple-primary, 0.06) 0%, transparent 50%),
    linear-gradient(135deg, $background-cream 0%, $white 30%, $background-cream 70%, $white 100%);
  background-size: 400% 400%;
  animation: backgroundShift 20s ease-in-out infinite;
  position: relative;
  overflow: hidden;
  perspective: 2000px;

  // Estados de visibilidad
  &--visible {
    .categories__badge {
      animation: cinematicReveal 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both;
    }

    .categories__title-line {
      animation: titleTypewriter 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both;
    }

    .categories__title-accent {
      animation: titleTypewriter 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.2s both;
    }

    .categories__subtitle {
      animation: cinematicReveal 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.8s both;
    }
  }

  &--animate {
    .category-card {
      &:nth-child(1) { animation: cardMorphing 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both; }
      &:nth-child(2) { animation: cardMorphing 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both; }
      &:nth-child(3) { animation: cardMorphing 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both; }
      &:nth-child(4) { animation: cardMorphing 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s both; }
    }

    .categories__cta {
      animation: cinematicReveal 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.5s both;
    }
  }

  // Capas de fondo con parallax
  &::before {
    content: '';
    position: absolute;
    top: -100%;
    left: -100%;
    width: 300%;
    height: 300%;
    background: 
      radial-gradient(circle at 20% 30%, rgba($purple-primary, 0.12) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba($purple-primary, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 40% 80%, rgba($purple-primary, 0.06) 0%, transparent 40%);
    animation: parallaxFloat 30s ease-in-out infinite;
    pointer-events: none;
    will-change: transform;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(45deg, transparent 30%, rgba($purple-primary, 0.02) 50%, transparent 70%),
      linear-gradient(-45deg, transparent 30%, rgba($purple-primary, 0.03) 50%, transparent 70%);
    animation: backgroundShift 25s ease-in-out infinite reverse;
    pointer-events: none;
  }

  &__container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 10;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: 10rem;
    position: relative;
    transform-style: preserve-3d;
  }

  &__header-content {
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
    z-index: 5;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    background: 
      linear-gradient(135deg, rgba($purple-primary, 0.15), rgba($purple-primary, 0.08)),
      linear-gradient(45deg, rgba($white, 0.9), rgba($background-cream, 0.8));
    background-blend-mode: overlay;
    color: $purple-primary;
    padding: 1.2rem 2.5rem;
    border-radius: 60px;
    font-size: 0.95rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 3rem;
    border: 3px solid rgba($purple-primary, 0.25);
    backdrop-filter: blur(20px);
    box-shadow: 
      0 15px 50px rgba($purple-primary, 0.15),
      inset 0 1px 0 rgba($white, 0.8);
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(50px);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba($white, 0.4), transparent);
      transition: left 0.8s ease;
    }

    &:hover::before {
      left: 100%;
    }
  }

  &__title {
    font-size: 3.5rem;
    font-weight: 900;
    color: $text-dark;
    margin-bottom: 3rem;
    letter-spacing: -2px;
    line-height: 1.1;
    position: relative;

    @media (min-width: 768px) {
      font-size: 5rem;
    }

    @media (min-width: 1024px) {
      font-size: 6rem;
    }
  }

  &__title-line {
    display: block;
    color: $text-light;
    font-weight: 500;
    overflow: hidden;
    white-space: nowrap;
    opacity: 0;
    width: 0;
    position: relative;

    &::after {
      content: '|';
      position: absolute;
      right: -5px;
      animation: blink 1s infinite;
      color: $purple-primary;
    }
  }

  &__title-accent {
    display: block;
    background: 
      linear-gradient(135deg, $purple-primary 0%, $purple-dark 50%, $purple-primary 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    opacity: 0;
    width: 0;
    animation: backgroundShift 3s ease-in-out infinite;

    &::before {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 0;
      width: 100%;
      height: 8px;
      background: linear-gradient(90deg, $purple-primary, transparent);
      border-radius: 4px;
      opacity: 0.4;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s;
    }

    &::after {
      content: '|';
      position: absolute;
      right: -5px;
      animation: blink 1s infinite;
      color: $purple-primary;
    }
  }

  &__subtitle {
    font-size: 1.4rem;
    color: $text-light;
    line-height: 1.9;
    max-width: 850px;
    margin: 0 auto;
    opacity: 0;
    transform: translateY(30px);

    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }

  &__decorative-elements {
    position: absolute;
    top: -50px;
    left: -50px;
    right: -50px;
    bottom: -50px;
    pointer-events: none;
    transform-style: preserve-3d;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    perspective: 1500px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, auto);
      gap: 3.5rem;

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
      gap: 4rem;
    }
  }

  &__cta {
    margin-top: 10rem;
    text-align: center;
    opacity: 0;
    transform: translateY(50px);
  }

  &__cta-content {
    background: 
      linear-gradient(135deg, rgba($white, 0.95), rgba($background-cream, 0.9)),
      radial-gradient(circle at center, rgba($purple-primary, 0.05), transparent);
    background-blend-mode: overlay;
    backdrop-filter: blur(30px);
    border: 2px solid rgba($purple-primary, 0.15);
    border-radius: 40px;
    padding: 5rem 3rem;
    max-width: 700px;
    margin: 0 auto;
    box-shadow: 
      0 30px 80px rgba($purple-primary, 0.15),
      inset 0 1px 0 rgba($white, 0.9);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent, rgba($purple-primary, 0.1), transparent);
      animation: spin 20s linear infinite;
      pointer-events: none;
    }
  }

  &__cta-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: $text-dark;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 2;

    @media (min-width: 768px) {
      font-size: 2.6rem;
    }
  }

  &__cta-text {
    font-size: 1.2rem;
    color: $text-light;
    margin-bottom: 3rem;
    line-height: 1.7;
    position: relative;
    z-index: 2;
  }

  &__cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 1.2rem;
    background: 
      linear-gradient(135deg, $purple-primary 0%, $purple-dark 50%, $purple-primary 100%);
    background-size: 200% 200%;
    color: $white;
    padding: 1.5rem 3rem;
    border: none;
    border-radius: 60px;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 
      0 15px 40px rgba($purple-primary, 0.4),
      inset 0 1px 0 rgba($white, 0.3);
    position: relative;
    z-index: 2;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba($white, 0.3), transparent);
      transition: left 0.6s ease;
    }

    &:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 
        0 25px 60px rgba($purple-primary, 0.5),
        inset 0 1px 0 rgba($white, 0.4);
      animation: backgroundShift 2s ease-in-out infinite;

      &::before {
        left: 100%;
      }

      i {
        transform: translateX(8px) rotate(15deg);
      }
    }

    i {
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      font-size: 1.1rem;
    }
  }
}

// ===== ELEMENTOS FLOTANTES =====
.floating-element {
  position: absolute;
  border-radius: 50%;
  background: 
    radial-gradient(circle at 30% 30%, rgba($purple-primary, 0.15), rgba($purple-primary, 0.05)),
    linear-gradient(135deg, rgba($white, 0.8), rgba($background-cream, 0.6));
  background-blend-mode: overlay;
  backdrop-filter: blur(10px);
  border: 1px solid rgba($purple-primary, 0.2);
  animation: parallaxFloat 20s ease-in-out infinite;
  box-shadow: 
    0 10px 30px rgba($purple-primary, 0.1),
    inset 0 1px 0 rgba($white, 0.8);

  &--1 {
    width: 150px;
    height: 150px;
    top: 5%;
    left: 8%;
    animation-delay: 0s;
    animation-duration: 25s;
  }

  &--2 {
    width: 100px;
    height: 100px;
    top: 15%;
    right: 12%;
    animation-delay: 8s;
    animation-duration: 30s;
  }

  &--3 {
    width: 80px;
    height: 80px;
    bottom: 25%;
    left: 15%;
    animation-delay: 15s;
    animation-duration: 35s;
  }
}

// ===== TARJETAS DE CATEGORÍAS =====
.category-card {
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: 
    linear-gradient(135deg, rgba($white, 0.9), rgba($background-cream, 0.85)),
    radial-gradient(circle at center, rgba($purple-primary, 0.03), transparent);
  background-blend-mode: overlay;
  backdrop-filter: blur(25px);
  border: 2px solid rgba($purple-primary, 0.12);
  box-shadow: 
    0 15px 50px rgba($purple-primary, 0.1),
    inset 0 1px 0 rgba($white, 0.9);
  transform-style: preserve-3d;
  opacity: 0;
  transform: perspective(1000px) rotateX(45deg) rotateY(-15deg) translateZ(-100px);

  &--hero {
    @media (min-width: 768px) {
      min-height: 600px;
    }

    @media (min-width: 1024px) {
      min-height: 650px;
    }

    &:hover {
      transform: perspective(1000px) rotateX(-2deg) rotateY(2deg) translateZ(30px) scale(1.02);
      box-shadow: 
        0 40px 100px rgba($purple-primary, 0.25),
        inset 0 1px 0 rgba($white, 0.95);

      .category-card__icon {
        transform: scale(1.2) rotateY(360deg);
        animation: glowPulse 2s ease-in-out infinite;
      }

      .category-card__particles {
        .particle {
          animation-play-state: running;
        }
      }
    }
  }

  &--secondary {
    min-height: 400px;

    @media (min-width: 768px) {
      min-height: 450px;
    }

    &:hover {
      transform: perspective(1000px) rotateX(-5deg) rotateY(5deg) translateZ(20px) scale(1.05);
      box-shadow: 
        0 30px 80px rgba($purple-primary, 0.2),
        inset 0 1px 0 rgba($white, 0.95);

      .category-card__icon {
        transform: scale(1.15) rotateZ(15deg);
        animation: glowPulse 1.5s ease-in-out infinite;
      }
    }
  }

  &--featured {
    background: 
      linear-gradient(135deg, rgba($white, 0.98), rgba($background-cream, 0.95)),
      radial-gradient(circle at center, rgba($purple-primary, 0.08), transparent);
    background-blend-mode: overlay;
    border: 3px solid rgba($purple-primary, 0.2);
    box-shadow: 
      0 20px 60px rgba($purple-primary, 0.15),
      inset 0 1px 0 rgba($white, 0.95);

    &:hover {
      transform: perspective(1000px) rotateX(-3deg) rotateY(3deg) translateZ(25px) scale(1.03);
      box-shadow: 
        0 35px 90px rgba($purple-primary, 0.25),
        inset 0 1px 0 rgba($white, 0.98);

      .category-card__features .feature {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 5px 15px rgba($purple-primary, 0.3);
      }
    }
  }

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform-style: preserve-3d;
  }

  &__image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 30%, rgba($purple-primary, 0.15) 0%, transparent 60%),
      radial-gradient(circle at 70% 70%, rgba($purple-primary, 0.1) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.8s ease;
  }

  &__gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(135deg, transparent 0%, rgba($purple-primary, 0.08) 100%),
      conic-gradient(from 45deg, transparent, rgba($purple-primary, 0.05), transparent);
    opacity: 0;
    transition: opacity 0.8s ease;
  }

  &:hover {
    .category-card__image-overlay,
    .category-card__gradient {
      opacity: 1;
    }

    .category-card__icon-glow {
      opacity: 1;
    }

    .category-card__btn {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 
        0 20px 50px rgba($purple-primary, 0.4),
        inset 0 1px 0 rgba($white, 0.4);
    }
  }

  &__content {
    position: relative;
    z-index: 5;
    padding: 3rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (min-width: 1024px) {
      padding: 3.5rem;
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
    margin-bottom: 2.5rem;

    .category-card--hero & {
      margin: 0 auto 3rem;

      @media (min-width: 768px) {
        margin: 0 0 3rem 0;
      }
    }
  }

  &__icon-bg {
    position: absolute;
    top: -15px;
    left: -15px;
    right: -15px;
    bottom: -15px;
    background: 
      radial-gradient(circle, rgba($purple-primary, 0.15), rgba($purple-primary, 0.05)),
      linear-gradient(135deg, rgba($white, 0.8), rgba($background-cream, 0.6));
    background-blend-mode: overlay;
    border-radius: 50%;
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    backdrop-filter: blur(10px);
  }

  &__icon {
    position: relative;
    z-index: 3;
    width: 90px;
    height: 90px;
    background: 
      linear-gradient(135deg, rgba($white, 0.95), rgba($background-cream, 0.9)),
      radial-gradient(circle at center, rgba($purple-primary, 0.05), transparent);
    background-blend-mode: overlay;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: $purple-primary;
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 
      0 15px 40px rgba($purple-primary, 0.2),
      inset 0 1px 0 rgba($white, 0.9);
    border: 2px solid rgba($purple-primary, 0.15);

    .category-card--hero & {
      width: 120px;
      height: 120px;
      font-size: 3.2rem;
    }
  }

  &__icon-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba($purple-primary, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.8s ease;
    filter: blur(10px);

    .category-card--hero & {
      width: 180px;
      height: 180px;
    }
  }

  &__text {
    flex: 1;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    background: 
      linear-gradient(135deg, $purple-primary, $purple-dark),
      radial-gradient(circle at center, rgba($white, 0.2), transparent);
    background-blend-mode: overlay;
    color: $white;
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2rem;
    box-shadow: 
      0 8px 25px rgba($purple-primary, 0.4),
      inset 0 1px 0 rgba($white, 0.3);
    width: fit-content;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba($white, 0.3), transparent);
      transition: left 0.6s ease;
    }

    &:hover::before {
      left: 100%;
    }

    &--new {
      background: 
        linear-gradient(135deg, #ff6b6b, #ee5a24),
        radial-gradient(circle at center, rgba($white, 0.2), transparent);
      background-blend-mode: overlay;
    }

    &--fresh {
      background: 
        linear-gradient(135deg, #00d2d3, #54a0ff),
        radial-gradient(circle at center, rgba($white, 0.2), transparent);
      background-blend-mode: overlay;
    }

    i {
      font-size: 1rem;
    }
  }

  &__title {
    font-size: 2rem;
    font-weight: 800;
    color: $text-dark;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    transition: all 0.4s ease;

    .category-card--hero & {
      font-size: 2.8rem;
      margin-bottom: 2rem;

      @media (min-width: 1024px) {
        font-size: 3.2rem;
      }
    }
  }

  &__description {
    font-size: 1.15rem;
    color: $text-light;
    line-height: 1.7;
    margin-bottom: 2rem;

    .category-card--hero & {
      font-size: 1.3rem;
      margin-bottom: 2.5rem;
    }
  }

  &__stats {
    display: flex;
    gap: 2.5rem;
    margin-bottom: 2.5rem;
  }

  &__count {
    font-size: 1rem;
    color: $purple-primary;
    font-weight: 700;
    background: 
      linear-gradient(135deg, rgba($purple-primary, 0.12), rgba($purple-primary, 0.08)),
      linear-gradient(45deg, rgba($white, 0.9), rgba($background-cream, 0.8));
    background-blend-mode: overlay;
    padding: 0.8rem 1.5rem;
    border-radius: 20px;
    width: fit-content;
    border: 1px solid rgba($purple-primary, 0.2);
    box-shadow: 0 5px 15px rgba($purple-primary, 0.1);
  }

  &__features {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;

    .feature {
      font-size: 0.9rem;
      color: $purple-primary;
      background: 
        linear-gradient(135deg, rgba($purple-primary, 0.12), rgba($purple-primary, 0.08)),
        linear-gradient(45deg, rgba($white, 0.9), rgba($background-cream, 0.8));
      background-blend-mode: overlay;
      padding: 0.6rem 1.2rem;
      border-radius: 15px;
      font-weight: 600;
      border: 1px solid rgba($purple-primary, 0.2);
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      box-shadow: 0 3px 10px rgba($purple-primary, 0.1);
    }
  }

  &__action {
    margin-top: auto;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 1.2rem;
    background: 
      linear-gradient(135deg, $purple-primary 0%, $purple-dark 50%, $purple-primary 100%);
    background-size: 200% 200%;
    color: $white;
    padding: 1.2rem 2.5rem;
    border: none;
    border-radius: 60px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 
      0 12px 35px rgba($purple-primary, 0.35),
      inset 0 1px 0 rgba($white, 0.3);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba($white, 0.3), transparent);
      transition: left 0.6s ease;
    }

    &--compact {
      width: 60px;
      height: 60px;
      padding: 0;
      border-radius: 50%;
      justify-content: center;

      i {
        font-size: 1.4rem;
      }
    }

    &:hover {
      animation: backgroundShift 2s ease-in-out infinite;

      &::before {
        left: 100%;
      }

      i {
        transform: translateX(5px) rotate(15deg);
      }
    }

    i {
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      font-size: 1.2rem;
    }
  }

  &__particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;

    .particle {
      position: absolute;
      width: 8px;
      height: 8px;
      background: radial-gradient(circle, rgba($purple-primary, 0.6), transparent);
      border-radius: 50%;
      animation: particleOrbit 15s linear infinite;
      animation-play-state: paused;

      &--1 {
        top: 20%;
        left: 20%;
        animation-delay: 0s;
      }

      &--2 {
        top: 60%;
        right: 30%;
        animation-delay: 5s;
        animation-duration: 20s;
      }

      &--3 {
        bottom: 30%;
        left: 40%;
        animation-delay: 10s;
        animation-duration: 25s;
      }
    }
  }
}

// ===== ESTADÍSTICAS =====
.stat {
  text-align: center;

  &__number {
    display: block;
    font-size: 2rem;
    font-weight: 900;
    color: $purple-primary;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__label {
    font-size: 0.9rem;
    color: $text-light;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

// ===== SECCIÓN CTA INCREÍBLE =====
.categories__cta {
  position: relative;
  margin-top: 8rem;
  border-radius: 30px;
  overflow: hidden;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  
  &-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('@/assets/events/PASTRY 173.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    transform: scale(1.1);
    animation: ctaBackgroundZoom 20s ease-in-out infinite alternate;
    
    @media (max-width: 768px) {
      background-attachment: scroll;
      transform: scale(1.05);
    }
  }
  
  &-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
       radial-gradient(ellipse at center, rgba($purple-primary, 0.2) 0%, rgba($purple-dark, 0.4) 50%, rgba($gray-900, 0.6) 100%),
       linear-gradient(135deg, rgba($purple-primary, 0.3) 0%, rgba($purple-dark, 0.5) 100%);
    backdrop-filter: blur(2px);
  }
  
  &-particles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    
    .particle {
      position: absolute;
      width: 12px;
      height: 12px;
      background: radial-gradient(circle, rgba($white, 0.8), rgba($purple-primary, 0.4));
      border-radius: 50%;
      animation: ctaParticleFloat 8s ease-in-out infinite;
      box-shadow: 0 0 20px rgba($white, 0.5);
      
      &--1 {
        top: 20%;
        left: 15%;
        animation-delay: 0s;
        animation-duration: 6s;
      }
      
      &--2 {
        top: 70%;
        right: 20%;
        animation-delay: 2s;
        animation-duration: 8s;
      }
      
      &--3 {
        bottom: 30%;
        left: 70%;
        animation-delay: 4s;
        animation-duration: 7s;
      }
      
      &--4 {
        top: 40%;
        right: 60%;
        animation-delay: 1s;
        animation-duration: 9s;
      }
    }
  }
  
  &-content {
    position: relative;
    z-index: 10;
    text-align: center;
    max-width: 800px;
    padding: 4rem 2rem;
    background: rgba($white, 0.1);
    backdrop-filter: blur(20px);
    border-radius: 25px;
    border: 2px solid rgba($white, 0.2);
    box-shadow: 
       0 25px 80px rgba($gray-900, 0.3),
       inset 0 1px 0 rgba($white, 0.2);
    animation: ctaContentFloat 6s ease-in-out infinite;
    
    @media (max-width: 768px) {
      padding: 3rem 1.5rem;
      margin: 0 1rem;
    }
  }
  
  &-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    background: linear-gradient(135deg, rgba($white, 0.9), rgba($purple-primary, 0.1));
    color: $purple-primary;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2rem;
    border: 2px solid rgba($white, 0.3);
    box-shadow: 0 10px 30px rgba($purple-primary, 0.2);
    animation: ctaBadgePulse 3s ease-in-out infinite;
    
    i {
       color: $warning;
       animation: ctaStarSpin 4s linear infinite;
     }
  }
  
  &-title {
    font-size: 3.5rem;
    font-weight: 900;
    color: $white;
    margin-bottom: 1.5rem;
    line-height: 1.1;
    text-shadow: 
       2px 2px 4px rgba($gray-900, 0.5),
       0 0 20px rgba($white, 0.3);
    background: linear-gradient(135deg, $white, rgba($white, 0.8));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ctaTitleGlow 4s ease-in-out infinite alternate;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
    
    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }
  
  &-text {
    font-size: 1.3rem;
    color: rgba($white, 0.9);
    margin-bottom: 3rem;
    line-height: 1.6;
    text-shadow: 1px 1px 3px rgba($gray-900, 0.5);
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
      margin-bottom: 2.5rem;
    }
  }
  
  &-actions {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    margin-bottom: 3rem;
    flex-wrap: wrap;
    
    @media (max-width: 480px) {
      flex-direction: column;
      gap: 1rem;
    }
  }
  
  &-btn {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    padding: 1.2rem 2.5rem;
    border-radius: 60px;
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: none;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;
    min-width: 200px;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba($white, 0.2), transparent);
      transition: left 0.6s;
    }
    
    &:hover::before {
      left: 100%;
    }
    
    &--primary {
      background: linear-gradient(135deg, $purple-primary, $purple-dark);
      color: $white;
      box-shadow: 
        0 15px 40px rgba($purple-primary, 0.4),
        inset 0 1px 0 rgba($white, 0.2);
      
      &:hover {
        transform: translateY(-5px) scale(1.05);
        box-shadow: 
          0 25px 60px rgba($purple-primary, 0.6),
          inset 0 1px 0 rgba($white, 0.3);
      }
      
      &:active {
        transform: translateY(-2px) scale(1.02);
      }
    }
    
    &--secondary {
      background: rgba($white, 0.15);
      color: $white;
      border: 2px solid rgba($white, 0.3);
      backdrop-filter: blur(10px);
      
      &:hover {
        background: rgba($white, 0.25);
        border-color: rgba($white, 0.5);
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba($white, 0.2);
      }
      
      &:active {
        transform: translateY(-1px);
      }
    }
    
    i {
      transition: transform 0.3s ease;
    }
    
    &:hover i {
      transform: translateX(5px);
    }
  }
  
  &-features {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
      gap: 2rem;
    }
    
    @media (max-width: 480px) {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .feature {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      color: rgba($white, 0.9);
      font-size: 1rem;
      font-weight: 600;
      
      i {
         color: $warning;
         font-size: 1.2rem;
         animation: ctaFeatureIcon 3s ease-in-out infinite;
       }
      
      &:nth-child(2) i {
        animation-delay: 1s;
      }
      
      &:nth-child(3) i {
        animation-delay: 2s;
      }
    }
  }
}

// ===== ANIMACIONES CTA =====
@keyframes ctaBackgroundZoom {
  0% { transform: scale(1.1) rotate(0deg); }
  50% { transform: scale(1.15) rotate(1deg); }
  100% { transform: scale(1.1) rotate(0deg); }
}

@keyframes ctaParticleFloat {
  0%, 100% { 
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-30px) rotate(180deg);
    opacity: 1;
  }
}

@keyframes ctaContentFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes ctaBadgePulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 10px 30px rgba($purple-primary, 0.2);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba($purple-primary, 0.4);
  }
}

@keyframes ctaStarSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ctaTitleGlow {
   0% { 
     text-shadow: 
       2px 2px 4px rgba($gray-900, 0.5),
       0 0 20px rgba($white, 0.3);
   }
   100% { 
     text-shadow: 
       2px 2px 4px rgba($gray-900, 0.5),
       0 0 30px rgba($white, 0.6),
       0 0 40px rgba($purple-primary, 0.3);
   }
 }
 
 @keyframes ctaFeatureIcon {
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    color: $warning;
  }
  50% { 
    transform: scale(1.2) rotate(10deg);
    color: $warning-light;
  }
}

// ===== ANIMACIONES AUXILIARES =====
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// ===== RESPONSIVE OPTIMIZATIONS =====
@media (max-width: 767px) {
  .categories {
    padding: 8rem 0;

    &__title {
      font-size: 2.8rem;
    }

    &__subtitle {
      font-size: 1.2rem;
    }

    &__grid {
      gap: 2rem;
    }

    .category-card {
      min-height: 300px;

      &__content {
        padding: 2rem;
      }

      &__icon {
        width: 70px;
        height: 70px;
        font-size: 2rem;
      }

      &__title {
        font-size: 1.6rem;
      }

      &__description {
        font-size: 1rem;
      }
    }

    // CTA Mobile Optimizations
    .categories__cta {
      margin-top: 6rem;
      min-height: 500px;
      border-radius: 20px;

      &-content {
        padding: 2.5rem 1.5rem;
        margin: 0 1rem;
      }

      &-badge {
        padding: 0.8rem 1.5rem;
        font-size: 0.8rem;
        margin-bottom: 1.5rem;
      }

      &-title {
        font-size: 2.2rem;
        margin-bottom: 1rem;
      }

      &-text {
        font-size: 1rem;
        margin-bottom: 2rem;
      }

      &-actions {
        margin-bottom: 2rem;
        flex-direction: column;
        gap: 1rem;
      }

      &-btn {
        padding: 1rem 2rem;
        font-size: 1rem;
        min-width: auto;
        width: 100%;
      }

      &-features {
        gap: 1.5rem;
        flex-direction: column;

        .feature {
          justify-content: center;
          font-size: 0.9rem;
        }
      }
    }
  }
}

// ===== ACCESSIBILITY =====
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>