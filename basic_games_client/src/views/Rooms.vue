<template>
<html>
<head title="Rooms"></head>
<body>
<leaderboard />
<onlineusers />
</body>
</html>
</template>

<script>
import leaderboard from '../components/leaderboard'
import onlineusers from '../components/onlineUsers'
export default {
    data(){
        return{
        socketMessage: ''
        }
    },
    components:{
      leaderboard,
      onlineusers
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
