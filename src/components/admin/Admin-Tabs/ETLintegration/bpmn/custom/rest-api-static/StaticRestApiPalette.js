/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.921Z
 */

// import { operationUniqId } from '../../../../../../../common/utils/helpers';

// export default class StaticRestApiPalette {
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
        // const newId = operationUniqId('SRestApi');
        // const businessObject = bpmnFactory.create('bpmn:Task');
        // businessObject.varibales = suitabilityScore;
        // businessObject.elementData = 'staticRestApi';
        // businessObject.type = 'staticRestApi';
        // businessObject.name = 'StaticRestApi';
        // businessObject.id = newId;
        // const shape = elementFactory.createShape({
          // type: 'bpmn:Task',
          // name: 'StaticRestApi',
          // elementType: 'staticRestApi',
          // businessObject: businessObject
        // });

        // create.start(event, shape);
      // };
    // }
    // return {
      // 'create.staticRestApi': {
        // group: 'activity',
        // className: 'bpmn-rest-api',
        // title: translate('StaticRestApi'),
        // action: {
          // dragstart: createTask({
            // elementData: 'staticRestApi'
          // })
        // }
      // }
    // };
  // }
// }

// StaticRestApiPalette.$inject = [
  // 'bpmnFactory',
  // 'create',
  // 'elementFactory',
  // 'palette',
  // 'translate'
// ];
