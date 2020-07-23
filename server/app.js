//Библиотеки и модули
const express = require ("express")
const pass_encryption = require("bcrypt")
const cors = require('cors')
//Мои модули и объекты
const DB = require("./db").db
const DB_obj = new DB(100)//Аргумент - максимальное количество соединений
const User = require('./models/models').User
//Парсеры
//Парсер Form
const multer = require("multer")
const upload = multer()
//Парсер JSON
const bodyParser = require('body-parser')

const app = express()
//Присоединение библиотек
app.use(upload.array())
app.use(cors())
app.use(bodyParser.json());
//Переменные среды
const port = process.env.port 


//Обработчики запросов
/*Регистрация пользователя(тело должно содержать пароль, email и имя пользователя)
  Имя и email уникальны */
app.post('/api/register' , (req,res) => {
    //10 - количество раундов хеширования
   pass_encryption.hash(req.body.password, 10, (err,encrypted) =>{
    if (err){ res.send(err);
              throw err};

    DB_obj.registerUser(new User(req.body.username,req.body.email,encrypted))
    .then(((attempt) =>{console.log(attempt); res.send(attempt) }))
   });
  
})
// Изменение рейтинга пользователя, нужно его имя и значение изменения(1 по умолчанию)
app.patch('/api/rating' , (req,res) => {
    //10 - количество раундов хеширования
    DB_obj.updateRating(req.body.username, req.body.changeValue)
    .then((attempt) =>{console.log(attempt); res.send(attempt) })
   });

app.listen(port || 8081)