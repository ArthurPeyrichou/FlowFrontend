<template>
  <div>
    <b-modal
      centered 
      id="modal-edit-component" 
      size="lg"
      ref="modal"
      :title="'Settings: ' + fdComponent.getTitle()"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="nameState"
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <template v-slot:modal-footer>
        <div class="w-100">
          
          <button type="button" class="btn btn-outline-danger"><i class="fas fa-trash-alt"></i> Delete the Component</button>
          <button type="button" class="btn btn-primary float-right" style="margin-left: 5px;" >Apply Settings</button>
          <button v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
          
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
    import { FDComponent } from '../models/FDComponent';
    import Vue from 'vue';
    export default Vue.extend({
        name: 'CompSettingModal',
        props: ['fdComponent'],
        data() {
            return {
            name: '',
            nameState: null,
            submittedNames: []
            }
        },
        methods: {
            openModal(newFDComp) {
                this.fdComponent = newFDComp;
                this.$bvModal.show("modal-edit-component")
            },
            hideModal() {
                this.fdComponent = FDComponent.prototype;
                this.$bvModal.hide("modal-edit-component")
            },
            checkFormValidity() {
                const valid = this.$refs.form.checkValidity()
                this.nameState = valid
                return valid
            },
            resetModal() {
                this.name = ''
                this.nameState = null
            },
            handleOk(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault()
                // Trigger submit handler
                this.handleSubmit()
            },
            handleUpdateSubmit() {
                // Exit when the form isn't valid
                if (!this.checkFormValidity()) {
                    return
                }
                // Push the name to submitted names
                this.submittedNames.push(this.name)
                // Hide the modal manually
                this.$nextTick(() => {
                    this.$bvModal.hide('modal-prevent-closing')
                })
            },
            handleDeleteSubmit() {
                // Exit when the form isn't valid
                if (!this.checkFormValidity()) {
                    return
                }
                // Push the name to submitted names
                this.submittedNames.push(this.name)
                // Hide the modal manually
                this.$nextTick(() => {
                    this.$bvModal.hide('modal-prevent-closing')
                })
            }
        }
    });
</script>