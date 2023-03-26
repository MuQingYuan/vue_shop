import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import '../src/assets/fonts/iconfont.css'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use((config) => {
  // 拦截器
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})

// Vue.prototype.$comfirm = s

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
