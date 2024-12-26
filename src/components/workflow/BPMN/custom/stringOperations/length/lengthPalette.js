/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.853Z
 */

// import { operationUniqId } from '../../../../../../common/utils/helpers';

// export default class Lengthpalette {
  // constructor(bpmnFactory, create, elementFactory, palette, translate) {
    // this.bpmnFactory = bpmnFactory;
    // this.create = create;
    // this.elementFactory = elementFactory;
    // this.translate = translate;

    // palette.registerProvider(this);
  // }

  // getPaletteEntries(element) {
    // const { bpmnFactory, create, elementFactory, translate } = this;

    // function createlengthOperation(suitabilityScore) {
      // return function (event) {
        // const newId = operationUniqId('lengthOperation');
        // const businessObject = bpmnFactory.create('bpmn:Task');
        // businessObject.varibales = suitabilityScore;
        // businessObject.elementData = 'lengthOperation';
        // businessObject.type = 'lengthOperation';
        // businessObject.name = 'Length';
        // businessObject.elementType = 'lengthOperation';
        // businessObject.id = newId;
        // const shape = elementFactory.createShape({
          // type: 'bpmn:Task',
          // name: 'length Operation',
          // businessObject: businessObject
        // });

        // create.start(event, shape);
      // };
    // }
    // return {
      // 'create.lengthOperation': {
        // group: 'stringOperations',
        // className: 'bpmn-length-operation',
        // title: translate('length Operation'),
        // action: {
          // dragstart: createlengthOperation({
            // elementData: 'lengthOperation'
          // }),
          // click: createlengthOperation({
          //   elementData: 'lengthOperation'
          // })
        // }
      // }
    // };
  // }
// }

// Lengthpalette.$inject = [
  // 'bpmnFactory',
  // 'create',
  // 'elementFactory',
  // 'palette',
  // 'translate'
// ];
