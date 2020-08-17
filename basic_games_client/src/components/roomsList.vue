<template>
  <html>
    <head></head>
    <body>
      <v-data-table
        @click:row="enterRoom"
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
  name: "leaderboard",
  data() {
    return {
      headers: [
        {
          text: "RoomId",
          value: "roomId",
          sortable: false,
          align: "start",
        },
        { text: "Owner", value: "host" },
        { text: "Capacity", value: "capacity" },
      ],
      rooms: this.$store.state.roomsState.allRooms,
    };
  },
  created() {
    this.rooms_unwatch = this.$store.watch(
      (state) => state.roomsState.allRooms,
      (newValue) => {
        console.log(newValue);
        let filtered = newValue.filter((room) => {
          if (
            room.capacity === 2 &&
            room.host !== this.$store.state.user.username
          ) {
            return false;
          } else {
            return true;
          }
        });
        this.rooms = filtered;
      }
    );
  },
  mounted() {
    this.$store.dispatch("storeAllRooms");
  },
  beforeDestroy() {
    this.rooms_unwatch();
  },
  methods: {
    enterRoom(row) {
      this.$socket.client.emit("userConnectedToRoom", {
        roomId: row.roomId,
        username: this.$store.state.user.username,
      });
      this.$router.push(`/rooms/${row.roomId}`);
    },
  },
};
</script>

<style scoped>
html {
  overflow: hidden;
}
</style>
