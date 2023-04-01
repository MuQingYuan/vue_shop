import Vue from 'vue'
import VueRouter from 'vue-router'

import MyLogin from '@/components/MyLogin.vue'
import MyHome from '@/components/MyHome.vue'
import MyWelcome from '@/components/MyWelcome.vue'
import MyUsers from '@/components/user/MyUsers.vue'
import MyRights from '@/components/Power/MyRights.vue'
import MyRoles from '@/components/Power/MyRoles.vue'
import CateGories from '@/components/goods/CateGories.vue'
import MyParams from '@/components/goods/MyParams.vue'
import MyList from '@/components/goods/MyList.vue'
import AddGoods from '@/components/goods/AddGoods.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: MyLogin },
    {
      path: '/home',
      component: MyHome,
      redirect: '/home/welcome',
      children: [
        { path: 'welcome', component: MyWelcome },
        { path: '/users', component: MyUsers },
        { path: '/rights', component: MyRights },
        { path: '/roles', component: MyRoles },
        { path: '/categories', component: CateGories },
        { path: '/params', component: MyParams },
        { path: '/goods', component: MyList },
        { path: '/goods/add', component: AddGoods }
      ]
    }
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
