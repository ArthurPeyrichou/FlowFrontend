<template>
  <div>
    <b-modal
      centered
      id="modal-export-data"
      size="lg"
      ref="modal"
      title="Export flow: "
    >
    <div style="max-height:600px; overflow:auto;">
        <div v-if="submitResponse.msg !== ''" :class="'alert alert-' + (submitResponse.success ? 'success' : 'danger')" role="alert">
            {{submitResponse.msg}}
        </div>

        <div class="data-export-container">
          <h6>Select tabs:</h6>
          <b-navbar id="tab-export-list" toggleable type="light tabs-export-list">
            <b-navbar-toggle target="tabs-export-option-navbar-toggle-collapse">
              <template v-slot:default="{ expanded }">
                {{ exportTabsText }}
                <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
                <b-icon v-else icon="chevron-bar-down"></b-icon>
              </template>
            </b-navbar-toggle>

            <b-collapse id="tabs-export-option-navbar-toggle-collapse" is-nav>
              <b-navbar-nav class="ml-auto">
                <p v-for="tab in exportTabs" :key="tab.id" class="tabs-checkbox">
                <b-form-checkbox
                  :id="tab.id + '-input'"
                  v-model="tab.selected"
                ></b-form-checkbox> {{ tab.name }}
                </p>
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </div>

        <div class="data-export-container">
          <h6>Notes:</h6>
          <textarea id="data-export-notes-content" class="container" v-model="notes">
          </textarea>
        </div>

        <div class="data-export-container">
          <b-form-group label="Choose an export type" label-for="export-type-selector">
            <b-form-select id="export-type-selector"
              v-model="selectedExportType" :options="exportTypeOptions"></b-form-select>
          </b-form-group>
        </div>

        <div class="data-export-container">
          <h6>Data:</h6>
          <textarea id="data-export-content" class="container" :value="result" disabled>
          </textarea>
        </div>
      </div>

      <template v-slot:modal-footer>
        <div class="w-100">
          <button id="export-data-modal-close" v-on:click="handleSubmit" type="button" class="btn btn-success float-right" style="margin-left: 5px;">Export data</button>
          <button id="export-data-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-danger float-right">Close</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { FDElement } from '../../models/FDElement'
import VariableManagementModal from './VariableManagementModal.vue'
import ConceptionGrid from '../conception/ConceptionGrid.vue'

/** Modal that allow users to export data from tabs and variables. */
@Component
export default class ExportDataModal extends Vue {
  public response: {success: boolean; msg: string} = { success: false, msg: '' }

  tabsSelection = new Array<string>()
  shouldExportVariables = true
  resultToExport = ''

  tabs: Array<{id: string; index: number; name: string; linker: string; icon: string; selected: true}> = []
  tabsSelected: Array<{id: string; index: number; name: string; linker: string; icon: string}> = []
  components: Array<FDElement> = []
  variables = ''
  notes = ''

  exportTypeOptions = [{ value: 'minijson', text: 'Minified JSON' }, { value: 'json', text: 'Structured JSON' }]
  selectedExportType = 'minijson'

  setComponents (compMap: Map<string, Array<FDElement>>): void {
    this.components = []
    this.tabs.forEach(tab => {
      const list = compMap.get(tab.id)
      if (list !== undefined) {
        list.forEach(comp => this.components.push(comp))
      }
    })
  }

  setTabs (tabs: Array<{id: string; index: number; name: string; linker: string; icon: string}>): void {
    this.tabs = []
    this.tabsSelected = tabs
    tabs.forEach(el => this.tabs.push({ id: el.id, index: el.index, name: el.name, linker: el.linker, icon: el.icon, selected: true }))
  }

  setVariables (variables: string): void {
    this.variables = variables
  }

  get submitResponse (): {success: boolean; msg: string} {
    return this.response
  }

  get exportTabs (): Array<{id: string; index: number; name: string; linker: string; icon: string; selected: true}> {
    return this.tabs
  }

  get exportTabsText (): string {
    let res = ''
    let count = 0
    this.tabsSelection = []
    this.tabs.forEach(el => {
      if (el.selected) {
        this.tabsSelection.push(el.id)
        ++count
        if (res.length > 0) { res += ', ' }
        res += el.name
      }
    })
    if (count === this.tabs.length) {
      res = 'All tabs'
    }
    return res
  }

