<template>
  <div>
    <b-modal
      centered
      id="modal-edit-tab"
      size="lg"
      ref="modal"
      :title="'Add new tab: '"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="nameState"
          label="Name"
          label-for="tab-name-input"
          :invalid-feedback="nameInvalidFeedback"
        >
          <b-form-input
            id="tab-name-input"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>

      <template v-slot:modal-footer>
        <div class="w-100">
          <button id="tab-setting-modal-add" v-on:click="handleAddSubmit" type="button" class="btn btn-primary float-right" style="margin-left: 5px;" >Add</button>
          <button id="tab-setting-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

/** Modal that allow users to add new tab in the #conception-grid-svg. */
@Component
export default class TabSettingModal extends Vue {
  /** Method which come from parent ComceptionGrid vue. Used for updating the current component. */
  @Prop({ default: () => { console.log('Not implemented!') } }) addNewTab!: Function

  name = ''
  nameState: boolean | null = null
  nameInvalidFeedback = 'Name with length in between [3;50] characters is required.'

  /**
   * Check if the form is valide.
   * @public
   * @returns true if the form is valid, false otherwise
   */
  checkFormValidity (): boolean {
    this.nameState = this.name.length >= 3 && this.name.length <= 50
    this.nameInvalidFeedback = 'Name with length in between [3;50] characters is required. Current ' + this.name.length + '.'
    return this.nameState
  }

  /**
   * Called when user click "Apply Settings" button.
   * WARNING: empty function
   * @public
   */
  handleAddSubmit (): void {
    console.log('cc')
    // Exit when the form isn't valid
    if (!this.checkFormValidity()) {
      return
    }
    // Do something here
    this.addNewTab(this.name)

    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-edit-tab')
    })
  }

  /**
   * Hides the modal from the user interface.
   * @public
   */
  hideModal (): void {
    this.$bvModal.hide('modal-edit-tab')
  }

  /**
   * Shows the modal from the user interface.
   * @public
   */
  showModal (): void {
    this.name = ''
    this.nameState = null
    this.$bvModal.show('modal-edit-tab')
  }
}
</script>
