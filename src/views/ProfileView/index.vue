<template>
  <div class="profile-view">
    <div class="container">
      <!-- Header del Perfil -->
      <ProfileHeader
        :user="user"
        :is-loading="isLoading"
        @edit-profile="openEditModal"
        @logout="openLogoutModal"
      />

      <!-- Contenido Principal -->
      <div class="profile-content">
        <!-- Información Personal -->
        <ProfileInfo :user="user" />

        <!-- Estadísticas de Actividad -->
        <ProfileStats
          :user="user"
          :total-orders="totalOrders"
          :favorite-products="favoriteProducts"
        />

        <!-- Acciones Rápidas -->
        <ProfileActions @edit-profile="openEditModal" />
      </div>

      <!-- Modales -->
      <ProfileModals
        :show-edit-modal="showEditModal"
        :show-logout-modal="showLogoutModal"
        :user="user"
        @close-edit-modal="closeEditModal"
        @close-logout-modal="closeLogoutModal"
        @update-profile="updateProfile"
        @confirm-logout="confirmLogout"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { User } from '@/types/auth'

// Componentes
import ProfileHeader from './ProfileHeader.vue'
import ProfileInfo from './ProfileInfo.vue'
import ProfileStats from './ProfileStats.vue'
import ProfileActions from './ProfileActions.vue'
import ProfileModals from './ProfileModals.vue'

// Composables
const router = useRouter()
const authStore = useAuthStore()

// Estado reactivo
const isLoading = ref(true)
const user = ref<User | null>(null)
const showEditModal = ref(false)
const showLogoutModal = ref(false)
const totalOrders = ref(0)
const favoriteProducts = ref(0)

// Métodos
const loadUserProfile = async () => {
  try {
    isLoading.value = true
    
    // Obtener datos del usuario
    user.value = authStore.user
    
    // Simular carga de estadísticas (aquí irían las llamadas a la API)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Datos simulados - en una app real vendrían de la API
    totalOrders.value = 12
    favoriteProducts.value = 8
    
  } catch (error) {
    console.error('Error loading profile:', error)
    console.error('Error al cargar el perfil')
  } finally {
    isLoading.value = false
  }
}

const openEditModal = () => {
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const openLogoutModal = () => {
  showLogoutModal.value = true
}

const closeLogoutModal = () => {
  showLogoutModal.value = false
}

const updateProfile = async (profileData: any) => {
  try {
    // Aquí iría la llamada a la API para actualizar el perfil
    console.log('Updating profile:', profileData)
    
    // Simular actualización
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Actualizar el usuario local
    if (user.value) {
      user.value = { ...user.value, ...profileData }
    }
    
    console.log('Perfil actualizado correctamente')
    closeEditModal()
    
  } catch (error) {
    console.error('Error updating profile:', error)
    console.error('Error al actualizar el perfil')
  }
}

const confirmLogout = async () => {
  try {
    await authStore.logout()
    console.log('Sesión cerrada correctamente')
    router.push('/login')
  } catch (error) {
    console.error('Error during logout:', error)
    console.error('Error al cerrar sesión')
  }
}

// Lifecycle
onMounted(() => {
  loadUserProfile()
})
</script>

<style lang="scss" scoped>
.profile-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.profile-content {
  display: grid;
  gap: 2rem;
  margin-top: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
}

// Responsive adjustments
@media (max-width: 767px) {
  .profile-view {
    padding: 1rem 0;
  }

  .container {
    padding: 0 0.5rem;
  }

  .profile-content {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
}
</style>