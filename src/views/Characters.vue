<template>
  <div>
    <b-row class="mb-2 mt-3">
      <b-col>
        <h4>Choisis un jeu puis ton perso</h4>
      </b-col>
    </b-row>

    <!-- ////////////////////////////////////// -->

    <b-form label-for="game-select" class="bg-dark p-2 rounded mb-3">
      <b-form-select id="game-select" v-model="gameId" @change="loadCharacters">
        <option value="" selected="true">Choisir un jeu</option>
        <option v-for="(game, index) in games" :key="index" :value="game._id">
          {{ game.name }}
        </option>
      </b-form-select>
    </b-form>

    <!-- characters list ////////////////////////// -->

    <b-row v-if="gameId" class="text-center bg-dark p-3 rounded m-0 mb-5">
      <b-col
        lg="2"
        md="2"
        sm="3"
        cols="3"
        v-for="(character, index) in characters"
        :key="index"
        :value="character._id"
        class="p-2"
      >
        <router-link
          :to="{
            name: 'ComboCharacter',
            params: { id: character._id, character: character }
          }"
          class="d-block h-100"
          ><img
            :src="
              '/assets/img/dragon_ball_fighterz/' +
                character.name.split(' ').join('_') +
                '.webp'
            "
            :alt="character.name"
            class="img-fluid img-thumbnail rounded-circle"
        /></router-link>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { HTTP } from '@/http-constants';
import { AUTH_LOGOUT } from '@/store/actions/auth';

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')),
      name: '',
      games: '',
      gameId: '',
      characters: '',
      manipulation: '',
      message: ''
    };
  },
  methods: {
    async loadCharacters() {
      this.characters = [];
      if (this.gameid != null || this.gameId != '') {
        await this.$store
          .dispatch('fetchCharactersFromGame', this.gameId)
          .then(res => {
            if (res.data.message == 'ok') {
              let charactersBeforeSort = this.$store.state.characters
                .gameCharacters.data.characters;
              this.characters = this.sortObjectByParam(
                charactersBeforeSort,
                'name'
              );
            }
          })
          .catch(err => {
            alert('Erreur lors de la récupération des données');
            console.log(err);
          });
      }
    },

    sortObjectByParam(monObjet, param) {
      return Object.keys(monObjet)
        .map(t => {
          this.$set(monObjet[t], 'key', t);
          return monObjet[t];
        })
        .sort(this.sortProperty(param));
    },

    sortProperty(prop) {
      return (a, b) => {
        if (a[prop] < b[prop]) return -1;
        if (a[prop] > b[prop]) return 1;
        return 0;
      };
    }
  },

  mounted() {
    this.$store
      .dispatch('fetchGames')
      .then(res => {
        this.games = this.sortObjectByParam(
          this.$store.state.games.games.data,
          'name'
        );
      })
      .catch(err => console.log(err));

    if (this.$route.params.game != null) {
      this.gameId = this.$route.params.game;
      this.loadCharacters();
    }
  },
  computed: {}
};
</script>

<style scoped>
.message {
  color: rgb(0, 0, 0);
  font-family: 'LEVIBRUSH', Helvetica, Arial;
  font-size: 3em;
  text-align: center;
}

/**/
</style>
