const redis = require('redis')
const fs = require('fs')
const db = require('../../db').db
const db_obj = new db(100)
const util = require('util')
const { compare } = require('bcrypt')


class mainRedisClient{
    constructor(){
        console.log('constructor fired')
        fs.readFile('./sockets/credentials.json', 'utf-8', (err, data) => {
            if(err) throw err;
            let creds = JSON.parse(data);
            this.connection = redis.createClient('redis://' + creds.user + ':' + creds.password + '@' + creds.host + ':' + creds.port);
            console.log('connection created')
            this.connection.once('ready', async () => {
                //Сбросить пользователей онлайн после перезагрузки сервера
                this.connection.zremrangebyscore('onlineUsers','-inf','+inf')
                //Сбросить комнаты
                let zrange_prom =  util.promisify(this.connection.zrange).bind(this.connection)
                let room_list = await zrange_prom('rooms',-1000,1000,'WITHSCORES')
                this.connection.zremrangebyscore('rooms','-inf','+inf')
                for(let i = 0; i < room_list.length; i+=2){
                    this.connection.zremrangebyscore(`room:${room_list[i+1]}`,-1000,1000)
                }
                let allUsers = await db_obj.fetchAllUsers()
                allUsers.forEach(user =>{
                    this.connection.zadd('allUsers',user.rating,user.username)
                })
                console.log('Connected to redis')
            });
        });
    }
     // Два метода на коннект и дисконнект нужны для того, чтобы когда пользовтель закрывает вкладки, 
     // это не считалось полным выходом из онлайна а логин не добавлял лишних подключений
    // OnlineUsers в рейтинге хранит количество текущих подключений
    async handleUserLogin(user){
        let zscore_prom =  util.promisify(this.connection.zscore).bind(this.connection)
        if(user.username !== undefined){
            if(await zscore_prom('onlineUsers',user.username) === null){
                this.connection.zadd('onlineUsers',1, user.username)
            }
        }
    }
    async handleUserConnection(user){
        let zscore_prom =  util.promisify(this.connection.zscore).bind(this.connection)
        if(user.username !== undefined){
            if(await zscore_prom('onlineUsers',user.username) === null){
                this.connection.zadd('onlineUsers',1, user.username)
            }
            else{
                this.connection.zincrby('onlineUsers',1, user.username)
            }
        }
    }
    async handleUserRegistration(user){
        this.connection.zremrangebyscore('allUsers','-inf','+inf')
        let allUsers = await db_obj.fetchAllUsers()
        allUsers.forEach(user =>{
            
            this.connection.zadd('allUsers',user.rating,user.username)
        })
        console.log(allUsers)
    }

