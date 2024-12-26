import { operationUniqId } from '../../../../../../common/utils/helpers';

export default class DateDiffPalette {
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
        const newId = operationUniqId('dDiffOperation');
        const businessObject = bpmnFactory.create('bpmn:Task');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'dateDiffOperation';
        businessObject.type = 'dateDiffOperation';
        businessObject.name = 'DateDiff';
        businessObject.elementType = 'dateDiffOperation';
        businessObject.id = newId;
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          name: 'dateAdd Operation',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }
    return {
      'create.dateDiffOperation': {
        group: 'dateOperations',
        className: 'bpmn-dateDiff-operation',
        title: translate('DateDiff Operation'),
        action: {
          dragstart: createTask({
            elementData: 'dateDiffOperation'
          }),
          click: createTask({
            elementData: 'dateDiffOperation'
          })
        }
      }
    };
  }
}

DateDiffPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
