import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import ToolBar from '@/components/ToolBar.vue'
import { FDComponent } from '../../src/models/FDComponent';

describe('ToolBar.vue', () => {
  it('should create', () => {
    // restitue le composant
   const wrapper = shallowMount(ToolBar, {
    propsData: {
      compBrutList: [new FDComponent("id0","FakeType1","FakeComp1", '#FFD800','autor',true,true,'icon','1.0','readme',false,'{}'),
      new FDComponent("id1","FakeType2","FakeComp2", '#FF0000','autor',true,true,'icon','1.0','readme',false,'{}'),
      new FDComponent("id2","FakeType1","FakeComp3", '#FFD800','autor',true,true,'icon','1.0','readme',false,'{}'),
      new FDComponent("id3","FakeType2","FakeComp4", '#FF0000','autor',true,true,'icon','1.0','readme',false,'{}'),
      new FDComponent("id4","FakeType1","FakeComp5", '#FFD800','autor',true,true,'icon','1.0','readme',false,'{}'),
      new FDComponent("id5","","FakeComp6", '#0094FF','autor',true,true,'icon','1.0','readme',false,'{}')]
    }});
 });
})
