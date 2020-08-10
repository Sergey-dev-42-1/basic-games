import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Registration.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import Unauthorized from '../views/Unauthorized'
import Rooms from '../views/Rooms'
import Room from '../views/Room'
import store from '../store/index'
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter(to, from, next){
      if(localStorage.getItem('refreshToken'))
      {
        next('/')
      }
      else{next()}
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter(to, from, next){
      if(localStorage.getItem('refreshToken'))
      {
        next('/')
      }
      else{next()}
    }
  },

  {
    path: '/rooms',
    name: 'Rooms',
    component: Rooms,
    async beforeEnter(to, from, next){
      console.log('Dispatched check')
      let auth = await store.dispatch('authorize')
      
      if(auth){
        next()
      }
      else{
        next('/401')
      }
    }
  },
  {
    path: '/rooms/:id',
    name: 'Room',
    component: Room,
    async beforeEnter(to, from, next){
      if(store.state.roomsState.roomIds.indexOf(to.params.id) === -1 ){
        next('/404')
      }
      let auth = await store.dispatch('authorize')
      if(!auth){
        next('/401')
      }
      else{
        
        next()
      }
    },
    
  },
  {
    path: '/401',
    name: '401',
    component: Unauthorized,
    beforeEnter(to, from, next){
      if(localStorage.getItem('refreshToken'))
      {
        next()
      }
      else{next('/login')}
    }
  },
  {
    path: '/*',
    name: '404',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

