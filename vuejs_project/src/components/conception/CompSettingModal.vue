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
          
          <button id="setting-modal-delete" v-on:click="handleDeleteSubmit" type="button" class="btn btn-outline-danger"><i class="fas fa-trash-alt"></i> Delete the Component</button>
          <button id="setting-modal-update" v-on:click="handleUpdateSubmit" type="button" class="btn btn-primary float-right" style="margin-left: 5px;" >Apply Settings</button>
          <button id="setting-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
          
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { FDComponent } from '../../models/FDComponent';

  /** Modal that allow users to update and delete Flowdata components from the #conception-grid-svg. */
  @Component
  export default class CompSettingModal extends Vue {
    
    /** The Flowdata component that the user can update or remove from the #conception-grid-svg. */
    @Prop({default: null}) fdComponent!: FDComponent | null;
    /** Method which come from parent ComceptionGrid vue. Used for deleting the current component. */
    @Prop({default: () => { console.log("Not implemented!") }}) deleteTheComp!: Function;

    name = '';
    nameState: boolean | null = null;
    
    /**
     * Check if the form is valide.
     * @public
     * @returns true if the form is valid, false otherwise
     */
    checkFormValidity(): boolean {
      const valid = false;
      this.nameState = valid
      return valid
    }

    /**
     * Called when user click "Delete the Component" button.
     * Remove the component from the #conception-grid-svg.
     * Uses deleteTheComp() from parent ComceptionGrid vue.
     * @public
     */
    handleDeleteSubmit(): void {
      this.deleteTheComp(this.fdComponent);
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
    handleUpdateSubmit(): void {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
          return
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
    hideModal(): void {
      this.$bvModal.hide("modal-edit-component")
    }

    /**
     * Resets the name's input of the modal form.
     * @public
     */
    resetModal(): void {
      this.name = ''
      this.nameState = null
    }

  }
</script>