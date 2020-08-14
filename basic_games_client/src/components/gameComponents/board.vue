<template>
<span>
    <span class="UIContainer">
    <v-btn id='statusBar'>{{status}}</v-btn>
    <span class="boardContainer">
        <span class="tictactoe-board">
            <div v-for="(n, row) in 3" :key="n">
            <div v-for="(n, column) in 3" :key="n">
                <cell @move="move(row,column)" :value="board[row][column]"></cell>
            </div>
            </div>
        </span>
        
        </span>
    <v-btn v-if="!ready_flag" @click="ready" id='readyNav' >Ready</v-btn>
    </span>
    
</span>

</template>

<script>

import cell from "./cell";
  export default {
    components:{
        cell
    },
    data() { return {
      board: this.$store.state.tictactoeState.board,
      status: '',
      ready_flag:false,
    } },
    created(){
      console.log("checking users in room")
      this.$store.dispatch('checkUsersInRoom',this.$route.params.id)
      this.status_unwatch = this.$store.watch(
      (state) => state.tictactoeState.status,
      (newValue) => {
        this.status = newValue
      },
    );
    },
    beforeDestroy(){
      this.status_unwatch();
    },
    sockets: {
      userEnteredRoom(payload){
        this.$store.dispatch('opponentConnected', payload.username)
      },
      userLeftRoom(){
        this.$store.dispatch('gameOver', "Opponent left the room!")
        this.ready_flag = false
        this.$forceUpdate()
      },
      enemyReady(){
        this.$store.dispatch('statusSet',"Enemy ready!") 
        console.log("Enemy ready!")
        this.$store.dispatch('enemyReady')
      },
      signSet(payload){
        console.log('Received sign: ' + payload)
        this.$store.dispatch('signSet',payload)
      },
      gameStart(){
        console.log('game started')
        this.$store.dispatch('gameStart')
        this.$store.dispatch('statusSet',"Starting!")
      },
      turnChange(payload){
        console.log(payload)
        console.log('game started')
        if(!payload){
          this.$store.dispatch('turnChange')
          this.$store.dispatch('statusSet', "Your move!")
        }
        else{
          this.$store.dispatch('move', { row: payload.row, column: payload.column, sign: payload.sign})
          this.$store.dispatch('turnChange')
          this.$store.dispatch('statusSet',"Your move!")
          console.log(this.$store.state.tictactoeState.board)
         
        }
        this.$forceUpdate()
      },
    },
    async beforeRouteLeave(to,from,next){
      this.$store.dispatch('gameOver')
      next(true)
    }, 
    methods:{
        ready(){
          if(this.$store.state.tictactoeState.enemy === ""){
            this.$store.dispatch('statusSet',"No one in room!")
          }
          else{
           this.$store.dispatch('statusSet', "Ready!")
           this.ready_flag = true
           this.$socket.client.emit('playerReady', this.$route.params.id)
          }
        },
        move(row,column){
            if(!this.$store.state.tictactoeState.started){
               this.$store.dispatch('statusSet',"Game didn't start!")
            }
            else if(!this.$store.state.tictactoeState.turn){
                this.$store.dispatch('statusSet',"It's not your turn!")
            }
            else if(this.$store.state.tictactoeState.board[row][column] !==""){
                this.$store.dispatch('statusSet',"Already taken!")
            }
            else{
                this.$store.dispatch('move',{row: row,column: column, sign:this.$store.state.tictactoeState.moveSign }) 
                this.$store.dispatch('turnChange')
                this.$store.dispatch('statusSet',"Enemy's move!")
                this.$socket.client.emit('madeMove',
                                        {
                                        roomId: this.$route.params.id,
                                        row: row, 
                                        column: column, 
                                        sign:this.$store.state.tictactoeState.moveSign})
                console.log(this.$store.state.tictactoeState.turnNum)                        
                this.$forceUpdate()
            }
        }
    },
  }
</script>
<style>
  .tictactoe-board {
    display: flex;
    flex-direction: row;
    justify-content:center;
    width: 18vw;
    height: 18vw;
  }
  .boardContainer{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content:center;
    width: 100vw;
    height: 18vw;
  }
  .UIContainer{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content:center;
    width: 100vw;
    height: 22.5vw;
  }
  #readyNav{
    text-align: center;
    align-self:initial;
    width:18vw;
    height: 4.5vh;
    background-color: lightskyblue;
  }
  #statusBar{
    text-align: center;
    align-self:initial;
    width:18vw;
    height: 4.5vh;
    background-color: lightskyblue;
  }
</style>