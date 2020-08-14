<template>
  <div>
    <b-modal
      centered
      id="modal-auth-account"
      size="lg"
      ref="modal"
      :title="isLogin ? 'Login:': 'Register:'"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
    >
      <form v-if="isLogin" @submit.stop.prevent="handleLoginSubmit">
        <b-form-group
          :state="nameState"
          label="Name"
          label-for="login-name-input"
          :invalid-feedback="nameInvalidFeedBack"
        >
          <b-form-input
            id="login-name-input"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :state="passwordState"
          label="Password"
          label-for="login-password-input"
          :invalid-feedback="passwordInvalidFeedBack"
        >
          <b-form-input
            id="login-password-input"
            v-model="password"
            type="password"
            :state="passwordState"
            required
          ></b-form-input>
        </b-form-group>

        <button id="login-modal-submit" v-on:click="handleLoginSubmit" type="button" class="btn btn-outline-primary float-right" style="margin-left: 5px;">Login</button>
        <p>Not registered? Register <a v-on:click="toggleAuth()">here</a>.</p>
      </form>

      <form v-else @submit.stop.prevent="handleRegisterSubmit">
        <b-form-group
          :state="nameState"
          label="Name"
          label-for="register-name-input"
          :invalid-feedback="nameInvalidFeedBack"
        >
          <b-form-input
            id="register-name-input"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :state="passwordState"
          label="Password"
          label-for="register-password-input"
          :invalid-feedback="passwordInvalidFeedBack"
        >
          <b-form-input
            id="register-password-input"
            v-model="password"
            type="password"
            :state="passwordState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :state="password2State"
          label="Confirm password"
          label-for="register-password2-input"
          :invalid-feedback="password2InvalidFeedBack"
        >
          <b-form-input
            id="register-password2-input"
            v-model="password2"
            type="password"
            :state="password2State"
            required
          ></b-form-input>
        </b-form-group>

        <button id="login-modal-close" v-on:click="handleRegisterSubmit" type="button" class="btn btn-outline-primary float-right" style="margin-left: 5px;">Register</button>
        <p>Already registered? Login <a v-on:click="toggleAuth()">here</a>.</p>
      </form>

      <template v-slot:modal-footer>
        <div class="w-100"></div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import App from '../../App.vue'
import { BackendRequestFactory } from '../../services/BackendRequestFactory'

/** Modal that allow users to login a new account. */
@Component
export default class LoginModal extends Vue {
  isLogin = true
  name = ''
  nameState: boolean | null = null
  nameInvalidFeedBack = ''
  password = ''
  passwordState: boolean | null = null
  passwordInvalidFeedBack = ''
  password2 = ''
  password2State: boolean | null = null
  password2InvalidFeedBack = ''

  /**
   * Check if the form is valide.
   * @public
   * @returns true if the form is valid, false otherwise
   */
  checkRegisterFormValidity (): boolean {
    this.nameState = this.name.length >= 3 && this.name.length <= 30
    this.passwordState = this.password.length >= 8 && this.password.length <= 30
    this.password2State = this.password === this.password2
    if (!this.nameState) {
      this.nameInvalidFeedBack = 'Name with length [3;30] is required. Current ' + this.name.length + '.'
    }
    if (!this.passwordState) {
      this.passwordInvalidFeedBack = 'Password with length [8;30] is required. Current ' + this.password.length + '.'
    }
    if (!this.password2State) {
      this.password2InvalidFeedBack = 'Password confirmation failed. Passwords are not similar.'
    }
    const valid = this.nameState && this.passwordState && this.password2State
    return valid
  }

  /**
   * Check if the form is valide.
   * @public
   * @returns true if the form is valid, false otherwise
   */
  checkLoginFormValidity (): boolean {
    this.nameState = this.name.length > 0
    this.passwordState = this.password.length > 0
    if (!this.nameState) {
      this.nameInvalidFeedBack = 'Name is empty.'
    }
    if (!this.passwordState) {
      this.passwordInvalidFeedBack = 'Password is empty.'
    }
    const valid = this.nameState && this.passwordState
    return valid
  }

  /**
   * Called when user click "Apply Settings" button.
   * WARNING: empty function
   * @public
   */
  handleLoginSubmit (): void {
    // Exit when the form isn't valid
    if (!this.checkLoginFormValidity()) {
      return
    }

    (this.$parent as App).sendMessageToBackend([BackendRequestFactory.loginUser(this.name, this.password)])

    // Warning, tempory
    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-auth-account')
    })
  }

  handleRegisterSubmit (): void {
    // Exit when the form isn't valid
    if (!this.checkRegisterFormValidity()) {
      return
    }

    (this.$parent as App).sendMessageToBackend([BackendRequestFactory.registerUser(this.name, this.password)])

    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-auth-account')
    })
  }

  /**
   * Init name and passwords
   * Then shows the modal from the user interface.
   * @public
   */
  showModal (): void {
    this.resetModal()
    this.$bvModal.show('modal-auth-account')
  }

  /**
   * Reinit name and passwords
   * @public
   */
  resetModal (): void {
    this.name = ''
    this.nameState = null
    this.password = ''
    this.passwordState = null
    this.password2 = ''
    this.password2State = null
  }

  /**
   * Reinit name and passwords
   * Then if current form is login switch to registering and vice versa
   * @public
   */
  toggleAuth (): void {
    this.resetModal()
    this.isLogin = !this.isLogin
  }
}
</script>

<style scoped>
  a {
    cursor: pointer;
    color: #007bff !important;
  }
  a:hover {
    color: #0056b3 !important;
    text-decoration: underline !important;
  }
</style>
