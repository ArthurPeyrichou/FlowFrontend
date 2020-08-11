<template>
  <div>
    <b-modal
      centered
      id="modal-group-management"
      size="lg"
      ref="modal"
      title="Group management: "
    >
    <div v-if="groupSituation.isInGroup === false" class="group-option-container" style="border-bottom: 1px solid #e9ecef; margin-bottom:15px;">
      <h5>Create and join a new group:</h5>
      <form ref="form" @submit.stop.prevent="handleCreateSubmit">
        <b-form-group
          :state="nameState"
          label="Group name"
          label-for="new-group-name-input"
        >
          <b-form-input
            id="new-group-name-input"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <button id="group-management-modal-login" v-on:click="handleCreateSubmit" type="button" class="btn btn-outline-success float-right">Create and join</button>
    </div>

    <div v-if="groupSituation.isInGroup === true" class="group-option-container" style="border-bottom: 1px solid #e9ecef; margin-bottom:15px;">
      <p>Your are currently in the group: {{groupSituation.groupName}}</p>
      <button id="group-management-modal-login" v-on:click="handleLeaveSubmit" type="button" class="btn btn-outline-danger float-right">Leave the group</button>
    </div>

    <div v-if="groupList.length > 0" class="group-option-container">
      <h5>Join a{{(groupSituation.isInGroup === true) ? 'nother' : ''}} group:</h5>
       <form ref="form" @submit.stop.prevent="handleJoinSubmit">
        <b-form-group
          :state="nameState"
          label="Choose a group"
          label-for="group-selector"
        >
          <b-form-select id="group-selector" v-model="selectedGroup" :options="groupList"></b-form-select>
        </b-form-group>
      </form>
      <button id="group-management-modal-login" v-on:click="handleJoinSubmit" type="button" class="btn btn-primary float-right">Join</button>
    </div>

      <template v-slot:modal-footer>
        <div class="w-100">
          <button id="group-management-modal-close" v-on:click="hideModal" type="button" class="btn btn-outline-primary float-right">Close</button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DesignBoard from '../../views/DesignBoard.vue'
import { BackendRequestFactory } from '../../services/BackendRequestFactory'

/** Modal that allow users to login a new account. */
@Component
export default class GroupManagementModal extends Vue {
  name = ''
  nameState: boolean | null = null
  password = ''
  passwordState: boolean | null = null
  groupSituation: { isInGroup: boolean; groupName: string } = { isInGroup: false, groupName: '' }
  groupList: Array<string> = ['group1', 'group2']
  selectedGroup = ''

  /**
   * Called when user click "Apply Settings" button.
   * WARNING: empty function
   * @public
   */
  handleCreateSubmit (): void {
    (this.$parent as DesignBoard).sendMessageToBackend([BackendRequestFactory.createGroup(this.name)]);
    (this.$parent as DesignBoard).sendMessageToBackend([BackendRequestFactory.joinGroup(this.name)])

    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-group-management')
    })
  }

  handleJoinSubmit (): void {
    (this.$parent as DesignBoard).sendMessageToBackend([BackendRequestFactory.joinGroup(this.selectedGroup)])

    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-group-management')
    })
  }

  handleLeaveSubmit (): void {
    (this.$parent as DesignBoard).sendMessageToBackend([BackendRequestFactory.leaveGroup(this.groupSituation.groupName)])

    // Hide the modal manually
    this.$nextTick(() => {
      this.$bvModal.hide('modal-group-management')
    })
  }

  /**
   * Hides the modal from the user interface.
   * @public
   */
  hideModal (): void {
    this.$bvModal.hide('modal-group-management')
  }

  /**
   * Init name and passwords
   * Then shows the modal from the user interface.
   * @public
   */
  showModal (): void {
    this.name = ''
    this.nameState = null
    this.password = ''
    this.passwordState = null
    this.$bvModal.show('modal-group-management')
  }
}
</script>

<style scoped>
  .group-option-container {
    display: grid;
  }
  .group-option-container button {
    max-width: 150px;
    margin-left: 5%;
    margin-bottom:15px;
  }
</style>
