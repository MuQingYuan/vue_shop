import Vue from 'vue'
import VueRouter from 'vue-router'

const MyLogin = () =>
  import(/* webpackChunkName:"login_home_welcome" */ '@/components/MyLogin.vue')
// import Login from './components/Login.vue'
const MyHome = () =>
  import(/* webpackChunkName:"login_home_welcome" */ '@/components/MyHome.vue')
// import Home from './components/Home.vue'
const MyWelcome = () =>
  import(
    /* webpackChunkName:"login_home_welcome" */ '@/components/MyWelcome.vue'
  )
// import Welcome from './components/Welcome.vue'
const MyUsers = () =>
  import(/* webpackChunkName:"user" */ '@/components/user/MyUsers.vue')
// import Users from './components/user/Users.vue'
const MyRights = () =>
  import(/* webpackChunkName:"power" */ '@/components/Power/MyRights.vue')
// import Rights from './components/power/Rights.vue'
const MyRoles = () =>
  import(/* webpackChunkName:"power" */ '@/components/Power/MyRoles.vue')
// import Roles from './components/power/Roles.vue'
const CateGories = () =>
  import(/* webpackChunkName:"goods" */ '@/components/goods/CateGories.vue')
// import Cate from './components/goods/Cate.vue'
const MyParams = () =>
  import(/* webpackChunkName:"goods" */ '@/components/goods/MyParams.vue')
// import Params from './components/goods/Params.vue'
const MyList = () =>
  import(/* webpackChunkName:"goods" */ '@/components/goods/MyList.vue')
// import GoodList from './components/goods/List.vue'
const AddGoods = () =>
  import(/* webpackChunkName:"goods" */ '@/components/goods/MyList.vue')
// import GoodAdd from './components/goods/Add.vue'
const MyOrder = () =>
  import(/* webpackChunkName:"order" */ '@/components/order/MyOrder.vue')
// import Order from './components/order/Order.vue'
const MyReport = () =>
  import(/* webpackChunkName:"report" */ '@/components/report/MyReport.vue')
// import Report from './components/report/Report.vue'

// import MyLogin from '@/components/MyLogin.vue'
// import MyHome from '@/components/MyHome.vue'
// import MyWelcome from '@/components/MyWelcome.vue'
// import MyUsers from '@/components/user/MyUsers.vue'
// import MyRights from '@/components/Power/MyRights.vue'
// import MyRoles from '@/components/Power/MyRoles.vue'
// import CateGories from '@/components/goods/CateGories.vue'
// import MyParams from '@/components/goods/MyParams.vue'
// import MyList from '@/components/goods/MyList.vue'
// import AddGoods from '@/components/goods/AddGoods.vue'
// import MyOrder from '@/components/order/MyOrder.vue'
// import MyReport from '@/components/report/MyReport.vue'

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
        { path: '/goods/add', component: AddGoods },
        { path: '/orders', component: MyOrder },
        { path: '/reports', component: MyReport }
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
