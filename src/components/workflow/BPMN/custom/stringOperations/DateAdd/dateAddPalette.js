/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.870Z
 */

// import { operationUniqId } from '../../../../../../common/utils/helpers';

// export default class DateAddPalette {
  // constructor(bpmnFactory, create, elementFactory, palette, translate) {
    // this.bpmnFactory = bpmnFactory;
    // this.create = create;
    // this.elementFactory = elementFactory;
    // this.translate = translate;

    // palette.registerProvider(this);
  // }

  // getPaletteEntries(element) {
    // const { bpmnFactory, create, elementFactory, translate } = this;

    // function createTask(suitabilityScore) {
      // return function (event) {
        // const newId = operationUniqId('dAddOperation');
        // const businessObject = bpmnFactory.create('bpmn:Task');
        // businessObject.varibales = suitabilityScore;
        // businessObject.elementData = 'dateAddOperation';
        // businessObject.type = 'dateAddOperation';
        // businessObject.name = 'DateAdd';
        // businessObject.elementType = 'dateAddOperation';
        // businessObject.id = newId;
        // const shape = elementFactory.createShape({
          // type: 'bpmn:Task',
          // name: 'dateAdd Operation',
          // businessObject: businessObject
        // });

        // create.start(event, shape);
      // };
    // }
    // return {
      // 'create.dateAddOperation': {
        // group: 'dateOperations',
        // className: 'bpmn-dateAdd-operation',
        // title: translate('DateAdd Operation'),
        // action: {
          // dragstart: createTask({
            // elementData: 'dateAddOperation'
          // }),
          // click: createTask({
            // elementData: 'dateAddOperation'
          // })
        // }
      // }
    // };
  // }
// }

// DateAddPalette.$inject = [
  // 'bpmnFactory',
  // 'create',
  // 'elementFactory',
  // 'palette',
  // 'translate'
// ];
