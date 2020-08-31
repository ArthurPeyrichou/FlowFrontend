<template>
  <div id="app" v-bind:class="configs.theme">
    <div class="header">
      <b-nav tabs id="main-menu" class="navbar-menu" style="height:50px">
        <b-nav-item v-bind:to="'/'" :active="currentRoute=='/'">Design Board</b-nav-item>
        <b-nav-item v-bind:to="'/blank-board'" :active="currentRoute=='/blank-board'">Blank Board</b-nav-item>
        <b-nav-item disabled>Disabled</b-nav-item>
      </b-nav>
      <b-dropdown id="auth-menu" size="lg"  variant="link" dropleft toggle-class="text-decoration-none" no-caret>
        <template v-slot:button-content>
          <i class="fas fa-cog"></i>
        </template>
        <b-dropdown-item v-on:click="openModal('group')">Group management</b-dropdown-item>
        <b-dropdown-item v-on:click="openModal('setting')">Settings</b-dropdown-item>
        <b-dropdown-item v-on:click="logoutRequest()">Logout</b-dropdown-item>
      </b-dropdown>
    </div>
    <AuthModal ref="myAuthModal" />
    <GroupManagementModal ref="myGroupManagementModal" :groupSituation="user.group" :invitations="invitations"/>
    <SettingModal ref="mySettingModal" :configs="configs"/>
    <router-view style="padding-bottom:50px" :configs="configs" ref="portal" />
  </div>
</template>

<script lang="ts">
import AuthModal from './components/modals/AuthModal.vue'
import GroupManagementModal from './components/modals/GroupManagementModal.vue'
import SettingModal from './components/modals/SettingModal.vue'
import { Component, Vue } from 'vue-property-decorator'
import * as CONFIGS from './config'
import JSEncrypt from 'jsencrypt'
import DesignBoard from './views/DesignBoard.vue'
import ConceptionGrid from './components/conception/ConceptionGrid.vue'
import { RSAService } from './services/RSAService'
import { BackendRequestFactory } from './services/BackendRequestFactory'

@Component({
  components: {
    AuthModal,
    GroupManagementModal,
    SettingModal
  }
})
export default class App extends Vue {
  // Dark or light
  public configs: {theme: string; svgGridSize: number; svgGridBorderSize: number; svgMinScale: number; svgMaxScale: number;
      svgScaleStep: number; linkFillColor: string; activeLinkFillColor: string; transferDuration: number; transferRadius: number;
      transferFillColor: string; transferStrokeColor: string; transferType: string; transferBytesPrecision: number; transferShowIO: boolean;
      outputFontSize: number; communicationType: string; dataLoadingType: string;} = {
        theme: CONFIGS.THEME,
        svgGridSize: CONFIGS.SVG_GRID_SIZE,
        svgGridBorderSize: CONFIGS.SVG_GRID_BORDER_WIDTH,
        svgMinScale: CONFIGS.SVG_MIN_SCALE,
        svgMaxScale: CONFIGS.SVG_MAX_SCALE,
        svgScaleStep: CONFIGS.SVG_SCALE_STEP,
        linkFillColor: CONFIGS.LINK_FILL_COLOR,
        activeLinkFillColor: CONFIGS.ACTIVE_LINK_FILL_COLOR,
        transferDuration: CONFIGS.TRANSFER_DURATION,
        transferRadius: CONFIGS.TRANSFER_RADIUS,
        transferFillColor: CONFIGS.TRANSFER_FILL_COLOR,
        transferStrokeColor: CONFIGS.TRANSFER_STROKE_COLOR,
        transferType: CONFIGS.TRANSFER_TYPE,
        transferBytesPrecision: CONFIGS.TRANSFER_BYTES_PRECISION,
        transferShowIO: CONFIGS.TRANSFER_SHOW_IO,
        outputFontSize: CONFIGS.OUTPUT_FONT_SIZE,
        communicationType: CONFIGS.COMMUNICATION_TYPE,
        dataLoadingType: CONFIGS.DATA_LOADING_TYPE
      }

