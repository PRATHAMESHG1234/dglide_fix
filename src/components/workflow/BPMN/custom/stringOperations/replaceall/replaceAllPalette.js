/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.819Z
 */

// import { operationUniqId } from '../../../../../../common/utils/helpers';

// export default class Replaceallpalette {
  // constructor(bpmnFactory, create, elementFactory, palette, translate) {
    // this.bpmnFactory = bpmnFactory;
    // this.create = create;
    // this.elementFactory = elementFactory;
    // this.translate = translate;

    // palette.registerProvider(this);
  // }

  // getPaletteEntries(element) {
    // const { bpmnFactory, create, elementFactory, translate } = this;

    // function createReplaceallOperation(suitabilityScore) {
      // return function (event) {
        // const newId = operationUniqId('reaplaceallOperation');
        // const businessObject = bpmnFactory.create('bpmn:Task');
        // businessObject.varibales = suitabilityScore;
        // businessObject.elementData = 'replaceallOperation';
        // businessObject.type = 'replaceallOperation';
        // businessObject.name = 'Replaceall';
        // businessObject.elementType = 'replaceallOperation';
        // businessObject.id = newId;
        // const shape = elementFactory.createShape({
          // type: 'bpmn:Task',
          // name: 'Replaceall Operation',
          // businessObject: businessObject
        // });

        // create.start(event, shape);
      // };
    // }

    // return {
      // 'create.replaceallOperation': {
        // group: 'stringOperations',
        // className: 'bpmn-replaceall-operation',
        // title: translate('replaceall Operation'),
        // action: {
          // dragstart: createReplaceallOperation({
            // elementData: 'replaceallOperation'
          // }),
          // click: createReplaceallOperation({
          //   elementData: 'replaceallOperation'
          // })
        // }
      // }
    // };
  // }
// }

// Replaceallpalette.$inject = [
  // 'bpmnFactory',
  // 'create',
  // 'elementFactory',
  // 'palette',
  // 'translate'
// ];
