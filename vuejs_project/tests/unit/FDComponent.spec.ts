import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import { FDComponent } from '../../src/models/FDComponent'

describe('FDComponent Model', () => {

  it('should create', () => {
    let fdComp = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true,true,'icon','1.0','readme',false,'{}');
    expect(fdComp).exist;
  });

  it('Input attribution check', () => {
    expect(new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',"A STRING",true, 'icon','1.0','readme',false,'{}'))
      .throw("Input attribut of FDComponent 'id0' should be an integer or boolean value.");
    
    expect(new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',"15p",true, 'icon','1.0','readme',false,'{}'))
    .throw("Input attribut of FDComponent 'id0' should be an integer or boolean value.");

    let fdComp1 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',5,true, 'icon','1.0','readme',false,'{}');
    expect(fdComp1).exist;

    let fdComp2 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',0,true, 'icon','1.0','readme',false,'{}');
    expect(fdComp2).exist;

    expect(new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',-5,true, 'icon','1.0','readme',false,'{}'))
    .throw("Input attribut of FDComponent 'id0' should be a positive or null integer.");

    let fdComp3 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true,true, 'icon','1.0','readme',false,'{}');
    expect(fdComp3).exist;

    let fdComp4 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',false,true,'icon','1.0','readme',false,'{}');
    expect(fdComp4).exist;

    let fdComp5 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',"true",true,'icon','1.0','readme',false,'{}');
    expect(fdComp5).exist;

    let fdComp6 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',"false",true,'icon','1.0','readme',false,'{}');
    expect(fdComp6).exist;
  });

  it('Output attribution check', () => {
    expect(new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true, "A STRING",'icon','1.0','readme',false,'{}'))
      .throw("Output attribut of FDComponent 'id0' should be an integer or boolean value.");
    
    expect(new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true, "15p",'icon','1.0','readme',false,'{}'))
    .throw("Output attribut of FDComponent 'id0' should be an integer or boolean value.");

    let fdComp1 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true,5,'icon','1.0','readme',false,'{}');
    expect(fdComp1).exist;

    let fdComp2 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true,0,'icon','1.0','readme',false,'{}');
    expect(fdComp2).exist;

    expect(new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true, -5,'icon','1.0','readme',false,'{}'))
    .throw("Output attribut of FDComponent 'id0' should be a positive or null integer.");

    let fdComp3 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true,true,'icon','1.0','readme',false,'{}');
    expect(fdComp3).exist;

    let fdComp4 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true,false,'icon','1.0','readme',false,'{}');
    expect(fdComp4).exist;

    let fdComp5 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true,"true",'icon','1.0','readme',false,'{}');
    expect(fdComp5).exist;

    let fdComp6 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true,"false",'icon','1.0','readme',false,'{}');
    expect(fdComp6).exist;
  });

  it('Options attribution check', () => {
    expect(new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true, true,'icon','1.0','readme',false,'A STRING'))
      .throw("Options attribut of FDComponent 'id0' should be a JSON Object value.");
    
    expect(new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true, "15p",'icon','1.0','readme',false,123456))
    .throw("Options attribut of FDComponent 'id0' should be a JSON Object value.");

    expect(new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true, "15p",'icon','1.0','readme',false,true))
    .throw("Options attribut of FDComponent 'id0' should be a JSON Object value.");

    expect(new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true, "15p",'icon','1.0','readme',false,[]))
    .throw("Options attribut of FDComponent 'id0' should be a JSON Object value.");

    expect(new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true, "15p",'icon','1.0','readme',false,null))
    .throw("Options attribut of FDComponent 'id0' should be a JSON Object value.");

    let fdComp1 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true,5,'icon','1.0','readme',false,{option1: "op1", option2: "op2"});
    expect(fdComp1).exist;

    let fdComp2 = new FDComponent("id0","FakeType1","FakeComp1", '#967ADC','autor',true,0,'icon','1.0','readme',false,'{option1: "op1", option2: "op2"}');
    expect(fdComp2).exist;
  });
})
