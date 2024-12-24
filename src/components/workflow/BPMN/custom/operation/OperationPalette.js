import { operationUniqId } from '../../../../../common/utils/helpers';

export default class Operation {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createTask(suitabilityScore) {
      return function (event) {
        const newId = operationUniqId('operation');
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'operation';
        businessObject.type = 'operation';
        businessObject.name = 'Operation';
        businessObject.elementType = 'operation';
         businessObject.id = newId
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          name: 'Operation',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    return {
      'create.operation': {
        group: 'activity',
        className: 'bpmn-operation',
        title: translate('Operation'),
        action: {
          dragstart: createTask({
            elementData: 'operation'
          }),
          // click: createTask({
          //   elementData: 'operation'
          // })
        }
      }
    };
  }
}

Operation.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
