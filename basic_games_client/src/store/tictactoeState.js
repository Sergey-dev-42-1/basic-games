const state = () => ({
    started:false,
    turn:false,
    board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ],
    moveSign:""
  })

const mutations = {

    move(state,payload){
      state.board[payload.row][payload.column] = state.moveSign
    },
    turnChange(state){
      state.turn = !state.turn
    },
    signSet(state,payload){
      state.moveSign = payload.sign
    },
    gameOver(state){
        state.turn = false,
        state.board =  [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
          ]
        state.moveSign = ""
    }
  }
const actions = {
    move(state,payload){
        state.commit("move",payload)
      },
    turnChange(state){
    state.commit("turnChange")
    },
    signSet(state,payload){
    state.commit('signSet', payload)
    },
    gameOver(state){
        state.commit("gameOver")
    }
    //socket_sendingAllRooms(state,payload){
    //   state.commit('storeAllRooms',payload)
    // },
    }
export default {
  state,
  actions,
  mutations
}