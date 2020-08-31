import { shallowMount, createLocalVue } from '@vue/test-utils'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import ToolBar from '../../src/components/tool/ToolBar.vue'
import * as CONFIGS from '../../src/config'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(IconsPlugin)

describe('ToolBar.vue', () => {
  const wrapper = shallowMount(ToolBar)

  it('Props check', () => {
    expect(wrapper.vm.$props.configs).toEqual({
      theme: CONFIGS.THEME,
      communicationType: CONFIGS.COMMUNICATION_TYPE
    })
  })
})
