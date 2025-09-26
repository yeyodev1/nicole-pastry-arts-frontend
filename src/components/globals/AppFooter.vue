<script setup lang="ts">
const whatsappNumber = '+593987149283'
const whatsappMessage = 'Hola! Necesito ayuda, vengo de su página web'

const openWhatsApp = () => {
  const encodedMessage = encodeURIComponent(whatsappMessage)
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`
  window.open(whatsappUrl, '_blank')
}

const openEmail = () => {
  window.open('mailto:proyectos@nicole.com.ec', '_blank')
}

const openMallDelSol = () => {
  window.open('https://www.google.com/maps/place/Nicole+Pastry+Arts/@-2.1558038,-79.8983288,17z/data=!3m1!4b1!4m6!3m5!1s0x902d6d517e8c2cf3:0xbd06d5b8a53e3b5e!8m2!3d-2.1558092!4d-79.8934579!16s%2Fg%2F11v6f7fq0v?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D', '_blank')
}

const openSanMarino = () => {
  window.open('https://www.google.com/maps/place/Nicole+Pastry+Arts+-+San+Marino/@-2.1693797,-79.9006856,17z/data=!3m1!4b1!4m6!3m5!1s0x902d6d8e0c019607:0x33ba5c6f72ce3e9!8m2!3d-2.1693851!4d-79.8981107!16s%2Fg%2F11x61kngcg?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D', '_blank')
}
</script>

<template>
  <footer class="app-footer" role="contentinfo">
    <div class="footer__container">
      <!-- Sección principal del footer -->
      <div class="footer__content">
        <!-- Logo y descripción -->
        <div class="footer__brand">
          <h3 class="footer__logo">Nicole Pastry Arts</h3>
          <p class="footer__description">
            Creando momentos dulces e inolvidables desde el corazón
          </p>
          <div class="footer__social-main">
            <button 
              @click="openWhatsApp" 
              class="footer__social-btn footer__social-btn--primary" 
              title="Contactar por WhatsApp"
              aria-label="Contactar por WhatsApp"
            >
              <i class="fab fa-whatsapp" aria-hidden="true"></i>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        <!-- Enlaces rápidos -->
        <nav class="footer__navigation" aria-label="Enlaces del footer">
          <h4 class="footer__title">Navegación</h4>
          <ul class="footer__list">
            <li><router-link to="/" class="footer__link">Inicio</router-link></li>
            <li><router-link to="/about" class="footer__link">Nosotros</router-link></li>
            <li><router-link to="/contact" class="footer__link">Contacto</router-link></li>
          </ul>
        </nav>

        <!-- Información de contacto -->
        <div class="footer__contact">
          <h4 class="footer__title">Contacto</h4>
          <div class="footer__contact-info">
            <div class="footer__contact-item footer__contact-item--clickable" @click="openWhatsApp">
              <i class="fab fa-whatsapp footer__contact-icon" aria-hidden="true"></i>
              <span class="footer__contact-text">{{ whatsappNumber }}</span>
            </div>
            <div class="footer__contact-item footer__contact-item--clickable" @click="openEmail">
              <i class="fas fa-envelope footer__contact-icon" aria-hidden="true"></i>
              <span class="footer__contact-text">proyectos@nicole.com.ec</span>
            </div>
            <div class="footer__contact-item footer__contact-item--clickable" @click="openMallDelSol">
              <i class="fas fa-map-marker-alt footer__contact-icon" aria-hidden="true"></i>
              <span class="footer__contact-text">Mall del Sol</span>
            </div>
            <div class="footer__contact-item footer__contact-item--clickable" @click="openSanMarino">
              <i class="fas fa-map-marker-alt footer__contact-icon" aria-hidden="true"></i>
              <span class="footer__contact-text">San Marino</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright y enlaces legales -->
      <div class="footer__bottom">
        <div class="footer__copyright">
          <p class="footer__copyright-text">
            © <span class="copyright__year">2025</span> Nicole Pastry Arts. Todos los derechos reservados.
          </p>
        </div>
        <div class="footer__legal">
          <a href="#" class="footer__legal-link">Política de Privacidad</a>
          <span class="footer__separator">•</span>
          <a href="#" class="footer__legal-link">Términos de Servicio</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  background: $white;
  color: $text-dark;
  margin-top: auto;
  position: relative;
  overflow: hidden;
  border-top: 1px solid $border-light;
  padding: 3rem 0 2rem;

  @media (min-width: 768px) {
    padding: 4rem 0 2.5rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 20%, rgba($purple-primary, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba($purple-primary, 0.01) 0%, transparent 50%);
    pointer-events: none;
  }
}

.footer__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }

  @media (min-width: 1024px) {
    padding: 0 3rem;
  }
}

.footer__content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-bottom: 2.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1.2fr;
    gap: 3rem;
    align-items: start;
  }

  @media (min-width: 1024px) {
    gap: 4rem;
    margin-bottom: 3rem;
  }
}

// Brand Section
.footer__brand {
  .footer__logo {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, $purple-primary, $purple-dark);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 2rem;
      margin-bottom: 1.25rem;
    }
  }

  .footer__description {
    color: $text-light;
    line-height: 1.6;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;

    @media (min-width: 768px) {
      font-size: 1rem;
      margin-bottom: 2rem;
    }
  }
}

.footer__social-main {
  .footer__social-btn--primary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, $success, $success-dark);
    color: $white;
    border: none;
    padding: 0.875rem 1.5rem;
    border-radius: 50px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba($success, 0.2);
    text-decoration: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($success, 0.3);
      background: linear-gradient(135deg, $success-dark, $success);
    }

    &:active {
      transform: translateY(0);
    }

    i {
      font-size: 1.1rem;
    }

    @media (min-width: 768px) {
      padding: 1rem 1.75rem;
      font-size: 1rem;
    }
  }
}

// Navigation Section
.footer__navigation {
  .footer__title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    color: $purple-primary;
    position: relative;

    @media (min-width: 768px) {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 2rem;
      height: 2px;
      background: linear-gradient(90deg, $purple-primary, transparent);
    }
  }

  .footer__list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.75rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .footer__link {
    color: $text-light;
    text-decoration: none;
    transition: all 0.3s ease;
    font-size: 0.95rem;
    position: relative;
    display: inline-block;

    &:hover {
      color: $purple-primary;
      transform: translateX(4px);
    }

    &::before {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: $purple-primary;
      transition: width 0.3s ease;
    }

    &:hover::before {
      width: 100%;
    }
  }
}

// Contact Section
.footer__contact {
  .footer__title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    color: $purple-primary;
    position: relative;

    @media (min-width: 768px) {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 2rem;
      height: 2px;
      background: linear-gradient(90deg, $purple-primary, transparent);
    }
  }

  .footer__contact-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .footer__contact-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0;
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(2px);

      .footer__contact-icon {
        color: $purple-primary;
        transform: scale(1.1);
      }
    }
    
    &--clickable {
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: rgba($purple-primary, 0.1);
        transform: translateX(0.25rem);
        
        .footer__contact-icon {
          color: $purple-primary;
          transform: scale(1.1);
        }
        
        .footer__contact-text {
          color: $purple-primary;
        }
      }
      
      &:focus {
        outline: 2px solid $purple-primary;
        outline-offset: 2px;
      }
      
      &:active {
        transform: translateX(0.125rem) scale(0.98);
      }
    }
  }

  .footer__contact-icon {
    color: $purple-primary;
    font-size: 1rem;
    width: 1.25rem;
    text-align: center;
    transition: all 0.3s ease;
  }

  .footer__contact-text {
    color: $text-light;
    font-size: 0.9rem;
    line-height: 1.4;

    @media (min-width: 768px) {
      font-size: 0.95rem;
    }
  }
}

// Bottom Section
.footer__bottom {
  border-top: 1px solid $border-light;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
    padding-top: 2.5rem;
  }
}

.footer__copyright {
  .footer__copyright-text {
    color: $text-light;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.4;

    @media (min-width: 768px) {
      font-size: 0.9rem;
    }

    .copyright__year {
      font-weight: 600;
      color: $purple-primary;
    }
  }
}

.footer__legal {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-end;
  }

  .footer__legal-link {
    color: $text-light;
    text-decoration: none;
    font-size: 0.875rem;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      color: $purple-primary;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: $purple-primary;
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }

  .footer__separator {
    color: $border-light;
    font-size: 0.75rem;
  }
}

// Animaciones
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.footer__social-btn--primary {
  animation: pulse 3s ease-in-out infinite;
}

.footer__content > * {
  animation: fadeInUp 0.6s ease-out;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
}

// Estados de focus para accesibilidad
.footer__link:focus,
.footer__legal-link:focus,
.footer__social-btn--primary:focus {
  outline: 2px solid $purple-primary;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>