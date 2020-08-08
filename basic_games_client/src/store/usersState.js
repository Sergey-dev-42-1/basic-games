const state = () => ({
    allUsers: [],
    onlineUsers: []
  })

const mutations = {

    storeAllUsers(state,payload){
      state.allUsers = payload
    },

    storeOnlineUsers(state,payload){
      state.onlineUsers = payload
    },

    userLoggedOut(state,payload){
      state.onlineUsers = state.onlineUsers.filter((value)=>{
          if(value !== payload.username){
              return true
          }
          return false
      })
    }
  }
const actions = {
      //Запросы к Redis
    async storeAllUsers(){
      this._vm.$socket.client.emit('sendAllUsers')
      },
    async storeOnlineUsers(){
      this._vm.$socket.client.emit('sendOnlineUsers')
      },
      //Обработчики
    socket_sendingAllUsers(state,payload){
        state.commit('storeAllUsers',payload)
      },
    socket_sendingOnlineUsers(state,payload){
        state.commit('storeOnlineUsers',payload)
      },

    userLoggedOut(state,payload){
        state.commit('userLoggedOut',payload)
      },
    }
export default {
  state,
  actions,
  mutations
}