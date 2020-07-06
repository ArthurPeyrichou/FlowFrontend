import { shallowMount, createLocalVue } from '@vue/test-utils'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import ToolBar from '../../src/components/tool/ToolBar.vue'
import { FDComponent } from '../../src/models/FDComponent'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(IconsPlugin)

const fakeBrutList: Array<FDComponent> = [new FDComponent('id0', 'FakeType1', 'FakeComp1', '#FFD800', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}'),
  new FDComponent('id1', 'FakeType2', 'FakeComp2', '#FF0000', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}'),
  new FDComponent('id2', 'FakeType1', 'FakeComp3', '#FFD800', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}'),
  new FDComponent('id3', 'FakeType2', 'FakeComp4', '#FF0000', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}'),
  new FDComponent('id4', 'FakeType1', 'FakeComp5', '#FFD800', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}'),
  new FDComponent('id5', '', 'FakeComp6', '#0094FF', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}')]

const fakeRefinedList = {
  FakeType1: [new FDComponent('id0', 'FakeType1', 'FakeComp1', '#FFD800', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}'),
    new FDComponent('id2', 'FakeType1', 'FakeComp3', '#FFD800', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}'),
    new FDComponent('id4', 'FakeType1', 'FakeComp5', '#FFD800', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}')],
  FakeType2: [new FDComponent('id1', 'FakeType2', 'FakeComp2', '#FF0000', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}'),
    new FDComponent('id3', 'FakeType2', 'FakeComp4', '#FF0000', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}')],
  Common: [new FDComponent('id5', '', 'FakeComp6', '#0094FF', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}')]
}

const fakeGroupList = ['Common', 'FakeType1', 'FakeType2']

describe('ToolBar.vue', () => {
  const wrapper = shallowMount(ToolBar, {
    localVue,
    propsData: {
      compBrutList: fakeBrutList
    }
  })

  it('Props check', () => {
    expect(wrapper.vm.$props.compBrutList).toEqual(fakeBrutList)
  })

  it('Datas check, components ordered by type and by name', () => {
    expect(wrapper.vm.$data.compList).toEqual(fakeRefinedList)
    expect(wrapper.vm.$data.compGroupsList).toEqual(fakeGroupList)
  })
})
