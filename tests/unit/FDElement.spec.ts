import { FDComponent } from '../../src/models/FDComponent'
import { FDElement } from '../../src/models/FDElement'
import { SVG_GRID_SIZE } from '../../src/config'

describe('FDElement Model', () => {
  it('Position x y can be string or number', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'), JSON.parse('{"option1":"op1","option2":"op2"}'))
    let fdElement = new FDElement('id0', fdComp, 'tabId', 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    expect(fdElement.getX()).toEqual(1235)
    expect(fdElement.getY()).toEqual(2500)
    fdElement = new FDElement('id0', fdComp, 'tabId', 'aName', '#967ADC', '856', '852', '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    expect(fdElement.getX()).toEqual(856)
    expect(fdElement.getY()).toEqual(852)
  })

  it('Position x y should be beetween 0 and SVG_GRID_SIZE', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'), JSON.parse('{"option1":"op1","option2":"op2"}'))
    expect(() => { return new FDElement('id0', fdComp, 'tabId', 'aName', '#967ADC', -5, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}')) })
      .toThrow('x attribut of Component "id0" should be an integer in interval [0;' + SVG_GRID_SIZE + ']. Got "-5".')

    expect(() => { return new FDElement('id0', fdComp, 'tabId', 'aName', '#967ADC', SVG_GRID_SIZE + 10, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}')) })
      .toThrow('x attribut of Component "id0" should be an integer in interval [0;' + SVG_GRID_SIZE + ']. Got "' + (SVG_GRID_SIZE + 10) + '".')

    expect(() => { return new FDElement('id0', fdComp, 'tabId', 'aName', '#967ADC', 2500, -5, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}')) })
      .toThrow('y attribut of Component "id0" should be an integer in interval [0;' + SVG_GRID_SIZE + ']. Got "-5".')

    expect(() => { return new FDElement('id0', fdComp, 'tabId', 'aName', '#967ADC', 2500, SVG_GRID_SIZE + 10, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}')) })
      .toThrow('y attribut of Component "id0" should be an integer in interval [0;' + SVG_GRID_SIZE + ']. Got "' + (SVG_GRID_SIZE + 10) + '".')
  })

  it('If name null give his FDComponent name', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'), JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, 'tabId', '', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    expect(fdElement.getName()).toEqual('FakeComp1')
  })

  it('If color null give his FDComponent name', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'), JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, 'tabId', 'aName', '', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{}'))
    expect(fdElement.getColor()).toEqual('#967ADC')
  })

  it('Getters check', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'), JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, 'tabId', 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{"0":[{"index":"0","id":"1591868779323"}]}'))
    expect(fdElement.getId()).toEqual('id0')
    expect(fdElement.getFDComponent()).toEqual(fdComp)
    expect(fdElement.getTabId()).toEqual('tabId')
    expect(fdElement.getName()).toEqual('aName')
    expect(fdElement.getColor()).toEqual('#967ADC')
    expect(fdElement.getX()).toEqual(1235)
    expect(fdElement.getY()).toEqual(2500)
    expect(fdElement.getNotes()).toEqual('')
    expect(fdElement.getState()).toEqual({})
    expect(fdElement.getOptions()).toEqual({ debug: false })
    expect(fdElement.getLinks().has(0)).toEqual(true)
  })

  it('Setters check', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'), JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, 'tabId', 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{"0":[{"index":"0","id":"1591868779323"}]}'))

    expect(fdElement.getName()).toEqual('aName')
    fdElement.setName('anOtherName')
    expect(fdElement.getName()).toEqual('anOtherName')

    expect(fdElement.getColor()).toEqual('#967ADC')
    fdElement.setColor('anOtherColor')
    expect(fdElement.getColor()).toEqual('anOtherColor')

    expect(fdElement.getX()).toEqual(1235)
    expect(fdElement.getY()).toEqual(2500)

    fdElement.setX(12)
    expect(fdElement.getX()).toEqual(12)

    fdElement.setY(45)
    expect(fdElement.getY()).toEqual(45)

    expect(() => { fdElement.setX(-5) })
      .toThrow('x attribut of Component "id0" should be an integer in interval [0;' + SVG_GRID_SIZE + ']. Got "-5".')

    expect(() => { fdElement.setX(SVG_GRID_SIZE + 10) })
      .toThrow('x attribut of Component "id0" should be an integer in interval [0;' + SVG_GRID_SIZE + ']. Got "' + (SVG_GRID_SIZE + 10) + '".')

    expect(() => { fdElement.setY(-5) })
      .toThrow('y attribut of Component "id0" should be an integer in interval [0;' + SVG_GRID_SIZE + ']. Got "-5".')

    expect(() => { fdElement.setY(SVG_GRID_SIZE + 10) })
      .toThrow('y attribut of Component "id0" should be an integer in interval [0;' + SVG_GRID_SIZE + ']. Got "' + (SVG_GRID_SIZE + 10) + '".')

    fdElement.setPostion(88, 75)
    expect(fdElement.getX()).toEqual(88)
    expect(fdElement.getY()).toEqual(75)

    expect(fdElement.getLinks().has(0)).toEqual(true)
    expect(fdElement.getLinks().has(1)).toEqual(false)
    fdElement.setLinks(JSON.parse('{"1":[{"index":"0","id":"1591868779323"}]}'))
    expect(fdElement.getLinks().has(0)).toEqual(false)
    expect(fdElement.getLinks().has(1)).toEqual(true)
    expect(fdElement.getLinks().get(1)?.length).toEqual(1)
  })

  it('Links attribut check', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'), JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, 'tabId', 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{"0":[{"index":"0","id":"1591868779323"}]}'))
    expect(fdElement.getLinks().has(0)).toEqual(true)

    expect(fdElement.getLinks().has(1)).toEqual(false)
    fdElement.addLink(1, { index: 0, id: 'anIdWhatever' })
    expect(fdElement.getLinks().has(1)).toEqual(true)
    fdElement.removeLink(1, { index: 0, id: 'anIdWhatever' })
    expect(fdElement.getLinks().has(1)).toEqual(false)

    expect(fdElement.getLinks().get(0)?.length).toEqual(1)
    fdElement.addLink(0, { index: 0, id: 'aSecondIdWhatever' })
    expect(fdElement.getLinks().get(0)?.length).toEqual(2)
    fdElement.removeLink(0, { index: 0, id: 'aSecondIdWhatever' })
    expect(fdElement.getLinks().get(0)?.length).toEqual(1)
  })

  it('To string check', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'), JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, 'tabId', 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{"0":[{"index":"0","id":"1591868779323"}]}'))
    expect(fdElement.toString()).toEqual('{"id":"id0","hisFDComponent":{"input":1,"output":5,"options":{"option1":"op1","option2":"op2"},"details":{"option1":"op1","option2":"op2"},"group":"FakeType1","id":"id0","title":"FakeComp1","color":"#967ADC","author":"autor","icon":"icon","version":"1.0","readme":"readme","click":false},"tabId":"tabId","name":"aName","color":"#967ADC","x":1235,"y":2500,"notes":"","state":{},"options":{"debug":false},"links":{"0": [{"index":"0","id":"1591868779323"}]}}')
  })

  it('From string check', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'), JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, 'tabId', 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{"0":[{"index":"0","id":"1591868779323"},{"index":"1","id":"987654321"}],"1":[{"index":"0","id":"456123789"}]}'))
    const intoString = fdElement.toString()
    const newFDElement = FDElement.fromString(intoString)
    expect(fdElement.getId()).toEqual(newFDElement.getId())
    expect(fdElement.getFDComponent()).toEqual(newFDElement.getFDComponent())
    expect(fdElement.getTabId()).toEqual(newFDElement.getTabId())
    expect(fdElement.getName()).toEqual(newFDElement.getName())
    expect(fdElement.getColor()).toEqual(newFDElement.getColor())
    expect(fdElement.getX()).toEqual(newFDElement.getX())
    expect(fdElement.getY()).toEqual(newFDElement.getY())
    expect(fdElement.getNotes()).toEqual(newFDElement.getNotes())
    expect(fdElement.getState()).toEqual(newFDElement.getState())
    expect(fdElement.getOptions()).toEqual(newFDElement.getOptions())
    for (const [key, value] of Object.entries(fdElement.getLinks())) {
      expect(newFDElement.getLinks().has(Number.parseInt(key)))
      expect(newFDElement.getLinks().get(Number.parseInt(key))?.length).toEqual(value.length)
      for (let i = 0; i < value.length; ++i) {
        const link = newFDElement.getLinks().get(Number.parseInt(key))
        expect(link ? link[i].id : undefined).toEqual(value[i].id)
        expect(link ? link[i].index : undefined).toEqual(value[i].index)
      }
    }

    expect(JSON.stringify(fdElement.getOptions())).toEqual(JSON.stringify(newFDElement.getOptions()))
  })

  it('From struct check', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'), JSON.parse('{"option1":"op1","option2":"op2"}'))
    const fdElement = new FDElement('id0', fdComp, 'tabId', 'aName', '#967ADC', 1235, 2500, '', JSON.parse('{}'), JSON.parse('{}'), JSON.parse('{"0":[{"index":"0","id":"1591868779323"},{"index":"1","id":"987654321"}],"1":[{"index":"0","id":"456123789"}]}'))
    const intoString = fdElement.toString()
    const intoStruct = JSON.parse(intoString)
    const newFDElement = FDElement.fromStruct(intoStruct)
    expect(fdElement.getId()).toEqual(newFDElement.getId())
    expect(fdElement.getFDComponent()).toEqual(newFDElement.getFDComponent())
    expect(fdElement.getTabId()).toEqual(newFDElement.getTabId())
    expect(fdElement.getName()).toEqual(newFDElement.getName())
    expect(fdElement.getColor()).toEqual(newFDElement.getColor())
    expect(fdElement.getX()).toEqual(newFDElement.getX())
    expect(fdElement.getY()).toEqual(newFDElement.getY())
    expect(fdElement.getNotes()).toEqual(newFDElement.getNotes())
    expect(fdElement.getState()).toEqual(newFDElement.getState())
    expect(fdElement.getOptions()).toEqual(newFDElement.getOptions())
    for (const [key, value] of Object.entries(fdElement.getLinks())) {
      expect(newFDElement.getLinks().has(Number.parseInt(key)))
      expect(newFDElement.getLinks().get(Number.parseInt(key))?.length).toEqual(value.length)
      for (let i = 0; i < value.length; ++i) {
        const link = newFDElement.getLinks().get(Number.parseInt(key))
        expect(link ? link[i].id : undefined).toEqual(value[i].id)
        expect(link ? link[i].index : undefined).toEqual(value[i].index)
      }
    }

    expect(JSON.stringify(fdElement.getOptions())).toEqual(JSON.stringify(newFDElement.getOptions()))
  })
})
