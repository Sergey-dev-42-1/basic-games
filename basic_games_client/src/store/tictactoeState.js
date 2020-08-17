const win_helper = require("./helpers/tictactoeWinning");
const win_board_helper = require("./helpers/tictactoeWinBoardClear");
const gameService = require("../services/gameService").default;

const state = () => ({
  started: false,
  enemy: "",
  enemyReady: false,
  turn: false,
  status: "",
  turnNum: 0,
  board: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  restart_flag: false,
  moveSign: "",
});

const mutations = {
  move(state, payload) {
    state.board[payload.row][payload.column] = payload.sign;
    ++state.turnNum;
  },
  turnChange(state) {
    state.turn = !state.turn;
  },
  statusSet(state, payload) {
    state.status = payload;
  },
  opponentConnected(state, payload) {
    console.log(payload);
    if (payload.length !== 0) {
      state.enemy = payload[0];
    } else {
      state.enemy = "";
    }
  },
  signSet(state, payload) {
    state.moveSign = payload;
  },
  enemyReady(state) {
    state.enemyReady = !state.enemyReady;
  },
  gameStart(state) {
    state.started = !state.started;
    state.board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  },
  resetState(state, payload) {
    if (payload.reason !== "Draw") {
      console.log(state.board + " before method");
      let cleared_board = win_board_helper(state.board, payload.win_comb);
      state.board = cleared_board;
    } else {
      state.board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
    }
    state.turn = false;
    state.enemy = "";
    state.turnNum = 0;
    state.moveSign = "";
    state.enemyReady = false;
    state.started = false;
    state.status = payload.reason;
    state.restart_flag = false;
  },
  restartOption(state, payload) {
    console.log("Restarting");
    console.log(state.restart_flag);
    state.restart_flag = payload;
  },
};
const actions = {
  async checkUsersInRoom(state, payload) {
    console.log("Asking server for users");
    this._vm.$socket.client.emit("sendUsersInRoom", payload);
  },
  async move({ state, commit, rootState }, payload) {
    await commit("move", payload);

    let win_check_res = win_helper(state.board, state.moveSign);

    //Условие ничьей, определяется по количеству ходов
    if (state.turnNum === 9 && !win_check_res) {
      console.log("draw cond");
      this._vm.$socket.client.emit("gameOver", {
        roomId: payload.roomId,
        reason: `Draw`,
      });
    }

    if (win_check_res) {
      await gameService.updateRating({
        username: rootState.user.username,
        value: 1,
      });
      this._vm.$socket.client.emit("gameOver", {
        roomId: payload.roomId,
        win_comb: win_check_res,
        reason: `${rootState.user.username} won!`,
      });
    }
  },
  turnChange(state) {
    state.commit("turnChange");
  },
  statusSet(state, payload) {
    state.commit("statusSet", payload);
  },
  opponentConnected(state, payload) {
    state.commit("opponentConnected", payload);
  },
  gameStart(state) {
    state.commit("gameStart");
  },
  signSet(state, payload) {
    state.commit("signSet", payload);
  },
  enemyReady(state) {
    state.commit("enemyReady");
  },
  resetState(state, payload) {
    state.commit("resetState", payload);
  },
  restart(state, payload) {
    this._vm.$socket.client.emit("restart", payload);
  },
  restartOption(state, payload) {
    state.commit("restartOption", payload);
  },
  socket_restartOption(state, payload) {
    state.commit("restartOption", payload);
  },
  socket_resetState(state, payload) {
    state.commit("resetState", payload);
  },
  socket_sendingUsersInRoom({ commit, rootState }, payload) {
    console.log("Getting users in room");
    console.log(payload);
    commit(
      "opponentConnected",
      payload.filter((value) => {
        console.log(value === rootState.user.username);
        if (value === rootState.user.username) {
          return false;
        } else {
          return true;
        }
      })
    );
  },
};
export default {
  state,
  actions,
  mutations,
};
