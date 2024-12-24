import { operationUniqId } from '../../../../../../common/utils/helpers';

export default class Trimpalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createTrimOperation(suitabilityScore) {
      return function (event) {
        const newId = operationUniqId('trimOperation');
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'trimOperation';
        businessObject.type = 'trimOperation';
        businessObject.name = 'Trim';
        businessObject.elementType = 'trimOperation';
        businessObject.id = newId;
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          name: 'Trim Operation',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }
    return {
      'create.trimOperation': {
        group: 'stringOperations',
        className: 'bpmn-trim-operation',
        title: translate('trim Operation'),
        action: {
          dragstart: createTrimOperation({
            elementData: 'trimOperation'
          }),
          // click: createTrimOperation({
          //   elementData: 'trimOperation'
          // })
        }
      }
    };
  }
}

Trimpalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
