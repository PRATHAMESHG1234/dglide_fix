/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.864Z
 */

// import { operationUniqId } from '../../../../../../common/utils/helpers';

// export default class IssubstringPalette {
  // constructor(bpmnFactory, create, elementFactory, palette, translate) {
    // this.bpmnFactory = bpmnFactory;
    // this.create = create;
    // this.elementFactory = elementFactory;
    // this.translate = translate;

    // palette.registerProvider(this);
  // }

  // getPaletteEntries(element) {
    // const { bpmnFactory, create, elementFactory, translate } = this;

    // function createIssubstringOperation(suitabilityScore) {
      // return function (event) {
        // const newId = operationUniqId('issubstringOperation');
        // const businessObject = bpmnFactory.create('bpmn:Task');
        // businessObject.varibales = suitabilityScore;
        // businessObject.elementData = 'issubstringOperation';
        // businessObject.type = 'issubstringOperation';
        // businessObject.name = 'Issubstring';
        // businessObject.elementType = 'issubstringOperation';
        // businessObject.id = newId;
        // const shape = elementFactory.createShape({
          // type: 'bpmn:Task',
          // name: 'issubstring Operation',
          // businessObject: businessObject
        // });

        // create.start(event, shape);
      // };
    // }
    // return {
      // 'create.issubstringOperation': {
        // group: 'stringOperations',
        // className: 'bpmn-issubstring-operation',
        // title: translate('issubstring Operation'),
        // action: {
          // dragstart: createIssubstringOperation({
            // elementData: 'issubstringOperation'
          // }),
          // click: createIssubstringOperation({
          //   elementData: 'issubstringOperation'
          // })
        // }
      // }
    // };
  // }
// }

// IssubstringPalette.$inject = [
  // 'bpmnFactory',
  // 'create',
  // 'elementFactory',
  // 'palette',
  // 'translate'
// ];
