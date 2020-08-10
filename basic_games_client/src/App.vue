<template>
  <v-app>
    <navbar />
    <v-main>
      <router-view></router-view>
    </v-main>
    <customFooter />
  </v-app>
</template>

<script>
import navbar from './components/navbar'
import customFooter from './components/footer'
export default {
  
  name: 'App',

  components: {
    navbar,
    customFooter
  },
  data: () => ({
  }),
};
</script>
