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
const http = require('http').createServer(app) 
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
  hash = ''
  try{
  hash = await bcrypt.hash(req.body.password, 10)
  }
  catch(err){
    res.status(400).send(err.data)
  }
  let response = await DB_obj.registerUser(new User(req.body.username,req.body.email,hash))
  
  if(response.status !==200){
    res.status(400).send(response)
  }
  res.status(200).send(response)
});


// Изменение рейтинга пользователя, нужно его имя и значение изменения(1 по умолчанию)
app.patch('/api/user/rating' , async (req,res) => {
    //10 - количество раундов хеширования
    let response = await DB_obj.updateRating(req.body.username, req.body.changeValue)
    res.status(200).send(response)
   });

const io = require('./sockets/roomsServer').socket
io(http)
http.listen(8081 || port)