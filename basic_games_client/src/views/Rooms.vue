<template>
<html>
<head title="Rooms"></head>
<body>
    <div>
    <h1>{{$socket.connected ? 'Connected' : 'Disconnected'}}</h1>
    </div>
    <br/>
    <br/>
    <div>
    <h2>{{socketMessage}}</h2>
    <h2>{{socketMessage2}}</h2>
    </div>
    <v-btn  right @click="getOnlineUsers()">Ping Server</v-btn>
    <v-btn  right @click="getAllUsers()">Ping Server</v-btn>
</body>
</html>
</template>

<script>
export default {
    data(){
        return{
        socketMessage: ''
        }
    },
    mounted(){
        this.$socket.client.on('sendingOnlineUsers', (val) => {
            console.log(val)
        this.socketMessage = val
        })
        this.$socket.client.on('sendingAllUsers', (val) => {
            console.log(val)
        this.socketMessage2 = val
         })
    
    },
    methods: {
    getOnlineUsers() {
      this.$socket.client.emit('sendOnlineUsers')
    },
    getAllUsers() {
      this.$socket.client.emit('sendAllUsers')
    }
  }
}
</script>

<style>
h1{
    position: absolute;
    align-self: center;
    justify-content: center;
}

</style>
