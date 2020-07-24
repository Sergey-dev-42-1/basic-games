<template>
<html>
<head></head>
<body>
  <v-toolbar flat app class="grey lighten-2" >
      <v-toolbar-title >
        <span class="cyan--text font-weight-bold">BG</span>
        <span class=" font-weight-light">ames</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
    <v-toolbar-items>
      <!-- TODO Remove it if user logged in -->
    <v-btn to="/register">Register</v-btn>
    <!-- TODO Change it to log out if user logged in -->
    <v-btn to="/login" class="">Sign In</v-btn>
    <v-btn to="/about">About</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</body>
</html>
</template>

<script>
export default {
  name: 'navbar',
}
</script>

<style scoped>

</style>