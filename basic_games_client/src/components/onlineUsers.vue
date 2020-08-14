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
        users: this.$store.state.roomsState.onlineUsers
    }
  },
    beforeCreate(){
        this.$store.dispatch('storeOnlineUsers')

        setTimeout(()=>{
            this.users = this.$store.state.roomsState.onlineUsers
            setTimeout(()=>{
            this.$store.dispatch('storeOnlineUsers')
            this.users = this.$store.state.roomsState.onlineUsers
        },1000)
        },500)
    },
}
</script>

<style scoped>
html{
  overflow: hidden;
}
</style>