const client = require("../redisModules/redisOperations").mainClient;
const db = require("../../db").db;
const db_obj = new db(100);
module.exports = function (io) {
  return function (socket, next) {
    const tictactoeRedis = require("../redisModules/tic-tac-toe-Operations")(
      client.connection
    );

    socket.on("userMessage", async (data) => {
      console.log("Message sent");
      io.in(data.roomId).emit("userSentMessage", {
        username: data.username,
        msg: data.msg,
      });
    });
    socket.on("userConnectedToRoom", async (data) => {
      let response = await client.handleRoomConnection(data);
      tictactoeRedis.readinessReset(data.roomId);
      if (response) {
        socket.join(data.roomId);
        console.log("connected: " + data.username);
        socket.emit("userConnectionSucceeded");
        socket.emit("sendingAllRooms", await client.getRoomOwnerById());
        socket.to(data.roomId).emit("userEnteredRoom", {
          username: data.username,
          msg: `${data.username} connected to room`,
        });
      } else {
        socket.emit("userConnectionFailed");
      }
    });
    socket.on("userCreatedRoom", async (data) => {
      let response = await client.handleRoomCreation(data);
      if (response) {
        socket.emit("sendingAllRooms", await client.getRoomOwnerById());
      } else {
        socket.emit("roomCreationFailed");
      }
    });
    socket.on("userLeavingRoom", async (data) => {
      client.handleRoomLeaving(data);
      tictactoeRedis.readinessReset(data.roomId);
      console.log(`${data.username} left room ${data.roomId}`);
      io.emit("sendingAllRooms", await client.getRoomOwnerById());
      socket.to(data.roomId).emit("userLeftRoom", {
        username: data.username,
        msg: `${data.username} left room`,
      });
      socket.leave(data.roomId);
    });
    socket.on("playerReady", async (data) => {
      let gameStarted = await tictactoeRedis.handleEnemyReadiness(data);

      socket.to(data).emit("enemyReady");

      console.log("Handling readiness");
      if (gameStarted) {
        let turnOrder = Math.random() >= 0.5 ? true : false;
        let signs = tictactoeRedis.handleSignSet();
        io.in(socket.id).emit("signSet", signs[0]);
        socket.to(data).emit("signSet", signs[1]);

        io.in(data).emit("gameStart");

        if (turnOrder) {
          console.log(socket.id);
          io.to(socket.id).emit("turnChange");
        } else {
          socket.to(data).emit("turnChange");
        }
      }
    }),
      socket.on("madeMove", (moveData) => {
        console.log("Sending move data");
        socket.to(moveData.roomId).emit("turnChange", moveData);
      });
    socket.on("gameOver", async (data) => {
      console.log("Sending lose notification to room " + data.roomId);
      await tictactoeRedis.handleEnemyReadiness(data.roomId, true);
      console.log(data);
      socket
        .to(data.roomId)
        .emit("resetState", { win_comb: data.win_comb, reason: data.reason });
    });
    //Как-то не DRY...
    socket.on("restart", async (data) => {
      let gameStarted = await tictactoeRedis.handleEnemyReadiness(data.roomId);
      socket.to(data.roomId).emit("enemyReady");
      if (gameStarted) {
        console.log("Starting game");
        let turnOrder = Math.random() >= 0.5 ? true : false;
        let signs = tictactoeRedis.handleSignSet();
        io.in(socket.id).emit("signSet", signs[0]);
        socket.to(data.roomId).emit("signSet", signs[1]);

        io.in(data.roomId).emit("gameStart");

        if (turnOrder) {
          console.log(socket.id);
          io.to(socket.id).emit("turnChange");
        } else {
          socket.to(data.roomId).emit("turnChange");
        }
      }
    });
    socket.on("sendUsersInRoom", async (roomId) => {
      let people = await tictactoeRedis.handleSendPeopleInRoom(roomId);
      console.log(people);
      socket.emit("sendingUsersInRoom", people);
    });
    next();
  };
};
