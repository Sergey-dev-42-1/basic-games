<template>
  <html>
    <head title="Rooms"></head>
    <body>
      <leaderboard />
      <onlineusers />
      <roomslist />
      <v-btn @click="createRoom">Create room</v-btn>
      <v-alert
        transition="slide-y-transition"
        type="error"
        id="creation_alert"
        v-model="alert"
      >
      </v-alert>
    </body>
  </html>
</template>

<script>
import leaderboard from "../components/leaderboard";
import onlineusers from "../components/onlineUsers";
import roomslist from "../components/roomsList";
export default {
  data() {
    return {
      socketMessage: "",
      alert: false,
    };
  },
  components: {
    leaderboard,
    onlineusers,
    roomslist,
  },
  sockets: {
    roomCreationFailed() {
      let temp_alert = document.getElementById("creation_alert");
      temp_alert.innerText =
        "Room creation failed, you probably already created one";
      this.alert = true;
      setTimeout(() => {
        this.alert = false;
      }, 1000);
    },
  },
  methods: {
    createRoom() {
      this.$socket.client.emit("userCreatedRoom", this.$store.state.user);
    },
  },
};
</script>

<style>
h1 {
  position: absolute;
  align-self: center;
  justify-content: center;
}
</style>
