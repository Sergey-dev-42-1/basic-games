// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/index'
import router from './router/router'
import vuetify from './plugins/vuetify';
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
const socket = io('http://localhost:8081');
Vue.use(VueSocketIOExt, socket, {store});
/* eslint-disable no-new */
new Vue({
  sockets: {
    connect: function () {
        socket.emit('userConnected', store.state.user.username ? 
        {username :store.state.user.username, 
        rating: store.state.user.rating} : false)
    }
    },
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

