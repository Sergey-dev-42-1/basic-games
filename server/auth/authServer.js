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
    return jwt.sign(user, process.env.ACCESS_SECRET_KEY, {expiresIn: '1h'})
}

app.get('/token' , async (req,res) => {
    
    const refresh_token = req.headers['authorization']
    console.log(refresh_token)
    if (refresh_token === undefined){ 
      return res.sendStatus(400).end('No refresh token sent')
    }

    if (await !auth_db_obj.checkRefreshTokenExistence(refresh_token)){
      return res.sendStatus(401).end('False Refresh token')
    }

    jwt.verify(refresh_token, process.env.REFRESH_SECRET_KEY, (err, user) => {
      if (err) 
      {
        return res.sendStatus(403).end('Token verification failed')
      }
      const accessToken = generateAccessToken({ name: user.username})
      res.status(200).send({accessToken : accessToken})
    })
    }
  );

  app.get('/auth' , async (req,res) => {
    const access_token = req.headers['authorization']
    console.log("Authorizing")
    console.log(access_token)
    if (access_token === undefined) { 
      return res.sendStatus(401).send('No access token sent')
    }
    jwt.verify(access_token, process.env.ACCESS_SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403).end('Token expired')
      }
      res.status(200).send("Authorized")
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
    user.password = ""

    return res.status(200).send(
      {
        msg: `Successfully logged in!`, user: user, refreshToken : refreshToken, accessToken : accessToken}
      )
    }
    
    else{
        res.status(401).send('Wrong password!')
    }
    });

app.listen(8083)