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
              <i class="fas fa-heart"></i>
            </div>
            <h3 class="feature-card__title">Delicioso</h3>
            <p class="feature-card__description">
              Sabores únicos que harán especial cada momento
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

    <!-- Categories Section -->
    <section class="categories">
      <div class="categories__container">
        <h2 class="categories__title">CATEGORÍAS</h2>
        <p class="categories__subtitle">
          Descubre nuestras categorías y encuentra el dulce perfecto para cada ocasión. 
          Desde pasteles clásicos hasta galletas y postres de vanguardia. 
          Navega por nuestras opciones y déjate tentar por nuestras creaciones.
        </p>
        <div class="categories__grid">
          <div class="category-card">
            <div class="category-card__image">
              <i class="fas fa-birthday-cake"></i>
            </div>
            <h3 class="category-card__title">Pasteles</h3>
            <p class="category-card__description">Pasteles artesanales para celebraciones especiales</p>
          </div>
          <div class="category-card">
            <div class="category-card__image">
              <i class="fas fa-cookie"></i>
            </div>
            <h3 class="category-card__title">Galletas</h3>
            <p class="category-card__description">Galletas gourmet con sabores únicos</p>
          </div>
          <div class="category-card">
            <div class="category-card__image">
              <i class="fas fa-ice-cream"></i>
            </div>
            <h3 class="category-card__title">Postres</h3>
            <p class="category-card__description">Postres de vanguardia con técnicas modernas</p>
          </div>
          <div class="category-card">
            <div class="category-card__image">
              <i class="fas fa-bread-slice"></i>
            </div>
            <h3 class="category-card__title">Bollería</h3>
            <p class="category-card__description">Bollería fresca elaborada diariamente</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Best Sellers Section -->
    <section class="bestsellers">
      <div class="bestsellers__container">
        <h2 class="bestsellers__title">BEST SELLERS</h2>
        <p class="bestsellers__subtitle">
          ¡No te pierdas nuestros Best Sellers! Estos son los dulces favoritos de nuestros clientes. 
          Pruébalos y elige tu favorito.
        </p>
        <div class="bestsellers__grid">
          <div class="product-card">
            <div class="product-card__image">
              <i class="fas fa-heart"></i>
            </div>
            <h3 class="product-card__title">Chocolate & Frutos Rojos</h3>
            <p class="product-card__price">$5.36 – $45.00</p>
            <p class="product-card__description">
              Perfecta combinación de chocolate y compota de frutos rojos a base de fresa, frambuesa, mora y arándanos.
            </p>
          </div>
          <div class="product-card">
            <div class="product-card__image">
              <i class="fas fa-apple-alt"></i>
            </div>
            <h3 class="product-card__title">Flor de Manzana</h3>
            <p class="product-card__price">$5.40</p>
            <p class="product-card__description">
              Mousse de crema inglesa, bizcocho de vainilla con núcleo de manzana y toffee salado, glaseado con brillo de caramelo.
            </p>
          </div>
          <div class="product-card">
            <div class="product-card__image">
              <i class="fas fa-seedling"></i>
            </div>
            <h3 class="product-card__title">Hazzelnut</h3>
            <p class="product-card__price">$5.36 – $45.00</p>
            <p class="product-card__description">
              Postre de avellana caramelizada, bizcocho francés de chocolate y harina de almendra, cubierto de una mousse ligera de chocolate dark milk.
            </p>
          </div>
          <div class="product-card">
            <div class="product-card__image">
              <i class="fas fa-leaf"></i>
            </div>
            <h3 class="product-card__title">Pistacho y Mora</h3>
            <p class="product-card__price">$6.40</p>
            <p class="product-card__description">
              Mousse a base de pasta de pistacho, núcleo de mora y bizcocho de vainilla, cubierto de un crocante de frutos secos.
            </p>
          </div>
          <div class="product-card">
            <div class="product-card__image">
              <i class="fas fa-coffee"></i>
            </div>
            <h3 class="product-card__title">Tiramisú</h3>
            <p class="product-card__price">$5.36 – $45.00</p>
            <p class="product-card__description">
              Clásico postre italiano elaborado con café nacional, licor amaretto y mousse de queso mascarpone.
            </p>
          </div>
          <div class="product-card">
            <div class="product-card__image">
              <i class="fas fa-lemon"></i>
            </div>
            <h3 class="product-card__title">Peach Melba</h3>
            <p class="product-card__price">$5.15 – $43.00</p>
            <p class="product-card__description">
              Postre refrescante y ligero, contiene durazno y frambuesa con un bizcocho de vainilla, cubierto de mousse a base de crema inglesa.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Chef Section -->
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

    <!-- Testimonials Section -->
    <section class="testimonials">
      <div class="testimonials__container">
        <h2 class="testimonials__title">Lo que dicen nuestros clientes</h2>
        <div class="testimonials__grid">
          <div class="testimonial-card">
            <div class="testimonial-card__content">
              <p class="testimonial-card__text">
                "Un lugar con mucho encanto y tradición. Los postres son deliciosos y el café es muy bueno."
              </p>
              <div class="testimonial-card__author">
                <img 
                  src="https://i.pravatar.cc/150?img=1" 
                  alt="Carolina Viteri" 
                  class="testimonial-card__avatar"
                />
                <div class="testimonial-card__info">
                  <h4 class="testimonial-card__name">Carolina Viteri</h4>
                  <p class="testimonial-card__handle">@carolinaviterij</p>
                </div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-card__content">
              <p class="testimonial-card__text">
                "La pastelería es un lujo para los sentidos. Cada pastel está meticulosamente elaborado. Definitivamente, una experiencia gourmet."
              </p>
              <div class="testimonial-card__author">
                <img 
                  src="https://i.pravatar.cc/150?img=7" 
                  alt="Hanz Von Buchwald" 
                  class="testimonial-card__avatar"
                />
                <div class="testimonial-card__info">
                  <h4 class="testimonial-card__name">Hanz Von Buchwald</h4>
                  <p class="testimonial-card__handle">@hanzvba</p>
                </div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-card__content">
              <p class="testimonial-card__text">
                "Cada pastel es una obra de arte. La atención al detalle y la calidad de los ingredientes son sobresalientes."
              </p>
              <div class="testimonial-card__author">
                <img 
                  src="https://i.pravatar.cc/150?img=5" 
                  alt="Priscilla Granizo" 
                  class="testimonial-card__avatar"
                />
                <div class="testimonial-card__info">
                  <h4 class="testimonial-card__name">Priscilla Granizo</h4>
                  <p class="testimonial-card__handle">@prisciigraniizo</p>
                </div>
              </div>
            </div>
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