  private connection: WebSocket | null = null
  public shouldReload = 2 // Backend send designerdata twice in short time
  private backendUrl: string | undefined = process.env.VUE_APP_BACKEND_URL
  private encryptForBackend = new RSAService('', '')
  private decryptForFrontend = new RSAService('', '')
  private dataReceiving = ''
  private user = { name: '', password: '', isLogged: false, group: { isInGroup: false, isGroupLeader: false, groupName: '' } }
  private invitations: Array<{value: string; text: string}> = []
  constructor () {
    super()
    const c = localStorage.getItem('config')
    if (c) {
      this.configs = JSON.parse(c)
    }
  }

  mounted (): void {
    this.$nextTick(function () {
      const user = localStorage.getItem('user')
      if (user) {
        this.user = JSON.parse(user)
      }

      // If the node environment is test, we populate the toolbar of fake components for tests
      if (process.env.NODE_ENV === 'test' || !this.backendUrl) {
        if (this.$refs.portal instanceof DesignBoard) {
          (this.$refs.portal as DesignBoard).sendBlankDesignerData()
        }
      } else {
        this.encryptForBackend = new RSAService('', process.env.VUE_APP_BACKEND_PUBLIC_KEY ? process.env.VUE_APP_BACKEND_PUBLIC_KEY : '')
        const temp = new JSEncrypt()
        this.decryptForFrontend = new RSAService(temp.getPrivateKey(), temp.getPublicKey())
        this.connect(3, this.backendUrl)
        if (!this.user.isLogged) {
          this.openModal('auth')
        }
      }
    })
  }

