/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.816Z
 */

// import { operationUniqId } from '../../../../../../common/utils/helpers';

// export default class Uppercasepalette {
  // constructor(bpmnFactory, create, elementFactory, palette, translate) {
    // this.bpmnFactory = bpmnFactory;
    // this.create = create;
    // this.elementFactory = elementFactory;
    // this.translate = translate;

    // palette.registerProvider(this);
  // }

  // getPaletteEntries(element) {
    // const { bpmnFactory, create, elementFactory, translate } = this;

    // function createUppercaseOperation(suitabilityScore) {
      // return function (event) {
        // const newId = operationUniqId('uppercaseOperation');
        // const businessObject = bpmnFactory.create('bpmn:Task');
        // businessObject.varibales = suitabilityScore;
        // businessObject.elementData = 'uppercaseOperation';
        // businessObject.type = 'uppercaseOperation';
        // businessObject.name = 'Uppercase';
        // businessObject.elementType = 'uppercaseOperation';
        // businessObject.id = newId;
        // const shape = elementFactory.createShape({
          // type: 'bpmn:Task',
          // name: 'uppercase Operation',
          // businessObject: businessObject
        // });

        // create.start(event, shape);
      // };
    // }
    // return {
      // 'create.uppercaseOperation': {
        // group: 'stringOperations',
        // className: 'bpmn-uppercase-operation',
        // title: translate('uppercase Operation'),
        // action: {
          // dragstart: createUppercaseOperation({
            // elementData: 'uppercaseOperation'
          // }),
          // click: createUppercaseOperation({
          //   elementData: 'uppercaseOperation'
          // })
        // }
      // }
    // };
  // }
// }

// Uppercasepalette.$inject = [
  // 'bpmnFactory',
  // 'create',
  // 'elementFactory',
  // 'palette',
  // 'translate'
// ];
