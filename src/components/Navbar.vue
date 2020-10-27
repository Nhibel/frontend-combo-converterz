<template>
  <div>
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

        <vue-typeahead-bootstrap
          size="sm"
          placeholder="Chercher un perso"
          class="ml-4"
          v-model="inputValue"
          :data="results"
          :serializer="item => item.name"
          @hit="navigateToCharacter($event)"
        />
      </div>
    </b-navbar>
  </div>
</template>

<script>
import { HTTP } from '@/http-constants';
import { AUTH_LOGOUT } from '@/store/actions/auth';
import LoginForm from '@/components/LoginForm.vue';
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';
import 'bootstrap/scss/bootstrap.scss';
export default {
  data() {
    return {
      connected: false,
      inputValue: '',
      results: [],
      charactersLoaded: false
    };
  },
  methods: {
    logout: function() {
      this.$store.dispatch(AUTH_LOGOUT).then(() => {
        this.$router.push('/');
      });
    },
    navigateToCharacter(e) {
      if (this.$route.path != '/characters/' + e._id) {
        this.$router.push({ name: 'ComboCharacter', params: { id: e._id } });
      }
      this.inputValue = '';
    }
  },

  mounted() {
    console.log(this.$route);
    this.$store.watch(state => {
      if (this.$store.getters.isAuthenticated) {
        this.connected = true;
      } else {
        this.connected = false;
      }
    });

    HTTP.get('/characters').then(
      res => {
        this.results = res.data.characters;
        this.charactersLoaded = true;
        console.log(this.results);
      },
      error => {
        alert(error);
      }
    );
  },
  components: {
    LoginForm,
    VueTypeaheadBootstrap
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
