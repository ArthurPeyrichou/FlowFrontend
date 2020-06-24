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
      @ok="handleOk"
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

<script>
  import Vue from 'vue';
  export default Vue.extend({
    name: 'AddCompModal',
    props: [],
    data() {
      return {
        file: null,
        fileState: null
      }
    },
    methods: {
      openModal() {
        this.$bvModal.show("modal-add-component")
      },
      hideModal() {
        this.$bvModal.hide("modal-add-component")
      },
      checkFormValidity() {
        this.fileState = Boolean(this.file);
        //Extension -> this.file.name.split('.').pop()
        return this.fileState
      },
      resetModal() {
        this.file = null
        this.fileState = null
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()
      },
      handleAddSubmit() {
        console.log(this.checkFormValidity())
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
            return
        }

        //DO SOMETHING HERE
        console.log("upload validated.")

        // Hide the modal manually
        this.$nextTick(() => {
            this.$bvModal.hide('modal-add-component')
        })
      }
    }
  });
</script>