// Categories Section
.categories {
  padding: 6rem 0;
  background-color: $background-cream;

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
    margin-bottom: 1.5rem;
    letter-spacing: 2px;

    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }

  &__subtitle {
    text-align: center;
    font-size: 1.1rem;
    color: $text-light;
    margin-bottom: 4rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;

    @media (min-width: 768px) {
      font-size: 1.2rem;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem;
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }
  }
}

.category-card {
  text-align: center;
  padding: 2.5rem 1.5rem;
  border-radius: 16px;
  background-color: $white;
  transition: all 0.3s ease;
  border: 1px solid rgba($purple-primary, 0.1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba($purple-primary, 0.15);
    border-color: rgba($purple-primary, 0.2);
  }

  &__image {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    color: $purple-primary;

    i {
      transition: transform 0.3s ease;
    }
  }

  &:hover &__image i {
    transform: scale(1.1);
  }

  &__title {
    font-size: 1.4rem;
    font-weight: 600;
    color: $purple-primary;
    margin-bottom: 0.8rem;
  }

  &__description {
    color: $text-light;
    line-height: 1.5;
    font-size: 0.95rem;
  }
}

// Best Sellers Section
.bestsellers {
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
    margin-bottom: 1.5rem;
    letter-spacing: 2px;

    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }

  &__subtitle {
    text-align: center;
    font-size: 1.1rem;
    color: $text-light;
    margin-bottom: 4rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;

    @media (min-width: 768px) {
      font-size: 1.2rem;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem;
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
  }
}

.product-card {
  padding: 2rem;
  border-radius: 16px;
  background-color: $background-cream;
  transition: all 0.3s ease;
  border: 1px solid rgba($purple-primary, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba($purple-primary, 0.12);
    border-color: rgba($purple-primary, 0.2);
  }

  &__image {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: $purple-primary;

    i {
      transition: transform 0.3s ease;
    }
  }

  &:hover &__image i {
    transform: scale(1.1);
  }

  &__title {
    font-size: 1.3rem;
    font-weight: 600;
    color: $purple-primary;
    margin-bottom: 0.8rem;
    text-align: center;
  }

  &__price {
    font-size: 1.1rem;
    font-weight: 700;
    color: $purple-dark;
    margin-bottom: 1rem;
    text-align: center;
  }

  &__description {
    color: $text-light;
    line-height: 1.6;
    font-size: 0.95rem;
    text-align: center;
  }
}

// Chef Section
.chef {
  padding: 6rem 0;
  background: linear-gradient(135deg, $purple-primary 0%, $purple-dark 100%);
  color: $white;

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
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;

    @media (min-width: 1024px) {
      grid-template-columns: 2fr 1fr;
      gap: 4rem;
    }
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    letter-spacing: 2px;

    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }

  &__quote {
    font-size: 1.2rem;
    line-height: 1.7;
    font-style: italic;
    margin-bottom: 2.5rem;
    padding-left: 2rem;
    border-left: 4px solid $white;
    opacity: 0.95;

    @media (min-width: 768px) {
      font-size: 1.3rem;
    }
  }

  &__info {
    text-align: left;

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
  }

  &__photo {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid $white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    }
    
    @media (max-width: 767px) {
      width: 220px;
      height: 220px;
    }
    
    @media (max-width: 480px) {
      width: 180px;
      height: 180px;
    }
  }
}

// Testimonials Section
.testimonials {
  padding: 6rem 0;
  background-color: $background-cream;

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
    margin-bottom: 4rem;

    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem;
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
  }
}

.testimonial-card {
  background-color: $white;
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba($purple-primary, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba($purple-primary, 0.12);
    border-color: rgba($purple-primary, 0.2);
  }

  &__content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__text {
    font-size: 1rem;
    line-height: 1.6;
    color: $text-light;
    margin-bottom: 1.5rem;
    font-style: italic;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 1rem;
    flex-shrink: 0;
    object-fit: cover;
    border: 3px solid $purple-primary;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      border-color: $purple-dark;
    }
  }

  &__name {
    font-size: 1rem;
    font-weight: 600;
    color: $purple-primary;
    margin-bottom: 0.2rem;
  }

  &__handle {
    font-size: 0.9rem;
    color: $text-light;
    opacity: 0.8;
  }
}
</style>