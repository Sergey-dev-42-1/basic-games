<template>
  <v-row  align="center"
          justify="center">
    <v-form
      ref="form"
      v-model="valid"
    >
   
    <v-text-field
      v-model="email"
      :counter="40"
      :rules="emailRules"
      label="Email"
      required
    ></v-text-field>

    <v-text-field
        v-model="username"
        :counter="20"
        :rules="nameRules"
        label="Username"
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
     v-on:click="register()">
     Register
     </v-btn>
    </v-form>
  </v-row>
</template>

<script>
import registrationService from '../services/registrationService'
export default {
  name: 'registration',
  data () {
    return {
      alert: false,
      al_type: '',
      valid: true,
      username: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      email: '',
       emailRules: [
        v => !!v || 'Email is required',
        v =>  /.+@.+\..{3}/.test(v) || 'This doesn\'t look right...'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be 6 characters or longer',
      ],
    }
  },
  methods: {
    async register () {
      let res = await registrationService.register({
          username: this.username,
          email: this.email,
          password: this.password
      })
      let temp_alert = document.getElementById('register_alert');
      
      if(res.data.status != 200){
       this.al_type = 'error'
       temp_alert.innerHTML = `<p>${res.data.msg}<p>`
       this.alert = true
       window.setTimeout(()=>{this.alert = false}, 3000)
      }
      else{
       this.al_type = 'success'
       temp_alert.innerText = res.data.msg
       this.alert = true
        window.setTimeout(()=>{this.alert = false}, 3000)
      }
      }
      //TODO redirect to index after logging in
    }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
