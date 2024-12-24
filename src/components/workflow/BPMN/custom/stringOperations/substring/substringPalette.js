import { operationUniqId } from '../../../../../../common/utils/helpers';

export default class SubstringPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createSubstringOperation(suitabilityScore) {
      return function (event) {
        const newId = operationUniqId('substringOperation');
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'substringOperation';
        businessObject.type = 'SubstringOperation';
        businessObject.name = 'Substring';
        businessObject.elementType = 'substringOperation';
        businessObject.id = newId;
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          name: 'Substring Operation',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }
    return {
      'create.substringOperation': {
        group: 'stringOperations',
        className: 'bpmn-substring-operation',
        title: translate('Substring Operation'),
        action: {
          dragstart: createSubstringOperation({
            elementData: 'substringOperation'
          }),
          // click: createSubstringOperation({
          //   elementData: 'substringOperation'
          // })
        }
      }
    };
  }
}

SubstringPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
