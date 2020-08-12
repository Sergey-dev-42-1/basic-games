<template>
  <div>
      <p>{{this.$route.params.id}}</p>
      <v-btn @click="mockMessage">Mock message</v-btn>
      <p id="chat"></p>
      <board />
  </div> 
</template>

<script>
import board from "../components/gameComponents/board";
export default {
  name: 'Room',
  components:{
        board
      },
  async beforeRouteLeave(to,from,next){
      this.$socket.client.emit('userLeavingRoom',{
        roomId: this.$route.params.id,
        username: this.$store.state.user.username})
      next()
        
    }, 
  sockets:{
      userSentMessage(data){
      console.log('message received')
      let chat = document.getElementById('chat')
      chat.innerText += `${data.username} ${data.msg} \n`
      },
      userEnteredRoom(data){
      console.log('message received')
      let chat = document.getElementById('chat')
      chat.innerText +=  `${data.msg} \n`
      },
      userLeftRoom(data){
      console.log('message received')
      let chat = document.getElementById('chat')
      chat.innerText += ` ${data.msg} \n`
      }
  },
  methods:{
    mockMessage(){
      this.$socket.client.emit('userMessage' ,{msg:"message", username:this.$store.state.user.username, roomId:this.$route.params.id})
    }
  }
}
</script>
