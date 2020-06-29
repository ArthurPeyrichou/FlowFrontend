import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import DesignBoard from '../views/DesignBoard.vue'
import BlankBoard from '../views/BlankBoard.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'DesignBoard',
    component: DesignBoard
  },
  {
    path: '/blank-board',
    name: 'BlankBoard',
    component: BlankBoard
  }
]

const router = new VueRouter({
  routes
})

export default router
