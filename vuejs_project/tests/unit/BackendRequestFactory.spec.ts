import { FDComponent } from '../../src/models/FDComponent'
import { FDElement } from '../../src/models/FDElement'
import { BackendRequestFactory } from '../../src/models/BackendRequestFactory'

describe('BackendRequestFactory Model', () => {
  it('Empty request', () => {
    const backendRF = new BackendRequestFactory()

    const res = backendRF.apply()
    expect(res.length).toEqual(1)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'tabs', tabs: [] }] }))
  })

  it('Add new tab request', () => {
    const backendRF = new BackendRequestFactory()

    const newTab = { id: '123456789', index: 0, name: 'Main', linker: 'main', icon: 'nothing' }
    backendRF.setTabs([newTab], [])

    const res = backendRF.apply()
    expect(res.length).toEqual(1)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'tabs', tabs: [newTab] }] }))
  })

  it('Add new element request', () => {
    const backendRF = new BackendRequestFactory()

    const newTab = { id: '123456789', index: 0, name: 'Main', linker: 'main', icon: 'nothing' }
    backendRF.setTabs([newTab], [])

    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, newTab.id, 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    backendRF.addElementIntoGrid(fdElement.getFDComponent(), [fdElement.getX(), fdElement.getY()], fdElement.getTabId(), fdElement.getId())

    const res = backendRF.apply()
    expect(res.length).toEqual(1)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'add', com: { component: fdComp.getId(), state: { text: '', color: '' }, x: fdElement.getX(), y: fdElement.getY(), tab: newTab.id, connections: {}, id: fdElement.getId(), disabledio: { input: [], output: [] } } }, { type: 'tabs', tabs: [newTab] }] }))
  })

  it('Add new link on new element request', () => {
    const backendRF = new BackendRequestFactory()

    const newTab = { id: '123456789', index: 0, name: 'Main', linker: 'main', icon: 'nothing' }
    backendRF.setTabs([newTab], [])

    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, newTab.id, 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    backendRF.addElementIntoGrid(fdElement.getFDComponent(), [fdElement.getX(), fdElement.getY()], fdElement.getTabId(), fdElement.getId())

    fdElement.addLink(0, { index: 0, id: 'id1' })
    fdElement.addLink(0, { index: 0, id: 'id2' })
    fdElement.addLink(1, { index: 1, id: 'id2' })
    backendRF.setALink(fdElement)

    const res = backendRF.apply()
    expect(res.length).toEqual(1)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'add', com: { component: fdComp.getId(), state: { text: '', color: '' }, x: fdElement.getX(), y: fdElement.getY(), tab: newTab.id, connections: { 0: [{ index: 0, id: 'id1' }, { index: 0, id: 'id2' }], 1: [{ index: 1, id: 'id2' }] }, id: fdElement.getId(), disabledio: { input: [], output: [] } } }, { type: 'tabs', tabs: [newTab] }] }))
  })

  it('Add new link on new element request, then remove', () => {
    const backendRF = new BackendRequestFactory()

    const newTab = { id: '123456789', index: 0, name: 'Main', linker: 'main', icon: 'nothing' }
    backendRF.setTabs([newTab], [])

    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, newTab.id, 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    backendRF.addElementIntoGrid(fdElement.getFDComponent(), [fdElement.getX(), fdElement.getY()], fdElement.getTabId(), fdElement.getId())

    fdElement.addLink(0, { index: 0, id: 'id1' })
    fdElement.addLink(0, { index: 0, id: 'id2' })
    fdElement.addLink(1, { index: 1, id: 'id2' })
    fdElement.removeLink(0, { index: 0, id: 'id2' })
    backendRF.setALink(fdElement)

    const res = backendRF.apply()
    expect(res.length).toEqual(1)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'add', com: { component: fdComp.getId(), state: { text: '', color: '' }, x: fdElement.getX(), y: fdElement.getY(), tab: newTab.id, connections: { 0: [{ index: 0, id: 'id1' }], 1: [{ index: 1, id: 'id2' }] }, id: fdElement.getId(), disabledio: { input: [], output: [] } } }, { type: 'tabs', tabs: [newTab] }] }))
  })

  it('Add new link on existing element request', () => {
    const backendRF = new BackendRequestFactory()

    const newTab = { id: '123456789', index: 0, name: 'Main', linker: 'main', icon: 'nothing' }
    backendRF.setTabs([newTab], [])

    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, newTab.id, 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))

    fdElement.addLink(0, { index: 0, id: 'id1' })
    fdElement.addLink(0, { index: 0, id: 'id2' })
    fdElement.addLink(1, { index: 1, id: 'id2' })
    backendRF.setALink(fdElement)

    const res = backendRF.apply()
    expect(res.length).toEqual(1)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'conn', id: fdElement.getId(), conn: { 0: [{ index: 0, id: 'id1' }, { index: 0, id: 'id2' }], 1: [{ index: 1, id: 'id2' }] } }, { type: 'tabs', tabs: [newTab] }] }))
  })

  it('Add new link on existing element request, then remove', () => {
    const backendRF = new BackendRequestFactory()

    const newTab = { id: '123456789', index: 0, name: 'Main', linker: 'main', icon: 'nothing' }
    backendRF.setTabs([newTab], [])

    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, newTab.id, 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))

    fdElement.addLink(0, { index: 0, id: 'id1' })
    fdElement.addLink(0, { index: 0, id: 'id2' })
    fdElement.addLink(1, { index: 1, id: 'id2' })
    fdElement.removeLink(0, { index: 0, id: 'id2' })
    backendRF.setALink(fdElement)

    fdElement.removeLink(1, { index: 1, id: 'id2' })
    backendRF.setALink(fdElement)

    const res = backendRF.apply()
    expect(res.length).toEqual(1)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'conn', id: fdElement.getId(), conn: { 0: [{ index: 0, id: 'id1' }] } }, { type: 'tabs', tabs: [newTab] }] }))
  })

  it('Add new element and moove request', () => {
    const backendRF = new BackendRequestFactory()

    const newTab = { id: '123456789', index: 0, name: 'Main', linker: 'main', icon: 'nothing' }
    backendRF.setTabs([newTab], [])

    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, newTab.id, 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    backendRF.addElementIntoGrid(fdElement.getFDComponent(), [fdElement.getX(), fdElement.getY()], fdElement.getTabId(), fdElement.getId())
    backendRF.mooveElementFromGrid(fdElement.getId(), [123, 123])
    backendRF.mooveElementFromGrid(fdElement.getId(), [345, 456])
    const res = backendRF.apply()
    expect(res.length).toEqual(1)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'add', com: { component: fdComp.getId(), state: { text: '', color: '' }, x: fdElement.getX(), y: fdElement.getY(), tab: newTab.id, connections: {}, id: fdElement.getId(), disabledio: { input: [], output: [] } } }, { type: 'mov', com: { id: fdElement.getId(), x: 345, y: 456 } }, { type: 'tabs', tabs: [newTab] }] }))
  })

  it('Add new element, moove and update request', () => {
    const backendRF = new BackendRequestFactory()

    const newTab = { id: '123456789', index: 0, name: 'Main', linker: 'main', icon: 'nothing' }
    backendRF.setTabs([newTab], [])

    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, newTab.id, 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    backendRF.addElementIntoGrid(fdElement.getFDComponent(), [fdElement.getX(), fdElement.getY()], fdElement.getTabId(), fdElement.getId())
    backendRF.mooveElementFromGrid(fdElement.getId(), [345, 456])
    fdElement.setColor('#8C8C8C')
    fdElement.setName('New name')
    backendRF.updateElementFromGrid(fdElement)

    fdElement.setColor('#101010')
    fdElement.setName('New name')
    backendRF.updateElementFromGrid(fdElement)

    const res = backendRF.apply()
    expect(res.length).toEqual(3)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'add', com: { component: fdComp.getId(), state: { text: '', color: '' }, x: fdElement.getX(), y: fdElement.getY(), tab: newTab.id, connections: {}, id: fdElement.getId(), disabledio: { input: [], output: [] } } }, { type: 'mov', com: { id: fdElement.getId(), x: 345, y: 456 } }, { type: 'tabs', tabs: [newTab] }] }))
    expect(res[1]).toEqual(JSON.stringify({ target: fdElement.getId(), type: 'options', body: { comname: fdElement.getName(), comcolor: fdElement.getColor(), comnotes: fdElement.getNotes() } }))
    expect(res[2]).toEqual(JSON.stringify({ type: 'apply', body: [] }))
  })

  it('Add new element, moove, update, set links and remove request', () => {
    const backendRF = new BackendRequestFactory()

    const newTab = { id: '123456789', index: 0, name: 'Main', linker: 'main', icon: 'nothing' }
    backendRF.setTabs([newTab], [])

    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', 2, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, newTab.id, 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    const fdElement2 = new FDElement('id1', fdComp, newTab.id, 'aName', '#967ADC', 456, 588, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    backendRF.addElementIntoGrid(fdElement.getFDComponent(), [fdElement.getX(), fdElement.getY()], fdElement.getTabId(), fdElement.getId())
    backendRF.mooveElementFromGrid(fdElement.getId(), [123, 123])
    fdElement.addLink(0, { index: 0, id: 'id2' })
    fdElement.addLink(0, { index: 0, id: 'id3' })
    fdElement.addLink(1, { index: 1, id: 'id3' })
    fdElement2.addLink(0, { index: 1, id: 'id2' })
    fdElement2.addLink(1, { index: 0, id: 'id1' })
    fdElement2.addLink(1, { index: 1, id: 'id1' })

    fdElement.setColor('#8C8C8C')
    fdElement.setName('New name')
    backendRF.updateElementFromGrid(fdElement)

    backendRF.setALink(fdElement)
    backendRF.setALink(fdElement2)

    backendRF.removeElementFromGrid(fdElement.getId())
    backendRF.removeElementFromGrid(fdElement2.getId())
    const res = backendRF.apply()
    expect(res.length).toEqual(1)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'rem', id: fdElement2.getId() }, { type: 'tabs', tabs: [newTab] }] }))
  })

  it('Remove an element request', () => {
    const backendRF = new BackendRequestFactory()

    const newTab = { id: '123456789', index: 0, name: 'Main', linker: 'main', icon: 'nothing' }
    backendRF.setTabs([newTab], [])

    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, newTab.id, 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    backendRF.removeElementFromGrid(fdElement.getId())
    const res = backendRF.apply()
    expect(res.length).toEqual(1)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'rem', id: fdElement.getId() }, { type: 'tabs', tabs: [newTab] }] }))
  })

  it('Remove tab request', () => {
    const backendRF = new BackendRequestFactory()

    const newTab = { id: '123456789', index: 0, name: 'Main', linker: 'main', icon: 'nothing' }
    const newTab2 = { id: '456456456', index: 1, name: 'Main2', linker: 'main2', icon: 'nothing' }
    backendRF.setTabs([newTab, newTab2], [])

    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, newTab2.id, 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    const fdElement2 = new FDElement('id1', fdComp, newTab2.id, 'aName', '#967ADC', 456, 588, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    backendRF.addElementIntoGrid(fdElement.getFDComponent(), [fdElement.getX(), fdElement.getY()], fdElement.getTabId(), fdElement.getId())
    backendRF.setTabs([newTab], [fdElement, fdElement2])
    const res = backendRF.apply()
    expect(res.length).toEqual(1)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'rem', id: fdElement2.getId() }, { type: 'tabs', tabs: [newTab] }] }))
  })

  it('Add new element, moove and update request, after the factory reset all changes', () => {
    const backendRF = new BackendRequestFactory()

    const newTab = { id: '123456789', index: 0, name: 'Main', linker: 'main', icon: 'nothing' }
    backendRF.setTabs([newTab], [])

    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, newTab.id, 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    backendRF.addElementIntoGrid(fdElement.getFDComponent(), [fdElement.getX(), fdElement.getY()], fdElement.getTabId(), fdElement.getId())
    backendRF.mooveElementFromGrid(fdElement.getId(), [345, 456])
    fdElement.setColor('#8C8C8C')
    fdElement.setName('New name')
    backendRF.updateElementFromGrid(fdElement)

    fdElement.setColor('#101010')
    fdElement.setName('New name')
    backendRF.updateElementFromGrid(fdElement)

    let res = backendRF.apply()
    expect(res.length).toEqual(3)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'add', com: { component: fdComp.getId(), state: { text: '', color: '' }, x: fdElement.getX(), y: fdElement.getY(), tab: newTab.id, connections: {}, id: fdElement.getId(), disabledio: { input: [], output: [] } } }, { type: 'mov', com: { id: fdElement.getId(), x: 345, y: 456 } }, { type: 'tabs', tabs: [newTab] }] }))
    expect(res[1]).toEqual(JSON.stringify({ target: fdElement.getId(), type: 'options', body: { comname: fdElement.getName(), comcolor: fdElement.getColor(), comnotes: fdElement.getNotes() } }))
    expect(res[2]).toEqual(JSON.stringify({ type: 'apply', body: [] }))
    res = backendRF.apply()
    expect(res.length).toEqual(1)
    expect(res[0]).toEqual(JSON.stringify({ type: 'apply', body: [{ type: 'tabs', tabs: [newTab] }] }))
  })

  it('Add new element, moove and update request, after the factory reset all changes', () => {
    expect(BackendRequestFactory.installComponent('fakeComp.py', 'print \'coucou\'')).toEqual('{"type":"install","filename":"fakeComp.py","body":"print \'coucou\'"}')
  })
})
