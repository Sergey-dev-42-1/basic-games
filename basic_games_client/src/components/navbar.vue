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
    <v-btn v-if="!loggedIn" to="/register">Register</v-btn>
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
  computed:{
    loggedIn: function(){
      return !!this.$store.state.user
    }
  },
  async beforeUpdate() { 
      let res = await this.$store.dispatch('authorize')
      if(res){
        return this.$store.state.user
      }
    },
}
</script>

<style scoped>

</style>