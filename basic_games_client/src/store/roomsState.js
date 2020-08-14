const state = () => ({
    allUsers: [],
    onlineUsers: [],
    allRooms:[],
    roomIds:[]
  })

const mutations = {

    storeAllUsers(state,payload){
      state.allUsers = payload
    },
    storeCreatedRoom(state,payload){
      state.allRooms.push(payload)
      state.roomIds.push(payload.roomId)
    },
    storeOnlineUsers(state,payload){
      state.onlineUsers = payload
    },

    storeAllRooms(state,payload){
      state.allRooms = payload
      for(let room in payload){
        state.roomIds.push(payload[room].roomId)
      }
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
    async storeAllRooms(){
      this._vm.$socket.client.emit('sendAllRooms')
      },
      //Обработчики
    socket_sendingAllUsers(state,payload){
      state.commit('storeAllUsers',payload)
    },
    socket_sendingOnlineUsers(state,payload){
      state.commit('storeOnlineUsers',payload)
    },
    socket_sendingAllRooms(state,payload){
      state.commit('storeAllRooms',payload)
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