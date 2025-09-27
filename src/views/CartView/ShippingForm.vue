<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  shippingData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits<{
  'update:shippingData': [data: any]
}>()

// Validar datos de envío
const isShippingDataValid = computed(() => {
  return props.shippingData.recipientName.trim() !== '' && 
         props.shippingData.recipientPhone.trim() !== ''
})

// Actualizar datos de envío
const updateShippingData = (field: string, value: string) => {
  emit('update:shippingData', {
    ...props.shippingData,
    [field]: value
  })
}

// Exponer la validación para el componente padre
defineExpose({
  isValid: isShippingDataValid
})
</script>

<template>
  <div class="shipping-form">
    <h3 class="shipping-form__title">
      <i class="fas fa-shipping-fast"></i>
      Datos de Envío
    </h3>
    
    <div class="shipping-form__fields">
      <div class="shipping-form__field">
        <label for="recipientName" class="shipping-form__label">
          Nombre del destinatario *
        </label>
        <input
          id="recipientName"
          :value="shippingData.recipientName"
          @input="updateShippingData('recipientName', ($event.target as HTMLInputElement).value)"
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
          :value="shippingData.recipientPhone"
          @input="updateShippingData('recipientPhone', ($event.target as HTMLInputElement).value)"
          type="tel"
          class="shipping-form__input"
          placeholder="Ej: +593 99 123 4567"
          required
        >
      </div>

      <div class="shipping-form__field">
        <label for="street" class="shipping-form__label">
          Dirección (opcional)
        </label>
        <input
          id="street"
          :value="shippingData.street"
          @input="updateShippingData('street', ($event.target as HTMLInputElement).value)"
          type="text"
          class="shipping-form__input"
          placeholder="Calle y número"
        >
      </div>

      <div class="shipping-form__field">
        <label for="city" class="shipping-form__label">
          Ciudad (opcional)
        </label>
        <input
          id="city"
          :value="shippingData.city"
          @input="updateShippingData('city', ($event.target as HTMLInputElement).value)"
          type="text"
          class="shipping-form__input"
          placeholder="Ciudad"
        >
      </div>

      <div class="shipping-form__field">
        <label for="notes" class="shipping-form__label">
          Notas adicionales (opcional)
        </label>
        <textarea
          id="notes"
          :value="shippingData.notes"
          @input="updateShippingData('notes', ($event.target as HTMLTextAreaElement).value)"
          class="shipping-form__textarea"
          placeholder="Instrucciones especiales para la entrega"
          rows="3"
        ></textarea>
      </div>
    </div>

    <!-- Mensaje de validación -->
    <div v-if="!isShippingDataValid" class="shipping-form__warning">
      <i class="fas fa-exclamation-triangle"></i>
      <span>Por favor completa los campos obligatorios (nombre y teléfono del destinatario)</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Formulario de envío - Mobile First
.shipping-form {
  background-color: $white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba($NICOLE-PRIMARY, 0.08);
  border: 1px solid $border-light;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2.5rem;
  }

  @media (min-width: 1024px) {
    padding: 1.5rem;
    max-width: 100%;
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

    // Campos que ocupan toda la fila en desktop
    .shipping-form__field:nth-child(5) {
      @media (min-width: 768px) {
        grid-column: 1 / -1;
      }
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    min-width: 0; // Permite que los elementos se contraigan

    @media (min-width: 768px) {
      gap: 0.75rem;
    }

    @media (min-width: 1024px) {
      gap: 0.5rem;
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

  &__warning {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background-color: rgba($warning, 0.1);
    border: 1px solid rgba($warning, 0.3);
    border-radius: 12px;
    color: darken($warning, 20%);
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
      color: $warning;
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