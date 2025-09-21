<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  // Configuración de animaciones para la sección de testimonios
  const testimonialsSection = document.querySelector('.testimonials')

  if (testimonialsSection) {
    // Animación del header
    const testimonialsHeader = testimonialsSection.querySelector('.testimonials__header')
    if (testimonialsHeader) {
      gsap.fromTo(testimonialsHeader.children, {
        opacity: 0,
        y: 50,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: testimonialsHeader,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      })
    }

    // Animación de testimonios individuales con direcciones variadas
    const testimonialStories = testimonialsSection.querySelectorAll('.testimonial-story')
    testimonialStories.forEach((story, index) => {
      const direction = index % 4 // Ciclo de 4 direcciones
      let fromProps: any = { opacity: 0, scale: 0.8 }

      switch (direction) {
        case 0: // Desde la izquierda
          fromProps = { ...fromProps, x: -100, rotation: -5 }
          break
        case 1: // Desde la derecha
          fromProps = { ...fromProps, x: 100, rotation: 5 }
          break
        case 2: // Desde abajo
          fromProps = { ...fromProps, y: 100, rotation: 3 }
          break
        case 3: // Desde arriba
          fromProps = { ...fromProps, y: -100, rotation: -3 }
          break
      }

      gsap.fromTo(story, fromProps, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: story,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      })
    })

    // Animación del CTA
    const testimonialsCta = testimonialsSection.querySelector('.testimonials__cta')
    if (testimonialsCta) {
      gsap.fromTo(testimonialsCta, {
        opacity: 0,
        y: 50,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: testimonialsCta,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      })
    }

    // Animación de estrellas de rating
    const ratingStars = testimonialsSection.querySelectorAll('.rating-stars i')
    ratingStars.forEach((star, index) => {
      gsap.fromTo(star, {
        opacity: 0,
        scale: 0,
        rotation: -180
      }, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        delay: index * 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: star.closest('.testimonial-story'),
          start: "top 85%",
          toggleActions: "play none none none"
        }
      })
    })

    // Efecto hover para testimonios
    testimonialStories.forEach((story) => {
      story.addEventListener('mouseenter', () => {
        gsap.to(story, {
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        })
      })

      story.addEventListener('mouseleave', () => {
        gsap.to(story, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        })
      })
    })
  }
})
</script>

<template>
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
</template>

<style lang="scss" scoped>
@keyframes parallaxFloat1 {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(2deg);
  }
}

@keyframes parallaxFloat2 {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-15px) rotate(-1deg);
  }
}

@keyframes parallaxFloat3 {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-25px) rotate(1deg);
  }
}

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

    // i {
    //   // Removed transition - using GSAP for animations
    // }

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

.rating-stars {
  display: flex;
  gap: 0.25rem;

  i {
    color: #ffd700;
    font-size: 0.9rem;
  }
}
</style>