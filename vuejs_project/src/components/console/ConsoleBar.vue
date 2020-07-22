<template>
  <div id="console-bar" v-bind:class="theme">
    <div class="header container">
      <h3>Console</h3>
    </div>
    <div class="console-output container">
      <p v-for="(log, index) in outputLogs" :key="index" :style="fontSize" v-html="toHtml(log)">
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { OUTPUT_FONT_SIZE } from '../../config'

/** Gives an user interface that will allow texts output and flowdata monitoring. (NOT IMPLEMENTED YET) */
@Component
export default class ConsoleBar extends Vue {
  @Prop({ default: 'dark' }) public theme!: string;

  logs: Array<{from: string; time: string; text: string; color: string}> = []

  /**
   * Add a new log got from backend into the console output
   * @public
   */
  addLog (from: string, log: string, color: string): void {
    const when: Date = new Date(Date.now())
    let newText = log
    while (newText.indexOf('\n') >= 0) {
      newText = newText.replace('\n', '<br/>')
    }
    this.logs.push({ from: from, text: newText, color: color, time: this.toYearMonthDay(when) })
  }

  /**
   * Return the font size of the console's output logs
   * @returns all logs that the console actually contains
   * @public
   */
  get outputLogs (): Array<{from: string; time: string; text: string; color: string}> {
    return this.logs
  }

  /**
   * Return the font size of the console's output logs
   * @public
   */
  get fontSize (): string {
    return 'font-size: ' + OUTPUT_FONT_SIZE + 'px;'
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
    padding-top: 5px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
  .console-output {
    padding-top: 25px;
    padding-bottom: 25px;
    padding-left: 10px;
    padding-right: 10px;
    height: 100%;
    overflow: auto;
    word-wrap: break-word;
    text-align: left;
  }

  .console-output p {
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  /* Dark side */
  .dark#console-bar {
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
</style>
