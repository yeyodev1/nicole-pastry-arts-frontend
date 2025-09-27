<template>
  <!-- Modal de Edición de Perfil -->
  <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">Editar Perfil</h3>
        <button @click="closeEditModal" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form @submit.prevent="updateProfile" class="edit-form">
        <div class="form-group">
          <label for="firstName">Nombre</label>
          <input
            id="firstName"
            v-model="editForm.firstName"
            type="text"
            class="form-input"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="lastName">Apellido</label>
          <input
            id="lastName"
            v-model="editForm.lastName"
            type="text"
            class="form-input"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="editForm.email"
            type="email"
            class="form-input"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="phone">Teléfono</label>
          <input
            id="phone"
            v-model="editForm.phone"
            type="tel"
            class="form-input"
          />
        </div>
        
        <div class="form-actions">
          <button type="button" @click="closeEditModal" class="cancel-button">
            Cancelar
          </button>
          <button type="submit" class="save-button" :disabled="isUpdating">
            <i v-if="isUpdating" class="fas fa-spinner fa-spin"></i>
            {{ isUpdating ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal de Confirmación de Logout -->
  <div v-if="showLogoutModal" class="modal-overlay" @click="closeLogoutModal">
    <div class="modal-content modal-content--small" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">Cerrar Sesión</h3>
        <button @click="closeLogoutModal" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <p>¿Estás seguro de que quieres cerrar sesión?</p>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="closeLogoutModal" class="cancel-button">
          Cancelar
        </button>
        <button @click="confirmLogout" class="logout-button" :disabled="isLoggingOut">
          <i v-if="isLoggingOut" class="fas fa-spinner fa-spin"></i>
          {{ isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { User } from '@/types/auth'

// Props
const props = defineProps({
  showEditModal: {
    type: Boolean,
    required: true
  },
  showLogoutModal: {
    type: Boolean,
    required: true
  },
  user: {
    type: Object as () => User | null,
    required: false,
    default: null
  }
})

// Emits
const emit = defineEmits<{
  'close-edit-modal': []
  'close-logout-modal': []
  'update-profile': [data: any]
  'confirm-logout': []
}>()

// Estado reactivo
const isUpdating = ref(false)
const isLoggingOut = ref(false)

// Formulario de edición
const editForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

// Watchers
watch(() => props.user, (newUser) => {
  if (newUser) {
    editForm.firstName = newUser.firstName || ''
    editForm.lastName = newUser.lastName || ''
    editForm.email = newUser.email || ''
    editForm.phone = newUser.phone || ''
  }
}, { immediate: true })

// Métodos
const closeEditModal = () => {
  emit('close-edit-modal')
}

const closeLogoutModal = () => {
  emit('close-logout-modal')
}

const updateProfile = async () => {
  isUpdating.value = true
  try {
    emit('update-profile', { ...editForm })
  } finally {
    isUpdating.value = false
  }
}

const confirmLogout = async () => {
  isLoggingOut.value = true
  try {
    emit('confirm-logout')
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

  &--small {
    max-width: 400px;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;

  .modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #6c757d;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      background: #f8f9fa;
      color: #2c3e50;
    }
  }
}

.modal-body {
  padding: 2rem;
  text-align: center;

  p {
    font-size: 1.1rem;
    color: #6c757d;
    margin: 0;
  }
}

.edit-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #2c3e50;
    }
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #6c757d;
  background: transparent;
  color: #6c757d;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #6c757d;
    color: white;
  }
}

.save-button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: #2c3e50;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: #1a252f;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.logout-button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: #dc3545;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: #c82333;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}
</style>