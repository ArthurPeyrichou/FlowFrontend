<template>
  <div id="app" v-bind:class="theme">
    <div class="header">
      <b-nav tabs id="main-menu" class="navbar-menu" style="height:50px">
        <b-nav-item v-bind:to="'/'" :active="currentRoute=='/'">Design Board</b-nav-item>
        <b-nav-item v-bind:to="'/blank-board'" :active="currentRoute=='/blank-board'">Blank Board</b-nav-item>
        <b-nav-item disabled>Disabled</b-nav-item>
      </b-nav>
      <b-dropdown id="auth-menu" size="lg"  variant="link" dropleft toggle-class="text-decoration-none" no-caret>
        <template v-slot:button-content>
          <i class="fas fa-sign-in-alt"></i>
        </template>
        <b-dropdown-item v-on:click="openModal('register')">Register</b-dropdown-item>
        <b-dropdown-item v-on:click="openModal('login')">Login</b-dropdown-item>
        <b-dropdown-item v-on:click="openModal('group')">Group management</b-dropdown-item>
      </b-dropdown>
    </div>
    <RegisterModal ref="myRegisterModal" />
    <LoginModal ref="myLoginModal" />
    <GroupManagementModal ref="myGroupManagementModal" />
    <router-view style="padding-bottom:50px" :theme="theme"/>
  </div>
</template>

<script lang="ts">
import RegisterModal from './components/auth/RegisterModal.vue'
import LoginModal from './components/auth/LoginModal.vue'
import GroupManagementModal from './components/auth/GroupManagementModal.vue'
import { Component, Vue } from 'vue-property-decorator'
import { THEME } from './config'

@Component({
  components: {
    RegisterModal,
    LoginModal,
    GroupManagementModal
  }
})
export default class App extends Vue {
  // Dark or light
  private theme = THEME;

  get currentRoute () { return this.$route.path }

  openModal (modal: 'register' | 'login' | 'group'): void {
    switch (modal) {
      case 'register':
        (this.$refs.myRegisterModal as RegisterModal).showModal()
        break
      case 'login':
        (this.$refs.myLoginModal as LoginModal).showModal()
        break
      case 'group':
        (this.$refs.myGroupManagementModal as GroupManagementModal).showModal()
        break
    }
  }
}
</script>

<style>
  @import './assets/style.css';
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .header {
    width: 100%;
    display: flex;
    background-color: #e8e8e8;
  }

  .unselectable-text {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
  }
  .navbar-menu {
    background-color: #e8e8e8;
    border-color:  rgba(0, 0, 0, 0.3) !important;
    padding-top: 10px !important;
    padding-bottom: 0px !important;
  }
  #main-menu {
    width: 90%;
    padding-left: 50px !important;
    padding-right: 50px !important;
  }
  #auth-menu button {
    box-shadow: none;
  }
  #auth-menu svg {
    color: black;
  }
  #auth-menu {
    width: 10%;
    padding-right: 50px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }
  .navbar-menu .nav-item .active {
    background-color: #b8b8b8 !important;
    border-color:  rgba(0, 0, 0, 0.3) !important;
  }
  .navbar-menu .nav-item a {
    border-bottom: none;
    color: #2c3e50 !important;
  }

  /* Dark side */
  .dark .header {
    background-color: #404040;
    color: #c8c8c8;
  }
  .dark .navbar-menu {
    background-color: #404040;
    color: #c8c8c8;
    border-color:  rgba(255, 255, 255, 0.3) !important;
  }
  .dark .navbar-menu .nav-item .active {
    background-color: #101010 !important;
    color: white !important;
    border-color:  rgba(255, 255, 255, 0.3) !important;
  }
  .dark .navbar-menu .nav-item a:hover {
    border-color:  rgba(255, 255, 255, 0.3) !important;
  }
  .dark .navbar-menu .nav-item a {
    color: white !important;
  }
  .dark #auth-menu {
    border-color:  rgba(255, 255, 255, 0.3) !important;
  }
  .dark #auth-menu svg {
    color: white;
  }

  /* CSS mobile tablette ici */
  @media (max-width: 450px) {
    #main-menu {
      width: 85%;
      padding-left: 5% !important;
      padding-right: 5% !important;
    }
    #auth-menu {
      width: 15%;
      padding-right: 5% !important;
    }
    .navbar-menu .nav-item {
      width: 100%;
    }
  }
</style>
