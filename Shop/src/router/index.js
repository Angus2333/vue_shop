import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      index: 1
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/product/:id',
    name: 'product',
    component: () => import('@/views/ProductDetail.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart.vue')
  },
  {
    path: '/create-order',
    name: 'create-order',
    component: () => import('@/views/CreateOrder.vue')
  },
  {
    path: '/address',
    name: 'address',
    component: () => import('@/views/Address.vue')
  },
  {
    path: '/address-edit',
    name: 'address-edit',
    component: () => import('@/views/AddressEdit.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User.vue')
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/Order.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
