import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ZkTable from 'vue-table-with-tree-grid'
// 导入nprogress样式文件
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import './plugins/element.js'
// 导入字体图标库
import './fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 导入全局样式
import './assets/global.css'
// 导入时间插件
import moment from 'moment'
// 配置axios的基地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios的请求拦截器中挂载token令牌
axios.interceptors.request.use(config => {
  // Do something before request is sent
  // console.log(config)
  // 开启nprogress
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// axios的响应拦截器
axios.interceptors.request.use(response => {
  // 关闭Nprogress
  Nprogress.done()
  return response
})
// 设置一个baseUrl在后面上传图片文件的时候使用
sessionStorage.setItem('baseUrl', 'http:////127.0.0.1:8888/api/private/v1/')
// 通过原型挂载的方式将axios挂载给Vue,让单文件组件
Vue.component('table-tree', ZkTable)
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 定义全局时间过滤器
Vue.filter('dateFormat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  // params 就是调用过滤器的参数
  // const date = new Date(params)
  // const year = date.getFullYear()
  // const month = (date.getMonth() + 1).toString().padStart(2, 0)
  // const day = date.getDate().toString().padStart(2, 0)
  // const hour = date.getHours().toString().padStart(2, 0)
  // const minutes = date.getMinutes().toString().padStart(2, 0)
  // const seconds = date.getSeconds().toString().padStart(2, 0)
  // return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
  return moment(dataStr).format(pattern)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
