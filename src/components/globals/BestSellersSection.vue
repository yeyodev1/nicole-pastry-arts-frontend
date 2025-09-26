<script setup lang="ts">
// Componente estático sin animaciones GSAP
</script>

<template>
  <!-- Best Sellers Section -->
  <section class="best-sellers">
    <div class="best-sellers__container">
      <div class="best-sellers__header">
        <div class="best-sellers__badge">
          <i class="fas fa-crown"></i>
          <span>Best Sellers</span>
        </div>
        <h2 class="best-sellers__title">Nuestros Productos Estrella</h2>
        <p class="best-sellers__subtitle">
          Los sabores que han conquistado corazones, creados con pasión y técnicas artesanales de clase mundial
        </p>
      </div>
      
      <div class="best-sellers__carousel">
        <div class="carousel-navigation">
          <button class="carousel-nav carousel-nav--prev" aria-label="Producto anterior">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="carousel-nav carousel-nav--next" aria-label="Siguiente producto">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <div class="carousel-container">
          <div class="carousel-track">
            <div class="product-showcase">
              <div class="product-showcase__visual">
                <div class="product-showcase__image">
                  <i class="fas fa-heart"></i>
                </div>
                <div class="product-showcase__rating">
                  <div class="rating-stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                  <span class="rating-count">(127 reseñas)</span>
                </div>
              </div>
              <div class="product-showcase__content">
                <div class="product-showcase__category">Postres Especiales</div>
                <h3 class="product-showcase__title">Chocolate & Frutos Rojos</h3>
                <p class="product-showcase__description">
                  Perfecta combinación de chocolate y compota de frutos rojos a base de fresa, frambuesa, mora y arándanos. Una sinfonía de sabores que despierta todos los sentidos.
                </p>
                <div class="product-showcase__features">
                  <span class="feature-tag">Frutos Premium</span>
                  <span class="feature-tag">Chocolate Belga</span>
                  <span class="feature-tag">Artesanal</span>
                </div>
                <div class="product-showcase__footer">
                  <div class="product-showcase__price">
                    <span class="price-label">Desde</span>
                    <span class="price-amount">$5.36</span>
                  </div>
                  <button class="product-showcase__cta">
                    <span>Ordenar Ahora</span>
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="product-showcase">
              <div class="product-showcase__visual">
                <div class="product-showcase__image">
                  <i class="fas fa-apple-alt"></i>
                </div>
                <div class="product-showcase__rating">
                  <div class="rating-stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                  <span class="rating-count">(89 reseñas)</span>
                </div>
              </div>
              <div class="product-showcase__content">
                <div class="product-showcase__category">Mousse Gourmet</div>
                <h3 class="product-showcase__title">Flor de Manzana</h3>
                <p class="product-showcase__description">
                  Mousse de crema inglesa, bizcocho de vainilla con núcleo de manzana y toffee salado, glaseado con brillo de caramelo. Una experiencia única de texturas y sabores.
                </p>
                <div class="product-showcase__features">
                  <span class="feature-tag">Toffee Salado</span>
                  <span class="feature-tag">Vainilla Madagascar</span>
                  <span class="feature-tag">Glaseado Artístico</span>
                </div>
                <div class="product-showcase__footer">
                  <div class="product-showcase__price">
                    <span class="price-label">Precio</span>
                    <span class="price-amount">$5.40</span>
                  </div>
                  <button class="product-showcase__cta">
                    <span>Ordenar Ahora</span>
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="product-showcase">
              <div class="product-showcase__visual">
                <div class="product-showcase__image">
                  <i class="fas fa-seedling"></i>
                </div>
                <div class="product-showcase__rating">
                  <div class="rating-stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                  <span class="rating-count">(156 reseñas)</span>
                </div>
              </div>
              <div class="product-showcase__content">
                <div class="product-showcase__category">Postres de Avellana</div>
                <h3 class="product-showcase__title">Hazzelnut Premium</h3>
                <p class="product-showcase__description">
                  Postre de avellana caramelizada, bizcocho francés de chocolate y harina de almendra, cubierto de una mousse ligera de chocolate dark milk. Elegancia en cada bocado.
                </p>
                <div class="product-showcase__features">
                  <span class="feature-tag">Avellana Caramelizada</span>
                  <span class="feature-tag">Chocolate Dark Milk</span>
                  <span class="feature-tag">Técnica Francesa</span>
                </div>
                <div class="product-showcase__footer">
                  <div class="product-showcase__price">
                    <span class="price-label">Desde</span>
                    <span class="price-amount">$5.36</span>
                  </div>
                  <button class="product-showcase__cta">
                    <span>Ordenar Ahora</span>
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="product-showcase">
              <div class="product-showcase__visual">
                <div class="product-showcase__image">
                  <i class="fas fa-leaf"></i>
                </div>
                <div class="product-showcase__rating">
                  <div class="rating-stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                  <span class="rating-count">(203 reseñas)</span>
                </div>
              </div>
              <div class="product-showcase__content">
                <div class="product-showcase__category">Sabores Únicos</div>
                <h3 class="product-showcase__title">Pistacho y Mora</h3>
                <p class="product-showcase__description">
                  Mousse a base de pasta de pistacho, núcleo de mora y bizcocho de vainilla, cubierto de un crocante de frutos secos. Una combinación exótica y sofisticada.
                </p>
                <div class="product-showcase__features">
                  <span class="feature-tag">Pasta de Pistacho</span>
                  <span class="feature-tag">Mora Fresca</span>
                  <span class="feature-tag">Crocante Artesanal</span>
                </div>
                <div class="product-showcase__footer">
                  <div class="product-showcase__price">
                    <span class="price-label">Precio</span>
                    <span class="price-amount">$6.40</span>
                  </div>
                  <button class="product-showcase__cta">
                    <span>Ordenar Ahora</span>
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="product-showcase">
              <div class="product-showcase__visual">
                <div class="product-showcase__image">
                  <i class="fas fa-coffee"></i>
                </div>
                <div class="product-showcase__rating">
                  <div class="rating-stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                  <span class="rating-count">(178 reseñas)</span>
                </div>
              </div>
              <div class="product-showcase__content">
                <div class="product-showcase__category">Clásicos Italianos</div>
                <h3 class="product-showcase__title">Tiramisú Artesanal</h3>
                <p class="product-showcase__description">
                  Clásico postre italiano elaborado con café nacional, licor amaretto y mousse de queso mascarpone. La receta tradicional con un toque de excelencia artesanal.
                </p>
                <div class="product-showcase__features">
                  <span class="feature-tag">Café Nacional</span>
                  <span class="feature-tag">Licor Amaretto</span>
                  <span class="feature-tag">Receta Tradicional</span>
                </div>
                <div class="product-showcase__footer">
                  <div class="product-showcase__price">
                    <span class="price-label">Desde</span>
                    <span class="price-amount">$5.36</span>
                  </div>
                  <button class="product-showcase__cta">
                    <span>Ordenar Ahora</span>
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="product-showcase">
              <div class="product-showcase__visual">
                <div class="product-showcase__image">
                  <i class="fas fa-lemon"></i>
                </div>
                <div class="product-showcase__rating">
                  <div class="rating-stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                  <span class="rating-count">(142 reseñas)</span>
                </div>
              </div>
              <div class="product-showcase__content">
                <div class="product-showcase__category">Postres Refrescantes</div>
                <h3 class="product-showcase__title">Peach Melba Deluxe</h3>
                <p class="product-showcase__description">
                  Postre refrescante y ligero, contiene durazno y frambuesa con un bizcocho de vainilla, cubierto de mousse a base de crema inglesa. Frescura y elegancia en perfecta armonía.
                </p>
                <div class="product-showcase__features">
                  <span class="feature-tag">Durazno Fresco</span>
                  <span class="feature-tag">Frambuesa Premium</span>
                  <span class="feature-tag">Crema Inglesa</span>
                </div>
                <div class="product-showcase__footer">
                  <div class="product-showcase__price">
                    <span class="price-label">Desde</span>
                    <span class="price-amount">$5.15</span>
                  </div>
                  <button class="product-showcase__cta">
                    <span>Ordenar Ahora</span>
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="carousel-indicators">
          <button class="indicator active" data-slide="0"></button>
          <button class="indicator" data-slide="1"></button>
          <button class="indicator" data-slide="2"></button>
          <button class="indicator" data-slide="3"></button>
          <button class="indicator" data-slide="4"></button>
          <button class="indicator" data-slide="5"></button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.best-sellers {
  padding: 8rem 0;
  background: linear-gradient(135deg, $white 0%, $background-cream 50%, $white 100%);
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
      radial-gradient(circle at 25% 25%, rgba($purple-primary, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba($purple-primary, 0.03) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
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
    margin-bottom: 6rem;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    color: $white;
    padding: 0.8rem 1.5rem;
    border-radius: 30px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2rem;
    box-shadow: 0 8px 25px rgba($purple-primary, 0.3);

    i {
      font-size: 1rem;
    }
  }

  &__title {
    font-size: 3rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1.5rem;
    letter-spacing: 2px;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 3.8rem;
    }
  }

  &__subtitle {
    font-size: 1.2rem;
    color: $text-light;
    line-height: 1.7;
    max-width: 700px;
    margin: 0 auto;

    @media (min-width: 768px) {
      font-size: 1.3rem;
    }
  }

  &__carousel {
    position: relative;
  }
}

