<template>
<html>
<head></head>
<body>
  <v-toolbar flat class="grey lighten-2" >
      <v-toolbar-title >
        <span class="cyan--text font-weight-bold">BG</span>
        <span class=" font-weight-light">ames</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
    <v-toolbar-items>
      <!-- TODO Remove it if user logged in -->
    <v-btn v-if="!loggedIn" to="/register">Register</v-btn>
    <!-- TODO Change it to log out if user logged in -->
    <v-btn v-if="!loggedIn" to="/login" class="">Sign In</v-btn>
    <v-btn to="/about">About</v-btn>
    <loggedTab v-if="loggedIn"></loggedTab>
    </v-toolbar-items>
  </v-toolbar>
</body>
</html>
</template>

<script>
import loggedTab from '@/components/loggedTab'

export default {
  name: 'navbar',
  components: {loggedTab},
  computed: {
    loggedIn: function() {
      return this.$store.state.user.username !== undefined
    }
  }
}
</script>

<style scoped>

</style>