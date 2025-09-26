import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/styles/global.scss'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth.store'

const app = createApp(App)

// Configurar Pinia
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Inicializar el store de autenticación para recuperar sesión almacenada
const authStore = useAuthStore()
authStore.initialize().catch((error) => {
  console.warn('Error al inicializar autenticación:', error)
})

app.mount('#app')
