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
            accept=".df"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
          ></b-form-file>
        </b-form-group>
      </form>

      <div v-if="notes !== ''" class="data-import-container">
          <h6>Notes:</h6>
          <textarea id="data-import-content" class="container" :value="notes" disabled>
          </textarea>
      </div>

      <template v-slot:modal-footer>
        <div class="w-100">
          <button id="import-data-modal-close" v-on:click="handleSubmit" type="button" class="btn btn-success float-right" style="margin-left: 5px;">Import data</button>
          <button id="import-data-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-danger float-right">Close</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ConceptionGrid from '../conception/ConceptionGrid.vue'
import { FDElement } from '../../models/FDElement'
import VariableManagementModal from './VariableManagementModal.vue'
import DesignBoard from '../../views/DesignBoard.vue'

/** Modal that allow users to import data from tabs and variables. */
@Component
export default class ImportDataModal extends Vue {
  public response: {success: boolean; msg: string} = { success: false, msg: '' }
  file: null | File = null
  fileState: null | boolean = null
  notes = ''

  get submitResponse (): {success: boolean; msg: string} {
    return this.response
  }

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
   * @public
   */
  handleSubmit (): void {
    // Exit when the form isn't valid
    if (!this.checkFormValidity()) {
      return
    }

    if (this.file) {
      // DO SOMETHING HERE
      const fr = new FileReader()

      try {
        fr.readAsText(this.file)
        const sendFile = (fileBody: string) => {
          try {
            const importedData: {created: ''; variables: ''; notes: ''; components: Array<FDElement>; tabs: Array<{id: string; index: number; name: string; linker: string; icon: string}>} = JSON.parse(fileBody)
            this.notes = 'Created: ' + importedData.created + '\n\n' + importedData.notes;

            // (this.$parent.$parent as DesignBoard).importTabs(importedData.tabs);
            (this.$parent.$parent.$refs.myConceptionGrid as ConceptionGrid).importTabs(importedData.tabs)

            const components: Array<FDElement> = []
            importedData.components.forEach(comp => components.push(FDElement.fromStruct(comp)));
            (this.$parent.$parent.$refs.myConceptionGrid as ConceptionGrid).importGraphsElements(components);
            (this.$parent.$parent as DesignBoard).importDataBaseElements(components);

            (this.$parent.$refs.myVariableManagementModal as VariableManagementModal).variables = this.fusionVariables(importedData.variables, (this.$parent.$refs.myVariableManagementModal as VariableManagementModal).variables);
            (this.$parent.$refs.myVariableManagementModal as VariableManagementModal).applyChange()
          } catch (error) {
            console.log(error)
            this.response = { success: false, msg: 'An error occured while treating data.' }
          }
        }

        fr.onload = function () {
          const res = fr.result
          if (res) {
            sendFile(res.toString())
          }
        }
      } catch (error) {
        this.response = { success: false, msg: 'An error occured while reading file.' }
      }
    }
  }

  /**
   * Will join existing variables and imported variables
   * If a imported varirable already exist in existing variables, it will replace it
   * @public
   */
  fusionVariables (vImp: string, vExist: string): string {
    const jsonVImp = VariableManagementModal.stringToVariableList(vImp)
    const jsonVExist = VariableManagementModal.stringToVariableList(vExist)
    const conflict: any = {}
    Object.keys(jsonVImp).forEach(key => {
      if (jsonVExist[key]) {
        conflict['import-' + key] = jsonVImp[key]
      } else {
        jsonVExist[key] = jsonVImp[key]
      }
    })

    let res = ''
    Object.keys(jsonVExist).forEach(key => {
      if (res.length > 0) {
        res += '\n'
      }
      res += key + ' : ' + jsonVExist[key]
    })

    const clonflictKeys = Object.keys(conflict)
    if (clonflictKeys.length > 0) {
      res += '\n\n'
      clonflictKeys.forEach(key => {
        if (res.length > 0) {
          res += '\n'
        }
        res += key + ' : ' + conflict[key]
      })
    }
    return res
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
    this.notes = ''
    this.file = null
    this.fileState = null
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
  #data-import-content {
    min-height: 200px;
  }
</style>
