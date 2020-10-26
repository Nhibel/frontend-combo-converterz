<template>
  <div>
    <!--  -->

    <b-navbar toggleable="sm" type="light">
      <div class="container-fluid">
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item v-if="connected" to="/characters"
              >Characters</b-nav-item
            >
          </b-navbar-nav>
        </b-collapse>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto" v-if="connected">
            <b-nav-form>
              <b-button size="sm" class="my-2 my-sm-0" @click="logout"
                >Déconnexion</b-button
              >
            </b-nav-form>
          </b-navbar-nav>

          <div class="ml-auto" v-if="!connected">
            <LoginForm></LoginForm>
          </div>
        </b-collapse>

        <!-- <b-form v-if="connected" class="ml-3 text-right">
          <b-form-input
            size="sm"
            type="text"
            v-model="keywords"
            class="form-control input-lg"
            list="somethingelse"
          >
          </b-form-input>

          <b-dropdown id="dropdown-1" text="Dropdown Button" class="m-md-2">
            <b-dropdown-item v-for="(res, index) in results" :key="index">{{
              res.name
            }}</b-dropdown-item>
          </b-dropdown>          
        </b-form> -->
      </div>
    </b-navbar>
  </div>
</template>

<script>
import { HTTP } from '@/http-constants';
import { AUTH_LOGOUT } from '@/store/actions/auth';
import LoginForm from '@/components/LoginForm.vue';
import _ from 'lodash';
export default {
  data() {
    return {
      connected: false,
      keywords: '',
      results: []
    };
  },
  methods: {
    logout: function() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        this.$router.push('/');
      });
    },
    searchAfterDebounce: _.debounce(function() {
      this.search();
    }, 500),

    search() {
      if (this.keywords.length > 1) {
        HTTP.get('/characters/search/' + this.keywords).then(
          response => {
            console.log('response : ', response);
            this.results = response.data;
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  },
  watch: {
    keywords: function(val) {
      this.searchAfterDebounce();
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
