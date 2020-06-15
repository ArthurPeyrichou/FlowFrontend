<template>
  <div class="tool-bar">
    <div class="header container">
      <h3>Tool bar</h3>
    </div>
    <div class="board">
      <div v-for="compGroup in compGroupsList" :key="compGroup" class="fdcomp-group-list">
        <p class="fdcomp-group-name">{{ compGroup }}</p>
        <ul class="list-group comp-list">
          <li v-for="FDComp in compList[compGroup]" :key="FDComp.getId()" class="list-group-item">
            {{ FDComp.getTitle() }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FDComponent } from '../models/FDComponent';

@Component
export default class ToolBar extends Vue {
  @Prop() private compList!: {};
  @Prop() private compGroupsList!: string[];

  constructor() {
    super();
    const list = [new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true,true,'icon','1.0','readme',false,'{}'),
                            new FDComponent("id1","FakeType2","FakeComp2", '#967ADC','autor',true,true,'icon','1.0','readme',false,'{}'),
                            new FDComponent("id2","FakeType1","FakeComp3", '#967ADC','autor',true,true,'icon','1.0','readme',false,'{}'),
                            new FDComponent("id3","FakeType2","FakeComp4", '#967ADC','autor',true,true,'icon','1.0','readme',false,'{}'),
                            new FDComponent("id4","FakeType1","FakeComp5", '#967ADC','autor',true,true,'icon','1.0','readme',false,'{}'),
                            new FDComponent("id5","","FakeComp6", '#967ADC','autor',true,true,'icon','1.0','readme',false,'{}')];
    
    this.compGroupsList = [];
    this.compList = {};

    //We read each FlowData Components, populate the compGroupsList and store them by membership group.
    list.forEach(FDComp => {
      if(this.compGroupsList.indexOf(FDComp.getGroup()) < 0){
        this.compGroupsList.push(FDComp.getGroup())
        this.compList[FDComp.getGroup()] = new Array<FDComponent>();
      }
      this.compList[FDComp.getGroup()].push(FDComp);
    });
    this.compGroupsList.sort( (a, b) => {
      if(a == 'Common') return -1;
      else if(b == 'Common') return 1;
      else return a.localeCompare(b);
    });
    console.log(this.compList)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header {
    background-color: black;
    height: 50px;
    width: 100%;
    color: white;
    padding-top: 5px;
  }
  .tool-bar {
    background-color: #404040;
    float: left;
    height: 100%;
    width: 215px;
    overflow: hidden;
  }
  .board {
    width: 100%;
    text-align: left;
  }
  .fdcomp-group-list {
    border-bottom: 1px solid darkgrey;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .fdcomp-group-name {
    font-weight: bold;
    color: white;
  }
  .comp-list {
    font-size: small;
  }
  .comp-list li{
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
