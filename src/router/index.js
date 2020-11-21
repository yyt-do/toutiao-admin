import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home/home'
import Layout from '@/views/layout/layout'
import Article from '@/views/article/article'
import Publish from '@/views/publish/publish'

Vue.use(VueRouter)
// 路由配置
const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/layout',
    name: 'layout',
    component: Layout,
    redirect: '/home',
    children: [
      { path: '/home', component: Home },
      { path: '/article', component: Article },
      { path: '/publish', component: Publish }
    ]
  }
]
const router = new VueRouter({
  routes
})

export default router
