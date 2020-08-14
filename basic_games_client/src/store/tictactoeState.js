const win_helper = require('./helpers/tictactoeWinning')
const gameService = require ("../services/gameService")


const state = () => ({
    started:false,
    enemy: '',
    enemyReady: false,
    turn:false,
    status: "",
    turnNum:0,
    board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ],
    
    moveSign:""
  })

const mutations = {

    move(state,payload){
      state.board[payload.row][payload.column] = payload.sign
      ++state.turnNum
    },
    turnChange(state){
      state.turn = !state.turn
    },
    statusSet(state,payload){
      state.status = payload
    },
    opponentConnected(state, payload){
      console.log(payload)
      if(payload.length !== 0){
        state.enemy = payload[0]
      }
      else{
        state.enemy = ''
      }
    },
    signSet(state,payload){
      state.moveSign = payload
    },
    enemyReady(state){
        state.enemyReady = !state.enemyReady
      },
    gameStart(state){
        state.started = !state.started
    },
    gameOver(state, reason){
      console.log('Game over')
        state.turn = false,
        state.board =  [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
          ]
        state.enymy = false
        state.moveSign = ""
        state.enemyReady = false
        state.started = false
        state.status = reason
        this._vm.$socket.client.emit('gameOver',reason)
    }
  }
const actions = {
    async checkUsersInRoom(state,payload){
      console.log('Asking server for users')
      this._vm.$socket.client.emit('sendUsersInRoom',payload)
    },
    async move({state, commit, rootState}, payload){
       
        await commit("move",payload)
        console.log(state.turnNum)
        //Условие ничьей, определяется по количеству ходов
        if(state.turnNum === 9){
          commit('gameOver', "Draw!")
        }
        let win_check_res = win_helper()
        if(win_check_res){
          gameService.updateRating({username:rootState.user.username, value: 1})
          commit('gameOver', `${rootState.user.username} won!`)
        }
      },
    turnChange(state){
    state.commit("turnChange")
    },
    statusSet(state,payload){
      state.commit('statusSet', payload)
    },
    opponentConnected(state, payload){
      state.commit("opponentConnected", payload)
    },
    gameStart(state){
        state.commit("gameStart")
    },
    signSet(state,payload){
    state.commit('signSet', payload)
    },
    enemyReady(state){
        state.commit("enemyReady")
    },
    gameOver(state){
        state.commit("gameOver")
    },
    socket_sendingUsersInRoom({ state, commit, rootState }, payload){
        let workaround = state.enemy
        console.log(workaround)
        
        console.log('Getting users in room')
        console.log(payload)
        commit('opponentConnected', payload.filter((value)=>
        {
          console.log(value === rootState.user.username)
          if(value === rootState.user.username){
            return false
          }
          else{
            return true
          }
        }))
    }
}
export default {
  state,
  actions,
  mutations
}