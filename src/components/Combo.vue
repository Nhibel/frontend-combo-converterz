<template>
  <div>
    <hr v-if="index > 0" class="divider" />
    <b-card no-body class="overflow-hidden mt-3">
      <div v-if="!modify">
        <div md="4" v-if="combo.youtubeId">
          <lazy-component @show="handler">
            <b-embed
              type="iframe"
              aspect="16by9"
              :src="youtubeLink"
              allowfullscreen
              controls
              crossorigin="anonymous"
            ></b-embed>
          </lazy-component>
        </div>

        <div>
          <b-card-body class="text-center">
            <b-card-text class="controller-buttons">
              <span v-for="(button, index) in buttons" :key="index">
                <img
                  :src="'/assets/' + platform + '/' + button + '.png'"
                  alt=""
                />
              </span>
              <br />
            </b-card-text>
            <b-button
              size="sm"
              variant="primary"
              class="mr-2"
              @click="modifyCombo"
              >Modifier</b-button
            >
            <b-button variant="danger" size="sm" @click="deleteCombo"
              >supprimer</b-button
            >
          </b-card-body>
        </div>
      </div>

      <b-form @submit.prevent v-else class="modify-combo-container">
        <b-form-input
          size="sm"
          type="text"
          v-model="manipulation"
          class="mb-2"
          v-on:keyup.enter="updateCombo"
        />
        <b-form-input
          size="sm"
          type="text"
          v-model="youtubeLink"
          placeholder="Renseigner un lien youtube"
          class="mb-2"
          v-on:keyup.enter="updateCombo"
        />
        <b-button class="mr-2" size="sm" variant="primary" @click="updateCombo"
          >Valider</b-button
        >

        <b-button size="sm" variant="warning" @click="modify = !modify"
          >Annuler</b-button
        >
      </b-form>
    </b-card>

    <b-card-text> </b-card-text>
  </div>
</template>

<script>
export default {
  data() {
    return {
      buttons: [],
      ytId: '',
      ytTimestamp: '',
      manipulation: '',
      modify: false,
      youtubeLink: ''
    };
  },
  methods: {
    handler() {
      console.log('loaded');
    },

    async deleteCombo() {
      await this.$store
        .dispatch('deleteCombo', { id: this.combo._id })
        .then(() => {
          this.$emit('comboDeleted', this.combo._id);
        });
    },

    // faire apparaître / disparaître la modif combo
    modifyCombo() {
      this.modify = !this.modify;
    },

    strNumericalToBtnArray(str) {
      str = str.toUpperCase();

      var result = str
        .replaceAll('236', 'bottom-to-right ')
        .replaceAll('QCF', 'bottom-to-right ')
        .replaceAll('214', 'bottom-to-left ')
        .replaceAll('QCB', 'bottom-to-left ')
        .replaceAll('VANISH', 'vanish ')
        .replaceAll('DELAY', 'delay ')
        .replaceAll('DL', 'delay ')
        .replaceAll('SD', 'super-dash ')
        .replaceAll('JC', 'jump-cancel ')
        .replaceAll('DR', 'dragon-rush ')
        .replaceAll('A1', 'assist-one ')
        .replaceAll('A2', 'assist-two ')
        .replaceAll('1', 'bottom-left ')
        .replaceAll('2', 'bottom ')
        .replaceAll('3', 'bottom-right ')
        .replaceAll('4', 'left ')
        .replaceAll('5', 'neutral ')
        .replaceAll('6', 'right ')
        .replaceAll('7', 'top-left ')
        .replaceAll('8', 'top ')
        .replaceAll('9', 'top-right ')
        .replaceAll('L', 'light ')
        .replaceAll('M', 'medium ')
        .replaceAll('H', 'high ')
        .replaceAll('S', 'super ')
        .replaceAll('J', 'jump ');
      result = result.split(' ');
      return result;
    },

    async updateCombo(e) {
      let tempYoutubeId = '';
      let tempTimeStamp = '';
      let tempManipulation = '';

      tempManipulation = this.manipulation;

      if (this.youtubeLink) {
        let testYoutubeLink = await this.$store.dispatch(
          'getYoutubeId',
          this.youtubeLink
        );

        if (testYoutubeLink != false) {
          tempYoutubeId = testYoutubeLink;
        } else {
          alert('Erreur sur le lien Youtube');
        }

        if (this.youtubeLink.includes('t=')) {
          let getYoutubeTimestamp = this.youtubeLink.split('t=');
          tempTimeStamp = getYoutubeTimestamp[1];
        }
      } else {
        tempYoutubeId = '';
      }

      if (
        tempYoutubeId == this.combo.youtubeId &&
        tempTimeStamp == this.combo.youtubeTimeStamp &&
        tempManipulation == this.combo.manipulation
      ) {
        this.modifyCombo();
      } else {
        this.combo.manipulation = tempManipulation;
        this.combo.youtubeId = tempYoutubeId;
        this.combo.youtubeTimeStamp = tempTimeStamp;

        this.$store.dispatch('modifyCombo', this.combo).then(res => {
          if (res.data.message == 'ok') {
            this.$store.dispatch('makeToast', {
              vm: this,
              variant: 'success',
              message: 'Combo modifié avec succès'
            });
            this.buttons = this.strNumericalToBtnArray(this.manipulation);
            if (this.youtubeLink) {
              this.youtubeLink = this.getYoutubeLink(
                this.combo.youtubeId,
                this.combo.youtubeTimeStamp
              );
            }
            this.modifyCombo();
          } else {
            this.$store.dispatch('makeToast', {
              vm: this,
              variant: 'danger',
              message: 'Erreur lors de la modification du combo'
            });
          }
        });
      }
    },

    getYoutubeLink(ytId, timestamp) {
      return 'https://www.youtube.com/embed/' + ytId + '?start=' + timestamp;
    }
  },
  props: {
    combo: {
      type: Object,
      default: () => ({})
    },
    platform: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {},
  mounted() {
    this.buttons = this.strNumericalToBtnArray(this.combo.manipulation);
    this.manipulation = this.combo.manipulation;

    if (this.combo.youtubeId) {
      this.youtubeLink = this.getYoutubeLink(
        this.combo.youtubeId,
        this.combo.youtubeTimeStamp
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.controller-buttons img {
  height: 40px;
}

.modify-combo-container {
  padding: 1.25rem;
}

.card {
  border: none;
}

.divider {
  color: white;
  border-style: solid none;
  border-width: 0.5px 0;
}
</style>
