<template>
  <html>
    <head></head>
    <body>
      <v-toolbar flat class="grey white--text">
        <v-toolbar-title>
          <span class="red--text darken-4 font-weight-bold">BG</span>
          <span>ames</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div>
          <v-btn v-if="!loggedIn" to="/register">Register</v-btn>
          <v-btn v-if="!loggedIn" to="/login" class="">Sign In</v-btn>
          <v-btn v-if="loggedIn" to="/rooms" class="">Rooms</v-btn>
          <v-btn to="/">About</v-btn>
        </div>
        <loggedTab v-if="loggedIn"></loggedTab>
      </v-toolbar>
    </body>
  </html>
</template>

<script>
import loggedTab from "@/components/loggedTab";

export default {
  name: "navbar",
  components: { loggedTab },
  computed: {
    loggedIn: function() {
      return !!this.$store.state.user;
    },
  },
  async beforeUpdate() {
    let res = await this.$store.dispatch("authorize");
    if (res) {
      return this.$store.state.user;
    }
  },
};
</script>

<style scoped>
html {
  overflow: hidden;
}
</style>
