import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // Si hay una posición guardada (por ejemplo, al usar el botón atrás del navegador)
    if (savedPosition) {
      return savedPosition
    }
    // Si la ruta tiene un hash (ancla), hacer scroll a ese elemento
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Por defecto, hacer scroll hacia arriba con animación suave
    return {
      top: 0,
      behavior: 'smooth'
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/ProductsView/index.vue'),
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('@/views/ProductsView/ProductDetailView.vue'),
      props: true,
    },
    {
      path: '/pay-response',
      name: 'pay-response',
      component: () => import('@/views/PaymentConfirmationView.vue'),
    },
    {
      path: '/payment-confirmation',
      name: 'payment-confirmation',
      component: () => import('@/views/PaymentConfirmationView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('@/views/EmailVerificationView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView/index.vue'),
      meta: {
        requiresAuth: true,
        title: 'Carrito de Compras'
      }
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/OrdersView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView/index.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    // Rutas de Staff - Protegidas por rol
    {
      path: '/staff',
      name: 'staff',
      redirect: '/staff/orders',
      meta: {
        requiresAuth: true,
        requiresStaff: true,
        title: 'Panel de Staff'
      }
    },
    {
      path: '/staff/orders',
      name: 'staff-orders',
      component: () => import('@/views/staff/StaffOrdersView.vue'),
      meta: {
        requiresAuth: true,
        requiresStaff: true,
        title: 'Gestión de Órdenes'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// Guard de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirigir al login si no está autenticado
    next({
      name: 'login',
      query: { redirect: to.fullPath } // Guardar la ruta de destino para redirigir después del login
    })
    return
  }
  
  // Verificar si la ruta requiere permisos de staff
  if (to.meta.requiresStaff && !authStore.isStaff) {
    // Redirigir al home si no tiene permisos de staff
    next({
      name: 'home'
    })
    return
  }
  
  next()
})

export default router
