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
      :rules="mixedRules"
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
     :type="al_type" id="register_alert"
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
    login () {
      let res = new Promise((resolve) => {
          let response =  registrationService.login({
          indetificator: this.username,
          password: this.password
        })
        resolve(response)
      })
      
      res.then((response) => {
      let temp_alert = document.getElementById('register_alert');
      
      if(response.data.status != 200){
       this.al_type = 'error'
       temp_alert.innerHTML = `<p>${response.data.msg}<p>`
       this.alert = true
       window.setInterval(()=>{this.alert = false}, 2000)
      }
      else{
       this.al_type = 'success'
       temp_alert.innerText = response.data.msg
       this.alert = true
        window.setInterval(()=>{this.alert = false}, 2000)
      }
      })
      
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
