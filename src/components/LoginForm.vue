<template>
  <div>
    <b-form @submit.prevent="login" inline>
      <b-form-group>
        <b-form-input
          class="mb-2 mr-sm-2 mb-sm-0"
          size="sm"
          id="email"
          type="email"
          v-model="email"
          placeholder="email"
          required
          autofocus
        ></b-form-input>
      </b-form-group>

      <b-form-group>
        <b-form-input
          class="mb-2 mr-sm-2 mb-sm-0"
          size="sm"
          id="password"
          type="password"
          v-model="password"
          placeholder="password"
          required
        />
      </b-form-group>

      <b-button type="submit" size="sm">Login</b-button>
      <div class="vl"></div>
      <b-button to="/register" size="sm">S'enregistrer</b-button>
    </b-form>
  </div>
</template>

<script>
import { HTTP } from '@/http-constants';
import { AUTH_REQUEST } from '@/store/actions/auth';
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    login() {
      const { email, password } = this;
      this.$store
        .dispatch(AUTH_REQUEST, { email, password })
        .then(res => {
          console.log('connected');
          //this.$router.push('/');
          // if (!res.data.user.isAdmin) {
          //   this.$router.push('/');
          // } else {
          //   this.$router.push('/admin');
          // }
        })
        .catch(error => {
          console.log('error');
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.vl {
  margin-left: 10px;
  margin-right: 10px;
  border-left: 1px solid white;
  height: 15px;
}
</style>
