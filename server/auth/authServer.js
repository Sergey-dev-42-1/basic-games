//Библиотеки и модули
const express = require ("express")
const bcrypt = require("bcrypt")
const cors = require('cors')
const jwt = require('jsonwebtoken')
//Мои модули и объекты
const DB = require("../db").db
const auth_db= require("./auth_db").AuthDB
const auth_db_obj= new auth_db()
const DB_obj = new DB(100)//Аргумент - максимальное количество соединений
const User = require('../models/models').User

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

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_SECRET_KEY, {expiresIn: '10m'})
}

app.get('/token' , async (req,res) => {
    const authHeader = req.headers['authorization']
    const refresh_token = authHeader && authHeader.split(' ')[1]
    if (refresh_token === null){res.sendStatus(401)
    jwt.verify(refresh_token, process.env.ACCESS_SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403)
    })
    }
  });


app.post('/login' , async (req,res) => {
    let user = await DB_obj.fetchUser(req.body.identificator)
    console.log(user)
    if(!user){
      return res.status(400).send({msg: 'No such user found'})
    }
    if(bcrypt.compare(req.body.password,user.password)){
  
    let refreshToken = jwt.sign({username :user.username}, process.env.REFRESH_SECRET_KEY)

    auth_db_obj.saveToken(refreshToken)

    return res.status(200).send({msg: `User ${user.username} logged in`, refereshToken : refreshToken})
    }
    else{
        res.status(401).send({msg: 'Wrong password!'})
    }
    });

app.listen(8083)