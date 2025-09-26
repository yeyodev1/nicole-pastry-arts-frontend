import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
  ],
})

export default router
