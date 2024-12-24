// import { operationUniqId } from '../../../../../../../common/utils/helpers';

// export default class Destination {
//   constructor(bpmnFactory, create, elementFactory, palette, translate) {
//     this.bpmnFactory = bpmnFactory;
//     this.create = create;
//     this.elementFactory = elementFactory;
//     this.translate = translate;

//     palette.registerProvider(this);
//   }

//   getPaletteEntries(element) {
//     const { bpmnFactory, create, elementFactory, translate } = this;

//     function createTask(suitabilityScore) {
//       return function (event) {
//         const newId = operationUniqId('destinationPlgin');
//         const businessObject = bpmnFactory.create('bpmn:Task');
//         businessObject.varibales = suitabilityScore;
//         businessObject.elementData = 'destinationPlgin';
//         businessObject.type = 'destinationPlgin';
//         businessObject.name = 'DestinationPlgin';
//         businessObject.id = newId;
//         const shape = elementFactory.createShape({
//           type: 'bpmn:Task',
//           name: 'DestinationPlgin',
//           businessObject: businessObject
//         });

//         create.start(event, shape);
//       };
//     }
//     return {
//       'create.destinationPlgin': {
//         group: 'activity',
//         className: 'bpmn-user',
//         title: translate('DestinationPlgin'),
//         action: {
//           dragstart: createTask({
//             elementData: 'destinationPlgin'
//           })
//         }
//       }
//     };
//   }
// }

// Destination.$inject = [
//   'bpmnFactory',
//   'create',
//   'elementFactory',
//   'palette',
//   'translate'
// ];
