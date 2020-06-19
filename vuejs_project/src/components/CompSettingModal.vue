<template>
  <div>
    <b-modal
      centered 
      id="modal-edit-component" 
      size="lg"
      ref="modal"
      :title="'Settings: ' + fdComponent.component.getTitle()"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <!--form ref="form" @submit.stop.prevent="handleSubmit">
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
      </form-->
      <template v-slot:modal-footer>
        <div class="w-100">
          
          <button v-on:click="handleDeleteSubmit" type="button" class="btn btn-outline-danger"><i class="fas fa-trash-alt"></i> Delete the Component</button>
          <button v-on:click="handleUpdateSubmit" type="button" class="btn btn-primary float-right" style="margin-left: 5px;" >Apply Settings</button>
          <button v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
          
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
    import Vue from 'vue';
    export default Vue.extend({
        name: 'CompSettingModal',
        props: ['fdComponent', 'deleteTheComp'],
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
                    this.$bvModal.hide('modal-edit-component')
                })
            },
            handleDeleteSubmit() {
                this.deleteTheComp(this.fdComponent);
                // Hide the modal manually
                this.$nextTick(() => {
                    this.$bvModal.hide('modal-edit-component')
                })
            }
        }
    });
</script>