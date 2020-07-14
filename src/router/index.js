import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '@/views/Home'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },{
    path:'/',
    name:'Home',
    component:Home
  }
]

const router = new VueRouter({
  routes
})

export default router
