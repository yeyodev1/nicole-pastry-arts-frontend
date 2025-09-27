<script setup lang="ts">
import { watch, onUnmounted } from 'vue';

interface Props {
  isOpen: boolean;
  title?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showCloseButton?: boolean;
  persistent?: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'confirm'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Cerrar modal con ESC
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && !props.persistent) {
    emit('close');
  }
};

// Cerrar modal al hacer click en el overlay
const handleOverlayClick = () => {
  if (!props.persistent) {
    emit('close');
  }
};

// Prevenir el cierre al hacer click en el contenido del modal
const handleContentClick = (event: Event) => {
  event.stopPropagation();
};

// Agregar/remover event listener para ESC
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
  }
});

// Cleanup al desmontar el componente
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @click="handleOverlayClick"
      >
        <div
          class="modal-content"
          :class="[`modal-content--${type || 'info'}`]"
          @click="handleContentClick"
        >
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-title-section">
              <div class="modal-icon">
                <svg
                  v-if="type === 'success'"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <svg
                  v-else-if="type === 'error'"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <svg
                  v-else-if="type === 'warning'"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <h3 v-if="title" class="modal-title">{{ title }}</h3>
            </div>
            
            <button
              v-if="showCloseButton && !persistent"
              class="modal-close-btn"
              @click="emit('close')"
              aria-label="Cerrar modal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.modules.scss' as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: $white;
  border-radius: 16px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    max-width: 95vw;
    margin: 1rem;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid $gray-200;
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }

  .modal-content--success & {
    color: $success;
  }

  .modal-content--error & {
    color: $error;
  }

  .modal-content--warning & {
    color: $warning;
  }

  .modal-content--info & {
    color: $info;
  }
}

.modal-title {
  @include heading-font(600);
  font-size: 1.25rem;
  color: $text-dark;
  margin: 0;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: $gray-400;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: $gray-100;
    color: $gray-600;
  }

  &:focus {
    outline: 2px solid $purple-primary;
    outline-offset: 2px;
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.modal-body {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
  color: $text-light;
  line-height: 1.6;
  @include body-font();
}

.modal-footer {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid $gray-200;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
 
  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
}

.btn {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  min-width: 80px;
  @include interface-font(500);

  &:focus {
    outline: 2px solid $purple-primary;
    outline-offset: 2px;
  }

  &.btn-primary {
    background-color: $purple-primary;
    color: $white;

    &:hover {
      background-color: $purple-hover;
    }
  }

  &.btn-secondary {
    background-color: $gray-100;
    color: $gray-700;
    border-color: $gray-300;

    &:hover {
      background-color: $gray-200;
    }
  }
}

// Transiciones
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}

.modal-enter-to .modal-content,
.modal-leave-from .modal-content {
  transform: scale(1) translateY(0);
  opacity: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>