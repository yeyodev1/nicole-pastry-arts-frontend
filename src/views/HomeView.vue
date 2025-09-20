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
        <div class="features__header">
          <h2 class="features__title">¿Por qué elegir Nicole Pastry Arts?</h2>
          <p class="features__subtitle">Tres pilares fundamentales que nos distinguen en el mundo de la pastelería artesanal</p>
        </div>
        <div class="features__showcase">
          <div class="feature-highlight">
            <div class="feature-highlight__visual">
              <div class="feature-highlight__icon-wrapper">
                <i class="fas fa-cookie-bite"></i>
              </div>
              <div class="feature-highlight__decoration"></div>
            </div>
            <div class="feature-highlight__content">
              <span class="feature-highlight__number">01</span>
              <h3 class="feature-highlight__title">Artesanal</h3>
              <p class="feature-highlight__description">
                Cada producto es elaborado a mano con técnicas tradicionales y ingredientes premium seleccionados cuidadosamente
              </p>
              <div class="feature-highlight__badge">Hecho a mano</div>
            </div>
          </div>
          <div class="feature-highlight feature-highlight--reverse">
            <div class="feature-highlight__visual">
              <div class="feature-highlight__icon-wrapper">
                <i class="fas fa-heart"></i>
              </div>
              <div class="feature-highlight__decoration"></div>
            </div>
            <div class="feature-highlight__content">
              <span class="feature-highlight__number">02</span>
              <h3 class="feature-highlight__title">Delicioso</h3>
              <p class="feature-highlight__description">
                Sabores únicos y equilibrados que despiertan emociones y crean momentos inolvidables en cada bocado
              </p>
              <div class="feature-highlight__badge">Sabor único</div>
            </div>
          </div>
          <div class="feature-highlight">
            <div class="feature-highlight__visual">
              <div class="feature-highlight__icon-wrapper">
                <i class="fas fa-star"></i>
              </div>
              <div class="feature-highlight__decoration"></div>
            </div>
            <div class="feature-highlight__content">
              <span class="feature-highlight__number">03</span>
              <h3 class="feature-highlight__title">Calidad Premium</h3>
              <p class="feature-highlight__description">
                Solo utilizamos los mejores ingredientes del mercado para garantizar la excelencia en cada creación
              </p>
              <div class="feature-highlight__badge">Premium</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories">
      <div class="categories__container">
        <div class="categories__header">
          <h2 class="categories__title">CATEGORÍAS</h2>
          <p class="categories__subtitle">
            Descubre nuestras categorías y encuentra el dulce perfecto para cada ocasión. 
            Desde pasteles clásicos hasta galletas y postres de vanguardia. 
            Navega por nuestras opciones y déjate tentar por nuestras creaciones.
          </p>
        </div>
        <div class="categories__mosaic">
          <div class="category-tile category-tile--large category-tile--primary">
            <div class="category-tile__background"></div>
            <div class="category-tile__content">
              <div class="category-tile__icon">
                <i class="fas fa-birthday-cake"></i>
              </div>
              <h3 class="category-tile__title">Pasteles</h3>
              <p class="category-tile__description">Pasteles artesanales para celebraciones especiales y momentos únicos</p>
              <div class="category-tile__badge">Especialidad</div>
            </div>
            <div class="category-tile__overlay"></div>
          </div>
          <div class="category-tile category-tile--medium">
            <div class="category-tile__background"></div>
            <div class="category-tile__content">
              <div class="category-tile__icon">
                <i class="fas fa-cookie"></i>
              </div>
              <h3 class="category-tile__title">Galletas</h3>
              <p class="category-tile__description">Galletas gourmet con sabores únicos</p>
            </div>
            <div class="category-tile__overlay"></div>
          </div>
          <div class="category-tile category-tile--medium">
            <div class="category-tile__background"></div>
            <div class="category-tile__content">
              <div class="category-tile__icon">
                <i class="fas fa-ice-cream"></i>
              </div>
              <h3 class="category-tile__title">Postres</h3>
              <p class="category-tile__description">Postres de vanguardia con técnicas modernas</p>
            </div>
            <div class="category-tile__overlay"></div>
          </div>
          <div class="category-tile category-tile--wide">
            <div class="category-tile__background"></div>
            <div class="category-tile__content">
              <div class="category-tile__icon">
                <i class="fas fa-bread-slice"></i>
              </div>
              <h3 class="category-tile__title">Bollería</h3>
              <p class="category-tile__description">Bollería fresca elaborada diariamente con ingredientes de primera calidad</p>
              <div class="category-tile__badge">Diario</div>
            </div>
            <div class="category-tile__overlay"></div>
          </div>
        </div>
      </div>
    </section>

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
  padding: 8rem 0;
  background: linear-gradient(135deg, $white 0%, $background-cream 50%, $white 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23f8f4f0" opacity="0.3"/><circle cx="75" cy="75" r="1" fill="%23f8f4f0" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.5;
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
    margin-bottom: 5rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
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
    font-weight: 400;

    @media (min-width: 768px) {
      font-size: 1.3rem;
    }
  }

  &__showcase {
    display: flex;
    flex-direction: column;
    gap: 4rem;

    @media (min-width: 1024px) {
      gap: 6rem;
    }
  }
}

