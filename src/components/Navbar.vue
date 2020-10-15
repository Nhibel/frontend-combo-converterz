<template>
  <div>
    <b-navbar type="light" fixed="top">
      <b-navbar-nav>
        <b-nav-item to="/">Home</b-nav-item>
        <b-nav-item v-if="connected" to="/characters">Characters</b-nav-item>
        <b-nav-item v-if="connected" to="/admin">Admin</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto" v-if="connected">
        <b-nav-form>
          <b-button size="sm" class="my-2 my-sm-0" @click="logout"
            >Déconnexion</b-button
          >
        </b-nav-form>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto" v-if="!connected">
        <LoginForm></LoginForm>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { AUTH_LOGOUT } from '@/store/actions/auth';
import LoginForm from '@/components/LoginForm.vue';
export default {
  data() {
    return {
      connected: false
    };
  },
  methods: {
    logout: function() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        this.$router.push('/');
      });
    }
  },
  created() {
    this.$store.watch(state => {
      if (this.$store.getters.isAuthenticated) {
        this.connected = true;
      } else {
        this.connected = false;
      }
    });
  },
  components: {
    LoginForm
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: orange;
}

nav .navbar-nav li a {
  color: black !important;
}
</style>
