const express = require ("express")
const app = express()
const port = process.env.port 

app.get('/index' , (req,res) => {
    res.send("Hello world")
})
app.listen(port || 8080)