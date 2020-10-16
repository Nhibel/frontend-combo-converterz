<template>
  <div>
    <b-row
      class="mb-2 mt-3"
      align-v="center"
      cols="1"
      cols-sm="1"
      cols-md="3"
      align-h="center"
    >
      <b-col class="text-md-left text-center mt-2 mt-md-0 "
        ><b-button textvariant="primary" class="goback-btn" @click="goBack">
          retour
        </b-button>
      </b-col>
      <b-col>
        <h4>
          {{ character.name }}
        </h4>
      </b-col>
      <b-col class="mb-2 mb-md-0">
        <div class="controllers-container">
          <b-row class="mt-0 m-0 ">
            <b-col
              class="d-inline-flex justify-content-center justify-content-md-end text-center pr-0 controllers-col"
            >
              <b-form-group
                :checked="platform"
                @change="forceRerender"
                class="controller-selector rounded pl-2 pr-2 pt-2 mb-0"
              >
                <input
                  id="psx"
                  type="radio"
                  name="controller"
                  value="psx_buttons"
                  v-model="platform"
                />
                <label
                  style="background-image: url(/assets/controllers/psx.png)"
                  class="platform-controller psx"
                  for="psx"
                ></label>
                <input
                  id="xbox"
                  type="radio"
                  name="controller"
                  value="xbox_buttons"
                  v-model="platform"
                />
                <label
                  style="background-image: url(/assets/controllers/xbox.png)"
                  class="platform-controller xbox"
                  for="xbox"
                ></label>
              </b-form-group>
            </b-col>
          </b-row></div
      ></b-col>
    </b-row>

    <!-- <b-button
      variant="primary"
      class="mb-3 mt-3 goback-btn fixed"
      @click="goBack"
      >retour</b-button
    > -->

    <!-- <div class="controllers-container mt-3">
      <b-row class="mt-0 m-0">
        <b-col
          class="d-inline-flex justify-content-end text-center pr-0 controllers-col"
        >
          <b-form-group
            :checked="platform"
            @change="forceRerender"
            class="controller-selector rounded pl-2 pr-2 pt-2 mt-2 mb-0"
          >
            <input
              id="psx"
              type="radio"
              name="controller"
              value="psx_buttons"
              v-model="platform"
            />
            <label
              style="background-image: url(/assets/controllers/psx.png)"
              class="platform-controller psx"
              for="psx"
            ></label>
            <input
              id="xbox"
              type="radio"
              name="controller"
              value="xbox_buttons"
              v-model="platform"
            />
            <label
              style="background-image: url(/assets/controllers/xbox.png)"
              class="platform-controller xbox"
              for="xbox"
            ></label>
          </b-form-group>
        </b-col>
      </b-row>
    </div> -->

    <!-- <h4>{{ character.name }}</h4> -->

    <b-row class="bg-dark p-2">
      <b-col xs="12" sm="9" md="10" class=" mb-sm-0 p-2 pr-3">
        <b-form @submit.prevent class="mb-3">
          <b-input-group>
            <b-form-input
              no-resize
              v-model="manipulation"
              :state="characterId != 'default' && characterId != '' >= 10"
              placeholder="Inscris ton combo ici"
              @input="enableButtonAndYoutube"
            >
            </b-form-input>
          </b-input-group>
        </b-form>

        <b-form class="select-box" @submit.prevent>
          <b-input-group>
            <b-form-input
              :disabled="comboValidated == 1"
              no-resize
              v-model="youtubeLink"
              placeholder="Enregistre un lien youtube vers le combo"
            ></b-form-input>
          </b-input-group>
        </b-form>
      </b-col>

      <b-col
        xs="12"
        sm="3"
        md="2"
        class="pr-3 pl-2 pl-sm-2 pt-2 pb-2 pt-sm-2 pb-sm-2"
      >
        <b-button
          variant="primary"
          type="submit"
          @click="addCombo"
          :disabled="activatedButton == 1"
          class="h-100 w-100"
          >Ajouter
        </b-button>
      </b-col>
    </b-row>

    <div v-if="comboList" class="combo-container pr-3 pl-3 pb-3">
      <div v-for="(combo, index) in comboList" :key="combo._id">
        <Combo
          :combo="combo"
          :platform="platform"
          :key="componentKey"
          :index="index"
          @comboDeleted="deletedCombo"
        ></Combo>
      </div>
    </div>
    <div class="message" v-else>
      {{ message }}
    </div>
  </div>
</template>

