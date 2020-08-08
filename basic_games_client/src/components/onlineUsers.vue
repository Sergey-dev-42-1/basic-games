<template>
<html>
<head></head>
<body>
    <v-data-table
    :headers="headers"
    :items="users"
    item-key="username"
    class="elevation-1"
  >
  </v-data-table>
</body>
</html>
</template>

<script>

export default {
  name: 'onlineUsers',
  data(){
    return{
        headers: [
            {text: "Nickname", value: 'username',align: 'start'},
        ],
        users: this.$store.state.usersState.onlineUsers
    }
    
    },
    beforeCreate(){
        this.$store.dispatch('storeOnlineUsers')

        setTimeout(()=>{
            this.users = this.$store.state.usersState.onlineUsers
            setTimeout(()=>{
            this.users = this.$store.state.usersState.onlineUsers
        },1000*30)
        },500)
    },
}
</script>

<style scoped>
html{
  overflow: hidden;
}
</style>