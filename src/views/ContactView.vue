<script setup lang="ts">
// Vista de Contacto de Nicole Pastry Arts
</script>

<template>
  <div class="contact">
    <section class="contact-hero">
      <div class="contact-hero__container">
        <h1 class="contact-hero__title">Contacto</h1>
        <p class="contact-hero__subtitle">
          Estamos aquí para hacer realidad tus ideas más dulces
        </p>
      </div>
    </section>

    <section class="contact-content">
      <div class="contact-content__container">
        <div class="contact-info">
          <h2 class="contact-info__title">¿Cómo podemos ayudarte?</h2>
          <p class="contact-info__text">
            Contáctanos para pedidos personalizados, consultas sobre nuestros productos 
            o cualquier pregunta que tengas. Estaremos encantados de atenderte.
          </p>
          
          <div class="contact-methods">
            <div class="contact-method">
              <h3 class="contact-method__title">
                <i class="fas fa-phone"></i> Teléfono
              </h3>
              <p class="contact-method__info">+1 (555) 123-4567</p>
            </div>
            
            <div class="contact-method">
              <h3 class="contact-method__title">
                <i class="fas fa-envelope"></i> Email
              </h3>
              <p class="contact-method__info">info@nicolepastryarts.com</p>
            </div>
            
            <div class="contact-method">
              <h3 class="contact-method__title">
                <i class="fas fa-map-marker-alt"></i> Ubicación
              </h3>
              <p class="contact-method__info">123 Sweet Street, Bakery District</p>
            </div>
            
            <div class="contact-method">
              <h3 class="contact-method__title">
                <i class="fas fa-clock"></i> Horarios
              </h3>
              <p class="contact-method__info">
                Lun - Vie: 8:00 AM - 6:00 PM<br>
                Sáb - Dom: 9:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.contact {
  min-height: 100vh;
}

.contact-hero {
  background: linear-gradient(135deg, $background-cream 0%, $white 100%);
  padding: 6rem 0 4rem;

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
    color: $purple-primary;
    margin-bottom: 1.5rem;

    @media (min-width: 768px) {
      font-size: 4rem;
    }
  }

  &__subtitle {
    font-size: 1.3rem;
    color: $text-light;

    @media (min-width: 768px) {
      font-size: 1.5rem;
    }
  }
}

.contact-content {
  padding: 6rem 0;
  background-color: $white;

  &__container {
    max-width: 1000px;
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

.contact-info {
  text-align: center;

  &__title {
    font-size: 2.5rem;
    font-weight: 700;
    color: $text-dark;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }

  &__text {
    font-size: 1.2rem;
    line-height: 1.6;
    color: $text-light;
    margin-bottom: 4rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}

.contact-methods {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }
}

.contact-method {
  background-color: $background-cream;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba($purple-primary, 0.1);
  }

  &__title {
    font-size: 1.3rem;
    font-weight: 600;
    color: $purple-primary;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    
    i {
      font-size: 1.5rem;
      transition: transform 0.3s ease;
    }
  }
  
  &:hover &__title i {
    transform: scale(1.1);
  }

  &__info {
    color: $text-light;
    line-height: 1.6;
    font-size: 1rem;
  }
}
</style>