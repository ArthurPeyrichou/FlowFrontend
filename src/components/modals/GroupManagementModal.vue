<template>
  <div>
    <b-modal
      centered
      id="modal-group-management"
      size="lg"
      ref="modal"
      title="Group management: "
    >

    <div v-if="submitResponse.msg !== ''" :class="'alert alert-' + (submitResponse.success ? 'success' : 'danger')" role="alert">
        {{submitResponse.msg}}
    </div>

    <div v-if="theGroupSituation.isInGroup === false" class="group-option-container" style="border-bottom: 1px solid #e9ecef; margin-bottom:15px;">
      <h5>Create and join a new group:</h5>
      <form ref="form" @submit.stop.prevent="handleCreateSubmit">
        <b-form-group
          :state="groupNameState"
          label="Group name"
          label-for="new-group-name-input"
          :invalid-feedback="groupNameInvalidFeedBack"
        >
          <b-form-input
            id="new-group-name-input"
            v-model="groupName"
            :state="groupNameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <button id="group-management-modal-create" v-on:click="handleCreateSubmit" type="button" class="btn btn-outline-success float-right">Create and join</button>
    </div>

    <div v-if="theGroupSituation.isInGroup === true" class="group-option-container" style="border-bottom: 1px solid #e9ecef; margin-bottom:15px;">
      <p>Your are currently in the group: {{theGroupSituation.groupName}}</p>
      <button id="group-management-modal-leave" v-on:click="handleLeaveSubmit" type="button" class="btn btn-outline-danger float-right">Leave the group</button>
    </div>

    <div v-if="theGroupSituation.isInGroup && theGroupSituation.isGroupLeader" class="group-option-container" style="border-bottom: 1px solid #e9ecef; margin-bottom:15px;">
      <h5>Invit somebody to your group:</h5>
      <form ref="form" @submit.stop.prevent="handleCreateSubmit">
        <b-form-group
          :state="groupNameState"
          label="User name"
          label-for="new-user-name-input"
        >
          <b-form-input
            id="new-user-name-input"
            v-model="invitUserName"
            :state="invitUserNameState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <button id="group-management-modal-invit" v-on:click="handleInvitSubmit" type="button" class="btn btn-outline-success float-right">Invite</button>
    </div>

    <div v-if="invitations.length > 0" class="group-option-container">
      <h5>Join a{{(theGroupSituation.isInGroup === true) ? 'nother' : ''}} group:</h5>
       <form ref="form" @submit.stop.prevent="handleJoinSubmit">
        <b-form-group
          label="Choose a group"
          label-for="group-selector"
        >
          <b-form-select id="group-selector" v-model="selectedGroup" :options="invitations"></b-form-select>
        </b-form-group>
      </form>
      <button id="group-management-modal-join" v-on:click="handleJoinSubmit" type="button" class="btn btn-success float-right">Join</button>
      <button id="group-management-modal-decline" v-on:click="handleDeclineSubmit" type="button" class="btn btn-danger float-right">Decline</button>
    </div>
    <div v-else class="group-option-container">
      <h5>You don't have any invitation yet</h5>
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import App from '../../App.vue'
import { BackendRequestFactory } from '../../services/BackendRequestFactory'

/** Modal that allow users to login a new account. */
@Component
export default class GroupManagementModal extends Vue {
  @Prop({ default: { isInGroup: false, isGroupLeader: false, groupName: '' } }) groupSituation!: { isInGroup: boolean; isGroupLeader: boolean; groupName: string };
  @Prop({ default: [] }) invitations!: Array<{value: string; text: string}>;

  groupName = ''
  groupNameState: boolean | null = null
  groupNameInvalidFeedBack = ''
  invitUserName = ''
  invitUserNameState: boolean | null = null
  selectedGroup = ''
  response: {success: boolean; msg: string} = { success: false, msg: '' }

  get submitResponse (): {success: boolean; msg: string} {
    return this.response
  }

  get theGroupSituation (): { isInGroup: boolean; isGroupLeader: boolean; groupName: string } {
    return this.groupSituation
  }

  /**
   * @public
   */
  handleCreateSubmit (): void {
    this.groupNameState = this.groupName.length >= 3
    if (!this.groupNameState) {
      this.groupNameInvalidFeedBack = 'Group name lenght should be greater than 2 characters.'
      return
    }
    (this.$parent as App).sendMessageToBackend([BackendRequestFactory.createGroup(this.groupName)])
  }

  /**
   * @public
   */
  handleJoinSubmit (): void {
    if (this.groupSituation.isInGroup) {
      return
    }
    (this.$parent as App).sendMessageToBackend([BackendRequestFactory.joinGroup(this.selectedGroup)])
  }

  /**
   * @public
   */
  handleDeclineSubmit (): void {
    (this.$parent as App).sendMessageToBackend([BackendRequestFactory.declineGroup(this.selectedGroup)])
  }

  /**
   * @public
   */
  handleLeaveSubmit (): void {
    (this.$parent as App).sendMessageToBackend([BackendRequestFactory.leaveGroup(this.groupSituation.groupName)])
  }

  /**
   * @public
   */
  handleInvitSubmit (): void {
    (this.$parent as App).sendMessageToBackend([BackendRequestFactory.inviteUserToGroup(this.invitUserName)])
  }

  /**
   * Hides the modal from the user interface.
   * @public
   */
  hideModal (): void {
    this.$bvModal.hide('modal-group-management')
  }

  /**
   * Init groupName and invitUserName
   * Then shows the modal from the user interface.
   * @public
   */
  showModal (): void {
    this.groupName = ''
    this.groupNameState = null
    this.groupNameInvalidFeedBack = ''
    this.invitUserName = ''
    this.invitUserNameState = null
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
