<template>
<html>
<head></head>
<body>
<v-menu>
    <template v-slot:activator="{ on }">
    <v-btn
        color="indigo"
        dark
        v-on="on"
    >
    {{loggedIn}}
    </v-btn>
    </template>

        <v-list>
    <v-list-tile
        @click="logout"
    >
    Logout
    </v-list-tile>
    </v-list>

</v-menu>
</body>
</html>
</template>

<script>
import registrationService  from "../services/registrationService";
export default {

  name: 'loggedTab',
  data(){
      return{
      }
  },
  computed: {
    loggedIn: function() {
      return this.$store.state.user.username
    }
  },
  methods: {
     async logout(){
        let logout_res = await registrationService.logout()
        if ( /2\d{2}$/.test(logout_res.status)){
            this.$store.dispatch('logout')
        }
        this.$forceUpdate()
      }
  }
}
</script>

<style scoped>

</style>