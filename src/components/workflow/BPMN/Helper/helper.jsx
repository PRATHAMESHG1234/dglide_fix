import { colors } from '../../../../common/constants/styles';
import { notify } from '../../../../hooks/toastUtils';

export const assignYesToFirstExclusiveGateway = (
  bpmnModeler,
  elementId,
  updateFlowInXml,
  setDisabledButton,
  dispatch
) => {
  const modeling = bpmnModeler.get('modeling');
  const elementRegistry = bpmnModeler.get('elementRegistry');

  const exclusiveGateway = elementRegistry?.get(elementId);
  const endEvents = elementRegistry.filter(
    (element) => element.type === 'bpmn:EndEvent'
  );
  // exclusiveGateway?.outgoing[0] === undefined
  //   ? setDisabledButton(false)
  //   : setDisabledButton(true);
  const outgoingFlows = exclusiveGateway?.outgoing;

  outgoingFlows?.forEach((flow, index) => {
    const label = index === 0 ? 'Yes' : 'No';

    if (outgoingFlows.length > 1) {
      // setDisabledButton(false);
      endEvents.forEach((endEvent) => {
        const incomingConnections = endEvent.incoming || [];
        if (incomingConnections.length <= 1) {
          setDisabledButton(false);
        } else {
          setDisabledButton(true);
        }
      });
    } else {
      setDisabledButton(true);
    }
    const color =
      index === 0
        ? { stroke: colors.success.main, fill: 'green' }
        : { stroke: colors.error.main, fill: 'red' };

    modeling.updateLabel(flow, label);
    modeling.setColor([flow], color);

    const suffix = label === 'Yes' ? 'yes' : 'no';
    const suffixPattern = new RegExp(`_${suffix}$`);

    if (!suffixPattern.test(flow.id)) {
      updateFlowInXml(elementRegistry, flow.id, label, bpmnModeler);
    }
  });
};

export const updateFlowInXml = (elementRegistry, flowId, label) => {
  const flowElement = elementRegistry.get(flowId);

  if (flowElement) {
    const businessObject = flowElement.businessObject.sourceRef;
    if (businessObject) {
      const outgoing = businessObject.outgoing || [];
      const flowXml = outgoing.find((flow) => flow.id === flowId);

      if (flowXml) {
        const suffix = label === 'Yes' ? 'yes' : 'no';
        const suffixPattern = new RegExp(`_${suffix}$`);

        if (!suffixPattern.test(flowXml.id)) {
          flowXml.id = `${flowXml.id}_${suffix}`;
        }

        flowXml.name = label;
      }
    }
  }
};

export const checkEndEventsConnections = (
  bpmnModeler,
  elementId,
  setDisabledButton,
  dispatch
) => {
  const elementRegistry = bpmnModeler.get('elementRegistry');
  const endEvents = elementRegistry.filter(
    (element) => element.type === 'bpmn:EndEvent'
  );
  const endElement = elementRegistry?.get(elementId);
  if (endElement?.target.type === 'bpmn:EndEvent') {
    setTimeout(() => {
      endEvents.forEach((endEvent) => {
        const incomingConnections = endEvent.incoming || [];
        if (incomingConnections.length > 1) {
          setDisabledButton(true);

          notify.warning('only one node can be connected to endevent');
        } else {
          setDisabledButton(false);
        }
      });
    }, 500);
  }
};
export const getArryFromObj = (obj) => {
  const keysArray = Object.keys(obj).map((key) => ({
    label: key,
    value: key
  }));
  return keysArray;
};
