import { operationUniqId } from '../../../../../../common/utils/helpers';

export default class DateFatchPalette {
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
        const newId = operationUniqId('dFetchOperation');
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'dateFetchOperation';
        businessObject.type = 'dateFetchOperation';
        businessObject.name = 'DateFetch';
        businessObject.elementType = 'dateFetchOperation';
        businessObject.id = newId;
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          name: 'dateFetch Operation',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }
    return {
      'create.dateFetchOperation': {
        group: 'dateOperations',
        className: 'bpmn-dateFetch-operation',
        title: translate('DateFetch Operation'),
        action: {
          dragstart: createTask({
            elementData: 'dateFetchOperation'
          }),
          click: createTask({
            elementData: 'dateFetchOperation'
          })
        }
      }
    };
  }
}

DateFatchPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
