import { operationUniqId } from '../../../../../../common/utils/helpers';

export default class Replacepalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createReplaceOperation(suitabilityScore) {
      return function (event) {
        const newId = operationUniqId('replaceOperation');
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'replaceOperation';
        businessObject.type = 'replaceOperation';
        businessObject.name = 'Replace';
        businessObject.elementType = 'replaceOperation';
        businessObject.id = newId;
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          name: 'replace Operation',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }
    return {
      'create.replaceOperation': {
        group: 'stringOperations',
        className: 'bpmn-replace-operation',
        title: translate('replace Operation'),
        action: {
          dragstart: createReplaceOperation({
            elementData: 'replaceOperation'
          }),
          // click: createReplaceOperation({
          //   elementData: 'replaceOperation'
          // })
        }
      }
    };
  }
}

Replacepalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
