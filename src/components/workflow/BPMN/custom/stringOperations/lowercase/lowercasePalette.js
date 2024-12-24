import { operationUniqId } from '../../../../../../common/utils/helpers';

export default class Lowercasepalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createLowercaseOperation(suitabilityScore) {
      return function (event) {
        const newId = operationUniqId('lowercaseOperation');
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'lowercaseOperation';
        businessObject.type = 'lowercaseOperation';
        businessObject.name = 'Lowercase';
        businessObject.elementType = 'lowercaseOperation';
        businessObject.id = newId;
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          name: 'Lowercase Operation',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }
    return {
      'create.lowercaseOperation': {
        group: 'stringOperations',
        className: 'bpmn-lowercase-operation',
        title: translate('Lowercase Operation'),
        action: {
          dragstart: createLowercaseOperation({
            elementData: 'lowercaseOperation'
          }),
          // click: createLowercaseOperation({
          //   elementData: 'lowercaseOperation'
          // })
        }
      }
    };
  }
}

Lowercasepalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
