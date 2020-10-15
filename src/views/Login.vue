<template>
  <div>
    <div v-if="showLoginForm">
      <LoginForm></LoginForm>
      <a @click="toggleForm()">Create an Account</a>
    </div>

    <div v-else>
      <RegisterForm></RegisterForm>
      <a @click="toggleForm()">Back to Log In</a>
    </div>

    <HomeConnected v-if="connected"></HomeConnected>
    <HomeNotConnected v-if="!connected"></HomeNotConnected>
  </div>
</template>

<script>
import { HTTP } from '@/http-constants';
import { AUTH_REQUEST } from '@/store/actions/auth';

import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';

import HomeConnected from '@/components/HomeConnected.vue';
import HomeNotConnected from '@/components/HomeNotConnected.vue';
export default {
  data() {
    return {
      showLoginForm: true,
      connected: false,
    };
  },
  methods: {
    toggleForm() {
      this.showLoginForm = !this.showLoginForm;
    },
  },
  components: {
    LoginForm,
    RegisterForm,
    HomeConnected,
    HomeNotConnected,
  },
  created() {
    this.$store.watch((state) => {
      if (this.$store.getters.isAuthenticated) {
        this.connected = true;
      } else {
        this.connected = false;
      }
    });
  },
};
</script>

<style lang="scss" scoped></style>
