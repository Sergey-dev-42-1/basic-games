const mainClient = require("../redisModules/redisOperations").mainClient;

module.exports = function (io) {
  return function (socket, next) {
    // CurrentUser Нужно для хранения информации о пользователе сокета
    let currentUser = "";
    const tictactoeRedis = require("../redisModules/tic-tac-toe-Operations")(
      mainClient.connection
    );
    socket.on("userConnected", async (data) => {
      if (data.username !== undefined) {
        currentUser = data.username;
      }
      mainClient.handleUserConnection(data);
    });
    socket.on("userRegistered", async (data) => {
      await mainClient.handleUserRegistration(data);
      io.emit("sendingAllUsers", await mainClient.sendAllUsers());
    });
    socket.on("userLoggedIn", async (data) => {
      await mainClient.handleUserLogin(data);
      io.emit("sendingOnlineUsers", await mainClient.sendOnlineUsers());
    });
    socket.on("userLoggedOut", async (data) => {
      console.log("user logged out");
      await mainClient.handleUserLogout(data);
      io.emit("sendingOnlineUsers", await mainClient.sendOnlineUsers());
    });
    socket.on("disconnect", async () => {
      console.log("disconnected");
      let inhabited_roomId = await mainClient.handleUserDisconnect(currentUser);
      console.log(inhabited_roomId);
      io.emit("sendingOnlineUsers", await mainClient.sendOnlineUsers());
      io.emit("sendingAllRooms", await mainClient.getRoomOwnerById());
      //Уведомить игроков что пользователь отсоединился
      if (inhabited_roomId !== "") {
        await mainClient.handleRoomLeaving({
          username: currentUser,
          roomId: inhabited_roomId,
        });
        await tictactoeRedis.readinessReset(inhabited_roomId);
        console.log(`${currentUser} left room ${inhabited_roomId}`);
        io.emit("sendingAllRooms", await mainClient.getRoomOwnerById());
        console.log("Sending message that user left room by disconnecting");
        socket.to(inhabited_roomId).emit("userLeftRoom", {
          username: currentUser,
          msg: `${inhabited_roomId} left room`,
        });
        socket.leave(inhabited_roomId);
      }
    });
    socket.on("sendOnlineUsers", async () => {
      socket.emit("sendingOnlineUsers", await mainClient.sendOnlineUsers());
      console.log("sendingOnlineUsers");
    });
    socket.on("sendAllUsers", async () => {
      socket.emit("sendingAllUsers", await mainClient.sendAllUsers());
      console.log("sendingAllUsers");
    });
    socket.on("sendAllRooms", async () => {
      socket.emit("sendingAllRooms", await mainClient.getRoomOwnerById());
      console.log("sendingAllRooms");
    });
    next();
  };
};
