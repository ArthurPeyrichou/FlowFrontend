import { FDComponent } from '../../src/models/FDComponent'

describe('FDComponent Model', () => {
  it('Input attribution check', () => {
    expect(() => { return new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', 'A STRING', true, 'icon', '1.0', 'readme', false, '{}') })
      .toThrow("Input attribut of FDComponent 'id0' should be an integer or boolean value. Got 'A STRING'.")

    let fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', 2, true, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getInput()).toEqual(2)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', 0, true, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getInput()).toEqual(0)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', '2', true, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getInput()).toEqual(2)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', -5, true, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getInput()).toEqual(0)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getInput()).toEqual(1)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', false, true, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getInput()).toEqual(0)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', 'true', true, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getInput()).toEqual(1)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', 'false', true, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getInput()).toEqual(0)
  })

  it('Output attribution check', () => {
    expect(() => { return new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 'A STRING', 'icon', '1.0', 'readme', false, '{}') })
      .toThrow("Output attribut of FDComponent 'id0' should be an integer or boolean value. Got 'A STRING'.")

    let fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 2, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getOutput()).toEqual(2)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 0, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getOutput()).toEqual(0)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, -5, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getOutput()).toEqual(0)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, '2', 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getOutput()).toEqual(2)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, true, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getOutput()).toEqual(1)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, false, 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getOutput()).toEqual(0)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 'true', 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getOutput()).toEqual(1)

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 'false', 'icon', '1.0', 'readme', false, '{}')
    expect(fdComp.getOutput()).toEqual(0)
  })

  it('Options attribution check', () => {
    let fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, true, 'icon', '1.0', 'readme', false, 'A STRING')
    expect(JSON.stringify(fdComp.getOptions())).toEqual('{}')

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, true, 'icon', '1.0', 'readme', false, null)
    expect(JSON.stringify(fdComp.getOptions())).toEqual('{}')

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    expect(JSON.stringify(fdComp.getOptions())).toEqual('{"option1":"op1","option2":"op2"}')

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 0, 'icon', '1.0', 'readme', false, '{"option3": "op3","option4": "op4"}')
    expect(JSON.stringify(fdComp.getOptions())).toEqual('{"option3":"op3","option4":"op4"}')

    fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 0, 'icon', '1.0', 'readme', false, '{"invalide_JSON" = "something"}')
    expect(JSON.stringify(fdComp.getOptions())).toEqual('{}')
  })

  it('Default group check', () => {
    const fdComp = new FDComponent('id0', '', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    expect(fdComp.getGroup()).toEqual('Common')
  })

  it('Getters check', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    expect(fdComp.getId()).toEqual('id0')
    expect(fdComp.getGroup()).toEqual('FakeType1')
    expect(fdComp.getTitle()).toEqual('FakeComp1')
    expect(fdComp.getColor()).toEqual('#967ADC')
    expect(fdComp.getAuthor()).toEqual('autor')
    expect(fdComp.getInput()).toEqual(1)
    expect(fdComp.getOutput()).toEqual(5)
    expect(fdComp.getIcon()).toEqual('icon')
    expect(fdComp.getVersion()).toEqual('1.0')
    expect(fdComp.getReadme()).toEqual('readme')
    expect(fdComp.isClickable()).toEqual(false)
    expect(JSON.stringify(fdComp.getOptions())).toEqual('{"option1":"op1","option2":"op2"}')
  })

  it('To string check', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    expect(fdComp.toString()).toEqual(JSON.stringify(fdComp))
  })

  it('From string check', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const intoString = fdComp.toString()
    const newFdcomp = FDComponent.fromString(intoString)
    expect(fdComp.getId()).toEqual(newFdcomp.getId())
    expect(fdComp.getGroup()).toEqual(newFdcomp.getGroup())
    expect(fdComp.getTitle()).toEqual(newFdcomp.getTitle())
    expect(fdComp.getColor()).toEqual(newFdcomp.getColor())
    expect(fdComp.getAuthor()).toEqual(newFdcomp.getAuthor())
    expect(fdComp.getInput()).toEqual(newFdcomp.getInput())
    expect(fdComp.getOutput()).toEqual(newFdcomp.getOutput())
    expect(fdComp.getIcon()).toEqual(newFdcomp.getIcon())
    expect(fdComp.getVersion()).toEqual(newFdcomp.getVersion())
    expect(fdComp.getReadme()).toEqual(newFdcomp.getReadme())
    expect(fdComp.isClickable()).toEqual(newFdcomp.isClickable())
    expect(JSON.stringify(fdComp.getOptions())).toEqual(JSON.stringify(newFdcomp.getOptions()))
  })

  it('From struct check', () => {
    const fdComp = new FDComponent('id0', 'FakeType1', 'FakeComp1', '#967ADC', 'autor', true, 5, 'icon', '1.0', 'readme', false, JSON.parse('{"option1":"op1","option2":"op2"}'))
    const intoString = fdComp.toString()
    const intoStruct = JSON.parse(intoString)
    const newFdcomp = FDComponent.fromStruct(intoStruct)
    expect(fdComp.getId()).toEqual(newFdcomp.getId())
    expect(fdComp.getGroup()).toEqual(newFdcomp.getGroup())
    expect(fdComp.getTitle()).toEqual(newFdcomp.getTitle())
    expect(fdComp.getColor()).toEqual(newFdcomp.getColor())
    expect(fdComp.getAuthor()).toEqual(newFdcomp.getAuthor())
    expect(fdComp.getInput()).toEqual(newFdcomp.getInput())
    expect(fdComp.getOutput()).toEqual(newFdcomp.getOutput())
    expect(fdComp.getIcon()).toEqual(newFdcomp.getIcon())
    expect(fdComp.getVersion()).toEqual(newFdcomp.getVersion())
    expect(fdComp.getReadme()).toEqual(newFdcomp.getReadme())
    expect(fdComp.isClickable()).toEqual(newFdcomp.isClickable())
    expect(JSON.stringify(fdComp.getOptions())).toEqual(JSON.stringify(newFdcomp.getOptions()))
  })
})
