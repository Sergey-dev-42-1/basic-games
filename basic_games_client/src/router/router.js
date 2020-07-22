import Vue from 'vue'
import Router from 'vue-router'
import registration from '@/components/Registration'
import app from '@/App'


Vue.use(Router)

export default new Router({
  routes: [
    {path : '/', component: app},
    {path : '/register', component: registration}
  ]
})

