import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  
  state: {
    user: {},
    accessToken: '',
    refreshToken: '',
  },
  mutations: {
    login(state,payload){
      state.user = payload.user
      state.accessToken = payload.accessToken
      state.refreshToken = payload.refreshToken
    },
    logout(state){
      state.user = ""
      state.accessToken = ''
      state.refreshToken = ''
    }
  },
  actions: {
    async login(context,payload){
      context.commit('login',payload)
    },
    logout(context){
      context.commit('logout')
    }
  },
  modules: {
  }
})
