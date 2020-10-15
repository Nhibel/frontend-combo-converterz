<template>
  <div class="hello">
    <HomeConnected v-if="connected"></HomeConnected>
    <HomeNotConnected v-if="!connected"></HomeNotConnected>
  </div>
</template>

<script>
import { AUTH_LOGOUT } from '@/store/actions/auth';
import store from '@/store'; // your vuex store
import Login from '@/views/Login.vue';

import HomeConnected from '@/components/HomeConnected.vue';
import HomeNotConnected from '@/components/HomeNotConnected.vue';
export default {
  data() {
    return {
      connected: false
    };
  },
  methods: {
    async toLogin() {
      await this.$router.push({ path: 'Login' });
    }
  },
  components: {
    Login,
    HomeConnected,
    HomeNotConnected
  },
  created() {
    this.$store.watch(state => {
      if (this.$store.getters.isAuthenticated) {
        this.connected = true;
      } else {
        this.connected = false;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
