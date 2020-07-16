const express = require ("express")
const db = require("./db").db
const pass_encryption = require("bcrypt")
const port = process.env.port 
//Parsing form data
const multer = require("multer")
const upload = multer()

const app = express()
app.use(upload.array())

app.get('/postreg', (req,res) =>{
    if(req.statusCode == 200){
        res.send('Вы успешно зарегистрированы')
    }
    else{
        res.send("Проблемы с регистрацией, попробуйте позже")
    }
})

//PotTODO переработать так, чтобы доставать все возможные поля из запроса автоматически
app.post('/register' , (req,res) => {
   let salt_rounds = 10; //Количество раундов хеширования
   pass_encryption.hash(req.body.password, salt_rounds, (err,encrypted) =>{
    db.query(`INSERT INTO basic_games.users (username, password, rating, email) 
    VALUES ('${req.body.username}','${encrypted}', 0 ,'${req.body.email}')` 
        , (err) => {
            if (err) throw err;
            console.log(`User ${req.body.email} was added to DB`)
            })
            res.redirect(200,'/postreg')
   });
  
})

app.listen(port || 8080)