//Инициализация Redis

const client = require('./redisOperations').client


function socketServer(httpServer) {
    const io = require('socket.io')(httpServer)
    
    io.on('connection', (socket) => {
        console.log('connected')
        socket.on('userLogin', data => {

        })
        socket.on('userConnected', (data)=>{
           client.handleUserConnection(data)
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
          io.emit('sendingOnlineUsers', await client.sendOnlineUsers())
          console.log('sendingOnlineUsers')
        })
        socket.on('sendAllUsers', async ()=>{
          io.emit('sendingAllUsers', await client.sendAllUsers())
          console.log('sendingAllUsers')
        })
    })
}

module.exports.socket = socketServer
