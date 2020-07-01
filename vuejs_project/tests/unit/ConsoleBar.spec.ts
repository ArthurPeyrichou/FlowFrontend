import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import ConsoleBar from '@/components/console/ConsoleBar.vue'

describe('ConsoleBar.vue', () => {
  it('should create', () => {
   const wrapper = shallowMount(ConsoleBar)

   it('Props check', () => {
    expect(wrapper.vm.$props.theme).equal("dark");
  })
 });
})
