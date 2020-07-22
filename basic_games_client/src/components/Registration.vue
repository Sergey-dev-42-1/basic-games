<template>
 <div id = 'registration'>
  <p>Registration</p>
 <input type="email" v-model = "email" placeholder="Input your email">
 <input v-model = "username" placeholder="Input yourusername">
 <input type = "password" v-model = "password" placeholder="Input your password">
 <button v-on:click="register()">Submit</button>
 </div>
</template>

<script>
import registrationService from '../services/registrationService'
export default {
  name: 'registration',
  data () {
    return {
      username: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async register () {
      const res = await registrationService.register({
        username: this.username,
        email: this.email,
        password: this.password
      })
      document.append(`<h1>${res.data}<h1>`)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
