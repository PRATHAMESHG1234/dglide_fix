/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.923Z
 */

// import { operationUniqId } from '../../../../../../../common/utils/helpers';

// export default class DynamicRestApiPalette {
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
        // const newId = operationUniqId('dynamicrestApi');
        // const businessObject = bpmnFactory.create('bpmn:Task');
        // businessObject.varibales = suitabilityScore;
        // businessObject.elementData = 'dynamicRestApi';
        // businessObject.type = 'dynamicRestApi';
        // businessObject.name = 'DynamicRestApi';
        // businessObject.id = newId;
        // const shape = elementFactory.createShape({
          // type: 'bpmn:Task',
          // name: 'DynamicRestApi',
          // elementType: 'dynamicRestApi',
          // businessObject: businessObject
        // });

        // create.start(event, shape);
      // };
    // }
    // return {
      // 'create.dynamicRestApi': {
        // group: 'activity',
        // className: 'bpmn-rest-api',
        // title: translate('DynamicRestApi'),
        // action: {
          // dragstart: createTask({
            // elementData: 'dynamicRestApi'
          // })
        // }
      // }
    // };
  // }
// }

// DynamicRestApiPalette.$inject = [
  // 'bpmnFactory',
  // 'create',
  // 'elementFactory',
  // 'palette',
  // 'translate'
// ];
