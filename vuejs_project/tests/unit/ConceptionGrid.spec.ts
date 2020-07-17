import { shallowMount, createLocalVue } from '@vue/test-utils'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { THEME } from '../../src/config'
import ConceptionGrid from '../../src/components/conception/ConceptionGrid.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(IconsPlugin)

describe('ConceptionGrid.vue', () => {
  const wrapper = shallowMount(ConceptionGrid, {
    localVue
  })

  it('Props check', () => {
    expect(wrapper.vm.$props.theme).toEqual(THEME)
  })

  it('Datas check', () => {
    expect(wrapper.vm.$data.fdCompToDrop).toEqual(undefined)
    expect(wrapper.vm.$data.idList.toString()).toEqual('')
    expect(wrapper.vm.$data.svgScale).toEqual(1)
    expect(wrapper.vm.$data.hideToolBar).toEqual(false)
    expect(wrapper.vm.$data.hideConsoleBar).toEqual(false)
  })
})