.feature-highlight {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  padding: 3rem 2rem;
  background: rgba($white, 0.8);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba($purple-primary, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 2fr;
    gap: 4rem;
    padding: 4rem 3rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba($purple-primary, 0.05), transparent);
    transition: left 0.8s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba($purple-primary, 0.15);
    border-color: rgba($purple-primary, 0.2);

    &::before {
      left: 100%;
    }

    .feature-highlight__icon-wrapper {
      transform: scale(1.1) rotate(5deg);
    }

    .feature-highlight__decoration {
      transform: scale(1.2) rotate(180deg);
    }
  }

  &--reverse {
    @media (min-width: 1024px) {
      grid-template-columns: 2fr 1fr;

      .feature-highlight__visual {
        order: 2;
      }

      .feature-highlight__content {
        order: 1;
      }
    }
  }

  &__visual {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 200px;

    @media (min-width: 1024px) {
      min-height: 250px;
    }
  }

  &__icon-wrapper {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: $white;
    position: relative;
    z-index: 2;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 10px 30px rgba($purple-primary, 0.3);

    @media (min-width: 1024px) {
      width: 140px;
      height: 140px;
      font-size: 3.5rem;
    }

    &::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      background: linear-gradient(135deg, $purple-light, $purple-primary);
      border-radius: 50%;
      z-index: -1;
      opacity: 0.3;
    }
  }

  &__decoration {
    position: absolute;
    width: 200px;
    height: 200px;
    border: 2px solid rgba($purple-primary, 0.2);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

    &::before {
      content: '';
      position: absolute;
      top: -20px;
      left: -20px;
      right: -20px;
      bottom: -20px;
      border: 1px solid rgba($purple-primary, 0.1);
      border-radius: 50%;
    }
  }

  &__content {
    text-align: center;

    @media (min-width: 1024px) {
      text-align: left;
    }
  }

  &__number {
    display: inline-block;
    font-size: 1rem;
    font-weight: 700;
    color: $purple-primary;
    background: rgba($purple-primary, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    margin-bottom: 1rem;
    letter-spacing: 1px;
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: $purple-primary;
    margin-bottom: 1.5rem;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 2.2rem;
    }
  }

  &__description {
    font-size: 1.1rem;
    color: $text-light;
    line-height: 1.7;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      font-size: 1.15rem;
    }
  }

  &__badge {
    display: inline-block;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    color: $white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 15px rgba($purple-primary, 0.3);
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
  padding: 8rem 0;
  background: linear-gradient(135deg, $background-cream 0%, rgba($purple-primary, 0.03) 50%, $background-cream 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 20% 20%, rgba($purple-primary, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba($purple-primary, 0.05) 0%, transparent 50%);
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
    margin-bottom: 5rem;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  &__title {
    font-size: 2.8rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 1.5rem;
    letter-spacing: 3px;
    position: relative;

    @media (min-width: 768px) {
      font-size: 3.5rem;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, $purple-primary, $purple-dark);
      border-radius: 2px;
    }
  }

  &__subtitle {
    font-size: 1.2rem;
    color: $text-light;
    line-height: 1.7;
    margin-top: 2rem;

    @media (min-width: 768px) {
      font-size: 1.3rem;
    }
  }

  &__mosaic {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(3, 200px);
      gap: 2rem;
    }

    @media (min-width: 1024px) {
      grid-template-rows: repeat(3, 220px);
      gap: 2.5rem;
    }
  }
}

