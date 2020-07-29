//Инициализация Redis
const redis = require('redis')
const fs = require('fs')
let client = undefined
fs.readFile('./sockets/credentials.json', 'utf-8', function(err, data) {
    if(err) throw err;
    creds = JSON.parse(data);
    client = redis.createClient('redis://' + creds.user + ':' + creds.password + '@' + creds.host + ':' + creds.port);
    client.once('ready', function() {
        console.log('Connected to redis')
        client.get('online_users', function(err, reply) {
            if (reply) {
                users = JSON.parse(reply);
            }
        });
        client.get('chat_messages', function(err, reply) {
            if (reply) {
                chat_messages = JSON.parse(reply);
            }
        });
    });
});

function socketServer(httpServer) {
    const io = require('socket.io')(httpServer)
    
    io.on('connection', (socket) => {
        console.log('connected')
        redis.set('')
        socket.on('disconnect', ()=>{
            console.log('disconnect')
        })
        socket.on('pingServer', ()=>{
          io.emit('messageChannel','hear ya')
          console.log('Got pinged')
        })
       
    })
}

module.exports.socket = socketServer
