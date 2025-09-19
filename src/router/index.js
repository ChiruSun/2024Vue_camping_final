import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import SignView from '@/views/SignView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: SignView,
      children: [
        { path: '', component: () => import('../views/LoginView.vue') },
        {
          path: '/signup',
          name: 'signup',
          component: () => import('../views/SignUpView.vue')
        }
      ]
    },

    {
      path: '/todopage',
      name: 'todopage',
      component: () => import('../views/TodoView.vue')
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') }
  ]
})

export default router
