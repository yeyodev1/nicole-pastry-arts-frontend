<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BillingInfo, DeliveryAddress, DeliveryZone } from '@/types/orders'
import { validateEcuadorCedula } from '@/utils/ecuadorValidations'

interface FormData {
  billingInfo: BillingInfo
  deliveryAddress: DeliveryAddress
  deliveryZone: DeliveryZone
  deliveryDateWithMargin?: string
}

const props = defineProps({
  formData: {
    type: Object as () => FormData,
    required: true,
  },
})

const emit = defineEmits<{
  'update:formData': [data: FormData]
}>()

// Zonas de entrega disponibles
const deliveryZones = [
  { value: 'samanes_suburbio' as DeliveryZone, label: 'Samanes - Suburbio', price: 3.00 },
  { value: 'norte_sur_esteros' as DeliveryZone, label: 'Norte - Sur - Esteros', price: 4.00 },
  { value: 'sambo' as DeliveryZone, label: 'Samborondón', price: 5.00 },
  { value: 'via_costa' as DeliveryZone, label: 'Vía a la Costa', price: 6.00 },
  { value: 'aurora' as DeliveryZone, label: 'Aurora', price: 7.00 },
] as const

// Estado para mostrar/ocultar el campo de Google Maps
const showGoogleMapsField = ref(false)

// Estado para el error de cédula
const cedulaError = ref('')

// Función para validar cédula
const validateCedula = (cedula: string) => {
  cedulaError.value = ''
  
  if (!cedula.trim()) {
    cedulaError.value = 'La cédula es obligatoria'
    return false
  }
  
  if (!validateEcuadorCedula(cedula)) {
    cedulaError.value = 'Ingresa una cédula ecuatoriana válida'
    return false
  }
  
  return true
}

// Función para actualizar cédula con validación
const updateCedula = (cedula: string) => {
  updateFormData('billingInfo', 'cedula', cedula)
  validateCedula(cedula)
}

// Calcular fecha mínima (3 días después de hoy)
const getMinDeliveryDate = () => {
  const today = new Date()
  const minDate = new Date(today)
  minDate.setDate(today.getDate() + 3)
  return minDate.toISOString().split('T')[0] // Formato YYYY-MM-DD
}

const minDeliveryDate = getMinDeliveryDate()

// Validaciones
const isBillingInfoValid = computed(() => {
  const billing = props.formData.billingInfo
  return billing.cedula.trim() !== '' && 
         validateEcuadorCedula(billing.cedula) &&
         billing.fullName.trim() !== '' && 
         billing.phone.trim() !== '' &&
         (billing.email ? billing.email.trim() !== '' : true)
})

const isDeliveryAddressValid = computed(() => {
  const delivery = props.formData.deliveryAddress
  return delivery.recipientName.trim() !== '' && 
         delivery.recipientPhone.trim() !== '' &&
         delivery.street.trim() !== ''
})

const isFormValid = computed(() => {
  return isBillingInfoValid.value && 
         isDeliveryAddressValid.value && 
         props.formData.deliveryZone !== null &&
         props.formData.deliveryDateWithMargin !== undefined &&
         props.formData.deliveryDateWithMargin !== ''
})

// Función para actualizar datos
const updateFormData = (section: keyof FormData, field: string, value: any) => {
  const currentSection = props.formData[section] as Record<string, any>
  const updatedSection = {
    ...currentSection,
    [field]: value
  }
  
  emit('update:formData', {
    ...props.formData,
    [section]: updatedSection
  } as FormData)
}

// Función específica para actualizar la dirección de facturación
const updateBillingAddress = (field: string, value: string) => {
  const currentAddress = props.formData.billingInfo.address || {}
  const updatedBillingInfo = {
    ...props.formData.billingInfo,
    address: {
      ...currentAddress,
      [field]: value
    }
  }
  
  emit('update:formData', {
    ...props.formData,
    billingInfo: updatedBillingInfo
  })
}

// Función para actualizar zona de entrega
const updateDeliveryZone = (zone: DeliveryZone) => {
  emit('update:formData', {
    ...props.formData,
    deliveryZone: zone
  })
}

// Función para actualizar fecha de entrega
const updateDeliveryDate = (date: string) => {
  emit('update:formData', {
    ...props.formData,
    deliveryDateWithMargin: date
  })
}

// Obtener precio de la zona seleccionada
const selectedZonePrice = computed(() => {
  const zone = deliveryZones.find(z => z.value === props.formData.deliveryZone)
  return zone ? zone.price : 0
})

// Exponer la validación para el componente padre
defineExpose({
  isValid: isFormValid,
  selectedZonePrice
})
</script>

