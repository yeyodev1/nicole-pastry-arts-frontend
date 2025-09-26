<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Referencias para controlar las animaciones
const testimonialsRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>()
const masonryRef = ref<HTMLElement>()
const ctaRef = ref<HTMLElement>()

// Estado de animaciones
const isVisible = ref(false)
const animatedCards = ref<Set<number>>(new Set())

onMounted(() => {
  // Configurar Intersection Observer para activar animaciones
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement
        
        if (target === headerRef.value) {
          // Activar animaciones del header
          setTimeout(() => {
            target.classList.add('animate-in')
          }, 100)
        } else if (target === masonryRef.value) {
          // Activar animaciones de las tarjetas con delay escalonado
          const cards = target.querySelectorAll('.testimonial-story')
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-in')
              animatedCards.value.add(index)
            }, index * 150 + 200)
          })
        } else if (target === ctaRef.value) {
          // Activar animación del CTA
          setTimeout(() => {
            target.classList.add('animate-in')
          }, 300)
        }
        
        observer.unobserve(target)
      }
    })
  }, observerOptions)

  // Observar elementos principales
  if (headerRef.value) observer.observe(headerRef.value)
  if (masonryRef.value) observer.observe(masonryRef.value)
  if (ctaRef.value) observer.observe(ctaRef.value)

  // Cleanup
  return () => {
    observer.disconnect()
  }
})
</script>

<template>
  <section ref="testimonialsRef" class="testimonials">
    <div class="testimonials__background">
      <div class="testimonials__parallax-layer testimonials__parallax-layer--1"></div>
      <div class="testimonials__parallax-layer testimonials__parallax-layer--2"></div>
      <div class="testimonials__parallax-layer testimonials__parallax-layer--3"></div>
    </div>

    <div class="testimonials__container">
      <div ref="headerRef" class="testimonials__header">
        <div class="testimonials__badge">
          <i class="fas fa-heart"></i>
          <span>Testimonios</span>
        </div>
        <h2 class="testimonials__title">Historias que Nos Inspiran</h2>
        <p class="testimonials__subtitle">
          Cada sonrisa es nuestra mayor recompensa. Descubre las experiencias auténticas de quienes han vivido la magia de nuestras creaciones artesanales
        </p>
      </div>
      
      <div ref="masonryRef" class="testimonials__masonry">
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

      <div ref="ctaRef" class="testimonials__cta">
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
// NOTA: Asegúrate de tener tus variables de SCSS ($purple-primary, $white, etc.)
// definidas globalmente o importadas en este archivo para que los estilos compilen.

// ===== ANIMACIONES DE PARALLAX =====
@keyframes parallaxFloat1 {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(2deg);
  }
}

@keyframes parallaxFloat2 {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(-1deg);
  }
}

@keyframes parallaxFloat3 {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-25px) rotate(1deg);
  }
}

// ===== ANIMACIONES MICRO-INTERACCIONES =====
@keyframes pulseGlow {
  0% { 
    transform: scale(1);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.1);
    filter: brightness(1.3) drop-shadow(0 0 8px currentColor);
  }
  100% { 
    transform: scale(1);
    filter: brightness(1);
  }
}

@keyframes morphingGlow {
  0% { 
    transform: scale(1) rotate(0deg);
    box-shadow: 0 0 0 rgba($purple-primary, 0);
  }
  50% { 
    transform: scale(1.05) rotate(2deg);
    box-shadow: 0 0 20px rgba($purple-primary, 0.4);
  }
  100% { 
    transform: scale(1) rotate(0deg);
    box-shadow: 0 0 0 rgba($purple-primary, 0);
  }
}

@keyframes typewriterReveal {
  0% { 
    opacity: 0;
    transform: translateX(-20px);
    clip-path: inset(0 100% 0 0);
  }
  100% { 
    opacity: 1;
    transform: translateX(0);
    clip-path: inset(0 0 0 0);
  }
}

