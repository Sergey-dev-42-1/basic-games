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
      status: "",
      ready_flag:false,
    } },
    methods:{
        ready(){
           this.status = "User ready!"
           this.ready_flag = true
           //Send conf to server
        },
        move(row,column){
            if(!this.$store.state.tictactoeState.started){
               this.status = "Game didn't start!"
            }
            else if(!this.$store.state.tictactoeState.turn){
                this.status = "It's not your turn!"
            }
            else{
                this.$store.state.tictactoeState.board[row][column] = this.$store.state.tictactoeState.moveSign
                this.$store.state.tictactoeState.turn = false
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