import { createRouter, createWebHistory } from 'vue-router'
import MyPlane from '../views/MyPlane.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MyPlane
    },
    {
      path: '/animation_skinning_blending',
      name: 'animation-skinning-blending',
      component: () => import('../views/AnimationSkinningBlending.vue')
    }
  ]
})

export default router
