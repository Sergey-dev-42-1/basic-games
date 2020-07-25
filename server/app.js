//Библиотеки и модули
const express = require ("express")
const bcrypt = require("bcrypt")
const cors = require('cors')
const jwt = require('jsonwebtoken')
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
app.post('/api/user/register' , async (req,res) => {
    //10 - количество раундов хеширования
  let hash = await bcrypt.hash(req.body.password, 10, (err) =>{
  if (err){throw err}})
  let response = await DB_obj.registerUser(new User(req.body.username,req.body.email,hash))
  res.status(200).send(response)
});


// Изменение рейтинга пользователя, нужно его имя и значение изменения(1 по умолчанию)
app.patch('/api/user/rating' , async (req,res) => {
    //10 - количество раундов хеширования
    let response = await DB_obj.updateRating(req.body.username, req.body.changeValue)
    res.send(response.status,response) 
   });

app.listen(port || 8081)