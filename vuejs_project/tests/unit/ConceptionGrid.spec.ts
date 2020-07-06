import { shallowMount, createLocalVue } from '@vue/test-utils'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import ConceptionGrid from '../../src/components/conception/ConceptionGrid.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(IconsPlugin)

describe('ConceptionGrid.vue', () => {
  const wrapper = shallowMount(ConceptionGrid, {
    localVue
  })

  it('Datas check', () => {
    expect(wrapper.vm.$data.fdCompToDrop).toEqual(undefined)
    expect(wrapper.vm.$data.currentFDComp.compId).toEqual('')
    expect(wrapper.vm.$data.componentList.toString()).toEqual('')
    expect(wrapper.vm.$data.idList.toString()).toEqual('')
    expect(wrapper.vm.$data.svgScale).toEqual(1)
    expect(wrapper.vm.$data.hideToolBar).toEqual(false)
    expect(wrapper.vm.$data.hideConsoleBar).toEqual(false)
  })
})
