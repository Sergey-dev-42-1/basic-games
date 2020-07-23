// код доступа к базе данных

const mysql = require('mysql');

class DB{
  constructor(connectionLimit){
      this.db = mysql.createPool({
        connectionLimit: connectionLimit,
        host: 'localhost',
        //TODO Исправить на действительные если выкладывать в продакшн
        user: 'develop',
        password: 'yjdfz21f066565',
        database: 'basic_games'
      });
  }
  //TODO Аутентифицировать при выполнении пользовательских запросов
  //Внутренние методы
  //Возвращает промис который ресолвится в true если находит записи с тем же именем пользователя 
  checkUsernameUniqueness(username){
    return new Promise((resolve) => {
      let sql = 'SELECT username'
        +' FROM basic_games.users'
        +' WHERE username = ?'
      this.db.query(sql,[username], 
        (err,results,fields) => {
        if(err) throw err
        if (results.length > 0){
          resolve(true)
          return true
        } 
        else{
          resolve(false)
          return true
        }
      })
    })
  }
  //Возвращает промис который ресолвится в true если находит записи с тем же email
  checkEmailUniqueness(email){
    return new Promise((resolve) => {
      let sql = 'SELECT email'
        +' FROM basic_games.users'
        +' WHERE email = ?'
      this.db.query(sql,[email],
        (err,results,fields) => {
        if(err) throw err
        if (results.length > 0){
          resolve(true)
          
        } 
        else{
          resolve(false)
        }})
    })
    
  }
  
   updateRating(username, value = 1){
    let sql = 'UPDATE basic_games.users'
    +' SET users.rating = users.rating + ?'
    +' WHERE users.username = ?'

    let uniqUsernameCheck = this.checkUsernameUniqueness(username)
    return uniqUsernameCheck.then((result) => {
      return new Promise((resolve) => {
      if (result){
        this.db.query(sql
          ,[value, username ], (err) => {
              if (err) throw err;
              console.log(`User ${username} rating was updated`)
              resolve ({status: 200, msg: `User ${username} rating was updated`})
              })
      }
      else{
        resolve ( {status: 400, msg: `User ${username} was not found`})
      }
    })
    })
    
  }
  fetchAllUsers(){
      
  }
  loginUser(credentials,encrypted_password){
      
  }
  async registerUser(User){
    let sql = `INSERT INTO basic_games.users (username, password, rating, email) 
                      VALUES (?,?, 0 ,?)` 

    let uniqUsernameCheck = this.checkUsernameUniqueness(User.username)
    let uniqEmailCheck = this.checkEmailUniqueness(User.email)

   return Promise.all([uniqUsernameCheck,uniqEmailCheck]).catch((err) => {if (err) throw err})
    .then(
      (results => {
        console.log(results)
        
        if(results[0] && results[1]){
          return {status: 400, msg: 'User with this username and email already exists'}
        }
        else if(results[0]){
          return {status: 400, msg: 'User with this username already exists'}
        }
        else if(results[1]){
          return {status: 400, msg: 'User with this email already exists'}
        }
        else
        this.db.query(sql
          ,[User.username,User.password,User.email], (err) => {
              if (err) throw err;
              console.log(`User ${User.email} was added to DB`)
              
              })
        return {status: 200, msg: `User ${User.email} was registered`}
      })
    )
  }
}

module.exports.db = DB