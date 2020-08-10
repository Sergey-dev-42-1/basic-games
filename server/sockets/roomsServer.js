//Инициализация Redis

const { emit } = require('nodemon')

const client = require('./redisOperations').client


function socketServer(httpServer) {
    const io = require('socket.io')(httpServer)
    
    io.on('connection', (socket) => {
        console.log('connected')
        socket.on('userLogin', data => {
        })
        socket.on('userMessage', async (data)=>{
            console.log('Message sent')
            io.in(data.roomId).emit('userSentMessage',{username: data.username, msg: data.msg})
          })
        socket.on('userConnectedToRoom', async (data)=>{
           let response = await client.handleRoomConnection(data)
           if(response){
            socket.join(data.roomId)
            socket.emit('userConnectionSucceeded')
            io.in(data.roomId).emit('userEnteredRoom',{username: data.username, msg: `${data.username} connected to room`})
           }
           else{
            socket.emit('userConnectionFailed')
           }
         })
        socket.on('userCreatedRoom', async (data)=>{
        let response = await client.handleRoomCreation(data)
        if(response){
            io.emit('roomCreationSucceeded',response)
        }
        else{
            socket.emit('roomCreationFailed')
        }
        })
        socket.on('userLeavingRoom', (data)=>{
            client.handleRoomLeaving(data)
            console.log(`${data.username} left room ${data.roomId}`)
            socket.to(data.roomId).emit('userLeftRoom',{username: data.username, msg: `${data.username} left room`})
         })
        socket.on('userConnected', (data)=>{
           client.handleUserConnection(data)
        })
        socket.on('userRegistered', (data)=>{
            client.handleUserRegistration(data)
        })
        socket.on('userLoggedIn', (data)=>{
            client.handleUserLogin(data)
         })
        socket.on('userLoggedOut', (data)=>{
            console.log("user logged out")  
            client.handleUserLogout(data)
        })
        socket.on('disconnect', (data)=>{
            console.log('disconnected')
            client.handleUserDisconnect(data)
        })
        socket.on('sendOnlineUsers', async ()=>{
          socket.emit('sendingOnlineUsers', await client.sendOnlineUsers())
          console.log('sendingOnlineUsers')
        })
        socket.on('sendAllUsers', async ()=>{
          socket.emit('sendingAllUsers', await client.sendAllUsers())
          console.log('sendingAllUsers')
        })
        socket.on('sendAllRooms', async ()=>{
            socket.emit('sendingAllRooms', await client.getRoomOwnerById())
            console.log('sendingAllRooms')
          })
    })
}

module.exports.socket = socketServer
