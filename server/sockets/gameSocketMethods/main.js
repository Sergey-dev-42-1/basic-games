const mainClient = require('../redisModules/redisOperations').mainClient
module.exports = function(io) {
    return function(socket, next) {
      // CurrentUser Нужно для хранения информации о пользователе сокета
        let currentUser = ""
        socket.on('userConnected', async (data)=>{
          if(data.username !== undefined){
            currentUser = data.username
          }
           mainClient.handleUserConnection(data)
        })
        socket.on('userRegistered', (data)=>{
            mainClient.handleUserRegistration(data)
        })
        socket.on('userLoggedIn', async (data)=>{
            mainClient.handleUserLogin(data)
            io.emit('sendingOnlineUsers', await mainClient.sendOnlineUsers())
         })
        socket.on('userLoggedOut', async (data)=>{
            console.log("user logged out")  
            mainClient.handleUserLogout(data)
            io.emit('sendingOnlineUsers', await mainClient.sendOnlineUsers())
        })
        socket.on('disconnect', async (data)=>{
            console.log('disconnected')
            await mainClient.handleUserDisconnect(currentUser)
            io.emit('sendingOnlineUsers', await mainClient.sendOnlineUsers())
        })
        socket.on('sendOnlineUsers', async ()=>{
          socket.emit('sendingOnlineUsers', await mainClient.sendOnlineUsers())
          console.log('sendingOnlineUsers')
        })
        socket.on('sendAllUsers', async ()=>{
          socket.emit('sendingAllUsers', await mainClient.sendAllUsers())
          console.log('sendingAllUsers')
        })
        socket.on('sendAllRooms', async ()=>{
            socket.emit('sendingAllRooms', await mainClient.getRoomOwnerById())
            console.log('sendingAllRooms')
          })
        next()
    }
  };