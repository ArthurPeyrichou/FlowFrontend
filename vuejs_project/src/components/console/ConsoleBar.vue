<template>
  <div id="console-bar">
    <div class="header">
      <div class="header-content">
        <b-nav tabs class="navbar-menu">
          <b-nav-item v-on:click="setCurrentTab('debug')" :active="activeTab === 'debug'">Outputs ({{outputDebugCount}})</b-nav-item>
          <b-nav-item v-on:click="setCurrentTab('errors')" :active="activeTab === 'errors'">Errors ({{outputErrorsCount}})</b-nav-item>
          <b-nav-item v-on:click="setCurrentTab('infos')" :active="activeTab === 'infos'">Infos ({{outputInfosCount}})</b-nav-item>
        </b-nav>
      </div>
    </div>
    <div class="console-output">
      <div class="console-output-btn">
        <button class="btn btn-outline-danger" v-on:click="deleteLogs()">Delete logs</button>
      </div>
      <div class="console-output-list">
        <template v-if="activeTab === 'debug'">
          <p v-for="(log, index) in outputDebugLogs" :key="index" :style="fontSize" v-html="toHtml(log)" v-on:click="selectALog(log.fromId)"></p>
        </template>
        <template v-if="activeTab === 'errors'">
          <p v-for="(log, index) in outputErrorsLogs" :key="index" :style="fontSize" v-html="toHtml(log)"></p>
        </template>
        <template v-if="activeTab === 'infos'">
          <p v-for="(log, index) in outputInfosLogs" :key="index" :style="fontSize" v-html="toHtml(log)"></p>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as d3 from 'd3'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { OUTPUT_FONT_SIZE } from '../../config'

/** Gives an user interface that will allow texts output and flowdata monitoring. (NOT IMPLEMENTED YET) */
@Component
export default class ConsoleBar extends Vue {
  @Prop({ default: null }) public configs!: null | {theme: string; svgGridSize: number; svgGridBorderSize: number; svgMinScale: number; svgMaxScale: number;
      svgScaleStep: number; linkFillColor: string; activeLinkFillColor: string; transferDuration: number; transferRadius: number;
      transferFillColor: string; transferStrokeColor: string; transferType: string; transferBytesPrecision: number; transferShowIO: boolean;
      outputFontSize: number; communicationType: string; dataLoadingType: string;};

  debuglogs: Array<{from: string; fromId: string; time: string; text: string; color: string}> = []
  errorslogs: Array<{from: string; fromId: string; time: string; text: string; color: string}> = []
  infoslogs: Array<{from: string; fromId: string; time: string; text: string; color: string}> = []
  currentTab: 'debug' | 'errors' | 'infos' = 'debug'

  get activeTab (): string {
    return this.currentTab
  }

  /**
   * Add a new log got from backend into the console output
   * @public
   */
  addLog (type: string, from: string, fromId: string, log: string, color: string): void {
    const when: Date = new Date(Date.now())
    let newText = log
    while (newText.indexOf('\n') >= 0) {
      newText = newText.replace('\n', '<br/>')
    }
    switch (type) {
      case 'debug':
        this.debuglogs.push({ from: from, fromId: fromId, text: newText, color: color, time: this.toYearMonthDay(when) })
        break
      case 'error':
      case 'errors':
        this.errorslogs.push({ from: from, fromId: fromId, text: newText, color: color, time: this.toYearMonthDay(when) })
        break
      case 'infos':
        this.infoslogs.push({ from: from, fromId: fromId, text: newText, color: color, time: this.toYearMonthDay(when) })
        break
      default:
        console.warn('Unknown log for console')
        break
    }
  }

  /**
   * Delete all logs link to the current tab
   * @public
   */
  deleteLogs (): void {
    switch (this.currentTab) {
      case 'debug':
        this.debuglogs = new Array<{from: string; fromId: string; time: string; text: string; color: string}>()
        break
      case 'errors':
        this.errorslogs = new Array<{from: string; fromId: string; time: string; text: string; color: string}>()
        break
      case 'infos':
        this.infoslogs = new Array<{from: string; fromId: string; time: string; text: string; color: string}>()
        break
    }
  }

  get outputDebugCount (): number {
    return this.debuglogs.length
  }

  get outputErrorsCount (): number {
    return this.errorslogs.length
  }

  get outputInfosCount (): number {
    return this.infoslogs.length
  }

  /**
   * Return the font size of the console's output debug logs
   * @returns all logs that the console actually contains
   * @public
   */
  get outputDebugLogs (): Array<{from: string; fromId: string; time: string; text: string; color: string}> {
    return this.debuglogs
  }

  /**
   * Return the font size of the console's output errors logs
   * @returns all logs that the console actually contains
   * @public
   */
  get outputErrorsLogs (): Array<{from: string; fromId: string; time: string; text: string; color: string}> {
    return this.errorslogs
  }