<script>
import Combo from '@/components/Combo.vue';
import router from '../router';
export default {
  data() {
    return {
      characterId: '',
      character: [],
      comboList: [],
      componentKey: 0,
      manipulation: '',
      platform: 'psx_buttons',
      comboValidated: 1,
      activatedButton: 1,
      youtubeLink: '',
      ytId: '',
      ytTimestamp: ''
    };
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'Characters',
        params: { game: this.character.game._id }
      });
    },

    async loadCharacter(characterId) {
      await this.$store
        .dispatch('fetchCharacterById', characterId)
        .then(response => {
          this.character = response.data;
          console.log(this.character.game.name);
          this.characterId = this.character._id;
          this.getCombos();
        })
        .catch(err => {
          alert('Erreur lors de la récupération des données');
          console.log(err);
        });
    },

    async getCombos() {
      const { characterId } = this;
      await this.$store
        .dispatch('fetchCombos', { characterId })
        .then(() => {
          if (this.$store.state.combos.combos.data.combo.length > 0) {
            this.comboList = this.$store.state.combos.combos.data.combo;
            this.comboList.sort(function(a, b) {
              return new Date(b.date) - new Date(a.date);
            });
          } else {
            this.message = 'Pas encore de combos pour ce personnage';
            console.log('Pas encore de combos pour ce personnage');
          }
        })
        .then(() => this.forceRerender);
    },

    async addCombo() {
      if (this.youtubeLink != '' && this.youtubeLink != null) {
        let testYoutubeLink = await this.$store.dispatch(
          'getYoutubeId',
          this.youtubeLink
        );
        if (testYoutubeLink != false) {
          this.ytId = testYoutubeLink;
        } else {
          alert('Erreur sur le lien Youtube');
        }
      }

      if (this.youtubeLink.includes('t=')) {
        let getYoutubeTimestamp = this.youtubeLink.split('t=');
        this.ytTimestamp = getYoutubeTimestamp[1];
      }

      const { characterId, manipulation, ytId, ytTimestamp } = this;

      this.$store
        .dispatch('createCombo', {
          characterId,
          manipulation,
          ytId,
          ytTimestamp
        })
        .then(res => {
          if (res.data.message == 'ok') {
            this.getCombos().then(() => this.forceRerender);
            this.$store.dispatch('makeToast', {
              vm: this,
              variant: 'success',
              message: 'Combo créé avec succès !'
            });
            this.youtubeLink = '';
            this.manipulation = '';
          } else {
            alert('Erreur lors de la création du combo');
          }
        })
        .catch(err => console.log(err));
    },

    deletedCombo(e) {
      // get index of object with id emitted by combo component
      var removeIndex = this.comboList
        .map(item => {
          return item._id;
        })
        .indexOf(e);

      // remove object
      this.comboList.splice(removeIndex, 1);
      this.$store.dispatch('makeToast', {
        vm: this,
        variant: 'warning',
        message: 'Combo supprimé'
      });
    },

    forceRerender() {
      this.componentKey += 1;
    },

    enableButtonAndYoutube() {
      if (this.manipulation.length > 0) {
        this.activatedButton = 0;
        this.comboValidated = 0;
      } else {
        this.activatedButton = 1;
        this.comboValidated = 1;
        this.youtubeLink = '';
      }
    }
  },
  created() {
    this.characterId = this.$route.params.id;

    if (this.$route.params.character) {
      this.character = this.$route.params.character;
      this.getCombos();
    } else {
      this.loadCharacter(this.characterId);
    }
  },
  components: {
    Combo
  }
};
</script>

<style lang="scss" scoped>
// h4 {
//   padding-top: 0;
// }
.goback-btn {
  z-index: 2;
}

.controller-buttons img {
  height: 40px;
}

.combo-container {
  margin-right: -15px;
  margin-left: -15px;
}

.controller-selector {
  background-color: white;
}

.controller-selector input {
  margin: 0;
  padding: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.controllers-container {
  z-index: 1;
  height: 50px;
  width: 100%;
}

.controllers-col {
  margin-right: 0px;
}

.platform-controller,
.controller-selector input:active + .platform-controller {
  opacity: 1;
}
.platform-controller,
.controller-selector input:checked + .platform-controller {
  -webkit-filter: none;
  -moz-filter: none;
  filter: none;
}
.platform-controller {
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  width: 70px;
  height: 40px;
  margin: 0px 0px 0px 0px;
  -webkit-transition: all 100ms ease-in;
  -moz-transition: all 100ms ease-in;
  transition: all 100ms ease-in;
  -webkit-filter: brightness(1.8) grayscale(1) opacity(0.7);
  -moz-filter: brightness(1.8) grayscale(1) opacity(0.7);
  filter: brightness(1.8) grayscale(1) opacity(0.7);
}
.platform-controller:hover {
  -webkit-filter: brightness(1.2) grayscale(0.5) opacity(0.9);
  -moz-filter: brightness(1.2) grayscale(0.5) opacity(0.9);
  filter: brightness(1.2) grayscale(0.5) opacity(0.9);
}

.platform-controller .xbox {
  height: 50px;
}

.message {
  color: rgb(0, 0, 0);
  font-family: 'LEVIBRUSH', Helvetica, Arial;
  font-size: 3em;
  text-align: center;
}
</style>
