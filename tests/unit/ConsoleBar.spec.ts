import { shallowMount, createLocalVue } from '@vue/test-utils'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import ConsoleBar from '../../src/components/console/ConsoleBar.vue'
import * as CONFIGS from '../../src/config'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(IconsPlugin)

describe('ConsoleBar.vue', () => {
  const wrapper = shallowMount(ConsoleBar, {
    localVue
  })

  it('Props check', () => {
    expect(wrapper.vm.$props.configs).toEqual({
      outputFontSize: CONFIGS.OUTPUT_FONT_SIZE
    })
  })
})
