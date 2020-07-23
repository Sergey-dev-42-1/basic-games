import Vue from 'vue'
import Router from 'vue-router'
import registration from '@/views/Registration'
import about from '@/views/About'

Vue.use(Router)

export default new Router({
  routes: [
    {path : '/about', name: 'About', component: about},
    {path : '/register', name: 'Register', component: registration}
  ]
})