.carousel-navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 3;
  pointer-events: none;

  @media (max-width: 767px) {
    display: none;
  }
}

.carousel-nav {
  width: 60px;
  height: 60px;
  background: rgba($white, 0.95);
  border: 2px solid rgba($purple-primary, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  pointer-events: all;
  box-shadow: 0 8px 25px rgba($purple-primary, 0.15);

  i {
    font-size: 1.2rem;
    color: $purple-primary;
  }

  &:hover {
    background: $purple-primary;
    border-color: $purple-primary;
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba($purple-primary, 0.3);

    i {
      color: $white;
      transform: scale(1.1);
    }
  }

  &--prev {
    margin-left: -30px;
  }

  &--next {
    margin-right: -30px;
  }
}

.carousel-container {
  overflow: hidden;
  border-radius: 20px;
  margin: 0 2rem;

  @media (max-width: 767px) {
    margin: 0;
  }
}

.carousel-track {
  display: flex;
}

.product-showcase {
  min-width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  padding: 3rem;
  background: linear-gradient(135deg, $white 0%, rgba($background-cream, 0.5) 100%);
  border-radius: 20px;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1.5fr;
    gap: 4rem;
    padding: 4rem;
  }

  @media (min-width: 1024px) {
    gap: 5rem;
    padding: 5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, rgba($purple-primary, 0.05), transparent);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }

  &__visual {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 2;
  }

  &__image {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    color: $white;
    margin-bottom: 2rem;
    position: relative;
    box-shadow: 0 20px 60px rgba($purple-primary, 0.3);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

    @media (min-width: 768px) {
      width: 250px;
      height: 250px;
      font-size: 5rem;
    }

    &::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: linear-gradient(135deg, rgba($purple-primary, 0.2), rgba($purple-dark, 0.2));
      border-radius: 50%;
      z-index: -1;
      opacity: 0;
      transition: all 0.6s ease;
    }
  }

  &__rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .rating-stars {
    display: flex;
    gap: 0.3rem;

    i {
      color: $warning;
      font-size: 1.2rem;
    }
  }

  .rating-count {
    font-size: 0.9rem;
    color: $text-light;
    font-weight: 500;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
  }

  &__category {
    font-size: 0.9rem;
    color: $purple-primary;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 2.2rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1.5rem;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 2.8rem;
    }
  }

  &__description {
    font-size: 1.1rem;
    color: $text-light;
    line-height: 1.7;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      font-size: 1.2rem;
    }
  }

  &__features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-bottom: 2.5rem;
  }

  .feature-tag {
    background: rgba($purple-primary, 0.1);
    color: $purple-primary;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid rgba($purple-primary, 0.2);
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;

    @media (max-width: 767px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__price {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    @media (max-width: 767px) {
      align-items: center;
    }

    .price-label {
      font-size: 0.9rem;
      color: $text-light;
      font-weight: 500;
      margin-bottom: 0.3rem;
    }

    .price-amount {
      font-size: 2rem;
      font-weight: 700;
      color: $purple-primary;
    }
  }

  &__cta {
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    color: $white;
    border: none;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    box-shadow: 0 8px 25px rgba($purple-primary, 0.3);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba($white, 0.2), transparent);
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba($purple-primary, 0.4);

      &::before {
        left: 100%;
      }

      i {
        transform: translateX(5px);
      }
    }

   
  }

  &:hover {
    .product-showcase__image {
      transform: scale(1.05) rotate(5deg);

      &::before {
        opacity: 1;
      }
    }
  }
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba($purple-primary, 0.3);
  background: transparent;
  cursor: pointer;

  &.active,
  &:hover {
    background: $purple-primary;
    border-color: $purple-primary;
    transform: scale(1.2);
  }
}
</style>