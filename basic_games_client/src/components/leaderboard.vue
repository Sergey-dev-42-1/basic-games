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
  name: 'leaderboard',
  data(){
    return{
        headers: [{
            text: "Rank",value: 'rank',sortable: false, align: 'start'},
            {text: "Nickname", value: 'username'},
            {text: 'Score', value: 'rating'}
        ],
        users: this.$store.state.roomsState.allUsers
    }
    },
    beforeCreate(){
        this.$store.dispatch('storeAllUsers')
        setTimeout(()=>{
            this.users = this.$store.state.roomsState.allUsers
            setTimeout(()=>{
            this.users = this.$store.state.roomsState.allUsers
        },1000*60*10)
        },500)
    }
}
</script>

<style scoped>
html{
  overflow: hidden;
}
</style>