  get result (): string {
    switch (this.selectedExportType) {
      case 'minijson':
        return this.getDataToExport()
      case 'json':
        return this.jsonToBigJson(this.getDataToExport())
      default:
        return ''
    }
  }

  private getDataToExport (): string {
    const structure: any = { tabs: this.tabsSelected.filter(el => this.tabsSelection.includes(el.id)), components: 'to_complete', notes: this.notes, created: new Date() }
    if (this.shouldExportVariables) {
      structure.variables = this.variables
    }
    const res = JSON.stringify(structure)
    let components = '['
    this.components.forEach(el => {
      if (this.tabsSelection.includes(el.getTabId())) {
        if (components.length > 1) {
          components += ','
        }
        components += el.toString()
      }
    })
    components += ']'
    console.log(res)
    return res.replace('"to_complete"', components)
  }

  private jsonToBigJson (s: string): string {
    let res = ''
    let braceCount = 0
    let isInDblQuote = false
    for (let i = 0; i < s.length; ++i) {
      switch (s.charAt(i)) {
        case '[':
        case '{':
          res += s.charAt(i)
          if (!isInDblQuote) {
            ++braceCount
            if ((i + 1) < s.length && !((s.charAt(i) === '[' && s.charAt(i + 1) === ']') || (s.charAt(i) === '{' && s.charAt(i + 1) === '}'))) {
              res += '\n'
              for (let j = 0; j < braceCount; ++j) { res += '\t' }
            }
          }
          break
        case ']':
        case '}':
          if (!isInDblQuote) {
            --braceCount
            if ((i - 1) >= 0 && !((s.charAt(i - 1) === '[' && s.charAt(i) === ']') || (s.charAt(i - 1) === '{' && s.charAt(i) === '}'))) {
              res += '\n'
              for (let j = 0; j < braceCount; ++j) { res += '\t' }
            }
          }
          res += s.charAt(i)
          break
        case ':':
          res += ':'
          if (!isInDblQuote) {
            if (res.charAt(res.length - 2) === '"') { res += ' ' }
          }
          break
        case ',':
          res += ','
          if (!isInDblQuote) {
            res += '\n'
            for (let j = 0; j < braceCount; ++j) { res += '\t' }
          }
          break
        case '"':
          if ((i - 1) >= 0 && s.charAt(i - 1) !== '\\') {
            isInDblQuote = !isInDblQuote
          }
          res += '"'
          break
        default :
          res += s.charAt(i)
          break
      }
    }
    return res
  }

  /**
   * @public
   */
  handleSubmit (): void {
    try {
      const a = document.createElement('a')
      const blob = new Blob([this.result], { type: 'octet/stream' })
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = 'export-dataflow.df'
      a.target = '_blank'
      a.click()
      window.URL.revokeObjectURL(url)
      this.response = { success: true, msg: 'Data exported successfully.' }
    } catch (error) {
      this.response = { success: false, msg: error }
    }
  }

  /**
   * Hides the modal from the user interface.
   * @public
   */
  hideModal (): void {
    this.$bvModal.hide('modal-export-data')
  }

  /**
   * Shows the modal from the user interface.
   * @public
   */
  showModal (): void {
    this.$bvModal.show('modal-export-data')
    this.response = { success: false, msg: '' }
    this.notes = ''
    this.setVariables((this.$parent.$refs.myVariableManagementModal as VariableManagementModal).variables)
    this.setTabs((this.$parent.$parent.$children[1] as ConceptionGrid).tabs)
    this.setComponents((this.$parent.$parent.$children[1] as ConceptionGrid).graphs)
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
  #tab-export-list {
    border: 1px lightgrey solid;
    border-radius: 5px;
  }
  .tabs-export-list ul {
    border-top: 1px lightgrey solid;
  }
  .tabs-export-list, .tabs-export-list button {
    width: 100%;
    text-align: left;
    outline: none;
    border: none;
  }
  .tabs-export-list svg {
    float: right;
  }
  .tabs-checkbox {
    display: flex;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 5px;
    margin-right: 5px;
  }
  .data-export-container {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  #data-export-content, #data-export-notes-content {
    width: 100%;
    height: 250px;
    overflow: auto;
    border: 1px lightgrey solid;
    border-radius: 5px;
  }
</style>
