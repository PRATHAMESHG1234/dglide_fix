import { operationUniqId } from '../../../../../common/utils/helpers';

export default class Template {
  constructor (bpmnFactory, create, elementFactory, palette, translate) {
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
        const newId = operationUniqId('task');
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'template';
        businessObject.type = 'template';
        businessObject.name = 'Task';
        businessObject.id = newId;
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          name: 'Task',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }
    return {
      'create.template': {
        group: 'activity',
        className: 'bpmn-template',
        title: translate('Task'),
        action: {
          dragstart: createTask({
            elementData: 'template'
          }),
          // click: createTask({
          //   elementData: 'template'
          // })
        }
      }
    };
  }
}

Template.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
