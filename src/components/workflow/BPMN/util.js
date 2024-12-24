export const newBpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1jjwewn" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="12.0.0">
  <bpmn:process id="Process_1st2zcl" isExecutable="false">
    <bpmn:startEvent id="StartEvent_162g9mu" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1st2zcl">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_162g9mu">
        <dc:Bounds x="172" y="82" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

export const modifyJson = async (result) => {
  for (const key in result) {
    if (result[key]) {
      if (
        typeof result[key] === 'object' &&
        !Array.isArray(result[key]) &&
        result[key] !== null
      ) {
        if (key === '$') {
          let data = result[key];
          delete result[key];
          result = { ...result, ...data };
        } else {
          result[key] = await modifyJson(result[key]);
        }
      } else if (Array.isArray(result[key]) && result[key] !== null) {
        if (result[key].length === 1) {
          let data = result[key][0];
          data = await modifyJson(data);
          delete result[key];
          result[key] = data;
        } else {
          let index = 0;
          for (let item of result[key]) {
            result[key][index] = await modifyJson(item);
            index++;
          }
        }
      }
    }
  }
  return result;
};

export const initJson = {
  'bpmn:definitions': {
    'bpmn:process': {
      'bpmn:startEvent': {
        'bpmn:outgoing': 'Flow_1pi2h9h',
        id: 'StartEvent_1',
        name: 'Start'
      },

      'bpmn:sequenceFlow': [
        {
          id: 'Flow_1pi2h9h',
          sourceRef: 'StartEvent_1',
          targetRef: 'Activity_1jmvmoa'
        },
        {
          id: 'Flow_0nfsrmb',
          sourceRef: 'Activity_1jmvmoa',
          targetRef: 'Event_1g7g8ak'
        }
      ],
      'bpmn:endEvent': {
        'bpmn:incoming': 'Flow_0nfsrmb',
        id: 'Event_1g7g8ak',
        name: 'End'
      },
      id: 'Process_03dsped',
      isExecutable: 'true'
    },
    'bpmndi:BPMNDiagram': {
      'bpmndi:BPMNPlane': {
        'bpmndi:BPMNShape': [
          {
            'dc:Bounds': {
              x: '179',
              y: '159',
              width: '36',
              height: '36'
            },
            'bpmndi:BPMNLabel': {
              'dc:Bounds': {
                x: '162',
                y: '202',
                width: '70',
                height: '27'
              }
            },
            id: '_BPMNShape_StartEvent_2',
            bpmnElement: 'StartEvent_1'
          },
          {
            'dc:Bounds': {
              x: '270',
              y: '137',
              width: '100',
              height: '80'
            },
            id: 'Activity_1jmvmoa_di',
            bpmnElement: 'Activity_1jmvmoa'
          },
          {
            'dc:Bounds': {
              x: '432',
              y: '159',
              width: '36',
              height: '36'
            },
            'bpmndi:BPMNLabel': {
              'dc:Bounds': {
                x: '415',
                y: '202',
                width: '71',
                height: '27'
              }
            },
            id: 'Event_1g7g8ak_di',
            bpmnElement: 'Event_1g7g8ak'
          }
        ],
        'bpmndi:BPMNEdge': [
          {
            'di:waypoint': [
              {
                x: '215',
                y: '177'
              },
              {
                x: '270',
                y: '177'
              }
            ],
            id: 'Flow_1pi2h9h_di',
            bpmnElement: 'Flow_1pi2h9h'
          },
          {
            'di:waypoint': [
              {
                x: '370',
                y: '177'
              },
              {
                x: '432',
                y: '177'
              }
            ],
            id: 'Flow_0nfsrmb_di',
            bpmnElement: 'Flow_0nfsrmb'
          }
        ],
        id: 'BPMNPlane_1',
        bpmnElement: 'Process_03dsped'
      },
      id: 'BPMNDiagram_1'
    },
    'xmlns:bpmn': 'http://www.omg.org/spec/BPMN/20100524/MODEL',
    'xmlns:bpmndi': 'http://www.omg.org/spec/BPMN/20100524/DI',
    'xmlns:dc': 'http://www.omg.org/spec/DD/20100524/DC',
    'xmlns:di': 'http://www.omg.org/spec/DD/20100524/DI',
    id: 'Definitions_0ex8ya2',
    targetNamespace: 'http://bpmn.io/schema/bpmn',
    exporter: 'Camunda Modeler',
    exporterVersion: '4.4.0'
  }
};

