<template>
  <div class="pb-3">
    <div>
      <h4>Register</h4>
    </div>
    <b-form @submit.prevent>
      <b-form-group label-for="input-name">
        <b-form-input
          id="input-name"
          v-model="name"
          required
          placeholder="Votre pseudo"
          autofocus
        ></b-form-input>
      </b-form-group>

      <b-form-group label-for="input-email">
        <b-form-input
          id="input-email"
          v-model="email"
          type="email"
          required
          placeholder="Votre email"
        ></b-form-input>
      </b-form-group>

      <b-form-group class="col-sm-16" @change="eraseErrorMessage">
        <password
          v-model="password"
          :toggle="true"
          defaultClass="form-control col-sm-16"
          :placeholder="placeholder"
          :secureLength="secureLength"
          @score="showScore"
          @feedback="showFeedback"
          @input="enableButton"
        ></password>
        <p v-for="(suggestion, index) in suggestions" :key="index">
          {{ suggestion }}
        </p>
        <p>{{ warning }}</p>
      </b-form-group>

      <b-form-group label-for="input-confirm-password">
        <b-form-input
          id="input-confirm-password"
          v-model="password_confirmation"
          @change="eraseErrorMessage"
          type="password"
          required
          @input="enableButton"
        ></b-form-input>
      </b-form-group>

      <!-- <b-form-group
        label="Is this an administrator account?"
        label-for="is-admin"
      >
        <b-form-select id="is-admin" v-model="isAdmin">
          <option value="1">Yes</option>
          <option value="0">No</option>
        </b-form-select>
      </b-form-group> -->

      <div v-if="error">
        <b-modal
          centered
          ok-only
          size="sm"
          v-model="modalShow"
          id="modal-1"
          title="Attention"
        >
          <div v-for="(errorMessage, index) in errorMessages" :key="index">
            {{ errorMessage }}
          </div>
        </b-modal>
      </div>

      <div>
        <b-button
          type="submit"
          @click="register"
          variant="primary"
          :disabled="!showButton"
          >Register</b-button
        >
      </div>
    </b-form>
  </div>
</template>

<script>
import { HTTP } from '@/http-constants';
import { REGISTER_REQUEST } from '@/store/actions/register';
import { AUTH_REQUEST } from '@/store/actions/auth';
import Password from 'vue-password-strength-meter';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      isAdmin: 0,
      error: false,
      placeholder: 'Le password doit comporter au moins 8 caractères',
      showButton: '',
      secureLength: 8, // minimum password
      score: 0,
      suggestions: '',
      warning: '',
      errorMessages: [],
      modalShow: false
    };
  },
  methods: {
    register() {
      const { name, email, password, isAdmin } = this;
      if (this.password === this.password_confirmation) {
        this.$store
          .dispatch(REGISTER_REQUEST, { name, email, password, isAdmin })
          .then(() => {
            this.$store
              .dispatch(AUTH_REQUEST, { email, password })
              .then(() => {
                if (!isAdmin) {
                  this.$router.push('/');
                } else {
                  this.$router.push('/');
                }
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(error => {
            this.errorMessages = [];
            this.error = true;
            this.modalShow = !this.modalShow;

            let errors = error.response.data.error.errors;
            for (error in errors) {
              if (error == 'email') {
                this.errorMessages.push('Un compte avec ce mail existe déjà');
              }
              if (error == 'name') {
                this.errorMessages.push('Un compte avec ce nom existe déjà');
              }
            }
            console.log(this.errorMessages);
          });
      } else {
        (this.error = true),
          this.errorMessages.push('Les mots de passe ne correspondent pas');
      }
    },
    showFeedback({ suggestions, warning }) {
      this.suggestions = suggestions;
      this.warning = warning;
    },
    showScore(score) {
      this.score = score;
    },
    enableButton() {
      console.log(this.score);
      if (this.score >= 4 && this.password === this.password_confirmation) {
        this.showButton = true;
      } else {
        this.showButton = false;
      }
    },
    eraseErrorMessage() {
      this.error = false;
    }
  },
  components: {
    Password
  }
};
</script>

<style lang="scss" scoped>
.Password {
  max-width: 100%;
}
p {
  color: yellow;
}
</style>
