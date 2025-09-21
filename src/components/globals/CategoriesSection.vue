<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Context para las animaciones GSAP
let ctx: gsap.Context

onMounted(() => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger)

  // Create GSAP context for proper cleanup
  ctx = gsap.context(() => {
    // Categories Section Animations
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
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
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
          <h3 class="categories__cta-title">¿Tienes un evento especial?</h3>
          <p class="categories__cta-text">Contáctanos y te ayudamos a hacer de tu celebración algo inolvidable</p>
          <button class="categories__cta-btn">
            <span>Escríbenos Aquí</span>
            <i class="fas fa-envelope"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
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

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}
</style>