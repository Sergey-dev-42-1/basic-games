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
  name: "leaderboard",
  data() {
    return {
      headers: [
        {
          text: "Rank",
          value: "rank",
          sortable: false,
          align: "start",
        },
        { text: "Nickname", value: "username" },
        { text: "Score", value: "rating" },
      ],
      users: this.$store.state.roomsState.allUsers,
    };
  },
  created() {
    this.users_unwatch = this.$store.watch(
      (state) => state.roomsState.allUsers,
      (newValue) => {
        this.users = newValue;
      }
    );
  },
  mounted() {
    this.$store.dispatch("storeAllUsers");
  },
  beforeDestroy() {
    this.users_unwatch();
  },
};
</script>

<style scoped>
html {
  overflow: hidden;
}
</style>
