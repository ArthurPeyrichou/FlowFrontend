<template>
  <div>
    <b-modal
      centered
      id="modal-login-account"
      size="lg"
      ref="modal"
      title="Login: "
    >
      <form ref="form" @submit.stop.prevent="handleLoginSubmit">
        <b-form-group
          :state="nameState"
          label="Name"
          label-for="login-name-input"
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
        >
          <b-form-input
            id="login-password-input"
            v-model="password"
            type="password"
            :state="passwordState"
            required
          ></b-form-input>
        </b-form-group>
      </form>

      <template v-slot:modal-footer>
        <div class="w-100">
          <button id="login-modal-submit" v-on:click="handleLoginSubmit" type="button" class="btn btn-primary float-right" style="margin-left: 5px;" >Login</button>
          <button id="login-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DesignBoard from '../../views/DesignBoard.vue'
import { BackendRequestFactory } from '../../services/BackendRequestFactory'

/** Modal that allow users to login a new account. */
@Component
export default class LoginModal extends Vue {
  name = ''
  nameState: boolean | null = null
  password = ''
  passwordState: boolean | null = null

  /**
   * Called when user click "Apply Settings" button.
   * WARNING: empty function
   * @public
   */
  handleLoginSubmit (): void {
    (this.$parent as DesignBoard).sendMessageToBackend([BackendRequestFactory.loginUser(this.name, this.password)])

    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-login-account')
    })
  }

  /**
   * Hides the modal from the user interface.
   * @public
   */
  hideModal (): void {
    this.$bvModal.hide('modal-login-account')
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
    this.$bvModal.show('modal-login-account')
  }
}
</script>
