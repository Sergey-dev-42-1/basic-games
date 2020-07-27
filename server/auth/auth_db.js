const mysql = require('mysql');
const User = require('../models/models').User
const DB = require("../db").db

class AuthMethods extends DB{
    constructor(){
        super()
    }
    saveToken(token){
        let sql = `INSERT INTO basic_games.tokens
        (refresh_token,expiration_date) 
        VALUES (?,?)`
        this.db.query(sql
            ,[token, Date.now()+(1000*60*60*24)], (err) => {
                if (err) throw err;
                })
                return true
    }
    removeToken(token){
        let sql = 'DELETE FROM basic_games.tokens'
                  +  ' WHERE refresh_token = ?'
        this.db.query(sql
            ,[token], (err) => {
                if (err) throw err;
                console.log(`Refresh token have been successfully removed`)
                })
                return true
    }
    checkRefreshTokenExistence(token){
        let sql = 'SELECT  refresh_token, expiration_date FROM basic_games.tokens'
                   + ' WHERE refresh_token = ?;'
        return new Promise((resolve) => {
            this.db.query(sql
            ,[token], (err, result) => {
                if (err) {throw err};
                if(result[0].expiration_date > Date.now()){
                    resolve(true)
                }
                else {
                     this.removeToken(token)
                     resolve(true)
                }
            })
        })
    }
}
module.exports.AuthDB = AuthMethods