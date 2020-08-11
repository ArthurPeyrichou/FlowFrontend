<template>
  <div>
    <b-modal
      centered
      id="modal-register-account"
      size="lg"
      ref="modal"
      title="Register: "
    >
      <form ref="form" @submit.stop.prevent="handleRegisterSubmit">
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
      </form>

      <template v-slot:modal-footer>
        <div class="w-100">
          <button id="register-modal-submit" v-on:click="handleRegisterSubmit" type="button" class="btn btn-primary float-right" style="margin-left: 5px;" >Register</button>
          <button id="register-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BackendRequestFactory } from '../../services/BackendRequestFactory'
import DesignBoard from '../../views/DesignBoard.vue'

/** Modal that allow users to register a new account. */
@Component
export default class RegisterModal extends Vue {
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
  checkFormValidity (): boolean {
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
   * Called when user click "Apply Settings" button.
   * WARNING: empty function
   * @public
   */
  handleRegisterSubmit (): void {
    // Exit when the form isn't valid
    if (!this.checkFormValidity()) {
      return
    }

    (this.$parent as DesignBoard).sendMessageToBackend([BackendRequestFactory.registerUser(this.name, this.password)])

    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-register-account')
    })
  }

  /**
   * Hides the modal from the user interface.
   * @public
   */
  hideModal (): void {
    this.$bvModal.hide('modal-register-account')
  }

  /**
   * Init name and passwords
   * Then shows the modal from the user interface.
   * @public
   */
  showModal (): void {
    this.name = ''
    this.nameState = null
    this.password = ''
    this.passwordState = null
    this.password2 = ''
    this.password2State = null
    this.$bvModal.show('modal-register-account')
  }
}
</script>
