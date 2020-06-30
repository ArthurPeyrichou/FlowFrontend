import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import ConceptionGrid from '@/components/conception/ConceptionGrid.vue'

const wrapper = shallowMount(ConceptionGrid)

describe('ConceptionGrid.vue', () => {

  it('Datas check', () => {
    expect(wrapper.vm.$data.fdCompToDrop).equal(undefined);
    expect(wrapper.vm.$data.currentFDComp.compId).equal("");
    expect(wrapper.vm.$data.componentList.toString()).equal("");
    expect(wrapper.vm.$data.idList.toString()).equal("");
    expect(wrapper.vm.$data.svgScale).equal(1);
    expect(wrapper.vm.$data.hideToolBar).equal(false);
    expect(wrapper.vm.$data.hideConsoleBar).equal(false);
  })

})