    async handleUserLogout(user){
        let zscore_prom =  util.promisify(this.connection.zscore).bind(this.connection)
        if(user.username !== undefined){
            if(await zscore_prom('onlineUsers',user.username) === null){
                console.log("Disconnected user had no connections which is strange")
            }
           else{
            this.connection.zrem('onlineUsers',user.username)
           }
        }
    }
    async handleUserDisconnect(username){
        let zscore_prom = util.promisify(this.connection.zscore).bind(this.connection)
        if(username !== undefined){
            if(await zscore_prom('onlineUsers',username) === null){
                console.log("Disconnected user had no connections which is strange")
            }
           else{
            await this.connection.zincrby('onlineUsers',-1,username)
            if(await zscore_prom('onlineUsers',username) === '0'){
                //TODO: Сделать механизм отслеживания пользователя в комнатах, что бы удалять его из них если он вышел из приложения
                this.connection.zrem('onlineUsers',username)
            }
           }
        }
    }
    // Посылает массив подключенных пользователей(пользователи с нулевым кол-вом подключений, но залогиненные, не передаются)
    async sendOnlineUsers(){
        try{
            let zrange_prom = util.promisify(this.connection.ZRANGE).bind(this.connection)
            //Возвращает массив в котором чередуются имена пользователей и кол-во подключений
            let online_users_arr = await zrange_prom('onlineUsers',0,-1,"WITHSCORES")
            let online_users = []
            for(let i = 0; i < online_users_arr.length; i++){
                if(i%2 === 0){
                    online_users.push({username: online_users_arr[i]})
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
            let zrange_prom = util.promisify(this.connection.ZRANGE).bind(this.connection)
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
    async refreshAllUsers(){
        let zrange_prom = util.promisify(this.connection.ZRANGE).bind(this.connection)
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



    //Обработка механизма комнат
    
    async handleRoomCreation(user){
        let zscore_prom =  util.promisify(this.connection.zscore).bind(this.connection)
        let zcount_prom =  util.promisify(this.connection.zcount).bind(this.connection)
        let zrange_prom =  util.promisify(this.connection.ZRANGE).bind(this.connection)

        console.log(await zscore_prom(`rooms`,user.username) !== null)
        if(await zscore_prom(`rooms`,user.username) !== null ){
            console.log('Already exists')
            return false
        }
        else{
            let rooms_arr = await zrange_prom(`rooms`,0,-1,'WITHSCORES')
            let rooms_arr_len = await zcount_prom(`rooms`,'-inf','+inf') 
            let roomIds = []
            if(rooms_arr.length > 0){
                for(let i = 0; i < rooms_arr_len*2; i+=2){
                    roomIds.push(rooms_arr[i+1])
                }
                this.connection.zadd('rooms',Math.max(...roomIds)+1,user.username)
                console.log('Successfully created')
                return {host: user.username,
                        roomId: Math.max(...roomIds)+1,
                        capacity: 1}
            }
            else{
                this.connection.zadd('rooms', 1, user.username)
                console.log('Successfully created')
                return {host: user.username,
                    roomId: 1,
                    capacity: 1}
            }
           
        }
    }
    async handleRoomDestruction(roomId, user){
        let zscore_prom =  util.promisify(this.connection.zscore).bind(this.connection)
        if(await zscore_prom('rooms',user.username) !== undefined){

            this.connection.zrem('rooms', user.username)
            this.connection.zremrangebyscore(`room:${roomId}`,-1000,1000)

            this.roomIds.filter((value)=>{
                if(roomId === value)
                {
                    return false
                }
                else return true})
            return true
        }
    }
    async handleRoomConnection(data){
        let zcount_prom = util.promisify(this.connection.ZCOUNT).bind(this.connection)
        //Если в комнате уже двое игроков, не добавлять еще одного
        if(await zcount_prom (`room:${data.roomId}`,'-inf','+inf') <= 2 ){
            this.connection.zadd(`room:${data.roomId}`,1, data.username)
            return true
        }
        else{
            return false
        }
    }
    async handleRoomLeaving(data){
        let zcount_prom = util.promisify(this.connection.ZCOUNT).bind(this.connection)
        if(await zcount_prom (`room:${data.roomId}`,'-inf','+inf') === 0 ){
           this.handleRoomDestruction(data.roomId)
        }
        this.connection.zrem(`room:${data.roomId}`,data.username)
        return true
    }
    check(){
        console.log('check')
    }
    //Если параметр не передан, то возвращается весь список комнат и количество пользователей в них
    async getRoomOwnerById(roomId){
        let zrange_prom = util.promisify(this.connection.ZRANGE).bind(this.connection)
        let zcount_prom = util.promisify(this.connection.ZCOUNT).bind(this.connection)
        if(roomId === undefined){
            //Возвращает массив в котором чередуются имена пользователей создавших комнату и номера комнат
            let rooms_arr = await zrange_prom('rooms',0,-1,"WITHSCORES")
            let rooms = []
            for(let i = 0; i < rooms_arr.length; i+=2){
                let room_cap = await zcount_prom(`room:${rooms_arr[i+1]}`,'-inf','+inf')
                console.log(room_cap)
                rooms.push(
                    {host: rooms_arr[i], 
                    roomId: rooms_arr[i+1],
                    capacity: room_cap})
            }
            console.log(rooms)
            return rooms
        }
        else{
            //Вернет имя пользователя создавшего комнату
            let rooms_arr = await zrange_prom('rooms',0,-1,"WITHSCORES")
            for(let i = 0; i < rooms_arr.length; i+=2){
                if(rooms_arr[i+1] === roomId){
                    return {host:rooms_arr[i]}
                }
            }
        }
    }
}
module.exports.mainClient = new mainRedisClient()
