<template>
  <div>
    <b-row>
      <b-col xs="12" sm="4" md="4" class=" mb-sm-0 pb-2 pb-sm-0 ">
        <b-dropdown
          id="dropdown-form"
          text="Login"
          ref="dropdown"
          class="m-0"
          size="sm"
        >
          <b-dropdown-form>
            <b-form @submit.prevent="login">
              <b-form-group label="Email" label-for="dropdown-form-email">
                <b-form-input
                  v-model="email"
                  id="dropdown-form-email"
                  size="sm"
                  placeholder="email@example.com"
                  required
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Password" label-for="dropdown-form-password">
                <b-form-input
                  v-model="password"
                  id="dropdown-form-password"
                  type="password"
                  size="sm"
                  placeholder="Password"
                  required
                ></b-form-input>
              </b-form-group>

              <b-button type="submit" size="sm">Login</b-button>
            </b-form>
          </b-dropdown-form>
        </b-dropdown>
      </b-col>
      <b-col>
        <!-- <div class="vl"></div> -->
        <b-button to="/register" size="sm">S'enregistrer</b-button>
      </b-col>
    </b-row>
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
      if (this.password != '' && this.email != '') {
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
            this.$store.dispatch('makeToast', {
              vm: this,
              variant: 'danger',
              message: error.response.data.error,
              position: 'b-toaster-top-left'
            });
          });
      }
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

.b-dropdown-form {
  width: 13rem;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.dropdown-menu {
  width: 150rem;
}
</style>
