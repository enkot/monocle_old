import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Home from '../views/Home.vue'
import Stocks from '../views/Stocks.vue'
import Authorize from '../views/Authorize.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/stocks',
    name: 'Stocks',
    component: Stocks,
    meta: { requiresAuth: true }
  },
  {
    path: '/authorize',
    name: 'Authorize',
    component: Authorize
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.isAuthenticated) {
      next({ name: 'Authorize' })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
