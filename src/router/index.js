import Vue from 'vue'
import VueRouter from 'vue-router'
import MyLogin from '@/components/MyLogin.vue'
import MyHome from '@/components/MyHome.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: MyLogin },
    { path: '/home', component: MyHome }
  ]
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  if (to.path === '/home') {
    if (token !== null) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
