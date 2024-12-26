/*
 * This component was automatically commented out as it was detected as unused.
 * Original file is preserved with .backup extension.
 * Date: 2024-12-26T07:34:02.885Z
 */

// import { colors } from '../../../../../common/constants/styles';
// import { operationUniqId } from '../../../../../common/utils/helpers';

// export default class GatewayPallate {
  // constructor(bpmnFactory, create, elementFactory, palette, translate) {
    // this.bpmnFactory = bpmnFactory;
    // this.create = create;
    // this.elementFactory = elementFactory;
    // this.translate = translate;

    // palette.registerProvider(this);
  // }

  // getPaletteEntries(element) {
    // const { bpmnFactory, create, elementFactory, translate } = this;

    // function createExclusiveGateway(suitabilityScore) {
      // return function (event) {
        // const newId = operationUniqId('exclusiveGateway');
        // const businessObject = bpmnFactory.create('bpmn:ExclusiveGateway');
        // businessObject.varibales = suitabilityScore;
        // businessObject.elementData = 'exclusiveGateway';
        // businessObject.type = 'exclusiveGateway';
        // businessObject.name = 'Exclusive Gateway';
        // businessObject.elementType = 'exclusiveGateway';
        // businessObject.id = newId;
        // const shape = elementFactory.createShape({
          // type: 'bpmn:ExclusiveGateway',
          // name: 'Exclusive Gateway',
          // businessObject: businessObject
        // });

        // create.start(event, shape);
      // };
    // }
    // return {
      // 'create.exclusiveGateway': {
        // group: 'activity',
        // className: 'bpmn-exclusive',
        // title: translate('Exclusive Gateway'),
        // action: {
          // dragstart: createExclusiveGateway({
            // elementData: 'exclusiveGateway'
          // }),
          // click: createExclusiveGateway({
          //   elementData: 'exclusiveGateway'
          // })
        // }
      // }
    // };
  // }
// }

// GatewayPallate.$inject = [
  // 'bpmnFactory',
  // 'create',
  // 'elementFactory',
  // 'palette',
  // 'translate'
// ];
