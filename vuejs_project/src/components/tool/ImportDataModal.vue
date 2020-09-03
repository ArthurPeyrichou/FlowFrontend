<template>
  <div>
    <b-modal
      centered
      id="modal-import-data"
      size="lg"
      ref="modal"
      title="Import flow: "
    >

      <div v-if="submitResponse.msg !== ''" :class="'alert alert-' + (submitResponse.success ? 'success' : 'danger')" role="alert">
          {{submitResponse.msg}}
      </div>

      <div>

      </div>

      <template v-slot:modal-footer>
        <div class="w-100">
          <button id="import-data-modal-close" v-on:click="applyChange" :disabled="!canSaveChange" type="button" class="btn btn-success float-right" style="margin-left: 5px;">Save Variables</button>
          <button id="import-data-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/** Modal that allow users to import data from tabs and variables. */
@Component
export default class ImportDataModal extends Vue {
  public response: {success: boolean; msg: string} = { success: false, msg: '' }

  get submitResponse (): {success: boolean; msg: string} {
    return this.response
  }

  /**
   * @public
   */
  applyChange (): void {
    console.log('not treated')
  }

  /**
   * Hides the modal from the user interface.
   * @public
   */
  hideModal (): void {
    this.$bvModal.hide('modal-import-data')
  }

  /**
   * Shows the modal from the user interface.
   * @public
   */
  showModal (): void {
    this.$bvModal.show('modal-import-data')
    this.response = { success: false, msg: '' }
  }

  /**
   * Set response from backend
   * if succes apply change
   * if not rollback
   * @public
   */
  setResponse (response: {success: boolean; msg: string}): void {
    this.response = response
  }
}
</script>

<style scoped>

</style>
