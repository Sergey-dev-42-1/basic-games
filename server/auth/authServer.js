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

app.post('/token' , async (req,res) => {
    const authHeader = req.headers['authorization']
    const refresh_token = authHeader && authHeader.split(' ')[1]

    if (refresh_token === null){ return res.sendStatus(401)}
    if (await !auth_db_obj.checkRefreshTokenExistence(refresh_token)){return res.sendStatus(401)}

    jwt.verify(refresh_token, process.env.REFRESH_SECRET_KEY, (err, user) => {
      console.log(user)
      if (err) {return res.sendStatus(403)}
      const accessToken = generateAccessToken({ name: user.username})
      res.status(200).send({accessToken : accessToken})
    })
    }
  );

  app.delete('/logout',async (req,res) => {
    await auth_db_obj.removeToken(req.body.refreshToken)
    res.status(200).send({msg:'Successfully logged out'})
  })

app.post('/login' , async (req,res) => {
    let user = await DB_obj.fetchUser(req.body.identificator)
    if(user === false){
      return res.status(400).send('No such user found')
    }
    let passComparison = false
    try{
      passComparison = await bcrypt.compare(req.body.password,user.password)
      console.log(passComparison)
    }
    catch(err){
     return res.status(400).send('Password comparison failed')
    }
    if(passComparison){

    let refreshToken = jwt.sign({username :user.username}, process.env.REFRESH_SECRET_KEY, {expiresIn: '1d'})
    let accessToken = generateAccessToken({username: user.username})
    auth_db_obj.saveToken(refreshToken)

    return res.status(200).send({msg: `Successfully logged in!`, user: user, refereshToken : refreshToken, accessToken : accessToken})
    }
    
    else{
        res.status(401).send('Wrong password!')
    }
    });

app.listen(8083)