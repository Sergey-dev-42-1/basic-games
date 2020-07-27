<template>
<html>
<head></head>
<body>
<v-menu>
    <template v-slot:activator="{ on }">
    <v-btn
        block
        color="indigo"
        dark
        v-on="on"
    >
    {{username}}
    </v-btn>
    </template>

        <v-list>
    <v-list-item 
         
        align=center
        @click="logout"
    >
    Logout
    </v-list-item>
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
    username() {
        return this.$store.state.user.username
    }
  },
  methods: {
     async logout(){
        let logout_res = await registrationService.logout()
        if ( /2\d{2}$/.test(logout_res.status)){
            this.$store.dispatch('logout')
        }
      }
  }
}
</script>

<style scoped>

</style>