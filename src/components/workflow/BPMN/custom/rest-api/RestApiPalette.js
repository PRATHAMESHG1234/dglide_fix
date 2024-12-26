import { operationUniqId } from '../../../../../common/utils/helpers';

export default class RestApiPalette {
  constructor(
    bpmnFactory,
    create,
    elementFactory,
    palette,
    translate,
  ) {
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
        const newId = operationUniqId('restApi');
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'restApi';
        businessObject.type = 'restApi';
        businessObject.name = 'RestApi';
        businessObject.id = newId;
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          name: 'RestApi',
          elementType : 'restApi',
          businessObject: businessObject
        });

        create.start(event, shape);
        
      };
    }
    return {
      'create.restApi': {
        group: 'activity',
        className: 'bpmn-rest-api',
        title: translate('RestApi'),
        action: {
          dragstart: createTask({
            elementData: 'restApi'
          }),
          // click: createTask({
          //   elementData: 'restApi'
          // })
        }
      }
    };
  }
}

RestApiPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate',
];