  /**
   * Connect to backend by WebSocket
   * And initialize listeners for communication
   * @param connectionTries the maximum number of connections we want tries before give up
   * @param url the backend url. Ex: ws://localhost:5001
   * @public
   */
  connect (connectionTries: number, url: string): void {
    const treatMessage = (msg: string) => {
      const res = this.decryptForFrontend.decrypt(msg)
      let data = JSON.parse('{}')
      try {
        data = JSON.parse(res)
      } catch {
        return
      }
      console.log(data)
      switch (data.type) {
        case 'auth':
          switch (data.body.state) {
            case 'login':
            case 'register':
              (this.$refs.myAuthModal as AuthModal).setResponse({ success: data.body.success, msg: data.body.msg })
              if (data.body.success) {
                this.user.isLogged = true
                localStorage.setItem('user', JSON.stringify(this.user))
              }
              break
            case 'key':
              if (this.user.isLogged) {
                this.sendMessageToBackend([BackendRequestFactory.loginUser(this.user.name, this.user.password)])
                this.user.isLogged = false
              }
              break
            case 'logout':
              localStorage.clear()
              location.reload()
              break
          }

          break
        case 'group':
          switch (data.body.state) {
            case 'create':
              if (data.body.success) {
                console.log(data.body.msg)
              } else {
                console.error(data.body.msg)
              }
              break
            case 'get':
              if (data.body.success) {
                if (data.body.msg === false) {
                  this.user.group.isInGroup = false
                  this.user.group.groupName = ''
                  this.user.group.isGroupLeader = false
                } else {
                  this.user.group.isInGroup = true
                  this.user.group.groupName = data.body.msg.groupName
                  this.user.group.isGroupLeader = data.body.msg.status === 'leader'
                }
                localStorage.setItem('user', JSON.stringify(this.user))
              }
              break
            case 'leave':
              if (data.body.success) {
                console.log(data.body.msg)
              } else {
                console.error(data.body.msg)
              }
              break
            case 'invit':
              if (data.body.success) {
                console.log(data.body.msg)
              } else {
                console.error(data.body.msg)
              }
              break
            case 'join':
              if (data.body.success) {
                console.log(data.body.msg)
              } else {
                console.error(data.body.msg)
              }
              break
            case 'decline':
              if (data.body.success) {
                console.log(data.body.msg)
              } else {
                console.error(data.body.msg)
              }
              break
            case 'invitations':
              if (data.body.success) {
                this.invitations = []
                const invits: Array<{id: string; groupName: string}> = JSON.parse(data.body.msg)
                invits.forEach(invit => {
                  this.invitations.push({ value: invit.id, text: invit.groupName })
                })
                console.log(this.invitations)
              } else {
                console.error(data.body.msg)
              }
              break
          }
          break
        case 'debug':
          if (this.$refs.portal instanceof DesignBoard) {
            (this.$refs.portal as DesignBoard).sendMessageToConsole(data)
          }
          break
        case 'designer':
          if (this.shouldReload > 0 || this.configs.communicationType === 'DIRECT') {
            if (this.$refs.portal instanceof DesignBoard) {
              (this.$refs.portal as DesignBoard).sendDesignerData(data)
            }
            --this.shouldReload
            // if too many time is spend (1.5s) before the next designer data, close the opportunnity to reload
            setTimeout(() => { this.shouldReload = 0 }, 1500)
          }
          break
        case 'error':
          (this.$refs.portal as DesignBoard).sendMessageToConsole(data)
          break
        case 'errors':
          console.error(data.type, data)
          break
        case 'online':
          console.log('Count of client connected: ' + data.body)
          break
        case 'status':
          console.log('Message type "' + data.type + '".')
          console.log(data)
          break
        case 'traffic':
          if (this.$refs.portal instanceof DesignBoard) {
            ((this.$refs.portal as DesignBoard).$children[1] as ConceptionGrid).setTraffic(data.body)
          }
          break
        default:
          console.warn('Message type "' + data.type + '" not treated.', 'Data: ' + JSON.stringify(data))
          break
      }
    }
    const giveFrontendPublicKey = () => {
      this.sendMessageToBackend([BackendRequestFactory.setUserkey(this.decryptForFrontend.getPublicKey())])
    }
    console.log('Starting connection to WebSocket Server...')
    this.connection = new WebSocket(url)
    this.connection.addEventListener('error', e => {
      // readyState === 3 is CLOSED
      if ((e.target as WebSocket).readyState === 3) {
        if (connectionTries > 0) {
          setTimeout(() => this.connect(connectionTries - 1, url), 1000)
        } else {
          console.error('Maximum number of connection trials has been reached')
        }
      } else {
        console.error('Websocket error: ' + event?.target)
      }
    })
    this.connection.onopen = function () {
      console.log('Successfully connected to the echo websocket server...')
      giveFrontendPublicKey()
    }
    this.connection.onmessage = function (event) {
      treatMessage(decodeURIComponent(event.data))
    }
  }

  logoutRequest () {
    this.sendMessageToBackend([BackendRequestFactory.logoutUser()])
  }

  /**
   * Call by a listener in addComponent.ts
   * Will send a message to backend for trigger clicked component
   * @param data
   * @public
   */
  sendMessageToBackend (data: Array<string>): void {
    if (this.connection !== null) {
      data.forEach(el => {
        if (this.connection !== null) {
          this.connection.send(this.encryptForBackend.encrypt(el))
        }
      })
    } else {
      console.log('Data received but no connection to send the message found.')
    }
  }

  setUserData (name: string, password: string): void {
    this.user.name = name
    this.user.password = password
  }

  get currentRoute () { return this.$route.path }

  /**
   * Open AUthentification modals
   * @public
   */
  openModal (modal: 'auth' | 'group' | 'setting'): void {
    switch (modal) {
      case 'auth':
        (this.$refs.myAuthModal as AuthModal).showModal()
        break
      case 'group':
        (this.$refs.myGroupManagementModal as GroupManagementModal).showModal()
        break
      case 'setting':
        (this.$refs.mySettingModal as SettingModal).showModal()
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
