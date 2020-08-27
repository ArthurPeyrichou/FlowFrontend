import { shallowMount, createLocalVue } from '@vue/test-utils'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import ConceptionGrid from '../../src/components/conception/ConceptionGrid.vue'
import * as CONFIGS from '../../src/config'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(IconsPlugin)

describe('ConceptionGrid.vue', () => {
  const wrapper = shallowMount(ConceptionGrid, {
    localVue
  })

  it('Props check', () => {
    expect(wrapper.vm.$props.configs).toEqual({
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
      communicationType: CONFIGS.COMMUNICATION_TYPE,
      dataLoadingType: CONFIGS.DATA_LOADING_TYPE
    })
  })

  it('Datas check', () => {
    expect(wrapper.vm.$data.fdCompToDrop).toEqual(undefined)
    expect(wrapper.vm.$data.idList.toString()).toEqual('')
    expect(wrapper.vm.$data.svgScale).toEqual(1)
    expect(wrapper.vm.$data.hideToolBar).toEqual(false)
    expect(wrapper.vm.$data.hideConsoleBar).toEqual(false)
  })
})
