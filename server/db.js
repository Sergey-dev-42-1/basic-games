// код доступа к базе данных

const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  //TODO Исправить на действительные
  user: 'develop',
  password: 'yjdfz21f066565',
  database: 'basic_games'
});

module.exports.db = db