<template>
  <span>
    <div id="btnAlign">
      <v-spacer></v-spacer>
      <v-btn v-if="host_flag" @click="leaveRoom('/rooms')">Destroy room</v-btn>
    </div>
    <board />
  </span>
</template>

<script>
import board from "../components/gameComponents/board";
export default {
  name: "Room",
  components: {
    board,
  },
  data() {
    return {
      host_flag: false,
    };
  },
  created() {
    this.host();
  },
  async beforeRouteLeave(to, from, next) {
    //Если пользователь, пытающийся выйти, хост комнаты, комната удаляется
    if (this.host_flag) {
      let confirmation = window.confirm(
        "If you leave now, room will be destoryed"
      );
      if (confirmation) {
        await this.leaveRoom();
        next(true);
        return;
      } else {
        return;
      }
    }
    if (this.$store.state.tictactoeState.started) {
      let confirmation = window.confirm(
        "If you leave now, you'll automatically lose"
      );
      if (confirmation) {
        await this.leaveRoom();
        next(true);
        return;
      } else {
        return;
      }
    }
    this.leaveRoom();
    next();
  },
  sockets: {
    userEnteredRoom() {
      // let chat = document.getElementById("chat");
      // chat.innerText += `${data.msg} \n`;
    },
    userLeftRoom() {
      // let chat = document.getElementById("chat");
      // chat.innerText += ` ${data.msg} \n`;
    },
    sendingUsersInRoom(data) {
      this.users = data;
    },
  },
  methods: {
    async leaveRoom(destination = "") {
      this.$socket.client.emit("userLeavingRoom", {
        roomId: this.$route.params.id,
        username: this.$store.state.user.username,
      });

      await this.$store.dispatch("resetState", { reason: "Draw" });
      console.log("Clearing state");
      if (destination !== "") {
        this.$router.push(destination);
      }
    },
    host() {
      let hosted_room = this.$store.state.roomsState.allRooms.filter(
        (value) => {
          console.log(value);
          if (this.$store.state.user.username === value.host) {
            return true;
          }
          return false;
        }
      );
      console.log(hosted_room);
      if (
        hosted_room[0] !== undefined &&
        hosted_room[0].roomId === this.$route.params.id
      ) {
        this.host_flag = true;
      } else {
        this.host_flag = false;
      }
    },
  },
};
</script>
<style scoped>
#btnAlign {
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100vw;
}
.UIContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100%;
}
</style>
