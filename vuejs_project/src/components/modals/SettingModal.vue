<template>
  <div>
    <b-modal
      centered
      id="modal-setting"
      size="lg"
      ref="modal"
      title="Settings: "
    >
    <div id="setting-modal-inputs" v-if="configs != null">
      <div class="setting-group">
        <h6>Themes</h6>
        <b-form-group label="Choose a theme" label-for="theme-selector">
          <b-form-select id="theme-selector"
            v-model="configs.theme" :options="themesOptions"></b-form-select>
        </b-form-group>
      </div>

      <div class="setting-group">
        <h6>Grid Parameters</h6>
        <b-form-group label="svg's grid size" label-for="svg-grid-size-input">
          <b-form-input
            id="svg-grid-size-input" type="number" min="0" step="5000" max="100000"
            v-model="configs.svgGridSize"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="svg's grid border size" label-for="svg-grid-border-size-input">
          <b-form-input
            id="svg-grid-border-size-input" type="number" min="0" step="10" max="100"
            v-model="configs.svgGridBorderSize"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="svg's min scale" label-for="svg-min-scale-input">
          <b-form-input
            id="svg-min-scale-input" type="number" min="0.1" step="0.1" max="1"
            v-model="configs.svgMinScale"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="svg's max scale" label-for="svg-max-scale-input">
          <b-form-input
            id="svg-max-scale-input" type="number" min="1" step="0.1" max="10"
            v-model="configs.svgMaxScale"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="svg's scale step" label-for="svg-scale-step-input">
          <b-form-input
            id="svg-scale-step-input" type="number" min="0.1" step="0.1" max="1"
            v-model="configs.svgScaleStep"
          ></b-form-input>
        </b-form-group>

      </div>

      <div class="setting-group">
        <h6>Link Rendering</h6>

        <b-form-group label="Link fill color" label-for="link-fill-color-input">
          <b-form-input
            id="link-fill-color-input" type="text"
            v-model="configs.linkFillColor"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Active link fill color" label-for="active-link-fill-color-input">
          <b-form-input
            id="active-link-fill-color-input" type="text"
            v-model="configs.activeLinkFillColor"
          ></b-form-input>
        </b-form-group>
      </div>

      <div class="setting-group">
        <h6>Data Transfer</h6>

        <b-form-group label="Transfert type" label-for="transfer-type-input">
          <b-form-select id="transfer-type-input"
            v-model="configs.transferType" :options="transferTypeOptions"></b-form-select>
        </b-form-group>

        <b-form-group v-if="configs.transferType === 'CIRCLE'" label="Circle transfert radius" label-for="transfer-radius-input">
          <b-form-input
            id="transfer-radius-input" type="number" min="0" step="1"  max="5"
            v-model="configs.transferRadius"
          ></b-form-input>
        </b-form-group>

        <b-form-group v-if="configs.transferType === 'CIRCLE'" label="Circle transfert stroke color" label-for="transfer-stroke-color-input">
          <b-form-input
            id="transfer-stroke-color-input" type="text"
            v-model="configs.transferStrokeColor"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Transfert color" label-for="transfer-color-input">
          <b-form-input
            id="transfer-color-input" type="text"
            v-model="configs.transferFillColor"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Transfer animation duration" label-for="transfer-duration-input">
          <b-form-input
            id="transfer-duration-input" type="number" min="100" step="100" max="10000"
            v-model="configs.transferDuration"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Transfer show IO bytes" label-for="transfer-shiow-io-input">
          <b-form-checkbox
            id="transfer-shiow-io-input"
            v-model="configs.transferShowIO"
          ></b-form-checkbox>
        </b-form-group>

        <b-form-group label="Transfer bytes precision" label-for="transfer-bytes-precision-input">
          <b-form-input
            id="transfer-bytes-precision-input" type="number" min="0" step="1"  max="10"
            v-model="configs.transferBytesPrecision"
          ></b-form-input>
        </b-form-group>
      </div>

      <div class="setting-group">
        <h6>Console Parameters</h6>
        <b-form-group label="Console's logs font size" label-for="output-font-size-input">
          <b-form-input
            id="output-font-size-input" type="number" min="8" step="1" max="16"
            v-model="configs.outputFontSize"
          ></b-form-input>
        </b-form-group>
      </div>

      <div class="setting-group">
        <h6>Communication Parameters</h6>

        <b-form-group label="Communication type" label-for="communication-type-input">
          <b-form-select id="communication-type-input"
            v-model="configs.communicationType" :options="communicationTypeOptions"></b-form-select>
        </b-form-group>

        <b-form-group label="Data loading type" label-for="data-loading-type-input">
          <b-form-select id="data-loading-type-input"
            v-model="configs.dataLoadingType" :options="dataLoadingTypeOptions"></b-form-select>
        </b-form-group>
      </div>
    </div>
      <template v-slot:modal-footer>
        <div class="w-100">
          <button id="tab-setting-modal-add" v-on:click="applyChange" type="button" class="btn btn-primary float-right" style="margin-left: 5px;" >Apply change</button>
          <button id="setting-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

/** Modal that allow users to login a new account. */
@Component
export default class GroupManagementModal extends Vue {
  themesOptions: Array<{value: string; text: string}> = [
    { value: 'dark', text: 'Dark' },
    { value: 'light', text: 'Light' },
    { value: 'custom', text: 'Custom' }]

  transferTypeOptions: Array<{value: string; text: string}> = [
    { value: 'PATH', text: 'Path' },
    { value: 'CIRCLE', text: 'Circle' }]

  communicationTypeOptions: Array<{value: string; text: string}> = [
    { value: 'DIRECT', text: 'Saves changes on each changes.' },
    { value: 'ON_APPLY', text: 'Save changes on click on "Apply" button.' }]

  dataLoadingTypeOptions: Array<{value: string; text: string}> = [
    { value: 'ALL_AT_ONCE', text: 'Loads all projects in many svg.' },
    { value: 'ON_CHANGE_TAB', text: 'Load current project only and reload on switching of tab.' }]

  @Prop({ default: null }) public configs!: null | {theme: string; svgGridSize: number; svgGridBorderSize: number; svgMinScale: number; svgMaxScale: number;
      svgScaleStep: number; linkFillColor: string; activeLinkFillColor: string; transferDuration: number; transferRadius: number;
      transferFillColor: string; transferStrokeColor: string; transferType: string; transferBytesPrecision: number; transferShowIO: boolean;
      outputFontSize: number; communicationType: string; dataLoadingType: string;};

  applyChange (): void {
    localStorage.setItem('config', JSON.stringify(this.configs))
    this.hideModal()
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

<style scoped>
  #setting-modal-inputs {
    height: 400px;
    overflow: auto;
  }
  .setting-group {
    padding-top: 10px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .dark .setting-group {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
</style>
