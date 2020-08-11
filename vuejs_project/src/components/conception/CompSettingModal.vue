<template>
  <div>
    <b-modal
      centered
      id="modal-edit-component"
      size="lg"
      ref="modal"
      :title="'Settings: ' + theName"
    >
      <form ref="form" @submit.stop.prevent="handleUpdateSubmit">
        <b-form-group
          :state="nameState"
          label="Name"
          label-for="name-input"
          :invalid-feedback="nameInvalidFeedback"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Color"
          label-for="setting-modal-color-picker-button"
        >
          <div class="color-picker-container" v-bind:hidden="hideColorPicker">
            <Sketch class="color-picker" v-model="colors" :preset-colors="[ defaultColor ]"/>
            <Compact class="color-picker" v-model="colors"/>
          </div>
          <div class="color-picker-bg" v-bind:hidden="hideColorPicker" v-on:click="hideColorPicker = true" ></div>

          <button id="setting-modal-color-picker-button" v-on:click="hideColorPicker = !hideColorPicker" type="button" class="btn color-picker-button" v-bind:value="theColor">
            <i class="fa fa-circle" :style="'border: 1px black solid; border-radius: 50%; color:' + theColor"></i> Choose
          </button>
        </b-form-group>
      </form>

      <template v-slot:modal-footer>
        <div class="w-100">
          <button id="setting-modal-delete" v-on:click="handleDeleteSubmit" type="button" class="btn btn-outline-danger"><i class="fas fa-trash-alt"></i> Delete the Component</button>
          <button id="setting-modal-update" v-on:click="handleUpdateSubmit" type="button" class="btn btn-primary float-right" style="margin-left: 5px;" >Apply Settings</button>
          <button id="setting-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { FDElement } from '../../models/FDElement'
import { Sketch, Compact } from 'vue-color'

/** Modal that allow users to update and delete Flowdata components from the #conception-grid-svg. */
@Component({
  components: {
    Sketch,
    Compact
  }
})
export default class CompSettingModal extends Vue {
  /** The Flowdata component that the user can update or remove from the #conception-grid-svg. */
  fdElement: FDElement | null = null;
  /** Method which come from parent ComceptionGrid vue. Used for deleting the current component. */
  @Prop({ default: () => { console.log('Not implemented!') } }) deleteTheComp!: Function
  /** Method which come from parent ComceptionGrid vue. Used for updating the current component. */
  @Prop({ default: () => { console.log('Not implemented!') } }) updateCurrentComponent!: Function

  name = ''
  nameState: boolean | null = null
  colors: {hex8: string} = { hex8: '' }
  defaultColor = ''
  hideColorPicker = true
  nameInvalidFeedback = 'Name with length in between [3;50] characters is required.'

  /**
   * Check if the form is valide.
   * @public
   * @returns true if the form is valid, false otherwise
   */
  checkFormValidity (): boolean {
    if (this.fdElement !== null) {
      this.nameState = this.name.length >= 3 && this.name.length <= 50
      this.nameInvalidFeedback = 'Name with length [3;50] is required. Current ' + this.name.length + '.'
      const valid = this.nameState
      return valid
    }
    return false
  }

  /**
   * Called when user click "Delete the Component" button.
   * Remove the component from the #conception-grid-svg.
   * Uses deleteTheComp() from parent ComceptionGrid vue.
   * @public
   */
  handleDeleteSubmit (): void {
    if (this.fdElement !== null) {
      this.deleteTheComp(this.fdElement.getId())
    }
    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-edit-component')
    })
  }

  /**
   * Called when user click "Apply Settings" button.
   * WARNING: empty function
   * @public
   */
  handleUpdateSubmit (): void {
    // Exit when the form isn't valid
    if (!this.checkFormValidity()) {
      return
    }
    if (this.fdElement !== null) {
      if (this.colors.hex8 === '') {
        this.colors.hex8 = this.fdElement.getColor()
      }
      this.updateCurrentComponent(this.fdElement, this.name, this.colors.hex8)
    }
    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-edit-component')
    })
  }

  /**
   * Hides the modal from the user interface.
   * @public
   */
  hideModal (): void {
    this.$bvModal.hide('modal-edit-component')
  }

  /**
   * Init name and color for the modal
   * Then shows the modal from the user interface.
   * @public
   */
  showModal (theFDElement: FDElement): void {
    this.fdElement = theFDElement
    this.colors = { hex8: theFDElement.getColor() }
    this.defaultColor = theFDElement.getColor()
    this.name = theFDElement.getName()
    this.nameState = null
    this.hideColorPicker = true
    this.$bvModal.show('modal-edit-component')
  }

  get theColor (): string {
    const button = document.getElementsByClassName('color-picker-button')[0]
    if (button && button.children[0]) {
      button.children[0].setAttribute('style', 'color: ' + this.colors.hex8)
    }
    return this.colors.hex8
  }

  get theName (): string {
    return this.fdElement ? this.fdElement.getName() : ''
  }
}
</script>

<style scoped>
  .color-picker-container {
    position: fixed;
    background-color: white;
    border: 1px black solid;
    border-radius: 10px;
    width: 80%;
    min-width: 200px;
    max-width: 500px;
    left: 0;
    margin-left: 10%;
    top: 25%;
    display: block;
    z-index: 101;
    padding:  10px 5px 10px 5px;
  }
  .color-picker {
    width: auto;
    box-shadow: none;
  }
  .color-picker-bg {
    position: fixed;
    width:200%;
    height:200%;
    background: black;
    opacity:0.7;
    z-index: 100;
    transform: translate(-50%, -50%);
  }
  .color-picker-button {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    border: 1px lightgrey solid;
  }

</style>
