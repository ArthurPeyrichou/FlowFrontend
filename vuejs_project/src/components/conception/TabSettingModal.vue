<template>
  <div>
    <b-modal
      centered
      id="modal-edit-tab"
      size="lg"
      ref="modal"
      :title="'Add new tab: '"
    >
      <form ref="form" @submit.stop.prevent="handleAddSubmit">
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

        <b-form-group
          :state="positionState"
          label="Postion"
          label-for="tab-position-input"
          :invalid-feedback="positionInvalidFeedback"
        >
          <b-form-input
            id="tab-position-input"
            v-model="position"
            :state="positionState"
            type="number"
            :min="first"
            :max="last"
            required
          ></b-form-input>
        </b-form-group>
      </form>

      <template v-slot:modal-footer>
        <div class="w-100">
          <template v-if="updateTab">
            <button id="tab-setting-modal-delete" v-on:click="handleDeleteSubmit" type="button" class="btn btn-outline-danger float-right" style="margin-left: 5px;" >Delete</button>
            <button id="tab-setting-modal-update" v-on:click="handleUpdateSubmit" type="button" class="btn btn-primary float-right" style="margin-left: 5px;" >Update</button>
          </template>
          <template v-else>
            <button id="tab-setting-modal-add" v-on:click="handleAddSubmit" type="button" class="btn btn-primary float-right" style="margin-left: 5px;" >Add</button>
          </template>

          <button id="tab-setting-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ConceptionGrid from './ConceptionGrid.vue'

/** Modal that allow users to add new tab in the #conception-grid-svg. */
@Component
export default class TabSettingModal extends Vue {
  name = ''
  nameState: boolean | null = null
  nameInvalidFeedback = 'Name with length in between [3;50] characters is required.'

  firstPosition = 1
  lastPositon = 1

  position = 1
  positionState: boolean | null = null
  positionInvalidFeedback = 'Position between [' + this.firstPosition + ';' + this.lastPositon + '] is required.'

  currentId = ''

  isUpdate = false

  get updateTab (): boolean {
    return this.isUpdate
  }

  /**
   * Check if the form is valide.
   * @public
   * @returns true if the form is valid, false otherwise
   */
  checkFormValidity (): boolean {
    this.nameState = this.name.length >= 3 && this.name.length <= 50
    this.nameInvalidFeedback = 'Name with length in between [3;50] characters is required. Current ' + this.name.length + '.'

    this.positionState = this.position >= this.firstPosition && this.position <= this.lastPositon
    this.positionInvalidFeedback = 'Position between [' + this.firstPosition + ';' + this.lastPositon + '] is required.'

    return this.nameState && this.positionState
  }

  /**
   * Called when user click "Add" button.
   * @public
   */
  handleAddSubmit (): void {
    // Exit when the form isn't valid
    if (!this.checkFormValidity()) {
      return
    }

    (this.$parent as ConceptionGrid).addNewTab(this.name, this.position - 1)

    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-edit-tab')
    })
  }

  /**
   * Called when user click "Delete" button.
   * @public
   */
  handleDeleteSubmit (): void {
    if (this.currentId !== '') {
      (this.$parent as ConceptionGrid).removeTab(this.currentId)
    }

    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-edit-tab')
    })
  }

  /**
   * Called when user click "Update" button.
   * @public
   */
  handleUpdateSubmit (): void {
    // Exit when the form isn't valid
    if (!this.checkFormValidity()) {
      return
    }

    if (this.currentId !== '') {
      (this.$parent as ConceptionGrid).updateTab(this.currentId, this.name, this.position - 1)
    }

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
   * Shows the modal from the user interface in add mode.
   * @public
   */
  showAddModal (lastPositon: number): void {
    this.isUpdate = false
    this.currentId = ''
    this.name = ''
    this.nameState = null
    this.lastPositon = lastPositon + 1
    this.position = this.lastPositon
    this.positionState = null
    this.$bvModal.show('modal-edit-tab')
  }

  /**
   * Shows the modal from the user interface in update mode.
   * @public
   */
  showUpdateModal (lastPositon: number, tab: {id: string; index: number; name: string; linker: string; icon: string}): void {
    this.isUpdate = true
    this.currentId = tab.id
    this.name = tab.name
    this.nameState = null
    this.lastPositon = lastPositon
    this.position = tab.index + 1
    this.positionState = null
    this.$bvModal.show('modal-edit-tab')
  }

  get first (): number {
    return this.firstPosition
  }

  get last (): number {
    return this.lastPositon
  }
}
</script>
