import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录组件
import Login from '../components/Login'
// 导入home组件
import Home from '../components/Home'
// 导入欢迎界面
import Welcome from '../components/Welcome'
// 导入用户路由
import Users from '../components/users/users'
// 导入权限列表路由
import Rights from '../components/rights/Rights'
// 导入角色列表路由
import Roles from '../components/rights/Roles'
// 导入商品分类路由
import Categories from '../components/goods/Categories'
// 导入商品
import Params from '../components/goods/Params'
// 导入商品列表 @表示src文件夹
import Goods from '@/components/goods/Goods'
// 导入添加商品的组件add
import Add from '../components/goods/Add'
// 导入orders
import Orders from '../components/orders/Orders'
// 导入echarts图表面
import Reports from '../components/reports/Reports'
Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: 'welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
  }
]
const router = new VueRouter({
  routes
})

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // to表示即将要去的页面 from表示从哪来的页面 next()放行
  // if (to.path === '/login') {
  //   next()
  // } else {
  //   if (sessionStorage.getItem('token')) {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // }
  if (to.path === '/login') {
    next()
  } else {
    // 如果访问的不是登录页面，首先验证是否有token，有token就放行，没有就强制跳转到登录页面
    // 自己造的假token虽然可以进这个home页面但是获取不到数据
    if (!sessionStorage.getItem('token')) return next('/login')
    next()
  }
})
export default router
