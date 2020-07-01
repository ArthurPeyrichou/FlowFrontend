import { expect } from 'chai'
import { FDComponent } from '../../src/models/FDComponent'

describe('FDComponent Model',() => {

  it('should create',() => {
    const fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,true,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
  });

  it('Input attribution check',() => {
    expect( () => { new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',"A STRING",true,'icon','1.0','readme',false,'{}');})
      .throw("Input attribut of FDComponent 'id0' should be an integer or boolean value. Got 'A STRING'.");

    let fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',2,true,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getInput()).equal(2);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',0,true,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getInput()).equal(0);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',"2",true,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getInput()).equal(2);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',-5,true,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getInput()).equal(0);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,true,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getInput()).equal(1);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',false,true,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getInput()).equal(0);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',"true",true,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getInput()).equal(1);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',"false",true,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getInput()).equal(0);
  });

  it('Output attribution check',() => {
    expect(() => { new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,"A STRING",'icon','1.0','readme',false,'{}');})
      .throw("Output attribut of FDComponent 'id0' should be an integer or boolean value. Got 'A STRING'.");

    let fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,2,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getOutput()).equal(2);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,0,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getOutput()).equal(0);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,-5,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getOutput()).equal(0);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,"2",'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getOutput()).equal(2);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,true,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getOutput()).equal(1);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,false,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getOutput()).equal(0);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,"true",'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getOutput()).equal(1);

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,"false",'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
    expect(fdComp.getOutput()).equal(0);
  });

  it('Options attribution check',() => {
    let fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,true,'icon','1.0','readme',false,'A STRING');
    expect(fdComp).exist;
    expect(JSON.stringify(fdComp.getOptions())).equal('{}')

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,true,'icon','1.0','readme',false,null);
    expect(fdComp).exist;
    expect(JSON.stringify(fdComp.getOptions())).equal('{}')

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,5,'icon','1.0','readme',false,JSON.parse('{"option1":"op1","option2":"op2"}'));
    expect(fdComp).exist;
    expect(JSON.stringify(fdComp.getOptions())).equal('{"option1":"op1","option2":"op2"}')

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,0,'icon','1.0','readme',false,'{"option3": "op3","option4": "op4"}');
    expect(fdComp).exist;
    expect(JSON.stringify(fdComp.getOptions())).equal('{"option3":"op3","option4":"op4"}')

    fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,0,'icon','1.0','readme',false,'{"invalide_JSON" = "something"}');
    expect(fdComp).exist;
    expect(JSON.stringify(fdComp.getOptions())).equal('{}')
  });

  it('Getters check',() => {
    const fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,5,'icon','1.0','readme',false,JSON.parse('{"option1":"op1","option2":"op2"}'));
    expect(fdComp).exist;
    expect(fdComp.getId()).equal("id0")
    expect(fdComp.getGroup()).equal("FakeType1")
    expect(fdComp.getTitle()).equal("FakeComp1")
    expect(fdComp.getColor()).equal("#967ADC")
    expect(fdComp.getAuthor()).equal("autor")
    expect(fdComp.getInput()).equal(1)
    expect(fdComp.getOutput()).equal(5)
    expect(fdComp.getIcon()).equal("icon")
    expect(fdComp.getVersion()).equal("1.0")
    expect(fdComp.getReadme()).equal("readme")
    expect(fdComp.isClickable()).equal(false)
    expect(JSON.stringify(fdComp.getOptions())).equal('{"option1":"op1","option2":"op2"}')
  });

  it('To string check',() => {
    const fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,5,'icon','1.0','readme',false,JSON.parse('{"option1":"op1","option2":"op2"}'));
    expect(fdComp).exist;
    expect(fdComp.toString()).equal(JSON.stringify(fdComp))
  });

  it('From string check',() => {
    const fdComp = new FDComponent("id0","FakeType1","FakeComp1",'#967ADC','autor',true,5,'icon','1.0','readme',false,JSON.parse('{"option1":"op1","option2":"op2"}'));
    const intoString = fdComp.toString();
    const newFdcomp = FDComponent.fromString(intoString);
    expect(fdComp.getId()).equal(newFdcomp.getId())
    expect(fdComp.getGroup()).equal(newFdcomp.getGroup())
    expect(fdComp.getTitle()).equal(newFdcomp.getTitle())
    expect(fdComp.getColor()).equal(newFdcomp.getColor())
    expect(fdComp.getAuthor()).equal(newFdcomp.getAuthor())
    expect(fdComp.getInput()).equal(newFdcomp.getInput())
    expect(fdComp.getOutput()).equal(newFdcomp.getOutput())
    expect(fdComp.getIcon()).equal(newFdcomp.getIcon())
    expect(fdComp.getVersion()).equal(newFdcomp.getVersion())
    expect(fdComp.getReadme()).equal(newFdcomp.getReadme())
    expect(fdComp.isClickable()).equal(newFdcomp.isClickable())
    expect(JSON.stringify(fdComp.getOptions())).equal(JSON.stringify(newFdcomp.getOptions()))
  });
})
