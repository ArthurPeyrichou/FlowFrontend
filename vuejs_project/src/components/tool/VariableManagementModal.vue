<template>
  <div>
    <b-modal
      centered
      id="modal-variable-management"
      size="lg"
      ref="modal"
      title="Variable management: "
    >

      <div v-if="submitResponse.msg !== ''" :class="'alert alert-' + (submitResponse.success ? 'success' : 'danger')" role="alert">
          {{submitResponse.msg}}
      </div>

      <div>
        <div>
          <div class="variables-label">Global Variables:</div>
          <textarea id="variables-input" class="variables-container" v-model="variables"></textarea>
        </div>
        <div>
          <strong>Example:</strong>
          <pre class="variablesexample variables-container">
              <i>// Comments can be used too</i>
              key1                                  : <b>A string value</b>
              key2                                  : <b>A string value</b>

              <i>// Keys can contain own data types</i>
              my-custom-object-raw      <span>(Object)</span>    : <b>{ name: 'Total.js', date: new Date() }</b>
              my-custom-object-json     <span>(JSON)</span>      : <b>{ "name": "Total.js" }</b>
              my-custom-number          <span>(number)</span>    : <b>320.34</b>
              my-custom-boolean         <span>(boolean)</span>   : <b>true</b>
              my-custom-date            <span>(date)</span>      : <b>2016-07-26</b>
              my-custom-array           <span>(array)</span>     : <b>[1, 2, 3, 4]</b>
              binds-environment-value   <span>(env)</span>       : <b>process.env</b>
              binds-config-value        <span>(config)</span>    : <b>name</b>
          </pre>
        </div>
      </div>

      <template v-slot:modal-footer>
        <div class="w-100">
          <button id="variable-management-modal-close" v-on:click="applyChange" :disabled="!canSaveChange" type="button" class="btn btn-success float-right" style="margin-left: 5px;">Save Variables</button>
          <button id="variable-management-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BackendRequestFactory } from '../../services/BackendRequestFactory'
import DesignBoard from '../../views/DesignBoard.vue'

/** Modal that allow users to manage variables. */
@Component
export default class VariableManagementModal extends Vue {
  public response: {success: boolean; msg: string} = { success: false, msg: '' }
  variables = ''
  variablesVerif = ''

  get submitResponse (): {success: boolean; msg: string} {
    return this.response
  }

  /**
   * @public
   */
  applyChange (): void {
    (this.$parent.$parent as DesignBoard).sendMessageToBackend([BackendRequestFactory.savedVariables(this.variables)])
  }

  /**
   * Hides the modal from the user interface.
   * @public
   */
  hideModal (): void {
    this.$bvModal.hide('modal-variable-management')
  }

  /**
   * Shows the modal from the user interface.
   * @public
   */
  showModal (): void {
    this.$bvModal.show('modal-variable-management')
    this.response = { success: false, msg: '' }
  }

  /**
   * Set Variables
   * @public
   */
  setVariables (variables: string): void {
    this.variables = variables
    this.variablesVerif = variables
    console.log(VariableManagementModal.stringToVariableList(this.variables))
  }

  /**
   * Set response from backend
   * if succes apply change
   * if not rollback
   * @public
   */
  setResponse (response: {success: boolean; msg: string}): void {
    this.response = response
    if (this.response.success) {
      this.variablesVerif = this.variables
      setTimeout(() => { this.hideModal() }, 1500)
    } else {
      this.variables = this.variablesVerif
    }
  }

  get canSaveChange (): boolean {
    return this.variables !== this.variablesVerif
  }

  static stringToVariableList (s: string): any {
    const res: any = {}
    let state: 'varName' | 'varValue' = 'varName'
    let lastVarName = ''
    let lastVarValue = ''
    let isInQuote = false
    for (let i = 0; i < s.length; ++i) {
      switch (s.charAt(i)) {
        case '\'':
          isInQuote = !isInQuote
          break
        case ':':
          if (!isInQuote) {
            state = 'varValue'
            lastVarValue = ''
          }
          break
        case '\n':
          if (!isInQuote) {
            res[lastVarName] = lastVarValue
            state = 'varName'
            lastVarName = ''
          }
          break
        default:
          if (isInQuote || (!isInQuote && s.charAt(i) !== ' ' && s.charAt(i) !== '\t')) {
            if (state === 'varName') {
              lastVarName += s.charAt(i)
            } else {
              lastVarValue += s.charAt(i)
            }
          }
          break
      }
    }
    res[lastVarName] = lastVarValue
    return res
  }
}
</script>

<style scoped>
  .variables-container {
    font-size: 12px;
    font-family: monospace;
    color: black;
    line-height: 16px;
  }
  .variablesexample {
    background-color: #F0F0F0;
    border-radius: 3px;
    padding: 15px;
  }
  #variables-input {
    width: 100%;
    height: 250px;
    overflow: auto;
  }
</style>
