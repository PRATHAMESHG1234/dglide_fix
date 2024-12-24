import { operationUniqId } from '../../../../../common/utils/helpers';

export default class GatewayParallelPallate {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createParallelGateway(suitabilityScore) {
      return function (event) {
        const newId = operationUniqId('parallelGateway');
        const businessObject = bpmnFactory.create('bpmn:ParallelGateway');
        businessObject.varibales = suitabilityScore;
        businessObject.elementData = 'parallelGateway';
        businessObject.type = 'parallelGateway';
        businessObject.name = 'Parallel Gateway';
        businessObject.elementType = 'parallelGateway';
        businessObject.id = newId;
        const shape = elementFactory.createShape({
          type: 'bpmn:ParallelGateway',
          name: 'Parallel Gateway',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }
    return {
      'create.parallelGateway': {
        group: 'activity',
        className: 'bpmn-parallel',
        title: translate('Parallel Gateway'),
        action: {
          dragstart: createParallelGateway({
            elementData: 'parallelGateway'
          })
          // click: createParallelGateway({
          //   elementData: 'parallelGateway'
          // })
        }
      }
    };
  }
}

GatewayParallelPallate.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];
