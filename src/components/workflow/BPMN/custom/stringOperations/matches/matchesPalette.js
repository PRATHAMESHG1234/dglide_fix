/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.845Z
 */

// import { operationUniqId } from '../../../../../../common/utils/helpers';

// export default class Matchespalette {
  // constructor(bpmnFactory, create, elementFactory, palette, translate) {
    // this.bpmnFactory = bpmnFactory;
    // this.create = create;
    // this.elementFactory = elementFactory;
    // this.translate = translate;

    // palette.registerProvider(this);
  // }

  // getPaletteEntries(element) {
    // const { bpmnFactory, create, elementFactory, translate } = this;

    // function createMatchesOperation(suitabilityScore) {
      // return function (event) {
        // const newId = operationUniqId('matchesOperation');
        // const businessObject = bpmnFactory.create('bpmn:Task');
        // businessObject.varibales = suitabilityScore;
        // businessObject.elementData = 'matchesOperation';
        // businessObject.type = 'matchesOperation';
        // businessObject.name = 'Matches';
        // businessObject.elementType = 'matchesOperation';
        // businessObject.id = newId;
        // const shape = elementFactory.createShape({
          // type: 'bpmn:Task',
          // name: 'matches Operation',
          // businessObject: businessObject
        // });

        // create.start(event, shape);
      // };
    // }
    // return {
      // 'create.matchesOperation': {
        // group: 'stringOperations',
        // className: 'bpmn-matches-operation',
        // title: translate('matches Operation'),
        // action: {
          // dragstart: createMatchesOperation({
            // elementData: 'matchesOperation'
          // }),
          // click: createMatchesOperation({
          //   elementData: 'matchesOperation'
          // })
        // }
      // }
    // };
  // }
// }

// Matchespalette.$inject = [
  // 'bpmnFactory',
  // 'create',
  // 'elementFactory',
  // 'palette',
  // 'translate'
// ];
