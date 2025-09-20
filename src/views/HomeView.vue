<script setup lang="ts">
// Vista principal de Nicole Pastry Arts
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__container">
        <div class="hero__content">
          <h1 class="hero__title">
            Bienvenidos a 
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
        <h2 class="features__title">¿Por qué elegir Nicole Pastry Arts?</h2>
        <div class="features__grid">
          <div class="feature-card">
            <div class="feature-card__icon">
              <i class="fas fa-cookie-bite"></i>
            </div>
            <h3 class="feature-card__title">Artesanal</h3>
            <p class="feature-card__description">
              Cada producto es elaborado a mano con ingredientes premium
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">
              <i class="fas fa-birthday-cake"></i>
            </div>
            <h3 class="feature-card__title">Personalizado</h3>
            <p class="feature-card__description">
              Diseños únicos adaptados a tus celebraciones especiales
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-card__icon">
              <i class="fas fa-star"></i>
            </div>
            <h3 class="feature-card__title">Calidad Premium</h3>
            <p class="feature-card__description">
              Solo utilizamos los mejores ingredientes para garantizar el sabor
            </p>
          </div>
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
  padding: 6rem 0;
  background-color: $white;

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

  &__title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 3rem;

    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 3rem;
    }
  }
}

.feature-card {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background-color: $background-cream;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba($purple-primary, 0.1);
  }

  &__icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    color: $purple-primary;
    
    i {
      transition: transform 0.3s ease;
    }
  }
  
  &:hover &__icon i {
    transform: scale(1.1);
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    color: $purple-primary;
    margin-bottom: 1rem;
  }

  &__description {
    color: $text-light;
    line-height: 1.6;
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
  transition: all 0.3s ease;
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
</style>