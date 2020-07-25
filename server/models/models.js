process.env.ACCESS_SECRET_KEY = 'f8d06fe448d5ffc86a049d1557bda693140908d34f9a7bc81d0f4641baf7ec4ee8c062b6bbfaf2bb7c0eed73deff3a125d0fe819617e8fcb9dc56273bfc93712'
process.env.REFRESH_SECRET_KEY = 'e9ae8b32250975003ce85bdb0f09c093613eda9e021c2facd67f5ae872ad1c5fd08330d08ded1369508a18b8f5011158ad31b832044ed0c25eeb83cf856dae95'

class User {
    constructor(username, email, password){
        this.username = username;
        this.password = password;
        this.email = email;
    }
}

module.exports.User = User