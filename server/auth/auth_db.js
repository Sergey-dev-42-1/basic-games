const mysql = require('mysql');
const User = require('../models/models').User
const DB = require("../db").db

class AuthMethods extends DB{
    constructor(){
        super()
    }
    saveToken(token){
        let sql = `INSERT INTO basic_games.tokens
        (token) 
        VALUES (?)`
        this.db.query(sql
            ,[token], (err) => {
                if (err) throw err;
                console.log(`New refresh token saved`)
                })
                return true
    }
    checkTokenExistence(token){
        let sql = `SELECT FROM basic_games.tokens token 
        WHERE token = ?`
        this.db.query(sql
            ,[token], (err, result) => {
                if (err) throw err;
                })
                if(result.length > 0){
                    return true
                }
                else{
                    return false
                }
    }
}
module.exports.AuthDB = AuthMethods