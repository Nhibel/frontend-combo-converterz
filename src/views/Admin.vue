<template>
  <div class="hello">
    <h2>Ajouter un combo en bdd</h2>

    <b-row>
      <b-col cols="6">
        <b-form-group label="Choisir le jeu :" label-for="game-select">
          <b-form-select
            id="game-select"
            v-model="gameId"
            @change="loadCharacters"
          >
            <option value="" selected="true">Choisir un jeu</option>
            <option
              v-for="(game, index) in games"
              :key="index"
              :value="game._id"
            >
              {{ game.name }}
            </option>
          </b-form-select>
        </b-form-group>

        <b-form-group
          label="Choisir le personnage :"
          label-for="character-select"
          v-if="showCharactersSelect"
        >
          <b-form-select
            id="character-select"
            v-model="characterId"
            @change="getCombos"
          >
            <option value="default">Choisir un Personnage</option>
            <option
              v-for="(character, index) in characters"
              :key="index"
              :value="character._id"
            >
              {{ character.name }}
            </option>
          </b-form-select>
        </b-form-group>
      </b-col>

      <b-col>
        <b-form @submit.prevent>
          <div>
            <b-form-input
              v-model="manipulation"
              placeholder="Entre ton combo"
            ></b-form-input>
          </div>

          <div>
            <b-button type="submit" @click="addCombo" variant="primary">
              Ajouter
            </b-button>
          </div>
        </b-form>
      </b-col>
    </b-row>

    <div v-if="showComboList">
      <div v-for="combo in comboList" :key="combo._id">
        <Combo :combo="combo" :key="componentKey"></Combo>
      </div>
    </div>
    <div v-else>
      {{ message }}
    </div>

    <br />
    <button @click="logout">Disconnect</button>
  </div>
</template>

<script>
import { HTTP } from '@/http-constants';
import { AUTH_LOGOUT } from '@/store/actions/auth';
import Combo from '@/components/Combo.vue';

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')),
      name: '',
      games: '',
      gameId: '',
      selected: '',
      characters: '',
      characterId: '',
      showCharactersSelect: false,
      showComboInput: false,
      showComboList: false,
      manipulation: '',
      comboList: [],
      message: '',
      componentKey: 0
    };
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },

    async loadCharacters() {
      (this.characterId = 'default'),
        (this.characters = []),
        (this.showComboList = false);
      if (this.gameid != null || this.gameId != '') {
        await this.$store.dispatch('fetchCharactersFromGame', this.gameId).then(
          this.$store.watch(state => {
            let charactersBeforeSort = this.$store.state.characters
              .gameCharacters.data;
            this.characters = this.sortObjectByParam(
              charactersBeforeSort,
              'name'
            );
          })
        );
        this.showCharactersSelect = true;
      } else {
        this.showCharactersSelect = false;
      }
    },

    addCombo() {
      const { characterId, manipulation } = this;
      this.$store
        .dispatch('createCombo', { characterId, manipulation })
        .then(this.getCombos());
    },

    async getCombos() {
      const { characterId } = this;
      if (this.characterId != 'default') {
        await this.$store.dispatch('fetchCombos', { characterId }).then(() => {
          if (this.$store.state.combos.combos.data.combo.length > 0) {
            this.comboList = this.$store.state.combos.combos.data.combo;
            this.forceRerender();
            this.showComboList = true;
          } else {
            this.showComboList = false;
            this.message = 'Pas encore de combos pour ce personnage';
          }
        });
      } else {
        console.log('default');
        this.showComboList = false;
      }
      this.forceRerender();
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
    },

    sortObject(monObjet) {
      return monObjet.slice(0).sort((a, b) => {
        return a - b;
      });
    }
  },

  mounted() {
    this.$store.dispatch('fetchGames');
    this.games = this.$store.state.games.games.data;
    this.games = this.sortObjectByParam(this.games, 'name');
  },
  computed: {},
  components: {
    Combo
  }
};
</script>

<style scoped></style>
