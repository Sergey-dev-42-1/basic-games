const redis = require('redis')
const fs = require('fs')
const db = require('../db').db
const db_obj = new db(100)
const util = require('util')
const { inflate } = require('zlib')
class redisClient{
    constructor(){
        fs.readFile('./sockets/credentials.json', 'utf-8', (err, data) => {
            if(err) throw err;
            let creds = JSON.parse(data);
            this.client = redis.createClient('redis://' + creds.user + ':' + creds.password + '@' + creds.host + ':' + creds.port);
            this.client.once('ready', async () => {
                //Сбросить пользователей онлайн после перезагрузки сервера
                this.client.zremrangebyscore('onlineUsers','-inf','+inf')
                let allUsers = await db_obj.fetchAllUsers()
                allUsers.forEach(user =>{
                    this.client.zadd('allUsers',user.rating,user.username)
                })
                console.log('Connected to redis')
            });
        });
    }
     // Два метода на коннект и дисконнект нужны для того, чтобы когда пользовтель закрывает вкладки, 
     // это не считалось полным выходом из онлайна а логин не добавлял лишних подключений
    // OnlineUsers в рейтинге хранит количество текущих подключений
    async handleUserLogin(user){
        let zrange_prom =  util.promisify(this.client.zrange).bind(this.client)
        let zscore_prom =  util.promisify(this.client.zscore).bind(this.client)
        if(user.username !== undefined){
            if(await zscore_prom('onlineUsers',user.username) === null){
                this.client.zadd('onlineUsers',1, user.username)
            }
        }
    }
    async handleUserConnection(user){
        let zrange_prom =  util.promisify(this.client.zrange).bind(this.client)
        let zscore_prom =  util.promisify(this.client.zscore).bind(this.client)
        if(user.username !== undefined){
            if(await zscore_prom('onlineUsers',user.username) === null){
                this.client.zadd('onlineUsers',1, user.username)
            }
            else{
                this.client.zincrby('onlineUsers',1, user.username)
            }
        }
    }
    async handleUserLogout(user){
        let zscore_prom =  util.promisify(this.client.zscore).bind(this.client)
        if(user.username !== undefined){
            if(await zscore_prom('onlineUsers',user.username) === null){
                console.log("Disconnected user had no connections which is strange")
            }
           else{
            this.client.zrem('onlineUsers',user.username)
           }
        }
    }
    async handleUserDisconnect(user){
        let zscore_prom =  util.promisify(this.client.zscore).bind(this.client)
        if(user.username !== undefined){
            if(await zscore_prom('onlineUsers',user.username) === null){
                console.log("Disconnected user had no connections which is strange")
            }
           else{
            this.client.zincrby('onlineUsers',-1,user.username)
           }
        }
    }
    // Посылает массив подключенных пользователей(пользователи с нулевым кол-вом подключений, но залогиненные, не передаются)
    async sendOnlineUsers(){
        try{
            let zrange_prom = util.promisify(this.client.ZRANGE).bind(this.client)
            //Возвращает массив в котором чередуются имена пользователей и кол-во подключений
            let online_users_arr = await zrange_prom('onlineUsers',0,-1,"WITHSCORES")
            let online_users = []
            for(let i = 0; i < online_users_arr.length; i++){
                if(i%2 === 0){
                    online_users.push(online_users_arr[i])
                }
            }
            console.log(online_users)
            return online_users
        }
        catch(err){
            throw err
        }
        
    }
    async sendAllUsers(){
        try{
            let zrange_prom = util.promisify(this.client.ZRANGE).bind(this.client)
            //Возвращает массив в котором чередуются имена пользователей и кол-во подключений
            let users_arr = await zrange_prom('allUsers',0,-1,"WITHSCORES")
            let users = []
            for(let i = 0; i < users_arr.length; i+=2){
                users.push(
                    {username: users_arr[i], 
                    rating: users_arr[i+1]})
            }
            console.log(users)
            return users
        }
        catch(err){
            throw err
        }
        
    }
}

module.exports.client = new redisClient()