import { operationUniqId } from '../../../../../common/utils/helpers';

export default class Approval {
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
        const newId = operationUniqId('approval');
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'approval';
        businessObject.type = 'approval';
        businessObject.name = 'Approval';
        businessObject.id = newId;
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          name: 'Approval',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }
    return {
      'create.approval': {
        group: 'activity',
        className: 'bpmn-user',
        title: translate('Approval'),
        action: {
          dragstart: createTask({
            elementData: 'approval'
          }),
          // click: createTask({
          //   elementData: 'approval'
          // })
        }
      }
    };
  }
}

Approval.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
