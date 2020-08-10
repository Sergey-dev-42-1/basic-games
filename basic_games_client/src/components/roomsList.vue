<template>
<html>
<head></head>
<body>
    <v-data-table
    :headers="headers"
    :items="rooms"
    item-key="roomId"
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
            text: "RoomId",value: 'roomId',sortable: false, align: 'start'},
            {text: "Owner", value: 'host'},
            {text: 'Capacity', value: 'capacity'}
        ],
        rooms: this.$store.state.roomsState.allRooms
    }
    },
    sockets:{
      roomCreationSucceeded(){
          this.rooms = this.$store.state.roomsState.allRooms
      },
      sendingAllRooms(data){
          this.rooms = data
      },
    },
    beforeCreate(){
        this.$store.dispatch('storeAllRooms')
    }
}
</script>

<style scoped>
html{
  overflow: hidden;
}
</style>