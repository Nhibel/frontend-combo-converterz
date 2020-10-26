<template>
  <div>
    <hr v-if="index > 0" class="divider" />
    <b-card no-body class="overflow-hidden mt-3">
      <div v-show="!modify">
        <div md="4" v-if="combo.youtubeId" class="bg-secondary pb-2">
          <!-- <lazy-component @show="handler"> -->
          <youtube
            :key="componentKey"
            :video-id="videoId"
            ref="youtube"
            :player-vars="playerVars"
            width="100%"
            :height="height"
            @playing="initialize()"
            @paused="videoPaused()"
          ></youtube>
          <b-form-input
            id="range-1"
            v-model="rangeValue"
            type="range"
            min="0"
            max="100"
            @change="changeVideoPosition()"
            step="0.1"
          ></b-form-input>

          <b-row>
            <b-col
              class="text-right text-md-center mb-md-0 mt-2 order-12 order-md-1"
              ><b-button size="sm" variant="primary" @click="modifyCombo"
                >Modifier</b-button
              ></b-col
            >
            <b-col class="text-center order-2" xs="12" sm="12" md="6">
              <b-button-group class="text-center" size="sm">
                <b-button @click="restartCombo" class="bg-dark border-dark">
                  <b-icon
                    icon="arrow-clockwise"
                    variant="secondary"
                    aria-label="restart combo"
                  ></b-icon>
                </b-button>

                <b-button
                  v-if="!playingState"
                  @click="playVideo"
                  class="bg-dark border-dark"
                >
                  <b-icon
                    icon="play-fill"
                    variant="secondary"
                    aria-label="Play"
                  >
                  </b-icon>
                </b-button>

                <b-button
                  v-if="playingState"
                  @click="pauseVideo"
                  class="bg-dark border-dark"
                >
                  <b-icon
                    icon="pause-fill"
                    variant="secondary"
                    aria-label="Pause"
                  ></b-icon>
                </b-button>

                <b-button
                  v-if="!muteState"
                  @click="muteVolume"
                  class="bg-dark border-dark"
                >
                  <b-icon
                    icon="volume-up-fill"
                    variant="secondary"
                    aria-label="unMute volume"
                  ></b-icon
                ></b-button>

                <b-button
                  v-if="muteState"
                  @click="unMuteVolume"
                  class="bg-dark border-dark"
                >
                  <b-icon
                    icon="volume-mute-fill"
                    variant="secondary"
                    aria-label="Mute volume"
                  ></b-icon
                ></b-button>

                <b-button class="bg-dark border-dark">
                  <b-form-select
                    v-model="speed"
                    @change="changeSpeed"
                    class="bg-dark pr-0"
                    size="sm"
                  >
                    <option value="default" disabled hidden>Speed</option>
                    <option value="0.25">speed x0.25</option>
                    <option value="0.5">speed x0.50</option>
                    <option value="1">speed x1</option>
                  </b-form-select>
                </b-button>
              </b-button-group>
            </b-col>
            <b-col
              class="text-left text-md-center mt-md-0 mt-2 order-12 order-md-3"
            >
              <b-button variant="danger" size="sm" @click="deleteCombo"
                >Supprimer</b-button
              >
            </b-col>
          </b-row>

          <!-- </lazy-component> -->
        </div>

        <div>
          <b-card-body class="text-center">
            <b-card-text
              class="controller-buttons d-flex flex-wrap justify-content-center"
            >
              <div v-for="(button, index) in buttons" :key="index">
                <b-img
                  fluid
                  :src="'/assets/' + platform + '/' + button + '.png'"
                  alt=""
                ></b-img>
              </div>
              <br />
            </b-card-text>
          </b-card-body>
        </div>
      </div>

      <b-form @submit.prevent v-show="modify" class="modify-combo-container">
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
      componentKey: 0,
      buttons: [],
      ytId: '',
      ytTimestamp: '',
      manipulation: '',
      modify: false,
      youtubeLink: '',
      videoId: this.combo.youtubeId,
      playerVars: {
        start: this.combo.youtubeTimeStamp,
        controls: 0
      },
      player: [],
      playingState: 0,
      muteState: 0,
      speedState: 1,
      rangeValue: 0,
      time_update_interval: '',
      speed: 'default',
      height: ''
    };
  },
  methods: {
    handler() {
      console.log('loaded');
    },

    // Start Youtube Player controls //

    async initialize() {
      this.playingState = 1;
      //this.updateProgressBar();

      // Clear any old interval.
      //clearInterval(this.time_update_interval);

      // Start interval to update elapsed time display and
      // the elapsed part of the progress bar every second.
      this.time_update_interval = setInterval(() => {
        this.updateProgressBar();
      }, 1000);
    },

    async updateProgressBar() {
      this.rangeValue =
        ((await this.player.getCurrentTime()) /
          (await this.player.getDuration())) *
        100;
    },

    // Change video position based on the range bar
    async changeVideoPosition() {
      var newTime = (await this.player.getDuration()) * (this.rangeValue / 100);
      this.player.seekTo(newTime);
    },

    videoPaused() {
      this.playingState = !this.playingState;
      clearInterval(this.time_update_interval);
    },

    restartCombo() {
      this.player.seekTo(this.combo.youtubeTimeStamp);
    },

    async playVideo() {
      this.initialize();
      await this.player.playVideo();
    },

    async pauseVideo() {
      this.playingState = 1;
      await this.player.pauseVideo();
    },

    async muteVolume() {
      this.muteState = !this.muteState;
      await this.player.mute();
    },

    async unMuteVolume() {
      this.muteState = !this.muteState;
      await this.player.unMute();
    },

    async changeSpeed() {
      console.log(this.speed);
      var speed = parseFloat(this.speed);
      await this.player.setPlaybackRate(speed);
    },

    async initializeRange() {
      console.log(await this.player.getDuration());
      this.rangeValue =
        (this.combo.youtubeTimeStamp / (await this.player.getDuration())) * 100;
    },

    // End Youtube Player controls //

    async deleteCombo() {
      await this.$store
        .dispatch('deleteCombo', { id: this.combo._id })
        .then(() => {
          this.$emit('comboDeleted', this.combo._id);
        });
    },

    // faire apparaître / disparaître la modif combo
    modifyCombo() {
      this.player.pauseVideo();
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
      result = result.split(' ').filter(e => {
        return e != '';
      });
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
            this.videoId = this.combo.youtubeId;
            this.playerVars.start = this.combo.youtubeTimeStamp;
            this.player.seekTo(this.combo.youtubeTimeStamp);
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

    changeHeight() {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1200) {
        this.height = '600px';
      } else if (screenWidth >= 992) {
        this.height = '500px';
      } else if (screenWidth >= 768) {
        this.height = '400px';
      } else if (screenWidth >= 576) {
        this.height = '300px';
      } else if (screenWidth < 576) {
        this.height = '180px';
      }

      console.log(this.height);
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
  computed: {
    // player() {
    //   return this.$refs.youtube.player;
    // }
  },
  components: {},
  mounted() {
    this.buttons = this.strNumericalToBtnArray(this.combo.manipulation);
    this.manipulation = this.combo.manipulation;

    if (this.combo.youtubeId) {
      this.player = this.$refs.youtube.player;
      this.initializeRange();

      this.youtubeLink = this.getYoutubeLink(
        this.combo.youtubeId,
        this.combo.youtubeTimeStamp
      );
    }

    this.changeHeight();
    window.addEventListener('resize', this.changeHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeHeight);
    clearInterval(this.time_update_interval);
  }
};
</script>

<style lang="scss" scoped>
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

.custom-select {
  color: lightgray;
}

.controller-buttons img {
  width: 25px;
  height: 25px;
}

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) {
  .controller-buttons img {
    width: 30px;
    height: 30px;
  }
}

// Medium devices (tablets, 768px and up)
@media (min-width: 768px) {
  .controller-buttons img {
    width: 35px;
    height: 35px;
  }
}

// Large devices (desktops, 992px and up)
@media (min-width: 992px) {
  .controller-buttons img {
    width: 40px;
    height: 40px;
  }
}
</style>
