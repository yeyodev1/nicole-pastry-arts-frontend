<script setup lang="ts">
// Vista Sobre Nosotros de Nicole Pastry Arts
</script>

<template>
  <div class="about">
    <section class="about-hero">
      <div class="about-hero__container">
        <h1 class="about-hero__title">Sobre Nosotros</h1>
        <p class="about-hero__subtitle">
          Conoce la historia detrás de Nicole Pastry Arts
        </p>
      </div>
    </section>

    <section class="about-content">
      <div class="about-content__container">
        <div class="about-story">
          <h2 class="about-story__title">Nuestra Historia</h2>
          <p class="about-story__text">
            Nicole Pastry Arts nació de la pasión por crear momentos dulces e inolvidables. 
            Desde nuestros inicios, nos hemos dedicado a la elaboración artesanal de productos 
            de pastelería de la más alta calidad, utilizando ingredientes premium y técnicas 
            tradicionales combinadas con innovación moderna.
          </p>
          <p class="about-story__text">
            Cada creación es única y está diseñada para hacer de tus celebraciones algo especial. 
            Nuestro compromiso es brindar no solo sabores excepcionales, sino también experiencias 
            memorables que perduren en el tiempo.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.about {
  min-height: 100vh;
}

.about-hero {
  background: linear-gradient(135deg, $purple-primary 0%, $purple-dark 100%);
  padding: 6rem 0 4rem;
  color: $white;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }

  &__title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;

    @media (min-width: 768px) {
      font-size: 4rem;
    }
  }

  &__subtitle {
    font-size: 1.3rem;
    opacity: 0.9;

    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }
}

.about-content {
  padding: 6rem 0;
  background-color: $white;

  &__container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }

    @media (min-width: 1024px) {
      padding: 0 3rem;
    }
  }
}

.about-story {
  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: $purple-primary;
    margin-bottom: 2rem;
    text-align: center;

    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }

  &__text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: $text-light;
    margin-bottom: 1.5rem;

    @media (min-width: 768px) {
      font-size: 1.2rem;
    }
  }
}
</style>