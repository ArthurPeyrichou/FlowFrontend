<template>
  <div>
    <b-modal
      centered
      id="modal-add-component"
      size="lg"
      ref="modal"
      :title="'Upload new component'"
      @show="resetModal"
      @hidden="resetModal"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="fileState"
          label="Upload .py component:"
          label-for="file-input"
          invalid-feedback="File is required"
        >
          <b-form-file
            id="file-input"
            v-model="file"
            :state="fileState==null?null:Boolean(file)"
            accept="text/x-python"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
          ></b-form-file>
        </b-form-group>
      </form>

      <template v-slot:modal-footer>
        <div class="w-100">
          <button id="setting-modal-update" v-on:click="handleAddSubmit" type="button" class="btn btn-primary float-right" style="margin-left: 5px;" >Validate</button>
          <button id="setting-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BackendRequestFactory } from '../../services/BackendRequestFactory'
import DesignBoard from '../../views/DesignBoard.vue'

/** Modal that allow users to upload Flowdata components files into the toolbar. */
@Component
export default class AddCompModal extends Vue {
  file: null | File = null;
  fileState: null | boolean = null;

  /**
   * Check if the file is valide.
   * @public
   * @returns true if the file is valid, false otherwise
   */
  checkFormValidity (): boolean {
    this.fileState = Boolean(this.file)
    document.getElementsByClassName('invalid-feedback')[0].setAttribute('style', 'outline-color: transparent !important')
    // Extension -> this.file.name.split('.').pop()
    return this.fileState
  }

  /**
   * Called when user click 'Validate' button.
   * WARNING: empty function
   * @public
   */
  handleAddSubmit (): void {
    // Exit when the form isn't valid
    if (!this.checkFormValidity()) {
      return
    }

    if (this.file) {
      // DO SOMETHING HERE
      const fr = new FileReader()
      const fileName = this.file.name

      fr.readAsText(this.file)
      const sendFile = (fileBody: string) => {
        (this.$parent.$parent as DesignBoard).sendMessageToBackend([BackendRequestFactory.installComponent(fileName || '', fileBody)])
      }

      fr.onload = function () {
        const res = fr.result
        if (res) {
          sendFile(res.toString())
        }
      }

      console.log('upload validated.')

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-add-component')
      })
    }
  }

  /**
   * Show the modal from the user interface.
   * @public
   */
  showModal (): void {
    this.$bvModal.show('modal-add-component')
  }

  /**
   * Hides the modal from the user interface.
   * @public
   */
  hideModal (): void {
    this.$bvModal.hide('modal-add-component')
  }

  /**
   * Resets the file's input of the modal form.
   * @public
   */
  resetModal (): void {
    this.file = null
    this.fileState = null
  }
}
</script>
