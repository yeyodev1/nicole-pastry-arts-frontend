import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  description?: string
}

export const useCartStore = defineStore('cart', () => {
  // Estado
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)

  // Getters computados
  const totalItems = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const totalPrice = computed(() => 
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  // Acciones
  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  const removeItem = (productId: string) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const getItemQuantity = (productId: string): number => {
    const item = items.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  return {
    // Estado
    items,
    isLoading,
    
    // Getters
    totalItems,
    totalPrice,
    isEmpty,
    
    // Acciones
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity
  }
})