.category-tile {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 250px;

  @media (min-width: 768px) {
    min-height: auto;
  }

  &--large {
    @media (min-width: 768px) {
      grid-column: span 2;
      grid-row: span 2;
    }
  }

  &--medium {
    @media (min-width: 768px) {
      grid-column: span 1;
      grid-row: span 1;
    }
  }

  &--wide {
    @media (min-width: 768px) {
      grid-column: span 2;
      grid-row: span 1;
    }
  }

  &--primary {
    .category-tile__background {
      background: linear-gradient(135deg, $purple-primary 0%, $purple-dark 100%);
    }

    .category-tile__content {
      color: $white;
    }

    .category-tile__icon {
      background: rgba($white, 0.2);
      color: $white;
    }
  }

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, $white 0%, $background-cream 100%);
    transition: all 0.6s ease;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba($purple-primary, 0.1) 100%);
    opacity: 0;
    transition: all 0.6s ease;
  }

  &__content {
    position: relative;
    z-index: 2;
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    color: $text-dark;

    @media (min-width: 1024px) {
      padding: 2.5rem;
    }
  }

  &__icon {
    width: 80px;
    height: 80px;
    background: rgba($purple-primary, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: $purple-primary;
    margin: 0 auto 1.5rem;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

    .category-tile--large & {
      width: 100px;
      height: 100px;
      font-size: 3rem;
    }
  }

  &__title {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;

    .category-tile--large & {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }
  }

  &__description {
    font-size: 1rem;
    line-height: 1.5;
    opacity: 0.9;

    .category-tile--large & {
      font-size: 1.1rem;
      line-height: 1.6;
    }
  }

  &__badge {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: rgba($white, 0.9);
    color: $purple-primary;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    backdrop-filter: blur(10px);
  }

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 25px 60px rgba($purple-primary, 0.2);

    .category-tile__background {
      transform: scale(1.1);
    }

    .category-tile__overlay {
      opacity: 1;
    }

    .category-tile__icon {
      transform: scale(1.1) rotate(5deg);
    }

    &:not(.category-tile--primary) {
      .category-tile__background {
        background: linear-gradient(135deg, $purple-primary 0%, $purple-dark 100%);
      }

      .category-tile__content {
        color: $white;
      }

      .category-tile__icon {
        background: rgba($white, 0.2);
        color: $white;
      }
    }
  }
}

// Best Sellers Section
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  pointer-events: all;
  box-shadow: 0 8px 25px rgba($purple-primary, 0.15);

  i {
    font-size: 1.2rem;
    color: $purple-primary;
    transition: all 0.3s ease;
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
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
      color: #ffd700;
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
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
      transition: left 0.6s ease;
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

    i {
      transition: transform 0.3s ease;
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
  transition: all 0.3s ease;

  &.active,
  &:hover {
    background: $purple-primary;
    border-color: $purple-primary;
    transform: scale(1.2);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(180deg);
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
// Testimonials Section
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

    i {
      transition: transform 0.3s ease;
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
  transition: all 0.4s ease;
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

@keyframes parallaxFloat1 {

  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }

  25% {
    transform: translateY(-10px) translateX(5px);
  }

  50% {
    transform: translateY(-5px) translateX(-3px);
  }

  75% {
    transform: translateY(-15px) translateX(8px);
  }
}

@keyframes parallaxFloat2 {

  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }

  33% {
    transform: translateY(-8px) translateX(-6px);
  }

  66% {
    transform: translateY(-12px) translateX(4px);
  }
}

@keyframes parallaxFloat3 {

  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }

  50% {
    transform: translateY(-6px) translateX(-2px);
  }
}
</style>