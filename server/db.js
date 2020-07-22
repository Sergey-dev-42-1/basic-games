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
  fetchUserMailorLogin(credential,password){
      
  }
  updateRating(){
      
  }
  fetchAllUsers(){
      
  }
  registerUser(User,encrypted_password){
    this.db.query(`INSERT INTO basic_games.users (username, password, rating, email) 
    VALUES ('${User.username}','${encrypted_password}', 0 ,'${User.email}')` 
        , (err) => {
            if (err) throw err;
            console.log(`User ${User.email} was added to DB`)
            })
            return {status: 200, msg: `User ${User.email} was registered`}
  }
}

module.exports.db = DB