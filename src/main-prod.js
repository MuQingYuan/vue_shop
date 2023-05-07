import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import '../src/assets/fonts/iconfont.css'
import axios from 'axios'
// 导入树型结构表
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入NProgress 包对应的JS和css
import NProgress from 'nprogress'

Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://47.108.115.132:8889/api/private/v1/'

// 在requset拦截器中，展示进度条NProgress.start()
axios.interceptors.request.use((config) => {
  // 拦截器
  config.headers.Authorization = sessionStorage.getItem('token')
  NProgress.start()
  return config
})
// 在response拦截器中，隐藏进度条NProgress.done()
axios.interceptors.response.use((response) => {
  NProgress.done()
  return response
})
Vue.component('tree-table', TreeTable) // 注册树型表格组件
Vue.use(VueQuillEditor) // 注册富文本编辑器

Vue.filter('timeFormat', function(origin) {
  // 时间过滤器
  const date = new Date(origin * 1000)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDate() + '').padStart(2, '0')
  const hh = (date.getHours() + '').padStart(2, '0')
  const mm = (date.getMinutes() + '').padStart(2, '0')
  const ss = (date.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