@keyframes slideInFromBottom {
  0% { 
    opacity: 0;
    transform: translateY(60px) scale(0.9);
  }
  100% { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// ===== ANIMACIONES CINEMATOGRÁFICAS DE ENTRADA =====
@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100px) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100px) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideInFromTop {
  0% {
    transform: translateY(-80px) scale(0.9);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideInFromBottom {
  0% {
    transform: translateY(80px) scale(0.9);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes fadeInScale {
  0% {
    transform: scale(0.7) rotate(-5deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.05) rotate(2deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes revealFromCenter {
  0% {
    transform: scale(0) rotate(180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.1) rotate(90deg);
    opacity: 0.7;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes typewriterReveal {
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

@keyframes elasticBounce {
  0% {
    transform: scale(0) translateY(100px);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) translateY(-20px);
    opacity: 0.8;
  }
  70% {
    transform: scale(0.9) translateY(10px);
    opacity: 0.9;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes morphingGlow {
  0% {
    box-shadow: 0 0 0 rgba($purple-primary, 0);
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    box-shadow: 0 0 30px rgba($purple-primary, 0.6);
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    box-shadow: 0 4px 15px rgba($purple-primary, 0.3);
    transform: scale(1);
    opacity: 1;
  }
}

// ===== ANIMACIONES DE HOVER AVANZADAS =====
@keyframes cardHover3D {
  0% {
    transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px);
  }
  100% {
    transform: perspective(1000px) rotateX(-5deg) rotateY(5deg) translateZ(20px);
  }
}

@keyframes shimmerEffect {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 5px rgba($purple-primary, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba($purple-primary, 0.6), 0 0 30px rgba($purple-primary, 0.4);
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
  
  // ===== OPTIMIZACIONES DE RENDIMIENTO =====
  // GPU acceleration para toda la sección
  transform: translateZ(0);
  will-change: auto;
  
  // Optimización de compositing
  contain: layout style paint;
  
  // Reducir repaints durante scroll
  backface-visibility: hidden;
  perspective: 1000px;

  // Se han eliminado los estados iniciales de animación de CSS.
  // GSAP es ahora la única fuente de verdad para estos estilos,
  // lo que previene conflictos y asegura que las animaciones
  // se inicien correctamente.

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
    
    // Estados iniciales para animaciones
    .testimonials__badge {
      opacity: 0;
      transform: translateX(-100px) scale(0.8);
      will-change: transform, opacity;
    }
    
    .testimonials__title {
      opacity: 0;
      transform: translateY(-80px) scale(0.9);
      will-change: transform, opacity;
    }
    
    .testimonials__subtitle {
      opacity: 0;
      transform: translateX(100px) scale(0.8);
      will-change: transform, opacity;
    }
    
    // Animaciones cuando se activa
    &.animate-in {
      .testimonials__badge {
        animation: slideInFromLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        animation-delay: 0.2s;
      }
      
      .testimonials__title {
        animation: slideInFromTop 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        animation-delay: 0.5s;
      }
      
      .testimonials__subtitle {
        animation: slideInFromRight 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        animation-delay: 0.8s;
      }
    }
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
    
    // Estados iniciales para todas las tarjetas
    .testimonial-story {
      opacity: 0;
      will-change: transform, opacity;
      
      // Diferentes estados iniciales según el tipo
      &:nth-child(1) { transform: translateX(-120px) scale(0.7) rotate(-10deg); }
      &:nth-child(2) { transform: translateY(100px) scale(0.8) rotate(5deg); }
      &:nth-child(3) { transform: translateX(120px) scale(0.7) rotate(10deg); }
      &:nth-child(4) { transform: translateY(-100px) scale(0.8) rotate(-5deg); }
      &:nth-child(5) { transform: translateX(-80px) translateY(80px) scale(0.6) rotate(15deg); }
      
      // Animaciones cuando se activa
      &.animate-in {
        &:nth-child(1) {
          animation: fadeInScale 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        &:nth-child(2) {
          animation: elasticBounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        &:nth-child(3) {
          animation: slideInFromRight 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        &:nth-child(4) {
          animation: revealFromCenter 1.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        &:nth-child(5) {
          animation: morphingGlow 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      }
    }
  }

  &__cta {
    text-align: center;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, rgba($white, 0.9), rgba($purple-primary, 0.05));
    border-radius: 24px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba($purple-primary, 0.1);
    
    // Estados iniciales para animaciones
    opacity: 0;
    transform: translateY(60px) scale(0.9);
    will-change: transform, opacity;
    
    // Animación cuando se activa
    &.animate-in {
      animation: slideInFromBottom 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      
      .testimonials__cta-title {
        animation: typewriterReveal 1.2s ease-out forwards;
        animation-delay: 0.3s;
      }
      
      .testimonials__cta-text {
        animation: fadeInScale 0.8s ease-out forwards;
        animation-delay: 0.6s;
      }
      
      .testimonials__cta-button {
        animation: elasticBounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        animation-delay: 0.9s;
      }
    }
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

    &:hover i {
      transform: translateX(4px);
    }
  }
}

.testimonial-story {
  background: $white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba($purple-primary, 0.08);
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-style: preserve-3d;
  will-change: transform, box-shadow;
  
  // Efecto shimmer sutil en el fondo
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba($purple-primary, 0.1),
      transparent
    );
    transition: left 0.6s ease;
    z-index: 1;
  }

  &:hover {
    border-color: rgba($purple-primary, 0.3);
    transform: perspective(1000px) rotateX(-2deg) rotateY(3deg) translateZ(15px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba($purple-primary, 0.15),
      0 10px 20px rgba($purple-primary, 0.1),
      0 0 0 1px rgba($purple-primary, 0.1);
    
    // Activar efecto shimmer
    &::before {
      left: 100%;
    }
    
    // Animaciones de elementos internos
    .testimonial-story__avatar {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 8px 25px rgba($purple-primary, 0.4);
    }
    
    .testimonial-story__quote i,
    .testimonial-story__large-quote i {
      transform: scale(1.2) rotate(10deg);
      color: $purple-primary;
      opacity: 0.6;
    }
    
    .testimonial-story__text {
      transform: translateY(-2px);
    }
    
    .testimonial-story__name {
      color: $purple-dark;
      transform: translateX(3px);
    }
    
    .rating-stars i {
      animation: pulseGlow 0.6s ease-in-out;
    }
    
    .detail-tag {
      transform: translateY(-1px) scale(1.05);
      background: rgba($purple-primary, 0.2);
    }
    
    .testimonial-story__verified {
      transform: scale(1.05);
      background: rgba($purple-primary, 0.2);
    }
  }
  
  // Efectos específicos por tipo de tarjeta
  &--featured:hover {
    transform: perspective(1000px) rotateX(-3deg) rotateY(2deg) translateZ(25px) scale(1.03);
    
    .testimonial-story__badge {
      animation: morphingGlow 0.8s ease-in-out;
    }
  }
  
  &--visual:hover {
    .testimonial-story__image {
      transform: scale(1.05);
      
      i {
        transform: scale(1.3) rotate(15deg);
        color: rgba($white, 1);
      }
    }
  }
  
  &--quote:hover {
    background: linear-gradient(135deg, $purple-dark, $purple-primary);
    transform: perspective(1000px) rotateX(-4deg) rotateY(4deg) translateZ(20px) scale(1.04);
    
    .testimonial-story__large-quote i {
      transform: scale(1.4) rotate(-10deg);
      opacity: 0.5;
    }
  }
  
  &--stats:hover {
    .testimonial-story__stat {
      transform: translateY(-5px) scale(1.02);
      background: linear-gradient(135deg, rgba($purple-primary, 0.1), rgba($purple-light, 0.2));
      
      .stat-number {
        animation: elasticBounce 0.6s ease-in-out;
        color: $purple-dark;
      }
    }
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
        color: $warning;
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
    border: 3px solid rgba($purple-primary, 0.1);
    flex-shrink: 0;
    
    // Optimizaciones de rendimiento
    transform: translateZ(0);
    will-change: transform, box-shadow;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

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
    color: $warning;
    font-size: 0.9rem;
  }
}
</style>