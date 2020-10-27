<template>
  <div id="app">
    <Navbar></Navbar>
    <b-container>
      <router-view :key="$route.fullPath" />
    </b-container>
  </div>
</template>

<script>
import { HTTP } from '@/http-constants';
import { USER_REQUEST } from '@/store/actions/user';
import { AUTH_LOGOUT } from '@/store/actions/auth';
import Navbar from '@/components/Navbar.vue';
export default {
  components: {
    Navbar
  }
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'LEVIBRUSH';
  src: local('LEVIBRUSH'), url(./assets/fonts/LEVIBRUSH.woff) format('woff');
}

.container {
  background-color: rgba(26, 26, 26, 0.9);
  padding-right: 35px;
  padding-left: 35px;
  min-height: 150px;
  padding-bottom: 1px;
  margin-bottom: 15px;
}
</style>
