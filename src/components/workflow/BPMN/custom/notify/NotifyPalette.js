import { operationUniqId } from '../../../../../common/utils/helpers';

export default class NotifyPalette {
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
        const newId = operationUniqId('notify');
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'notify';
        businessObject.type = 'notify';
        businessObject.name = 'Notify';
        businessObject.elementType = 'notify';
        businessObject.id = newId;
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          name: 'Notify',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }
    return {
      'create.notify': {
        group: 'activity',
        className: 'bpmn-mail',
        title: translate('Notify'),
        action: {
          dragstart: createTask({
            elementData: 'notify'
          }),
          // click: createTask({
          //   elementData: 'notify'
          // })
        }
      }
    };
  }
}

NotifyPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
