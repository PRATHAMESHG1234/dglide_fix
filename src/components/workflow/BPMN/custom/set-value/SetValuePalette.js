/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.879Z
 */

// import { operationUniqId } from '../../../../../common/utils/helpers';

// export default class SetValuePalette {
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
        // const newId = operationUniqId('set-value');
        // const businessObject = bpmnFactory.create('bpmn:Task');

        // businessObject.varibales = suitabilityScore;
        // businessObject.elementData = 'set-value';
        // businessObject.type = 'set-value';
        // businessObject.name = 'Set value';
        // businessObject.elementType = 'set-value';
        // businessObject.id = newId;
        // const shape = elementFactory.createShape({
          // type: 'bpmn:Task',
          // name: 'Set value',
          // businessObject: businessObject
        // });

        // create.start(event, shape);
      // };
    // }
    // return {
      // 'create.set-value': {
        // group: 'activity',
        // className: 'bpmn-set-value',
        // title: translate('Set Value'),
        // action: {
          // dragstart: createTask({
            // elementData: 'set-value'
          // }),
          // click: createTask({
          //   elementData: 'set-value'
          // })
        // }
      // }
    // };
  // }
// }

// SetValuePalette.$inject = [
  // 'bpmnFactory',
  // 'create',
  // 'elementFactory',
  // 'palette',
  // 'translate'
// ];
