const tictactoeEventHandlers = require ('./gameSocketMethods/tic-tac-toe')
const mainEventHandlers = require ('./gameSocketMethods/main')


function socketServer(httpServer) {
    const io = require('socket.io')(httpServer)
    io.use(tictactoeEventHandlers(io))
    io.use(mainEventHandlers(io))  
    io.on('connect', async ()=>{
        console.log('connect')
       
    })
    
}

module.exports.socket = socketServer
