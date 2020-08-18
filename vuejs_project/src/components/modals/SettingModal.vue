<template>
  <div>
    <b-modal
      centered
      id="modal-setting"
      size="lg"
      ref="modal"
      title="Settings: "
    >

        <b-form-group
          label="Choose a theme"
          label-for="theme-selector"
        >
          <b-form-select id="theme-selector" v-model="selected" :options="options" v-on:change="applyTheme()"></b-form-select>
        </b-form-group>

      <template v-slot:modal-footer>
        <div class="w-100">
          <button id="setting-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
        </div>
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
export default class GroupManagementModal extends Vue {
  options: Array<{value: string; text: string}> = [
    { value: 'dark', text: 'Dark' },
    { value: 'light', text: 'Light' },
    { value: 'custom', text: 'Custom' }]

  selected = (this.$parent as App).$data.theme

  applyTheme (): void {
    (this.$parent as App).setTheme(this.selected)
  }

  /**
   * Hides the modal from the user interface.
   * @public
   */
  hideModal (): void {
    this.$bvModal.hide('modal-setting')
  }

  /**
   * Init name and passwords
   * Then shows the modal from the user interface.
   * @public
   */
  showModal (): void {
    this.$bvModal.show('modal-setting')
  }
}
</script>
