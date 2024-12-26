/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.866Z
 */

// import { operationUniqId } from '../../../../../../common/utils/helpers';

// export default class Insertpalette {
  // constructor(bpmnFactory, create, elementFactory, palette, translate) {
    // this.bpmnFactory = bpmnFactory;
    // this.create = create;
    // this.elementFactory = elementFactory;
    // this.translate = translate;

    // palette.registerProvider(this);
  // }

  // getPaletteEntries(element) {
    // const { bpmnFactory, create, elementFactory, translate } = this;

    // function createInsertOperation(suitabilityScore) {
      // return function (event) {
        // const newId = operationUniqId('insertOperation');
        // const businessObject = bpmnFactory.create('bpmn:Task');
        // businessObject.varibales = suitabilityScore;
        // businessObject.elementData = 'insertOperation';
        // businessObject.type = 'InsertOperation';
        // businessObject.name = 'Insert';
        // businessObject.elementType = 'insertOperation';
        // businessObject.id = newId;
        // const shape = elementFactory.createShape({
          // type: 'bpmn:Task',
          // name: 'Insert Operation',
          // businessObject: businessObject
        // });

        // create.start(event, shape);
      // };
    // }
    // return {
      // 'create.insertOperation': {
        // group: 'stringOperations',
        // className: 'bpmn-insert-operation',
        // title: translate('Insert Operation'),
        // action: {
          // dragstart: createInsertOperation({
            // elementData: 'insertOperation'
          // }),
          // click: createInsertOperation({
          //   elementData: 'insertOperation'
          // })
        // }
      // }
    // };
  // }
// }

// Insertpalette.$inject = [
  // 'bpmnFactory',
  // 'create',
  // 'elementFactory',
  // 'palette',
  // 'translate'
// ];
