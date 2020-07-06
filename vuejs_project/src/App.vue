<template>
  <div id="app" v-bind:class="theme">
    <b-nav tabs class="navbar-menu">
      <b-nav-item v-bind:to="'/'" :active="currentRoute=='/'">Design Board</b-nav-item>
      <b-nav-item v-bind:to="'/blank-board'" :active="currentRoute=='/blank-board'">Blank Board</b-nav-item>
      <b-nav-item disabled>Disabled</b-nav-item>
    </b-nav>
    <router-view style="" :theme="theme"/>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  // Dark or light
  private theme = 'dark';

  get currentRoute () { return this.$route.path }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .unselectable-text {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
  }
  .navbar-menu {
    width: 100%;
    padding-top: 10px !important;
    padding-bottom: 0px !important;
    padding-left: 50px !important;
    padding-right: 50px !important;
    background-color: #e8e8e8;
    border-color:  rgba(0, 0, 0, 0.3) !important;
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

  /* CSS mobile tablette ici */
  @media (max-width: 450px) {
    .navbar-menu {
      width: 100%;
      padding-left: 5% !important;
      padding-right: 5% !important;
    }
    .navbar-menu .nav-item {
      width: 100%;
    }
  }
</style>
