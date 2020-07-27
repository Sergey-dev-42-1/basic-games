<template>
  <v-row  align="center"
          justify="center">
    <v-form
      ref="form"
      v-model="valid"
    >
   
    <v-text-field
      v-model="identificator"
      :counter="40"
      :rules="identificatorRules"
      label="Email or username"
      required
    ></v-text-field>

    <v-text-field
      type = 'password'
      v-model="password"
      :rules="passwordRules"
      label="Password"
      required
    ></v-text-field>

    <v-alert 
    transition="slide-y-transition"
     :type="al_type"
      id="login_alert"
      v-model="alert" >
    </v-alert>

    <v-btn block :disabled="!valid"
     v-on:click="login()">
     Log in
     </v-btn>
    </v-form>
  </v-row>
</template>

<script>
import registrationService from '../services/registrationService'
export default {
  name: 'login',
  data () {
    return {

      alert: false,
      al_type: '',

      valid: true,
      identificator: '',
      identificatorRules: [
        v => !!v || 'Name is required',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
      ],
    }
  },
  methods: {
    async login () {
      let login_res = ''
      let temp_alert = document.getElementById('login_alert');
      try{
      login_res = await registrationService.login({
          identificator: this.identificator,
          password: this.password
      })
      }
      catch(err){
        console.log(err)
        this.al_type = 'error'
        temp_alert.innerText = err.response.data
        this.alert = true
        window.setTimeout(()=>{this.alert = false}, 3000)
        return
      }
      console.log(login_res)
      

      this.al_type = 'success'
      temp_alert.innerText = login_res.data.msg
      this.alert = true
      window.setTimeout(()=>{this.alert = false; }, 3000)
      setTimeout(async ()=>{
        await this.$store.dispatch('login',{
        user: login_res.data.user,
        refreshToken: login_res.data.refreshToken,
        accessToken: login_res.data.accessToken
         })
        this.$router.push('/')},3000)
    }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
