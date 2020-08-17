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
  name: "onlineUsers",
  data() {
    return {
      headers: [{ text: "Nickname", value: "username", align: "start" }],
      users: this.$store.state.roomsState.onlineUsers,
    };
  },
  created() {
    this.online_users_unwatch = this.$store.watch(
      (state) => state.roomsState.onlineUsers,
      (newValue) => {
        this.users = newValue;
      }
    );
  },
  mounted() {
    this.$store.dispatch("storeOnlineUsers");
  },
  beforeDestroy() {
    this.online_users_unwatch();
  },
};
</script>

<style scoped>
html {
  overflow: hidden;
}
</style>