export const initBpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0zw4i2i" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="14.0.0">
  <bpmn:process id="Process_17y7r53" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1a82p43" name="Start">
      <bpmn:outgoing>Flow_0uch9j1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:endEvent id="Event_1abhgyw" name="End">
      <bpmn:incoming>Flow_0uch9j1</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_0uch9j1" sourceRef="StartEvent_1a82p43" targetRef="Event_1abhgyw" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_17y7r53">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1a82p43">
        <dc:Bounds x="152" y="82" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="158" y="125" width="24" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1abhgyw_di" bpmnElement="Event_1abhgyw">
        <dc:Bounds x="332" y="82" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="340" y="125" width="20" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_0uch9j1_di" bpmnElement="Flow_0uch9j1">
        <di:waypoint x="188" y="100" />
        <di:waypoint x="332" y="100" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

export const etlXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0zw4i2i" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="14.0.0">
  <bpmn:process id="Process_17y7r53" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1a82p43" name="Start">
      <bpmn:outgoing>Flow_0uch9j1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:endEvent id="Event_1abhgyw" name="End">
      <bpmn:incoming>Flow_16dn977</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_0uch9j1" sourceRef="StartEvent_1a82p43" targetRef="NOT-619" />
    <bpmn:task id="NOT-619" name="Source" s_type="source"> 
      <bpmn:outgoing>Flow_0is1op0</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="DES-888" name="Destination" s_type="destination" >
      <bpmn:incoming>Flow_0i12k3k</bpmn:incoming>
      <bpmn:outgoing>Flow_16dn977</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_16dn977" sourceRef="DES-888" targetRef="Event_1abhgyw" />
    <bpmn:task id="INS-639" name="Source operation"  s_type="sourceId">
      <bpmn:incoming>Flow_0is1op0</bpmn:incoming>
      <bpmn:outgoing>Flow_0nry13u</bpmn:outgoing>
      <bpmn:outgoing>Flow_16rekj8</bpmn:outgoing>
    </bpmn:task>
    <bpmn:task id="LEN-800" name="Destination Operation"  s_type="destinationId">
      <bpmn:incoming>Flow_0xepdea</bpmn:incoming>
      <bpmn:incoming>Flow_0pnrms8</bpmn:incoming>
      <bpmn:outgoing>Flow_0i12k3k</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_0is1op0" sourceRef="NOT-619" targetRef="INS-639" />
    <bpmn:sequenceFlow id="Flow_0i12k3k" sourceRef="LEN-800" targetRef="DES-888" />
    <bpmn:task id="DYN-101" name="Transformation">
      <bpmn:incoming>Flow_0nry13u</bpmn:incoming>
      <bpmn:outgoing>Flow_0xepdea</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_0nry13u" sourceRef="INS-639" targetRef="DYN-101" />
    <bpmn:sequenceFlow id="Flow_0xepdea" sourceRef="DYN-101" targetRef="LEN-800" />
   
   
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_17y7r53">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1a82p43">
        <dc:Bounds x="52" y="82" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="58" y="125" width="25" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1abhgyw_di" bpmnElement="Event_1abhgyw">
        <dc:Bounds x="842" y="82" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="850" y="125" width="21" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="NOT-619_di" bpmnElement="NOT-619">
        <dc:Bounds x="150" y="60" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="DES-888_di" bpmnElement="DES-888">
        <dc:Bounds x="690" y="60" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="INS-639_di" bpmnElement="INS-639">
        <dc:Bounds x="240" y="-130" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="LEN-800_di" bpmnElement="LEN-800">
        <dc:Bounds x="590" y="-130" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="DYN-101_di" bpmnElement="DYN-101">
        <dc:Bounds x="430" y="-130" width="100" height="80" />
      </bpmndi:BPMNShape>
      
      <bpmndi:BPMNEdge id="Flow_0uch9j1_di" bpmnElement="Flow_0uch9j1">
        <di:waypoint x="88" y="100" />
        <di:waypoint x="150" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_16dn977_di" bpmnElement="Flow_16dn977">
        <di:waypoint x="790" y="100" />
        <di:waypoint x="842" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0is1op0_di" bpmnElement="Flow_0is1op0">
        <di:waypoint x="200" y="60" />
        <di:waypoint x="200" y="-90" />
        <di:waypoint x="240" y="-90" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0i12k3k_di" bpmnElement="Flow_0i12k3k">
        <di:waypoint x="690" y="-90" />
        <di:waypoint x="720" y="-90" />
        <di:waypoint x="720" y="60" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0nry13u_di" bpmnElement="Flow_0nry13u">
        <di:waypoint x="340" y="-90" />
        <di:waypoint x="430" y="-90" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0xepdea_di" bpmnElement="Flow_0xepdea">
        <di:waypoint x="530" y="-90" />
        <di:waypoint x="590" y="-90" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_16rekj8_di" bpmnElement="Flow_16rekj8">
        <di:waypoint x="340" y="-90" />
        <di:waypoint x="420" y="-90" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0pnrms8_di" bpmnElement="Flow_0pnrms8">
        <di:waypoint x="520" y="-90" />
        <di:waypoint x="590" y="-90" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