  /**
   * Return the font size of the console's output infos logs
   * @returns all logs that the console actually contains
   * @public
   */
  get outputInfosLogs (): Array<{from: string; fromId: string; time: string; text: string; color: string}> {
    return this.infoslogs
  }

  /**
   * Return the font size of the console's output logs
   * @public
   */
  get fontSize (): string {
    return 'font-size: ' + (this.configs !== null ? this.configs.outputFontSize : OUTPUT_FONT_SIZE) + 'px;'
  }

  /**
   * Set the current console's tab ('debug', 'errors' or 'infos')
   * Will actualise the console panel
   * @public
   */
  setCurrentTab (str: 'debug' | 'errors' | 'infos'): void {
    this.currentTab = str
  }

  selectALog (fromId: string): void {
    if (fromId !== '') {
      console.log(fromId)
      d3.select('#rect-' + fromId).attr('stroke', 'white').attr('stroke-width', '3')
      const rect = document.getElementById('rect-' + fromId)
      if (rect) {
        rect.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      }
      setTimeout(() => d3.select('#rect-' + fromId).attr('stroke', 'black').attr('stroke-width', '1'), 1000)
    }
  }

  /**
   * Formats a log for console output
   * @param when the date we want to format
   * @returns html text
   * @public
   */
  toHtml (log: {from: string; time: string; text: string; color: string}): string {
    return '<i class="fa fa-circle" style="width: 12px; border: black; color: ' + log.color + '"></i> ' + log.from + ' ~ ' + log.time +
      '<br/>' + log.text
  }

  /**
   * Converts a Date into string
   * @param when the date we want to format
   * @returns yyyy-mm-dd hh:mm:ss
   * @public
   */
  toYearMonthDay (when: Date): string {
    return when.getFullYear() + '-' + String(when.getMonth() + 1).padStart(2, '0') + '-' + when.getDate() + ' ' + when.getHours() + ':' + when.getMinutes() + ':' + when.getSeconds()
  }

  /**
   * Converts a Date into string
   * @param when the date we want to format
   * @returns dd/mm/yyyy hh:mm:ss
   * @public
   */
  toDayMonthYear (when: Date): string {
    return when.getDate() + '/' + String(when.getMonth() + 1).padStart(2, '0') + '/' + when.getFullYear() + ' ' + when.getHours() + ':' + when.getMinutes() + ':' + when.getSeconds()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #console-bar {
    background-color: #c8c8c8;
    float: right;
    height: 100%;
    overflow: hidden;
    width: 460px;
    padding-bottom: 50px;
  }
  #console-bar {
    margin-right: 0px;
    -webkit-transition: .4s;
    transition: .4s;
  }
  #console-bar.hide{
    margin-right: -460px;
    -webkit-transition: .4s;
    transition: .4s;
  }
  .header {
    background-color: #b8b8b8;
    height: 50px;
    width: 100%;
    max-width: 100%;
    display: flex;
    overflow: hidden;
  }
  .header-content {
    width: 100%;
    padding-left: 35px;
    padding-right: 35px;
    min-height: 50px;
  }
  .navbar-menu {
    background-color: #b8b8b8;
  }
  .navbar-menu .nav-item .active {
    background-color: #c8c8c8 !important;
    border-color:  rgba(0, 0, 0, 0.3) !important;
  }
  .navbar-menu .nav-item a {
    color: #2c3e50 !important;
  }
  .nav-tabs {
    border-bottom: none;
  }
  .console-output {
    height: 100%;
    word-wrap: break-word;
    text-align: left;
  }
  .console-output-list {
    height: 100%;
    padding-top: 65px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: -60px;
    overflow: auto;
  }
  .console-output-list p {
    cursor: pointer;
  }
  .console-output-btn {
    width: 440px;
    position: absolute;
    background-color: #c8c8c8;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .console-output-btn button {
    height: 40px;
  }

  .console-output p {
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  /* Dark side */
  .dark #console-bar {
    background-color: #202020;
  }
  .dark .header {
    background-color: #101010;
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark .console-output {
    color: #c8c8c8;
  }
  .dark .console-output p {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .dark .console-output-btn {
    background-color: #202020;
  }
  .dark .navbar-menu {
    background-color: #101010 !important;
    color: #c8c8c8;
    border-color:  rgba(255, 255, 255, 0.3) !important;
  }
  .dark .navbar-menu .nav-item .active {
    background-color: #202020 !important;
    color: white !important;
    border-color:  rgba(255, 255, 255, 0.3) !important;
  }
  .dark .navbar-menu .nav-item a:hover {
    border-color:  rgba(255, 255, 255, 0.3) !important;
  }
  .dark .navbar-menu .nav-item a {
    color: white !important;
  }
</style>
