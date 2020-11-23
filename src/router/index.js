import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home/home'
import Layout from '@/views/layout/layout'
import Article from '@/views/article/article'
import Publish from '@/views/publish/publish'
import Image from '@/views/image/image'
import Comment from '@/views/comment/comment'

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
      { path: '/publish', component: Publish },
      { path: '/img', component: Image },
      { path: '/comment', component: Comment }

    ]
  }
]
const router = new VueRouter({
  routes
})

export default router
