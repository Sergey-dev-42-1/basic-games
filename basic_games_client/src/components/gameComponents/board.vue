<template>
  <span>
    <span class="UIContainer">
      <v-btn id="statusBar">{{ status }}</v-btn>
      <span class="boardContainer">
        <span class="tictactoe-board">
          <div v-for="(n, column) in 3" :key="n">
            <div v-for="(n, row) in 3" :key="n">
              <cell
                @move="move(row, column)"
                :value="board[row][column]"
              ></cell>
            </div>
          </div>
        </span>
      </span>
      <v-btn v-if="!ready_flag" @click="ready" id="readyNav">Ready</v-btn>
      <v-btn v-if="restart_flag" @click="restart" id="readyNav">Restart?</v-btn>
    </span>
  </span>
</template>

<script>
import cell from "./cell";
export default {
  components: {
    cell,
  },
  data() {
    return {
      board: this.$store.state.tictactoeState.board,
      status: "",
      ready_flag: false,
      restart_flag: false,
    };
  },
  created() {
    console.log("checking users in room");
    this.$store.dispatch("checkUsersInRoom", this.$route.params.id);
    this.status_unwatch = this.$store.watch(
      (state) => state.tictactoeState.status,
      (newValue) => {
        this.status = newValue;
      }
    );
    this.board_unwatch = this.$store.watch(
      (state) => state.tictactoeState.board,
      (newValue) => {
        this.board = newValue;
      }
    );
    this.restart_unwatch = this.$store.watch(
      (state) => state.tictactoeState.restart_flag,
      (newValue) => {
        console.log("restart value changed");
        this.restart_flag = newValue;
      }
    );
  },
  beforeDestroy() {
    this.status_unwatch();
    this.board_unwatch();
    this.restart_unwatch();
  },
  sockets: {
    userEnteredRoom(payload) {
      this.$store.dispatch("opponentConnected", payload.username);
    },
    async userLeftRoom() {
      this.$store.dispatch("statusSet", "Opponent left the room!");
      await this.$store.dispatch("checkUsersInRoom", this.$route.params.id);
      await this.$store.dispatch("resetState", { reason: "Draw" });
      this.ready_flag = false;
      this.restart_flag = false;
      this.$forceUpdate();
    },
    enemyReady() {
      this.$store.dispatch("statusSet", "Enemy ready!");
      console.log("Enemy ready!");
      this.$store.dispatch("enemyReady");
    },
    signSet(payload) {
      console.log("Received sign: " + payload);
      this.$store.dispatch("signSet", payload);
    },
    gameStart() {
      console.log("game started");
      this.$store.dispatch("gameStart");
      this.$store.dispatch("statusSet", "Starting!");
    },
    turnChange(payload) {
      console.log(payload);
      console.log("game started");
      if (!payload) {
        this.$store.dispatch("turnChange");
        this.$store.dispatch("statusSet", "Your move!");
      } else {
        console.log(
          "received move " + "row " + payload.row + " column " + payload.column
        );
        console.log("moving, roomID " + this.$route.params.id);
        this.$store.dispatch("move", {
          roomId: this.$route.params.id,
          row: payload.row,
          column: payload.column,
          sign: payload.sign,
        });
        this.$store.dispatch("turnChange");
        this.$store.dispatch("statusSet", "Your move!");
        console.log(this.$store.state.tictactoeState.board);
      }
    },
  },
  async beforeRouteLeave(to, from, next) {
    this.$store.dispatch("gameOver");
    next(true);
  },
  methods: {
    ready() {
      if (this.$store.state.tictactoeState.enemy === "") {
        this.$store.dispatch("statusSet", "No one in room!");
      } else {
        this.$store.dispatch("statusSet", "Ready!");
        this.ready_flag = true;
        this.$socket.client.emit("playerReady", this.$route.params.id);
      }
    },
    restart() {
      this.$store.dispatch("restart", { roomId: this.$route.params.id });
      this.$store.dispatch("statusSet", "Ready!");
      this.$store.dispatch("restartOption", false);
    },
    move(row, column) {
      if (!this.$store.state.tictactoeState.started) {
        this.$store.dispatch("statusSet", "Game didn't start!");
      } else if (!this.$store.state.tictactoeState.turn) {
        this.$store.dispatch("statusSet", "It's not your turn!");
      } else if (this.$store.state.tictactoeState.board[row][column] !== "") {
        this.$store.dispatch("statusSet", "Already taken!");
      } else {
        console.log("after click move " + "row " + row + " column " + column);
        this.$store.dispatch("move", {
          roomId: this.$route.params.id,
          row: row,
          column: column,
          sign: this.$store.state.tictactoeState.moveSign,
        });
        this.$store.dispatch("turnChange");
        this.$store.dispatch("statusSet", "Enemy's move!");
        this.$socket.client.emit("madeMove", {
          roomId: this.$route.params.id,
          row: row,
          column: column,
          sign: this.$store.state.tictactoeState.moveSign,
        });
        this.$forceUpdate();
      }
    },
  },
};
</script>
<style>
.tictactoe-board {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 18vw;
  height: 18vw;
}
.boardContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 18vw;
}
.UIContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100%;
}
#readyNav {
  text-align: center;
  align-self: initial;
  width: 18vw;
  height: 4.5vh;
  background-color: lightskyblue;
}
#statusBar {
  text-align: center;
  align-self: initial;
  width: 18vw;
  height: 4.5vh;
  background-color: lightskyblue;
}
</style>
