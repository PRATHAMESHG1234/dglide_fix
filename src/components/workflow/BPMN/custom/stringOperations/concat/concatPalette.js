import { operationUniqId } from '../../../../../../common/utils/helpers';

export default class Concatpalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createConcatOperation(suitabilityScore) {
      return function (event) {
        const newId = operationUniqId('concatOperation');
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'concatOperation';
        businessObject.type = 'concatOperation';
        businessObject.name = 'Concat';
        businessObject.elementType = 'concatOperation';
        businessObject.id = newId;
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          name: 'concat Operation',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }
    return {
      'create.concatOperation': {
        group: 'stringOperations',
        className: 'bpmn-concat-operation',
        title: translate('Concat Operation'),
        action: {
          dragstart: createConcatOperation({
            elementData: 'concatOperation'
          }),
          click: createConcatOperation({
            elementData: 'concatOperation'
          })
        }
      }
    };
  }
}

Concatpalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