<template>
  <div class="shipping-form">
    <!-- Información de Facturación -->
    <section class="shipping-form__section">
      <h3 class="shipping-form__title">
        <i class="fas fa-file-invoice"></i>
        Información de Facturación
      </h3>
      
      <div class="shipping-form__fields">
        <div class="shipping-form__field">
          <label for="cedula" class="shipping-form__label">
            Cédula *
          </label>
          <input
            id="cedula"
            :value="formData.billingInfo.cedula"
            @input="updateCedula(($event.target as HTMLInputElement).value)"
            type="text"
            class="shipping-form__input"
            :class="{ 'shipping-form__input--error': cedulaError }"
            placeholder="Ej: 0123456789"
            maxlength="10"
            required
          >
          <div v-if="cedulaError" class="shipping-form__error">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ cedulaError }}</span>
          </div>
        </div>

        <div class="shipping-form__field">
          <label for="fullName" class="shipping-form__label">
            Nombre completo *
          </label>
          <input
            id="fullName"
            :value="formData.billingInfo.fullName"
            @input="updateFormData('billingInfo', 'fullName', ($event.target as HTMLInputElement).value)"
            type="text"
            class="shipping-form__input"
            placeholder="Nombre y apellidos completos"
            required
          >
        </div>

        <div class="shipping-form__field">
          <label for="phone" class="shipping-form__label">
            Teléfono *
          </label>
          <input
            id="phone"
            :value="formData.billingInfo.phone"
            @input="updateFormData('billingInfo', 'phone', ($event.target as HTMLInputElement).value)"
            type="tel"
            class="shipping-form__input"
            placeholder="Ej: +593 99 123 4567"
            required
          >
        </div>

        <div class="shipping-form__field">
          <label for="email" class="shipping-form__label">
            Email *
          </label>
          <input
            id="email"
            :value="formData.billingInfo.email"
            @input="updateFormData('billingInfo', 'email', ($event.target as HTMLInputElement).value)"
            type="email"
            class="shipping-form__input"
            placeholder="correo@ejemplo.com"
            required
          >
        </div>

        <div class="shipping-form__field shipping-form__field--full">
          <label for="billingStreet" class="shipping-form__label">
            Dirección de facturación (opcional)
          </label>
          <input
            id="billingStreet"
            :value="formData.billingInfo.address?.street || ''"
            @input="updateBillingAddress('street', ($event.target as HTMLInputElement).value)"
            type="text"
            class="shipping-form__input"
            placeholder="Calle, número, sector"
          >
        </div>
      </div>
    </section>

    <!-- Zona de Entrega -->
    <section class="shipping-form__section">
      <h3 class="shipping-form__title">
        <i class="fas fa-map-marker-alt"></i>
        Zona de Entrega
      </h3>
      
      <div class="shipping-form__zone-warning">
        <i class="fas fa-info-circle"></i>
        <span>Solo realizamos entregas dentro de Guayaquil y Durán</span>
      </div>

      <div class="shipping-form__zones">
        <div 
          v-for="zone in deliveryZones" 
          :key="zone.value"
          class="shipping-form__zone"
          :class="{ 'shipping-form__zone--selected': formData.deliveryZone === zone.value }"
          @click="updateDeliveryZone(zone.value)"
        >
          <div class="shipping-form__zone-info">
            <span class="shipping-form__zone-name">{{ zone.label }}</span>
            <span class="shipping-form__zone-price">${{ zone.price.toFixed(2) }}</span>
          </div>
          <i class="fas fa-check shipping-form__zone-check"></i>
        </div>
      </div>
    </section>

    <!-- Fecha de Entrega -->
    <section class="shipping-form__section">
      <h3 class="shipping-form__title">
        <i class="fas fa-calendar-alt"></i>
        Fecha de Entrega Preferida
      </h3>
      
      <div class="shipping-form__date-info">
        <i class="fas fa-info-circle"></i>
        <span>Selecciona tu fecha preferida de entrega (mínimo 3 días de anticipación)</span>
      </div>

      <div class="shipping-form__date-field">
        <label for="deliveryDate" class="shipping-form__label">
          Fecha de entrega *
        </label>
        <input
          id="deliveryDate"
          :value="formData.deliveryDateWithMargin || ''"
          @input="updateDeliveryDate(($event.target as HTMLInputElement).value)"
          type="date"
          class="shipping-form__date-input"
          :min="minDeliveryDate"
          required
        >
        <div class="shipping-form__date-help">
          <i class="fas fa-clock"></i>
          <span>La fecha mínima de entrega es {{ new Date(minDeliveryDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
        </div>
      </div>
    </section>

    <!-- Dirección de Entrega -->
    <section class="shipping-form__section">
      <h3 class="shipping-form__title">
        <i class="fas fa-shipping-fast"></i>
        Dirección de Entrega
      </h3>
      
      <div class="shipping-form__fields">
        <div class="shipping-form__field">
          <label for="recipientName" class="shipping-form__label">
            Nombre del destinatario *
          </label>
          <input
            id="recipientName"
            :value="formData.deliveryAddress.recipientName"
            @input="updateFormData('deliveryAddress', 'recipientName', ($event.target as HTMLInputElement).value)"
            type="text"
            class="shipping-form__input"
            placeholder="Nombre completo del destinatario"
            required
          >
        </div>

        <div class="shipping-form__field">
          <label for="recipientPhone" class="shipping-form__label">
            Teléfono del destinatario *
          </label>
          <input
            id="recipientPhone"
            :value="formData.deliveryAddress.recipientPhone"
            @input="updateFormData('deliveryAddress', 'recipientPhone', ($event.target as HTMLInputElement).value)"
            type="tel"
            class="shipping-form__input"
            placeholder="Ej: +593 99 123 4567"
            required
          >
        </div>

        <div class="shipping-form__field shipping-form__field--full">
          <label for="deliveryStreet" class="shipping-form__label">
            Dirección completa *
          </label>
          <input
            id="deliveryStreet"
            :value="formData.deliveryAddress.street"
            @input="updateFormData('deliveryAddress', 'street', ($event.target as HTMLInputElement).value)"
            type="text"
            class="shipping-form__input"
            placeholder="Calle, número, referencias"
            required
          >
        </div>

        <div class="shipping-form__field shipping-form__field--full">
          <label for="locationNotes" class="shipping-form__label">
            Referencias adicionales (opcional)
          </label>
          <textarea
            id="locationNotes"
            :value="formData.deliveryAddress.locationNotes"
            @input="updateFormData('deliveryAddress', 'locationNotes', ($event.target as HTMLTextAreaElement).value)"
            class="shipping-form__textarea"
            placeholder="Instrucciones especiales, puntos de referencia, etc."
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- Botón para mostrar campo de Google Maps -->
      <div class="shipping-form__maps-section">
        <button 
          type="button"
          class="shipping-form__maps-toggle"
          @click="showGoogleMapsField = !showGoogleMapsField"
        >
          <i class="fas fa-map"></i>
          {{ showGoogleMapsField ? 'Ocultar' : 'Agregar' }} ubicación de Google Maps
        </button>

        <div v-if="showGoogleMapsField" class="shipping-form__maps-field">
          <label for="googleMapsLink" class="shipping-form__label">
            Link de Google Maps (opcional)
          </label>
          <input
            id="googleMapsLink"
            :value="formData.deliveryAddress.googleMapsLink"
            @input="updateFormData('deliveryAddress', 'googleMapsLink', ($event.target as HTMLInputElement).value)"
            type="url"
            class="shipping-form__input"
            placeholder="https://maps.google.com/..."
          >
          <div class="shipping-form__maps-help">
            <i class="fas fa-lightbulb"></i>
            <span>No te preocupes si no lo colocas, pronto un colaborador se contactará contigo para cuadrar exactamente la entrega</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Mensaje de validación -->
    <div v-if="!isFormValid" class="shipping-form__warning">
      <i class="fas fa-exclamation-triangle"></i>
      <span>Por favor completa todos los campos obligatorios</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shipping-form {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  &__section {
    background-color: $white;
    border-radius: 20px;
    padding: 1.5rem;
    box-shadow: 0 8px 32px rgba($NICOLE-PRIMARY, 0.08);
    border: 1px solid $border-light;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2.5rem;
    }

    @media (min-width: 1024px) {
      padding: 1.5rem;
      max-width: 100%;
    }
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-dark;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    @media (min-width: 768px) {
      font-size: 1.375rem;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    @media (min-width: 1024px) {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }

    i {
      color: $NICOLE-PRIMARY;
      font-size: 1.125rem;

      @media (min-width: 768px) {
        font-size: 1.25rem;
      }

      @media (min-width: 1024px) {
        font-size: 1.125rem;
      }
    }
  }

  &__fields {
    display: grid;
    gap: 1.25rem;
    width: 100%;

    @media (min-width: 768px) {
      gap: 1.5rem;
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      gap: 1rem;
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    min-width: 0;

    @media (min-width: 768px) {
      gap: 0.75rem;
    }

    @media (min-width: 1024px) {
      gap: 0.5rem;
    }

    &--full {
      @media (min-width: 768px) {
        grid-column: 1 / -1;
      }
    }
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: $text-dark;

    @media (min-width: 768px) {
      font-size: 0.95rem;
    }

    @media (min-width: 1024px) {
      font-size: 0.875rem;
    }
  }

  &__input,
  &__textarea {
    width: 100%;
    max-width: 100%;
    padding: 1rem;
    border: 1px solid $border-light;
    border-radius: 12px;
    font-size: 1rem;
    color: $text-dark;
    background-color: $white;
    transition: all 0.3s ease;
    box-sizing: border-box;

    @media (min-width: 768px) {
      padding: 1.125rem;
      border-radius: 16px;
      font-size: 1.05rem;
    }

    @media (min-width: 1024px) {
      padding: 0.875rem;
      border-radius: 12px;
      font-size: 0.95rem;
    }

    &::placeholder {
      color: $text-light;
    }

    &:focus {
      outline: none;
      border-color: $NICOLE-PRIMARY;
      box-shadow: 0 0 0 3px rgba($NICOLE-PRIMARY, 0.1);
    }

    &:hover {
      border-color: rgba($NICOLE-PRIMARY, 0.5);
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 80px;
    font-family: inherit;
    line-height: 1.5;

    @media (min-width: 768px) {
      min-height: 100px;
    }

    @media (min-width: 1024px) {
      min-height: 80px;
    }
  }

  &__zone-warning {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background-color: rgba($info, 0.1);
    border: 1px solid rgba($info, 0.3);
    border-radius: 12px;
    color: darken($info, 20%);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;

    @media (min-width: 768px) {
      padding: 1.125rem;
      border-radius: 16px;
      font-size: 0.95rem;
      gap: 1rem;
    }

    @media (min-width: 1024px) {
      padding: 1rem;
      border-radius: 12px;
      font-size: 0.875rem;
    }

    i {
      color: $info;
      font-size: 1rem;
      flex-shrink: 0;
    }
  }

  &__zones {
    display: grid;
    gap: 1rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }

    @media (min-width: 1024px) {
      gap: 1rem;
    }
  }

  &__zone {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border: 2px solid $border-light;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: $white;

    @media (min-width: 768px) {
      padding: 1.25rem;
      border-radius: 16px;
    }

    @media (min-width: 1024px) {
      padding: 1rem;
      border-radius: 12px;
    }

    &:hover {
      border-color: rgba($NICOLE-PRIMARY, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba($NICOLE-PRIMARY, 0.1);
    }

    &--selected {
      border-color: $NICOLE-PRIMARY;
      background-color: rgba($NICOLE-PRIMARY, 0.05);

      .shipping-form__zone-check {
        opacity: 1;
        color: $NICOLE-PRIMARY;
      }
    }
  }

  &__zone-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__zone-name {
    font-weight: 500;
    color: $text-dark;
    font-size: 0.95rem;

    @media (min-width: 768px) {
      font-size: 1rem;
    }

    @media (min-width: 1024px) {
      font-size: 0.95rem;
    }
  }

  &__zone-price {
    font-weight: 600;
    color: $NICOLE-PRIMARY;
    font-size: 1rem;

    @media (min-width: 768px) {
      font-size: 1.125rem;
    }

    @media (min-width: 1024px) {
      font-size: 1rem;
    }
  }

  &__zone-check {
    opacity: 0;
    transition: all 0.3s ease;
    font-size: 1.125rem;

    @media (min-width: 768px) {
      font-size: 1.25rem;
    }

    @media (min-width: 1024px) {
      font-size: 1.125rem;
    }
  }

  &__maps-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid $border-light;

    @media (min-width: 768px) {
      margin-top: 2rem;
      padding-top: 2rem;
    }

    @media (min-width: 1024px) {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
    }
  }

  &__maps-toggle {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    background-color: transparent;
    border: 2px solid $NICOLE-PRIMARY;
    border-radius: 12px;
    color: $NICOLE-PRIMARY;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;

    @media (min-width: 768px) {
      padding: 1rem 1.5rem;
      border-radius: 16px;
      font-size: 1rem;
      gap: 1rem;
    }

    @media (min-width: 1024px) {
      padding: 0.875rem 1.25rem;
      border-radius: 12px;
      font-size: 0.95rem;
    }

    &:hover {
      background-color: $NICOLE-PRIMARY;
      color: $white;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba($NICOLE-PRIMARY, 0.2);
    }

    i {
      font-size: 1rem;

      @media (min-width: 768px) {
        font-size: 1.125rem;
      }

      @media (min-width: 1024px) {
        font-size: 1rem;
      }
    }
  }

  &__maps-field {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    @media (min-width: 768px) {
      margin-top: 1.25rem;
      gap: 0.75rem;
    }

    @media (min-width: 1024px) {
      margin-top: 1rem;
      gap: 0.5rem;
    }
  }

  &__maps-help {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    background-color: rgba($success, 0.1);
    border: 1px solid rgba($success, 0.3);
    border-radius: 12px;
    color: darken($success, 20%);
    font-size: 0.875rem;
    margin-top: 0.5rem;

    @media (min-width: 768px) {
      padding: 1.125rem;
      border-radius: 16px;
      font-size: 0.95rem;
      gap: 1rem;
    }

    @media (min-width: 1024px) {
      padding: 1rem;
      border-radius: 12px;
      font-size: 0.875rem;
    }

    i {
      color: $success;
      font-size: 1rem;
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    span {
      line-height: 1.4;
    }
  }

  &__date-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background-color: rgba($NICOLE-PRIMARY, 0.1);
    border: 1px solid rgba($NICOLE-PRIMARY, 0.3);
    border-radius: 12px;
    color: darken($NICOLE-PRIMARY, 20%);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;

    @media (min-width: 768px) {
      padding: 1.125rem;
      border-radius: 16px;
      font-size: 0.95rem;
      gap: 1rem;
    }

    @media (min-width: 1024px) {
      padding: 1rem;
      border-radius: 12px;
      font-size: 0.875rem;
    }

    i {
      color: $NICOLE-PRIMARY;
      font-size: 1rem;
      flex-shrink: 0;
    }
  }

  &__date-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;

    @media (min-width: 768px) {
      gap: 0.75rem;
    }

    @media (min-width: 1024px) {
      gap: 0.5rem;
    }
  }

  &__date-input {
    width: 100%;
    max-width: 100%;
    padding: 1rem;
    border: 1px solid $border-light;
    border-radius: 12px;
    font-size: 1rem;
    color: $text-dark;
    background-color: $white;
    transition: all 0.3s ease;
    box-sizing: border-box;
    font-family: inherit;

    @media (min-width: 768px) {
      padding: 1.125rem;
      border-radius: 16px;
      font-size: 1.05rem;
    }

    @media (min-width: 1024px) {
      padding: 0.875rem;
      border-radius: 12px;
      font-size: 0.95rem;
    }

    &:focus {
      outline: none;
      border-color: $NICOLE-PRIMARY;
      box-shadow: 0 0 0 3px rgba($NICOLE-PRIMARY, 0.1);
    }

    &:hover {
      border-color: rgba($NICOLE-PRIMARY, 0.5);
    }

    // Estilos específicos para el selector de fecha
    &::-webkit-calendar-picker-indicator {
      color: $NICOLE-PRIMARY;
      cursor: pointer;
      font-size: 1.125rem;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba($NICOLE-PRIMARY, 0.1);
      }
    }
  }

  &__date-help {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    background-color: rgba($success, 0.1);
    border: 1px solid rgba($success, 0.3);
    border-radius: 12px;
    color: darken($success, 20%);
    font-size: 0.875rem;
    margin-top: 0.5rem;

    @media (min-width: 768px) {
      padding: 1.125rem;
      border-radius: 16px;
      font-size: 0.95rem;
      gap: 1rem;
    }

    @media (min-width: 1024px) {
      padding: 1rem;
      border-radius: 12px;
      font-size: 0.875rem;
    }

    i {
      color: $success;
      font-size: 1rem;
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    span {
      line-height: 1.4;
    }
  }

  &__warning {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background-color: rgba($error, 0.1);
    border: 1px solid rgba($error, 0.3);
    border-radius: 12px;
    color: darken($error, 20%);
    font-size: 0.875rem;
    margin-top: 1.5rem;
    width: 100%;
    box-sizing: border-box;

    @media (min-width: 768px) {
      padding: 1.125rem;
      border-radius: 16px;
      font-size: 0.95rem;
      gap: 1rem;
    }

    @media (min-width: 1024px) {
      padding: 1rem;
      border-radius: 12px;
      font-size: 0.875rem;
      margin-top: 1rem;
    }

    i {
      color: $error;
      font-size: 1rem;
      flex-shrink: 0;

      @media (min-width: 768px) {
        font-size: 1.125rem;
      }

      @media (min-width: 1024px) {
        font-size: 1rem;
      }
    }

    span {
      line-height: 1.4;
    }
  }
}
</style>