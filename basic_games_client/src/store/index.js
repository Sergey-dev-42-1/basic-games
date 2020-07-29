import Vue from 'vue'
import Vuex from 'vuex'
import registrationService from '../services/registrationService'
Vue.use(Vuex)
let store = new Vuex.Store({
  
  state: {
    user: JSON.parse(localStorage.getItem('user')) || false,
    accessToken: localStorage.getItem('accessToken') || false,
    refreshToken: localStorage.getItem('refreshToken') || false,
  },
  mutations: {
    login(state,payload){
      state.user = payload.user
      state.accessToken = payload.accessToken
      state.refreshToken = payload.refreshToken
    },
    refreshAccess(state,payload){
      localStorage.setItem('accessToken', payload.accessToken) 
      state.accessToken = payload.accessToken
    },
    logout(state){
      console.log('Logging out')
      state.user = false
      state.accessToken = false
      state.refreshToken = false
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  },
  actions: {
    login(context,payload){
      localStorage.setItem('user',JSON.stringify({username: payload.user.username,
        email: payload.user.email,
        rating: payload.user.rating})),
      localStorage.setItem('accessToken', payload.accessToken) 
      localStorage.setItem('refreshToken', payload.refreshToken) 
      context.commit('login', payload)
      this._vm.$socket.client.emit('userConnected', payload.user.username);
    },
    async authorize({commit,state}){
        let res = '';
        let error = '';
        if(state.refreshToken){
          try{
            res = await registrationService.checkAccess(state.accessToken)
            return true
          }
          catch(err){
            console.log('Access token expired')
            error = err
          }
        }
        else{
          commit('logout')
          return false
        }
        if (error !== '' && error.response.status === 403)
          {
            console.log('handling 403')
            try{
              res = await registrationService.giveAccessToken(state.refreshToken)
              commit('refreshAccess',{accessToken: res.data.accessToken})
              return true
            }
            catch(err){
              console.log(err)
              console.log('Refresh token expired')
              commit('logout')
              return false
            }
          }
    },
    logout(context){
      context.commit('logout')
    }
  },
  modules: {
  }
})
export default store
