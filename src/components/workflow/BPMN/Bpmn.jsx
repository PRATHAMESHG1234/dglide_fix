import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { X } from 'lucide-react';
import { Box, Tooltip } from '@mui/joy';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { FormLabel } from '@mui/material';
import BpmnColorPickerModule from 'bpmn-js-color-picker';
import 'bpmn-js-color-picker/colors/color-picker.css';
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import xml2js from 'xml2js';

import { colors } from '../../../common/constants/styles';
import {
  checkPaletteLoaded,
  generateUId,
  removeDuplicateName
} from '../../../common/utils/helpers';
import { Button } from '@/componentss/ui/button';
import {
  fetchUpdatedDiagram,
  fetchWorkFlow
} from '../../../redux/slices/workflowSlice';
import { fetchCatalogFlow } from '../../../services/catalogFlow';
import * as fieldService from '../../../services/field';
import * as FORM_SERVICE from '../../../services/form';
import { fetchRecordsBytableName } from '../../../services/table';
import ActionModal from './BpmnActionModal';
import { addDataAtCursor } from './BpmnCommonFunctions';
import { BpmnGateWay } from './BpmnGateWay';
import approvalModule from './custom/approval';
import customRendererModule from './custom/customRenderer';
import gateWayModule from './custom/gateway';
import parallelGateWayModule from './custom/gatewayparallel';
import notifyModule from './custom/notify';
import operationModule from './custom/operation';
import restApiModule from './custom/rest-api';
import setValueModule from './custom/set-value';
import ConcatModule from './custom/stringOperations/concat';
import DateAddModule from './custom/stringOperations/DateAdd';
import DateDiffModule from './custom/stringOperations/DateDiff';
import DateFetchModule from './custom/stringOperations/DateFetch';
import InsertModule from './custom/stringOperations/Insert';
import IsSubStringModule from './custom/stringOperations/issubstring';
import LengthModule from './custom/stringOperations/length';
import LowerCaseModule from './custom/stringOperations/lowercase';
import MatchesModule from './custom/stringOperations/matches';
import ReplaceModule from './custom/stringOperations/replace';
import SubstringModule from './custom/stringOperations/substring';
import TrimModule from './custom/stringOperations/trim';
import UpperCaseModule from './custom/stringOperations/uppercase';
import templateModule from './custom/template';
import { useLocalStorage } from './custom/useLocalStorage';
import {
  assignYesToFirstExclusiveGateway,
  checkEndEventsConnections,
  updateFlowInXml
} from './Helper/helper';
import ConcatPanel from './Panels/concatPanel';
import { DateAddPanel } from './Panels/DateAddPanel';
import { DateDiffPanel } from './Panels/DateDiffPanel';
import { DateFetchPanel } from './Panels/DateFetchPanel';
import { ApprovalPanel } from './Panels/general-function/ApprovalPanel';
import { ConditionPanel } from './Panels/general-function/ConditionPanel';
import { ExpressionPanel } from './Panels/general-function/ExpressionPanel';
import { NotifyPanel } from './Panels/general-function/NotifyPanel';
import { OperationPanel } from './Panels/general-function/OperationPanel';
import { SetValuePanel } from './Panels/general-function/SetValuePanel';
import InsertPanel from './Panels/InsertPanel';
import IssubstringPanel from './Panels/Issubstringpanel';
import { JsonPath } from './Panels/JsonPathPicker';
import LengthPanel from './Panels/lengthPanel';
import LowercasePanel from './Panels/lowercasePanel';
import MatchesPanel from './Panels/matchesPanel';
import ReplaceallPanel from './Panels/replaceAllPanel';
import ReplacePanel from './Panels/replacePanel';
import SubstringPanel from './Panels/substringPanel';
import { TempaltePanel } from './Panels/templatePanel';
import TrimPanel from './Panels/trimPanel';
import UppercasePanel from './Panels/uppercasePanel';
import qaExtension from './resources/qa';
import { modifyJson } from './util';

import './Bpmn.css';
import { notify } from '../../../hooks/toastUtils';

const operationVariableObj = {
  tableName: '',
  tableId: '',
  type: '',
  columns: [
    {
      name: ''
    }
  ]
};

const HIGH_PRIORITY = 1500;

const BpmnNew = () => {
  const inputRef = useRef(null);
  // const [value, setValue] = useState('');
  const [datePickerShow, setDatePickerShow] = useState(false);
  const jsonRef = useRef(null);
  const { currentTheme } = useSelector((state) => state.auth);
  const regexOfIndentifyDot = /^[^.]*\.[^.]*$/;
  let restApiRegex = /^RES-\d{3}$/;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { workFlowId } = useParams();
  const workFlowDetail = useSelector((state) => state?.workflow);

  const [allTableList, setAllTableList] = useState([]);
  const allTableListRef = useRef(null);
  const [tableInfoId, setTableInfoId] = useState();
  const [selectedTableDetail, setSelectedTableDetail] = useState('');
  const [selectedformId, setSelectedformId] = useState('');
  const [destDropdwnCol, setDestDropdwnCol] = useState([]);
  const [modeler, setModeler] = useState();
  const [elementId, setElementId] = useState('');
  const [jsonPathPreText, setjsonPathPreText] = useState('');
  const [element, setElement] = useState(null);
  const [error, setError] = useState(false);
  // const [defineVariablePanel, setDefineVariablePanel] = useState(false);
  const [variableValuePanel, setVariableValuePanel] = useState(false);
  const [expressionPanel, setExpressionPanel] = useState(false);
  // const [fullScreen, setfullScreen] = useState(false);
  const [localStorageData, setLocalStorage] = useState({
    expressionIndex: '',
    expressionType: ''
  });
  // const [conditionText, setConditionText] = useState('');
  const [expressionColumn, setExpressionColumn] = useState([]);
  const [catalogName, setCatalogName] = useState([]);
  const [expressionText, setExpressionText] = useState('');
  const [expression, setExpression] = useState([]);
  const [oldColumnList, setOldColumnList] = useState([]);
  const oldColumnListRef = useRef(null);
  const [newColumnList, setNewColumnList] = useState([]);
  const [newColumnConditionList, setNewColumnConditionList] = useState([]);
  const [operationEvent, setOperationEvent] = useState('');
  const [conditionPanal, setConditionPanal] = useState(false);
  const [templatePanal, setTemplatePanal] = useState(false);
  const [selectedFormField, setSelectedFormField] = useState('');
  const [variableValue, setVariableValue] = useState(operationVariableObj);
  const [approvalPanel, setApprovalPanel] = useState(false);
  const [gateWayPanel, setGateWayPanel] = useState(false);
  const [disableDropdwn, setdisableDropdwn] = useState(false);
  const [parentDataArr, setParentDataArr] = useState([]);
  const [operationPanel, setOperationPanel] = useState(false);
  const [notifyPanel, setNotifyPanel] = useState(false);
  const [expresionByCatagory, setExpresionByCatagory] = useState({
    referanceData: false,
    dropdownData: false
  });
  const [referenceFormList, setReferenceFormList] = useState([]);
  const [jsonContent, setJsonContent] = useState('');
  const [restApiVariableObj, setRestApiVariableObj] = useState({});
  const [disabledButton, setDisabledButton] = useState(false);
  const [jsonPathPickerPanel, setJsonPathPickerPanel] = useState(false);
  const [notifyData, setNotifyData] = useState({
    to: '',
    subject: '',
    messageText: '',
    type: '',
    bcc: '',
    cc: '',
    formId: null,
    notificationType: 'Email',
    operation: 'string',
    templateId: null,
    workflowName: ''
  });
  const { get, set } = useLocalStorage();
  const [restApiDataPanel, setRestApiDataPanel] = useState(false);
  const [dateOperation, setDateOperation] = useState({
    DateAddPanel: false,
    dateDiffPanel: false,
    dateFetchPanel: false
  });

  const [approvalList, setApprovalList] = useState({
    approvalData: [],
    approvalGroupData: [],
    approvalUsersData: []
  });

  const [restApiExpresion, setRestApiExpresion] = useState({
    url: '',
    payload: '',
    headerData: '',
    apiKey: ''
  });
  const [restApiData, setRestApiData] = useState({
    value: '',
    type: ''
  });
  const [restApiExpresionFlag, setrestApiExpresionFlag] = useState(false);
  const [restApiFieldObj, setRestApiFieldObj] = useState();
  // const [templateForm, setTemplateForm] = useState([]);
  const [templateData, setTemplateData] = useState({
    formName: '',
    formId: '',
    templateId: '',
    value: ''
  });
  const [approvalData, setApprovalData] = useState({
    c_type: '',
    type: '',
    user: '',
    level: '',
    group: ''
  });
  const [gateWayData, setgateWayData] = useState({
    condition: '',
    type: ''
  });
  const [operationData, setOperationData] = useState({
    operation: '',
    value: '',
    type: '',
    condition: '',
    dest_formName: '',
    dest_formId: '',
    source_formName: '',
    source_formId: ''
  });
  const [gatewayConditions, setGatewayConditions] = useState({
    // conditionId: generateUId(),
    fieldName: '',
    operator: '',
    value: ''
  });
  const [conditionText, setConditionText] = useState('');
  const [workFlowType, setWorkFlowType] = useState('');
  const [nodePath, setNodePath] = useState('');

  const [operationConditions, setOperationConditions] = useState([
    {
      conditionId: generateUId(),
      dest_field: '',
      operator: '',
      source_field: '',
      dest_field_id: ''
    }
  ]);

  const [stringOperations, setStringOperations] = useState({
    InsertOperationPanel: false,
    LengthOperationPanel: false,
    MatchesOperationPanel: false,
    ReplaceOperationPanel: false,
    ReplaceAllOperationPanel: false,
    IsSubStringOperationPanel: false,
    UpperCaseOperationPanel: false,
    LowerCaseOperationPanel: false,
    setTrimOperationPanel: false,
    setSubstringOperationPanel: false,
    ConcatOperationPanel: false,
    other: false
  });

  const [insertOperationData, setInsertOperationData] = useState({
    type: 'insert',
    input: '',
    position: '',
    substring: ''
  });
  const [dateAddData, setDateAddData] = useState({
    operation_type: 'dateadd',
    date: '',
    type: '',
    days: '',
    hours: '',
    minutes: '',
    seconds: ''
  });
  const [dateDiffData, setDateDiffData] = useState({
    operation_type: 'datediff',
    date1: '',
    date2: ''
  });
  const [dateFetchData, setDateFetchData] = useState({
    operation_type: 'datefetch',
    date: '',
    param: ''
  });
  const [lengthOperationData, setLengthOperationData] = useState({
    type: 'length',
    input: ''
  });

  const [matchesOperationData, setMatchesOperationData] = useState({
    type: 'matches',
    input: '',
    regex: ''
  });

  const [replaceOperationData, setReplaceOperationData] = useState({
    type: 'replace',
    input: '',
    target: '',
    replacement: ''
  });

  const [replaceAllOperationData, setReplaceAllOperationData] = useState({
    type: 'replaceall',
    input: '',
    target: '',
    replacement: ''
  });

  const [isSubStringOperationData, setIsSubStringOperationData] = useState({
    type: 'issubstring',
    input: '',
    substring: ''
  });

  const [upperCaseOperationData, setUpperCaseOperationData] = useState({
    type: 'uppercase',
    input: ''
  });

  const [lowerCaseOperationData, setLowerCaseOperationData] = useState({
    type: 'lowercase',
    input: ''
  });

  const [trimOperationData, setTrimOperationData] = useState({
    type: 'trim',
    input: ''
  });

  const [substringOperationData, setSubstringOperationData] = useState({
    type: 'substring',
    input: '',
    beginindex: '',
    endindex: ''
  });

  const [concatOperationData, setConcatOperationData] = useState({
    type: 'concat',
    input: '',
    beginindex: '',
    endindex: ''
  });

  const fetchApprovalData = () => {
    const data = fetchRecordsBytableName('approval_rule').then((res) => {
      setApprovalList((prev) => ({
        ...prev,
        approvalData: res?.data
      }));
    });
  };

  const fetchApprovalGroupData = () => {
    const data = fetchRecordsBytableName('system_group').then((res) => {
      setApprovalList((prev) => ({
        ...prev,
        approvalGroupData: res?.data
      }));
    });
  };

  const fetchApprovalUsersData = () => {
    const data = fetchRecordsBytableName('system_user').then((res) => {
      setApprovalList((prev) => ({
        ...prev,
        approvalUsersData: res?.data
      }));
    });
  };

  useEffect(() => {
    if (workFlowDetail.workFlow?.source_type_display) {
      setWorkFlowType(workFlowDetail.workFlow.source_type_display);
      setCatalogName(workFlowDetail.workFlow?.catalog_id_display);
    }
    fetchApprovalData();
    fetchApprovalGroupData();
    fetchApprovalUsersData();
  }, []);

  const getAllFormsList = async () => {
    const tableListData = await FORM_SERVICE.fetchForms();
    allTableListRef.current = tableListData?.result;
    setAllTableList(tableListData?.result);
  };

  useEffect(() => {
    if (workFlowDetail.workFlow.source_type_display) {
      setWorkFlowType(workFlowDetail.workFlow.source_type_display);
      setCatalogName(workFlowDetail.workFlow?.catalog_id_display);
    }
    getAllFormsList();
    let xmlString = localStorage.getItem('xmlDataBPMN');
    xmlString = xmlString.split('\n').join('');
    xmlString = xmlString.split('\t').join('');
    xmlString = xmlString.split('\n').join('');
    xmlString = xmlString.split('\t').join('');
    let props = workFlowDetail.workFlow.form_info_id_display
      ? workFlowDetail.workFlow.form_info_id_display
      : workFlowDetail.workFlow;
    const initializeDiagram = () => {
      return new Promise((resolve, reject) => {
        initDiagram(xmlString, props);
        resolve();
      });
    };
    initializeDiagram();
  }, [workFlowDetail?.workFlow]);

  useEffect(() => {
    if (
      workFlowId !== 'undefined' ||
      workFlowId !== 'null' ||
      workFlowId !== undefined ||
      workFlowId !== null
    ) {
      dispatch(fetchWorkFlow({ workFlowId }));
    }
  }, [workFlowId]);

  const handleRowSelect = (index, e) => {
    setExpressionColumn(e.target.value);
  };

  const getParentElem = (Arr, childElem, parentArr) => {
    for (const sequenceFlow of Arr) {
      if (sequenceFlow.id === childElem) {
        if (Array.isArray(sequenceFlow.incoming)) {
          for (const item of sequenceFlow.incoming) {
            if (item.sourceRef?.name !== 'Start') {
              parentArr.push(item);
              if (item.sourceRef?.id) {
                getParentElem(Arr, item.sourceRef.id, parentArr);
              }
            }
          }
        }
      }
    }
    return parentArr;
  };

  const getVariableTaskId = (definitions, task) => {
    let parentArr = [];
    for (const process of definitions.rootElements) {
      let sequenceFlows = process.flowElements?.filter(
        (element) =>
          element.$type === 'bpmn:Task' ||
          element.$type === 'bpmn:ExclusiveGateway'
      );
      const parentElemt = getParentElem(
        sequenceFlows,
        task?.businessObject?.id,
        parentArr
      );

      return parentElemt;
    }
  };

  const getFinalData = (tempArray) => {
    setParentDataArr([...tempArray]);
  };

  const getPerentData = (definitions, elem) => {
    const previousTaskId = getVariableTaskId(definitions, elem);

    if (previousTaskId) {
      const tempArray = [];

      previousTaskId.forEach((elem) => {
        const { sourceRef } = elem;

        const parentData = sourceRef?.$attrs?.variables;
        if (!parentData) return;

        const variableData = JSON.parse(parentData);

        const addOutputs = (outputArr, type) => {
          if (type === 'RestApi') {
            setRestApiVariableObj((prev) => ({
              ...prev,
              [sourceRef.id]: variableData?.json
            }));
            tempArray.push({
              id: sourceRef.id,
              name: `${sourceRef.id}`,
              value: '',
              label: `${sourceRef.id}`
            });
          } else {
            outputArr?.forEach((o) => {
              tempArray.push({
                id: sourceRef.id,
                name: `${sourceRef.id}.out.${
                  type === 'value' ? o.name : 'string'
                }`,
                value: '',
                label: `${sourceRef.id}.out.${
                  type === 'value' ? o.name : 'string'
                }`
              });
            });
          }
        };
        switch (sourceRef.name) {
          case 'Operation':
            if (variableData?.operation === 'Select') {
              addOutputs(variableData?.value, 'value');
            }
            break;
          case 'Set value':
            addOutputs(variableData?.columns, 'value');
            break;
          case 'RestApi':
            addOutputs(sourceRef.id, 'RestApi');
            break;
          case 'Insert':
          case 'Length':
          case 'Matches':
          case 'Replace':
          case 'Issubstring':
          case 'Substring':
          case 'Uppercase':
          case 'Lowercase':
          case 'Trim':
          case 'Concat':
            tempArray.push({
              id: sourceRef.id,
              name: `${sourceRef.id}.out.string`,
              value: '',
              label: `${sourceRef.id}.out.string`
            });
          case 'DateAdd':
          case 'DateDiff':
          case 'DateFetch':
            tempArray.push({
              id: sourceRef.id,
              name: `${sourceRef.id}.out.datetime`,
              value: '',
              label: `${sourceRef.id}.out.datetime`
            });
            break;
          default:
            return;
        }
      });

      getFinalData(tempArray);
    } else {
      setError(true);
    }
  };

  const initDiagram = (xmlData, seleTableName) => {
    if (seleTableName) {
      const container = document.getElementById('container');
      if (!modeler) {
        const bpmnModeler = new BpmnModeler({
          container,
          additionalModules: [
            parallelGateWayModule,
            gateWayModule,
            setValueModule,
            notifyModule,
            approvalModule,
            operationModule,
            restApiModule,
            templateModule,
            BpmnColorPickerModule,
            customRendererModule,
            InsertModule,
            LengthModule,
            MatchesModule,
            ReplaceModule,
            // ReplaceAllModule,
            IsSubStringModule,
            UpperCaseModule,
            LowerCaseModule,
            TrimModule,
            SubstringModule,
            ConcatModule,
            DateAddModule,
            DateDiffModule,
            DateFetchModule
          ],
          keyboard: {
            bindTo: document
          },
          moddleExtensions: {
            qa: qaExtension
          }
        });
        bpmnModeler
          .importXML(xmlData)
          .then(() => {
            setModeler(bpmnModeler);
            const canvas = bpmnModeler.get('canvas');
            canvas.zoom('fit-viewport');

            let element;
            const definitions = bpmnModeler.getDefinitions();
            // removeDuplicate name
            removeDuplicateName();

            //customize side panel//////////////////
            const paletteInterval = setInterval(() => {
              if (document.querySelector('.djs-palette-entries')) {
                clearInterval(paletteInterval);
                checkPaletteLoaded();
              }
            }, 100);

            bpmnModeler.on('element.added', HIGH_PRIORITY, (event) => {
              const addedElement = event.element;
              if (addedElement.type === 'bpmn:SequenceFlow') {
                const source = addedElement.source;
                if (source.type === 'bpmn:ExclusiveGateway') {
                  setTimeout(() => {
                    assignYesToFirstExclusiveGateway(
                      bpmnModeler,
                      source.id,
                      updateFlowInXml,
                      setDisabledButton
                    );
                  }, 500);
                }
              }
            });

            bpmnModeler.on('connect.end', (event) => {
              const connection = event.context.connection;
              if (connection.type === 'bpmn:SequenceFlow') {
                const source = connection.source;
                checkEndEventsConnections(
                  bpmnModeler,
                  connection.id,
                  setDisabledButton,
                  dispatch
                );
                if (source.type === 'bpmn:ExclusiveGateway') {
                  setTimeout(() => {
                    assignYesToFirstExclusiveGateway(
                      bpmnModeler,
                      source.id,
                      updateFlowInXml,
                      setDisabledButton,
                      dispatch
                    );
                  }, 500);
                }
              }
            });

            bpmnModeler.on('element.changed', HIGH_PRIORITY, (event) => {
              const changedElement = event.element;
              if (
                changedElement.type === 'bpmn:ExclusiveGateway' ||
                changedElement.type === 'bpmn:EndEvent' ||
                changedElement.type === 'bpmn:StartEvent'
              ) {
                removeDuplicateName();
              }

              if (
                changedElement.type === 'bpmn:ExclusiveGateway' ||
                changedElement.type === 'bpmn:EndEvent'
              ) {
                setTimeout(() => {
                  assignYesToFirstExclusiveGateway(
                    bpmnModeler,
                    changedElement.id,
                    updateFlowInXml,
                    setDisabledButton
                  );
                }, 500);
              }
            });

            bpmnModeler.on('element.dblclick', HIGH_PRIORITY, (event) => {
              event.originalEvent.preventDefault();
              event.originalEvent.stopPropagation();

              ({ element } = event);
              const elem = element;
              setElement(elem);
              setElementId(elem.id);
              let {
                $attrs: { variables, type, elementData }
              } = elem.businessObject;

              if (variables) {
                variables = JSON.parse(variables);
              }

              set(`currentElementId`, elem.id);

              if (
                elem.type === 'bpmn:Task' &&
                (elem.businessObject.name.toLowerCase() === 'set value' ||
                  (variables && variables.type === 'set-value'))
              ) {
                setVariableValuePanel(true);
                getPerentData(definitions, elem);
                setError(false);
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`variableValue_${elem.id}`, variables);
                  let variableArray = JSON.parse(variables);
                  setVariableValue(variableArray);
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                (elem.businessObject.name.toLowerCase() === 'notify' ||
                  (variables && variables.type === 'notify'))
              ) {
                getPerentData(definitions, elem);
                setNotifyPanel(true);
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`notify_${elem.id}`, variables);
                  let notifyData = JSON.parse(variables);
                  setNotifyData(notifyData);
                } else {
                  setNotifyData({
                    to: '',
                    subject: '',
                    messageText: '',
                    type: '',
                    bcc: null,
                    cc: null,
                    formId: null,
                    notificationType: 'Email',
                    operation: 'string',
                    templateId: null,
                    workflowName: ''
                  });
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                (elem.businessObject.name.toLowerCase() === 'approval' ||
                  (variables && variables.type === 'approval'))
              ) {
                getPerentData(definitions, elem);
                let {
                  $attrs: { variables }
                } = elem.businessObject;

                setApprovalPanel(true);
                if (variables) {
                  set(`approval_${elem.id}`, variables);
                  let approvalData = JSON.parse(variables);
                  setApprovalData(approvalData);
                } else {
                  setApprovalData({
                    user: '',
                    value: ''
                  });
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                (elem.businessObject.name.toLowerCase() === 'operation' ||
                  (variables && variables.type === 'operation'))
              ) {
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                setOperationPanel(true);

                getPerentData(definitions, elem);

                if (variables) {
                  setdisableDropdwn(true);
                  set(`operation_${elem.id}`, variables);
                  let operationData = JSON.parse(variables);

                  if (operationData.value) {
                    let value = operationData?.value;
                    setNewColumnList(value);
                    // getSourceTableColumn(operationData.source_formId);
                    setSelectedTableDetail(operationData.dest_formName);
                  }
                  setOperationData(operationData);
                  let parsedGateway = operationData.condition;

                  if (parsedGateway.length === 1) {
                    setOperationConditions((prev) =>
                      prev.map((condition) => ({
                        dest_field: parsedGateway[0]?.dest_field,
                        source_field: parsedGateway[0]?.source_field,
                        operator: parsedGateway[0]?.operator,
                        dest_field_id: parsedGateway[0]?.dest_field_id,
                        conditionId: parsedGateway[0]?.conditionId
                      }))
                    );
                  }

                  setTableInfoId(operationData.source_formId);
                  setSelectedformId(operationData.dest_formId);
                  setOperationEvent(operationData.operation);
                } else {
                  setdisableDropdwn(false);
                  setOperationPanel(true);
                  setOperationData({
                    operation: '',
                    value: '',
                    type: '',
                    condition: '',
                    dest_formId: '',
                    dest_formName: ''
                  });
                  setOperationConditions((prev) =>
                    prev?.map((condition) => ({
                      ...condition,
                      dest_field: '',
                      source_field: '',
                      operator: '',
                      dest_field_id: ''
                    }))
                  );

                  // setOperationEvent("");
                  // setSelectedformId("");
                  setNewColumnList([]);
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'restapi'
              ) {
                getPerentData(definitions, elem);
                setRestApiDataPanel(true);
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`restApi_${elem.id}`, variables);
                  let restApiData = JSON.parse(variables);

                  setRestApiData({
                    value: restApiData,
                    type: 'restApi'
                  });
                } else {
                  setRestApiData({
                    value: '',
                    type: ''
                  });
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'task'
              ) {
                getPerentData(definitions, elem);
                setTemplatePanal(true);
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  setdisableDropdwn(true);
                  set(`template_${elem.id}`, variables);
                  let prcedTemplateData = JSON.parse(variables);
                  let obj = {
                    formId: prcedTemplateData?.formId,
                    formName: prcedTemplateData?.formName,
                    templateId: prcedTemplateData?.templateId,
                    value: prcedTemplateData?.value
                  };
                  setTemplateData(obj);
                  // setTemplateData((prev) => ({
                  //   ...prev,
                  //   formId: prcedTemplateData?.formId,
                  //   formName: prcedTemplateData?.formName,
                  //   templateId: prcedTemplateData?.templateId,
                  //   value: prcedTemplateData?.value,
                  // }));
                  setSelectedformId(prcedTemplateData?.formId);
                  setNewColumnList(prcedTemplateData?.value);
                } else {
                  let obj = {
                    formId: '',
                    formName: '',
                    templateId: '',
                    value: ''
                  };
                  setTemplateData(obj);
                  setNewColumnList([]);
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'insert'
              ) {
                getPerentData(definitions, elem);
                setStringOperations((prev) => ({
                  ...prev,
                  InsertOperationPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`insert_${elem.id}`, variables);
                  let InsertOperationData = JSON.parse(variables);

                  setInsertOperationData(InsertOperationData);
                } else {
                  setInsertOperationData((prev) => ({
                    ...prev,
                    input: '',
                    substring: '',
                    position: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'length'
              ) {
                getPerentData(definitions, elem);
                setStringOperations((prev) => ({
                  ...prev,
                  LengthOperationPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`length_${elem.id}`, variables);
                  let LengthOperationData = JSON.parse(variables);

                  setLengthOperationData(LengthOperationData);
                } else {
                  setLengthOperationData((prev) => ({
                    ...prev,
                    input: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'matches'
              ) {
                getPerentData(definitions, elem);
                setStringOperations((prev) => ({
                  ...prev,
                  MatchesOperationPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`matches_${elem.id}`, variables);
                  let MatchesOperationData = JSON.parse(variables);

                  setMatchesOperationData(MatchesOperationData);
                } else {
                  setMatchesOperationData((prev) => ({
                    ...prev,
                    input: '',
                    regex: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'replace'
              ) {
                getPerentData(definitions, elem);
                setStringOperations((prev) => ({
                  ...prev,
                  ReplaceOperationPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`replace_${elem.id}`, variables);
                  let ReplaceOperationData = JSON.parse(variables);

                  setReplaceOperationData(ReplaceOperationData);
                } else {
                  setReplaceOperationData((prev) => ({
                    ...prev,
                    input: '',
                    target: '',
                    replacement: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'replaceall'
              ) {
                getPerentData(definitions, elem);
                setStringOperations((prev) => ({
                  ...prev,
                  ReplaceAllOperationPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`replaceall_${elem.id}`, variables);
                  let ReplaceallOperationData = JSON.parse(variables);

                  setReplaceAllOperationData(ReplaceallOperationData);
                } else {
                  setReplaceAllOperationData((prev) => ({
                    ...prev,
                    input: '',
                    target: '',
                    replacement: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'issubstring'
              ) {
                getPerentData(definitions, elem);
                setStringOperations((prev) => ({
                  ...prev,
                  IsSubStringOperationPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`issubstring_${elem.id}`, variables);
                  let IssubstringOperationData = JSON.parse(variables);

                  setIsSubStringOperationData(IssubstringOperationData);
                } else {
                  setIsSubStringOperationData((prev) => ({
                    ...prev,
                    input: '',
                    substring: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'uppercase'
              ) {
                getPerentData(definitions, elem);
                setStringOperations((prev) => ({
                  ...prev,
                  UpperCaseOperationPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`uppercase_${elem.id}`, variables);
                  let UppercaseOperationData = JSON.parse(variables);

                  setUpperCaseOperationData(UppercaseOperationData);
                } else {
                  setUpperCaseOperationData((prev) => ({
                    ...prev,
                    input: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'lowercase'
              ) {
                getPerentData(definitions, elem);
                setStringOperations((prev) => ({
                  ...prev,
                  LowerCaseOperationPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`lowercase_${elem.id}`, variables);
                  let LowercaseOperationData = JSON.parse(variables);

                  setLowerCaseOperationData(LowercaseOperationData);
                } else {
                  setLowerCaseOperationData((prev) => ({
                    ...prev,
                    input: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'trim'
              ) {
                getPerentData(definitions, elem);
                setStringOperations((prev) => ({
                  ...prev,
                  TrimOperationPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`trim_${elem.id}`, variables);
                  let TrimOperationData = JSON.parse(variables);

                  setTrimOperationData(TrimOperationData);
                } else {
                  setTrimOperationData((prev) => ({
                    ...prev,
                    input: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'substring'
              ) {
                getPerentData(definitions, elem);
                setStringOperations((prev) => ({
                  ...prev,
                  SubstringOperationPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`substring_${elem.id}`, variables);
                  let SubstringOperationData = JSON.parse(variables);

                  setSubstringOperationData(SubstringOperationData);
                } else {
                  setSubstringOperationData((prev) => ({
                    ...prev,
                    input: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name.toLowerCase() === 'concat'
              ) {
                getPerentData(definitions, elem);
                setStringOperations((prev) => ({
                  ...prev,
                  ConcatOperationPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`concat_${elem.id}`, variables);
                  let ConcatOperationData = JSON.parse(variables);

                  setConcatOperationData(ConcatOperationData);
                } else {
                  setConcatOperationData((prev) => ({
                    ...prev,
                    input: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:ExclusiveGateway' &&
                (elem.businessObject.name.toLowerCase() ===
                  'exclusive gateway' ||
                  (variables && variables.type === 'exclusiveGateway'))
              ) {
                getPerentData(definitions, elem);

                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`gateway_${elem.id}`, variables);
                  let gateWayDataa = JSON.parse(variables);
                  setgateWayData(gateWayDataa);
                  setConditionText(gateWayDataa?.condition);
                } else {
                  setGateWayPanel(true);
                  setgateWayData({
                    condition: '',
                    type: ''
                  });
                }
                setGateWayPanel(true);
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name === 'DateAdd'
              ) {
                getPerentData(definitions, elem);
                setDateOperation((prev) => ({
                  ...prev,
                  DateAddPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`dateAdd_${elem.id}`, variables);
                  let DateAdd = JSON.parse(variables);

                  setDateAddData(DateAdd);
                } else {
                  setDateAddData((prev) => ({
                    ...prev,
                    date: '',
                    type: '',
                    days: '',
                    hours: '',
                    minutes: '',
                    seconds: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name === 'DateDiff'
              ) {
                getPerentData(definitions, elem);
                setDateOperation((prev) => ({
                  ...prev,
                  dateDiffPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`dateDiff_${elem.id}`, variables);
                  let parcedData = JSON.parse(variables);

                  setDateDiffData(parcedData);
                } else {
                  setDateDiffData((prev) => ({
                    ...prev,
                    date1: '',
                    date2: ''
                  }));
                }
              } else if (
                elem.type === 'bpmn:Task' &&
                elem.businessObject.name === 'DateFetch'
              ) {
                getPerentData(definitions, elem);
                setDateOperation((prev) => ({
                  ...prev,
                  dateFetchPanel: true
                }));
                let {
                  $attrs: { variables }
                } = elem.businessObject;
                if (variables) {
                  set(`dateFetch_${elem.id}`, variables);
                  let parcedData = JSON.parse(variables);
                  setDateFetchData(parcedData);
                } else {
                  setDateFetchData((prev) => ({
                    ...prev,
                    date: '',
                    param: ''
                  }));
                }
              }
            });
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const setApprovalValue = (value, field) => {
    const approval = Object.assign({}, approvalData);
    approval[field] = value;
    if (currentApprover?.condition === 'group') {
      approval['level'] = '';
      approval['user'] = '';
    }
    if (currentApprover?.condition === 'email') {
      approval['level'] = '';
      approval['group'] = '';
    }
    if (
      currentApprover?.condition?.replace(/\s+/g, '')?.toLowerCase() ===
      'email,level'
    ) {
      approval['group'] = '';
    }

    approval.c_type = 'approval';
    setApprovalData(approval);
    set(`approval_${elementId}`, JSON.stringify(approval));
    setError(false);
  };

  const setOperationValue = (value, operation) => {
    const Operation = Object.assign({}, operationData);
    if (operation === 'operation') {
      Operation.operation = value;
    } else if (operation === 'condition') {
      Operation.condition = value;
    }
    Operation.type = 'operation';
    Operation.dest_formId = '';
    setOperationData(Operation);
    set(`operation_${elementId}`, JSON.stringify(Operation));
    setError(false);
  };

  useEffect(() => {
    if (
      workFlowDetail &&
      workFlowDetail.workFlow &&
      workFlowDetail.workFlow.bpmn_str
    ) {
      let expresionPanel;
      if (workFlowDetail.workFlow?.source_type_display === 'Form') {
        // setTableInfoId(workFlowDetail.workFlow?.form_info_id);
        // getSourceTableColumn(workFlowDetail.workFlow?.form_info_id);
        // localStorage.setItem("tableId", JSON.stringify(Number(workFlowDetail.workFlow?.form_info_id)));
        // expresionPanel = workFlowDetail.workFlow.form_info_id_display
        let selectedTable;

        if (allTableListRef.current?.length > 0) {
          selectedTable = allTableListRef.current?.find(
            (o) =>
              o.name === workFlowDetail.workFlow.form_info_id_display ||
              o.displayName === workFlowDetail.workFlow.form_info_id_display
          );

          if (selectedTable) {
            setTableInfoId(selectedTable?.formInfoId);
            getSourceTableColumn(selectedTable?.formInfoId);
            let tableIdNum = selectedTable.formInfoId;
            localStorage.setItem('tableId', JSON.stringify(tableIdNum));
            expresionPanel = selectedTable?.displayName;
          }
        }
      } else if (workFlowDetail.workFlow?.source_type_display === 'Catalog') {
        if (workFlowDetail.workFlow?.catalog_id) {
          fetchCatalogFlow(workFlowDetail.workFlow?.catalog_id).then(
            (response) => {
              if (response?.result) {
                let result = response?.result;
                oldColumnListRef.current = JSON.parse(result.json_str)?.fields;
                setOldColumnList(JSON.parse(result.json_str)?.fields);
                expresionPanel = workFlowDetail.workFlow;
              }
            }
          );
        }
      }
      let xmlString = localStorage.getItem('xmlDataBPMN');
      xmlString = xmlString.split('\n').join('');
      xmlString = xmlString.split('\t').join('');
      xmlString = xmlString.split('\n').join('');
      xmlString = xmlString.split('\t').join('');
      const initializeDiagram = () => {
        return new Promise((resolve, reject) => {
          initDiagram(xmlString, expresionPanel);
          resolve();
        });
      };
      initializeDiagram();
    }
  }, [workFlowDetail.workFlow, allTableListRef.current, parentDataArr]);

  const addVariable = () => {
    const variable = Object.assign({}, variableValue);
    variable.columns.push({
      name: ''
    });
    setVariableValue(variable);
    // set(`defineVariable_${elementId}`, JSON.stringify(variable));
  };

  const operationConditionHandler = (criteria, value, currCondition) => {
    setOperationConditions((prev) =>
      prev?.map((condition) => {
        if (condition.conditionId === currCondition.conditionId) {
          if (criteria === 'dest_field') {
            const column = newColumnConditionList?.find(
              (column) => column.fieldInfoId === value
            );
            const dest_form_text = `{${selectedTableDetail}.${column.name}}`;
            if (column) {
              return {
                ...condition,
                [criteria]: dest_form_text,
                dest_field_id: value
              };
            } else {
              return condition;
            }
          }

          return {
            ...condition,
            [criteria]: value
          };
        }
        return {
          ...condition,
          [criteria]: value
        };
      })
    );
  };

  const submitGateWay = () => {
    const elementId = get(`currentElementId`) || '';
    setElementId(elementId);
    const gateWay = Object.assign({}, gateWayData);
    gateWay.condition = conditionText;
    gateWay.type = 'exclusiveGateway';
    setgateWayData(gateWay);
    set(`gateWay_${elementId}`, JSON.stringify(gateWay));
    setError(false);
    let local = get(`gateWay_${elementId}`) || null;
    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: local,
        s_type: 'exclusiveGateway'
      });
      setgateWayData({
        condition: '',
        type: ''
      });
      setConditionText('');
      setGateWayPanel(false);
    }
  };

  const submitOperationPanal = () => {
    const elementId = get(`currentElementId`) || '';
    setElementId(elementId);
    let local = get(`operation_${elementId}`) || null;
    let filteredData = newColumnList.filter(
      (item) => item.hasOwnProperty('value') && item.value !== null
    );
    if (local) {
      local = JSON.parse(local);
      local.dest_formId = selectedformId;
      local.dest_formName = selectedTableDetail;
      local.source_formName = workFlowDetail.workFlow.form_info_id_display;
      local.source_formId = tableInfoId;
      local.value = operationEvent === 'Select' ? newColumnList : filteredData;
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: JSON.stringify(local),
        s_type: 'operation'
      });
      setOperationData({
        operation: '',
        value: '',
        type: '',
        condition: '',
        source_formName: ''
      });
      setOperationEvent('');
      setSelectedformId('');
      setNewColumnList([]);
      setOperationPanel(false);
      setExpression('');
    }
  };
  const submitTemplatePanal = () => {
    const elementId = get(`currentElementId`) || '';
    //set newcolumn list of temlate to local////
    let filteredData = newColumnList.filter(
      (item) => item.hasOwnProperty('value') && item.value !== null
    );
    const copyTemplate = Object.assign({}, templateData);
    copyTemplate.value = filteredData;
    setTemplateData(copyTemplate);
    set(`template_${elementId}`, JSON.stringify(copyTemplate));

    let local = get(`template_${elementId}`) || null;

    if (local) {
      local = JSON.parse(local);
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: JSON.stringify(local),
        s_type: 'template'
      });

      setTemplatePanal(false);
      setExpression('');
      setTemplateData((prev) => ({
        formId: '',
        formName: '',
        templateId: '',
        value: ''
      }));
      setNewColumnList([]);
      setSelectedformId('');
      setdisableDropdwn(false);
    }
  };

  const setGateWayExpression = (value, field, currCondition) => {
    let copyOfCondition = Object.assign({}, currCondition);
    copyOfCondition[field] = value;
    setGatewayConditions(copyOfCondition);
  };

  const setRestApiExpressionData = (value, field) => {
    let restApiRef = Object.assign({}, restApiExpresion);
    restApiRef[field] = value;
    setRestApiExpresion(restApiRef);
  };

  // const setTemplateDataValue = (value, field, currCondition) => {
  //   let copyOfTemplateData = Object.assign({}, templateData);
  //   copyOfTemplateData[field] = value;
  //   setTemplateData(copyOfTemplateData);
  // };

  const submitSetVariable = () => {
    const elementId = get(`currentElementId`) || '';
    let local = get(`variableValue_${elementId}`) || null;
    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: local,
        s_type: 'set-value'
      });
      setVariableValue({});
      setVariableValuePanel(false);
    }
  };

  // const submitinsertApiPanel = (data) => {
  //   const RestApi = Object.assign({}, insertOperationData);

  //   setRestApiData(RestApi);
  //   const elementId = get(`currentElementId`) || '';
  //   set(`insert_${elementId}`, JSON.stringify(data));

  //   setElementId(elementId);
  //   let local = JSON.stringify(data) || null;
  //   // local.elementType = 'restApi'

  //   if (local) {
  //     local = JSON.parse(local);
  //     // local.restApiValue = JSON.stringify(data);
  //     const modeling = modeler.get('modeling');
  //     modeling.updateProperties(element, {
  //       variables: JSON.stringify(local),
  //       s_type: 'stringOperation'
  //     });
  //     // setRestApiData({
  //     //   value: "",
  //     //   type: "",
  //     // });
  //     setStringOperations((prev) => ({
  //       ...prev,
  //       InsertOperationPanel: false
  //     }));
  //   }
  // };

  const setVariableDataValue = (value, field, index) => {
    const variable = Object.assign({}, variableValue);
    variable.columns[index][field] = value;
    variable.type = 'set-value';
    setVariableValue(variable);
    set(`variableValue_${elementId}`, JSON.stringify(variable));
  };

  const setOperationValueData = (value, field, index) => {
    let variable;
    variable = Object.assign({}, newColumnList);
    variable[index][field] = value;
    const arrayOfVariable = Object.keys(variable)?.map((key) => ({
      id: key,
      category: variable[key]?.category || null,
      options: variable[key]?.options || null,
      dataType: variable[key]?.dataType || null,
      fieldInfoId: variable[key]?.fieldInfoId || null,
      formName: workFlowDetail.workFlow?.form_info_id_display
        ? workFlowDetail.workFlow?.form_info_id_display
        : null,
      formInfoId: variable[key]?.formInfoId || null,
      label: variable[key]?.label || null,
      name: variable[key]?.name || null,
      type: variable[key]?.type || null,
      value: variable[key]?.value || null
    }));

    setNewColumnList(arrayOfVariable);
  };

  const setNotifyValue = (value, field) => {
    let sourceTableId = localStorage.getItem('tableId');
    const notify = Object.assign({}, notifyData);
    notify[field] = value;
    notify.type = 'notify';
    notify.formId = sourceTableId;
    notify.workflowName = workFlowDetail?.workFlow?.name;
    setNotifyData(notify);
    set(`notify_${elementId}`, JSON.stringify(notify));
  };

  function getUniqueArray(arr, key) {
    return arr
      .filter(
        (item, index, self) =>
          item.name !== '' &&
          self.findIndex((obj) => obj[key] === item[key]) === index
      )
      .sort((a, b) => {
        if (!a.fieldInfoId) return 1;
        if (!b.fieldInfoId) return -1;
        return 0;
      });
  }

  const getTableColumn = async (formId, type) => {
    let selectedTableName = allTableListRef.current?.filter((elem) => {
      return elem.formInfoId == formId;
    });
    setSelectedformId(selectedTableName[0]?.formInfoId);

    setSelectedTableDetail(selectedTableName[0]?.displayName);
    if (
      formId !== 'undefined' ||
      formId !== 'null' ||
      formId !== undefined ||
      formId !== null
    ) {
      let allColumList = [];
      const tableColumnData = await fieldService.fetchFieldsByFormId(formId);
      setNewColumnConditionList(tableColumnData?.result);
      const tableColumn = tableColumnData?.result.filter(
        (o) => o.category !== 'AutoIncrement'
      );
      if (disableDropdwn === false) {
        allColumList = [...tableColumn];
      } else {
        allColumList = [...newColumnList, ...tableColumn];
      }
      const uniqueArray = getUniqueArray(allColumList, 'name');
      const updatedList = uniqueArray.map((field) => {
        const updatedOptions = field.options?.map((option) => {
          return {
            ...option,
            newLabel: option.label
          };
        });
        // Return the field with updated options
        return {
          ...field,
          options: updatedOptions
        };
      });
      setNewColumnList(updatedList);
    }
  };

  const AddVariablToOperation = (columnList) => {
    if (parentDataArr.length > 0) {
      const uniqueArray = getUniqueArray(
        [...columnList, ...parentDataArr],
        'name'
      );
      oldColumnListRef.current = uniqueArray;
      setOldColumnList(uniqueArray);
    }
  };

  const getSourceTableColumn = async (tableInfoId) => {
    if (
      tableInfoId !== 'undefined' ||
      tableInfoId !== 'null' ||
      tableInfoId !== undefined ||
      tableInfoId !== null
    ) {
      const tableColumn = await fieldService.fetchFieldsByFormId(tableInfoId);
      const allColumList = [...tableColumn?.result];

      if (parentDataArr.length > 0) {
        AddVariablToOperation(allColumList);
      } else {
        const uniqueArray = getUniqueArray(allColumList, 'name');
        oldColumnListRef.current = uniqueArray;
        setOldColumnList(uniqueArray);
      }
    }
  };

  useEffect(() => {
    if (parentDataArr.length > 0) {
      AddVariablToOperation(oldColumnList);
    }
  }, [parentDataArr]);

  useEffect(() => {
    if (destDropdwnCol.length > 0) {
      const uniqueArray = getUniqueArray(
        [...destDropdwnCol, ...oldColumnListRef.current, ...parentDataArr],
        'name'
      );
      setOldColumnList(uniqueArray);
    }
  }, [destDropdwnCol]);

  const addJsonPathPicker = (index, type, obj, currCondition) => {
    setJsonPathPickerPanel(true);
    setRestApiFieldObj(obj);
    localStorage.setItem(`currCondition`, JSON.stringify(currCondition));
    localStorage.setItem(`expressionIndex`, index);
    localStorage.setItem(`expressionType`, type);
  };

  const addExpression = (index, type, value, currCondition) => {
    if (currCondition) {
      localStorage.setItem(`currCondition`, JSON.stringify(currCondition));
    }
    localStorage.setItem(`expressionIndex`, index);
    localStorage.setItem(`expressionType`, type);
    setLocalStorage({
      expressionIndex: index,
      expressionType: type
    });
    setExpression(value);
    setExpressionPanel(true);

    if (type === 'operation') {
      const selectedEleData = newColumnList[index];
      if (selectedEleData.category === 'DropDown') {
        selectedEleData?.options.forEach((element) => {
          if (workFlowType === 'Form') {
            element.name = `${selectedEleData.label}.${
              element.label || element.name
            }`;
          } else if (workFlowType === 'Catalog') {
            element.name = element.newLabel;
            element.label = `${selectedEleData.label}.${element.newLabel}`;
          }
        });
        setDestDropdwnCol(selectedEleData?.options);
      } else {
        setOldColumnList(oldColumnListRef.current);
        setDestDropdwnCol([]);
      }
    }
    if (index === 'value' && type === 'exclusiveGateway') {
      const selectedEleData = selectedFormField;
      if (
        selectedEleData.category === 'DropDown' ||
        selectedEleData.category === 'Radio'
      ) {
        selectedEleData?.options.forEach((element) => {
          element.name = `${selectedEleData.label}.${
            element.label || element.name
          }`;
          element.label = `${selectedEleData.label}.${element.label}`;
        });

        const uniqueArray = getUniqueArray(
          [...selectedEleData?.options, ...oldColumnList, ...parentDataArr],
          'name'
        );
        setOldColumnList(uniqueArray);
        setDestDropdwnCol(selectedEleData?.options);
      } else {
        setDestDropdwnCol([]);
      }
    }
    if (index === 'fieldName' && type === 'exclusiveGateway') {
      setOldColumnList(oldColumnListRef.current);
    }
    setSelectedFormField('');
  };
  const submitJsonPathExpression = () => {
    setError(false);
    setJsonPathPickerPanel(false);
    setJsonContent('');
    // setExpression((prevExpression) =>
    //   prevExpression ? prevExpression + nodePath : nodePath
    // );
    // let expressionIndex = localStorage.getItem("expressionIndex") || -1;
    // let expressionType = localStorage.getItem("expressionType") || "";
    // const currentCondtn = localStorage.getItem(`currCondition`);
    // console.log("JSON,", expressionIndex, expressionType, currentCondtn);
  };
  const submitExpression = () => {
    setError(false);

    let expressionIndex = localStorage.getItem('expressionIndex') || -1;
    let expressionType = localStorage.getItem('expressionType') || '';

    if (expression && expression.length > 0) {
      // const expressionIndex = localStorage.getItem('expressionIndex') || -1;
      // const expressionType = localStorage.getItem('expressionType') || '';
      if (expressionType == 'setValue') {
        if (Number(expressionIndex) > -1) {
          setVariableDataValue(expression, 'value', expressionIndex);
        }
      } else if (expressionType === 'approval') {
        setApprovalValue(expression, 'value');
      } else if (expressionType === 'notify') {
        setNotifyValue(expression, expressionIndex);
      } else if (expressionType === 'insertOperation') {
        setInsertOperationData((prevState) => ({
          ...prevState,
          input: expression
        }));
      } else if (expressionType === 'lengthOperation') {
        setLengthOperationData((prevState) => ({
          ...prevState,
          input: expression
        }));
      } else if (expressionType === 'matchesOperation') {
        setMatchesOperationData((prevState) => ({
          ...prevState,
          input: expression
        }));
      } else if (expressionType === 'replaceOperation') {
        setReplaceOperationData((prevState) => ({
          ...prevState,
          input: expression
        }));
      } else if (expressionType === 'replaceAllOperation') {
        setReplaceAllOperationData((prevState) => ({
          ...prevState,
          input: expression
        }));
      } else if (expressionType === 'issubstringOperation') {
        setIsSubStringOperationData((prevState) => ({
          ...prevState,
          input: expression
        }));
      } else if (expressionType === 'uppercaseOperation') {
        setUpperCaseOperationData((prevState) => ({
          ...prevState,
          input: expression
        }));
      } else if (expressionType === 'lowercaseOperation') {
        setLowerCaseOperationData((prevState) => ({
          ...prevState,
          input: expression
        }));
      } else if (expressionType === 'trimOperation') {
        setTrimOperationData((prevState) => ({
          ...prevState,
          input: expression
        }));
      } else if (expressionType === 'dateAddOperation') {
        setDateAddData((prevState) => ({
          ...prevState,
          date: expression
        }));
      } else if (expressionType === 'dateDiffOperation') {
        setDateDiffData((prevState) => ({
          ...prevState,
          [expressionIndex]: expression
        }));
      } else if (expressionType === 'dateFetchOperation') {
        setDateFetchData((prevState) => ({
          ...prevState,
          date: expression
        }));
      } else if (expressionType === 'substringOperation') {
        setSubstringOperationData((prevState) => ({
          ...prevState,
          input: expression
        }));
      } else if (expressionType === 'concatOperation') {
        setConcatOperationData((prevState) => ({
          ...prevState,
          input: expression
        }));
      } else if (expressionType === 'operation') {
        if (Number(expressionIndex) > -1) {
          setOperationValueData(expression, 'value', expressionIndex);
        }
      } else if (expressionType === 'conditionPanel') {
        if (Number(expressionIndex) > -1) {
          operationConditionHandler('source_field', expression, '');
        }
      } else if (expressionType === 'exclusiveGateway') {
        let gateWayCondition = localStorage.getItem(`currCondition`);
        setGateWayExpression(
          expression,
          expressionIndex,
          JSON.parse(gateWayCondition)
        );
      } else if (expressionType === 'restApi') {
        setrestApiExpresionFlag(!restApiExpresionFlag);
        setRestApiExpressionData(expression, expressionIndex);
      } else if (expressionType === 'template') {
        if (Number(expressionIndex) > -1) {
          setOperationValueData(expression, 'value', expressionIndex);
        }
      }
      setExpressionPanel(false);
      setExpression('');
      setExpressionColumn([]);
      setExpressionText('');
    } else if (expressionType === 'operation') {
      if (Number(expressionIndex) > -1) {
        setOperationValueData(expressionText, 'value', expressionIndex);
        setExpressionPanel(false);
      }
    } else {
      setError(true);
    }
    setDatePickerShow(false);
  };

  // const closeExpressionPanel = () => {
  //   setExpressionPanel(false);
  //   setDatePickerShow(false);
  //   setfullScreen(false);
  //   setOldColumnList(oldColumnListRef.current);
  //   setSelectedFormField('');
  //   setExpresionByCatagory({
  //     dropdownData: false,
  //     referanceData: false
  //   });
  // };

  const parseXMLToJson = async (xmlString) => {
    xmlString = xmlString.split('\n').join('');
    xmlString = xmlString.split('\t').join('');
    const parser = new xml2js.Parser({ explicitArray: false });
    let result = await new Promise((resolve, reject) =>
      parser.parseString(xmlString, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
    );
    if (result) {
      result = await modifyJson(result);
    }
    return result;
  };

  const downloadXml = async () => {
    setdisableDropdwn(false);
    let offlineElem = [];
    const definitions = modeler.getDefinitions();
    for (const process of definitions.rootElements) {
      let sequenceFlows = process.flowElements?.filter(
        (element) =>
          'incoming' in element ||
          'outgoing' in element ||
          'sourceRef' in element ||
          'targetRef' in element
      );
      offlineElem = process.flowElements?.filter(
        (element) =>
          !(
            'incoming' in element ||
            'outgoing' in element ||
            'sourceRef' in element ||
            'targetRef' in element
          )
      );
      process.flowElements = sequenceFlows;
    }
    if (offlineElem.length) {
      notify.error('Please Remove offline element');
    } else {
      let xml = await modeler?.saveXML({ format: true });
      const json = await parseXMLToJson(xml.xml);
      const updatedData = {
        bpmn_str: xml.xml,
        json_str: JSON.stringify(json),
        workflow_record_id: workFlowDetail.workFlow?.uuid,
        workflow_id: workFlowDetail.workFlow?.workflow_id
      };
      localStorage.setItem('xmlDataBPMN', xml.xml);

      if (
        updatedData !== 'undefined' ||
        updatedData !== 'null' ||
        updatedData !== undefined ||
        updatedData !== null ||
        updatedData !== ''
      ) {
        dispatch(fetchUpdatedDiagram({ workflow: updatedData }));
      }
    }
  };

  const closeGateWayPanel = () => {
    setGateWayPanel(false);
    setConditionText('');
  };

  const closeTemplatePanel = () => {
    setTemplatePanal(false);
    setdisableDropdwn(false);
    setSelectedformId('');
    let obj = {
      formId: '',
      formName: '',
      templateId: '',
      value: ''
    };
    setTemplateData(obj);
    setNewColumnList([]);
  };

  useEffect(() => {
    setExpression((prevExpression) =>
      prevExpression ? prevExpression + nodePath : nodePath
    );
  }, [nodePath]);

  const handleExpression = async (SelectedOption) => {
    let selectedField = oldColumnList.filter((o) => {
      if (workFlowType !== 'Catalog') {
        return o.name === SelectedOption;
      } else {
        return o.field_name === SelectedOption;
      }
    });
    if (selectedField.length > 0) {
      setSelectedFormField(selectedField[0]);
    }

    let newExpression;
    if (selectedField[0]?.category === 'Reference') {
      oldColumnListRef.current = oldColumnList;
      const lookupFormId = selectedField[0]?.lookup?.parentFormInfoId
        ? selectedField[0]?.lookup?.parentFormInfoId
        : selectedField[0]?.lookup?.formInfoId;
      fieldService.fetchFieldsByFormId(lookupFormId).then((res) => {
        setReferenceFormList(res?.result);
        setOldColumnList(res?.result);
        // setExpresionByCatagory(true);
        setExpresionByCatagory({
          referanceData: true
        });
      });
    } else if (selectedField[0]?.category === 'DropDown') {
      oldColumnListRef.current = oldColumnList;
      const newArrObj = [
        {
          label: 'by_value',
          value: 'by_value',
          name: 'by_value'
        },
        {
          label: 'by_name',
          value: 'by_name',
          name: 'by_name'
        }
      ];
      setOldColumnList(newArrObj);
      setExpresionByCatagory({
        dropdownData: true
      });
    } else if (restApiRegex.test(SelectedOption)) {
      const file = restApiVariableObj[SelectedOption];

      if (file) {
        const URL = process.env.REACT_APP_STORAGE_URL;
        const Json = `${URL}/${file.filePath}/${file.fileName}`;
        try {
          const response = await fetch(Json);

          if (response.ok) {
            const data = await response.json();
            const jsonString = JSON.stringify(data);
            setJsonContent(jsonString);
          }
        } catch (error) {
          console.error('Error fetching JSON content:', error);
        }
      }
      setJsonPathPickerPanel(true);
      setjsonPathPreText(SelectedOption);
    } else if (regexOfIndentifyDot.test(SelectedOption)) {
      destDropdwnCol.forEach((ele) => {
        if (workFlowType !== 'Catalog') {
          if (ele.name === SelectedOption) {
            newExpression = ele.value;
          }
        } else {
          if (ele.label === SelectedOption) {
            newExpression = ele.value.toString();
          }
        }
      });
      addDataAtCursor(newExpression, inputRef, expression, setExpression);
    } else if (!SelectedOption.includes('.out.')) {
      newExpression = `{${
        workFlowType === 'Catalog'
          ? `${workFlowDetail?.workFlow?.catalog_id_display}.${SelectedOption}`
          : `${workFlowDetail?.workFlow?.form_info_id_display}.${SelectedOption}`
      }}`;
      addDataAtCursor(newExpression, inputRef, expression, setExpression);
    } else {
      newExpression = `{${SelectedOption}}`;
      addDataAtCursor(newExpression, inputRef, expression, setExpression);
    }
  };

  const currentApprover = approvalList?.approvalData?.filter(
    (item) => item.uuid === approvalData.type
  )[0];
  return (
    <div className="border" style={{ borderRadius: '10px' }}>
      <div
        className="bpmn-content flex items-center justify-between px-3"
        style={{
          height: '60px'
        }}
      >
        <FormLabel
          sx={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: currentTheme === 'Dark' ? colors.grey[700] : colors.grey[900]
          }}
        >
          {workFlowDetail?.workFlow
            ? `${
                workFlowDetail.workFlow.name?.charAt(0).toUpperCase() +
                workFlowDetail.workFlow.name?.slice(1)
              } - ${
                workFlowDetail.workFlow.source_type_display === 'Catalog'
                  ? workFlowDetail.workFlow.catalog_id_display
                      ?.charAt(0)
                      .toUpperCase() +
                    workFlowDetail.workFlow.catalog_id_display?.slice(1)
                  : workFlowDetail.workFlow.form_info_id_display
                      ?.charAt(0)
                      .toUpperCase() +
                    workFlowDetail.workFlow.form_info_id_display?.slice(1)
              }`
            : null}
        </FormLabel>
        <div className="flex items-center">
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Tooltip title="Save WorkFlow Diagram">
              <Button disabled={disabledButton} onClick={downloadXml}>
                Save
              </Button>
            </Tooltip>
            <Tooltip title="Close WorkFlow Diagram">
              <Button
                className="close-icon"
                onClick={() => navigate('/workflow')}
                variant="outline"
              >
                <CloseIcon />
              </Button>
            </Tooltip>
          </Box>
        </div>
      </div>
      <div
        id="container"
        className={`diagram-box border-top bpmn-content m-0 ${
          operationPanel === true ? 'locked' : ''
        }`}
      ></div>
      {dateOperation?.DateAddPanel && (
        <DateAddPanel
          dateAddData={dateAddData}
          setDateAddData={setDateAddData}
          setDateOperation={setDateOperation}
          setDatePickerShow={setDatePickerShow}
          addExpression={addExpression}
          elementId={elementId}
          modeler={modeler}
          element={element}
        />
      )}
      {dateOperation?.dateDiffPanel && (
        <DateDiffPanel
          dateDiffData={dateDiffData}
          setDateDiffData={setDateDiffData}
          addExpression={addExpression}
          setDateOperation={setDateOperation}
          setDatePickerShow={setDatePickerShow}
          elementId={elementId}
          modeler={modeler}
          element={element}
        />
      )}
      {dateOperation?.dateFetchPanel && (
        <DateFetchPanel
          dateFetchData={dateFetchData}
          setDateFetchData={setDateFetchData}
          addExpression={addExpression}
          setDatePickerShow={setDatePickerShow}
          elementId={elementId}
          setDateOperation={setDateOperation}
          modeler={modeler}
          element={element}
        />
      )}
      {stringOperations?.InsertOperationPanel && (
        <InsertPanel
          insertOperationData={insertOperationData}
          setInsertOperationData={setInsertOperationData}
          addExpression={addExpression}
          elementId={elementId}
          modeler={modeler}
          element={element}
          setStringOperations={setStringOperations}
        />
      )}
      {stringOperations?.LengthOperationPanel && (
        <LengthPanel
          lengthOperationData={lengthOperationData}
          setLengthOperationData={setLengthOperationData}
          addExpression={addExpression}
          elementId={elementId}
          modeler={modeler}
          element={element}
          setStringOperations={setStringOperations}
        />
      )}

      {stringOperations?.MatchesOperationPanel && (
        <MatchesPanel
          matchesOperationData={matchesOperationData}
          setMatchesOperationData={setMatchesOperationData}
          addExpression={addExpression}
          elementId={elementId}
          modeler={modeler}
          element={element}
          setStringOperations={setStringOperations}
        />
      )}

      {stringOperations?.ReplaceOperationPanel && (
        <ReplacePanel
          replaceOperationData={replaceOperationData}
          setReplaceOperationData={setReplaceOperationData}
          addExpression={addExpression}
          elementId={elementId}
          modeler={modeler}
          element={element}
          setStringOperations={setStringOperations}
        />
      )}

      {stringOperations?.ReplaceAllOperationPanel && (
        <ReplaceallPanel
          replaceAllOperationData={replaceAllOperationData}
          setReplaceAllOperationData={setReplaceAllOperationData}
          addExpression={addExpression}
          elementId={elementId}
          modeler={modeler}
          element={element}
          setStringOperations={setStringOperations}
        />
      )}

      {stringOperations?.IsSubStringOperationPanel && (
        <IssubstringPanel
          isSubStringOperationData={isSubStringOperationData}
          setIsSubStringOperationData={setIsSubStringOperationData}
          addExpression={addExpression}
          elementId={elementId}
          modeler={modeler}
          element={element}
          setStringOperations={setStringOperations}
        />
      )}

      {stringOperations?.UpperCaseOperationPanel && (
        <UppercasePanel
          upperCaseOperationData={upperCaseOperationData}
          setUpperCaseOperationData={setUpperCaseOperationData}
          addExpression={addExpression}
          elementId={elementId}
          modeler={modeler}
          element={element}
          setStringOperations={setStringOperations}
        />
      )}
      {stringOperations?.LowerCaseOperationPanel && (
        <LowercasePanel
          lowerCaseOperationData={lowerCaseOperationData}
          setLowerCaseOperationData={setLowerCaseOperationData}
          addExpression={addExpression}
          elementId={elementId}
          modeler={modeler}
          element={element}
          setStringOperations={setStringOperations}
        />
      )}

      {stringOperations?.TrimOperationPanel && (
        <TrimPanel
          trimOperationData={trimOperationData}
          setTrimOperationData={setTrimOperationData}
          addExpression={addExpression}
          elementId={elementId}
          modeler={modeler}
          element={element}
          setStringOperations={setStringOperations}
        />
      )}

      {stringOperations?.SubstringOperationPanel && (
        <SubstringPanel
          substringOperationData={substringOperationData}
          setSubstringOperationData={setSubstringOperationData}
          addExpression={addExpression}
          elementId={elementId}
          modeler={modeler}
          element={element}
          setStringOperations={setStringOperations}
        />
      )}
      {stringOperations?.ConcatOperationPanel && (
        <ConcatPanel
          concatOperationData={concatOperationData}
          setConcatOperationData={setConcatOperationData}
          addExpression={addExpression}
          elementId={elementId}
          modeler={modeler}
          element={element}
          setStringOperations={setStringOperations}
        />
      )}
      {templatePanal && (
        <TempaltePanel
          selectedformId={selectedformId}
          closeTemplatePanel={closeTemplatePanel}
          formList={allTableListRef.current}
          getTableColumn={getTableColumn}
          newColumnList={newColumnList}
          handleRowSelect={handleRowSelect}
          setNewColumnList={setNewColumnList}
          setSelectedformId={setSelectedformId}
          submitTemplatePanal={submitTemplatePanal}
          addExpression={addExpression}
          templateData={templateData}
          setTemplateData={setTemplateData}
          elementId={elementId}
          modeler={modeler}
          element={element}
        />
      )}
      {variableValuePanel && (
        <SetValuePanel
          setVariableValuePanel={setVariableValuePanel}
          variableValue={variableValue}
          setVariableDataValue={setVariableDataValue}
          addExpression={addExpression}
          elementId={elementId}
          setVariableValue={setVariableValue}
          addVariable={addVariable}
          submitSetVariable={submitSetVariable}
          error={error}
        />
      )}

      {notifyPanel && (
        <NotifyPanel
          setNotifyPanel={setNotifyPanel}
          notifyData={notifyData}
          setNotifyValue={setNotifyValue}
          addExpression={addExpression}
          setNotifyData={setNotifyData}
          elementId={elementId}
          modeler={modeler}
          element={element}
        />
      )}
      {approvalPanel && approvalList && (
        <ApprovalPanel
          elementId={elementId}
          modeler={modeler}
          element={element}
          setApprovalPanel={setApprovalPanel}
          approvalData={approvalData}
          setApprovalValue={setApprovalValue}
          approvalList={approvalList}
          currentApprover={currentApprover}
        />
      )}

      {operationPanel && (
        <OperationPanel
          disableDropdwn={disableDropdwn}
          operationData={operationData}
          setOperationEvent={setOperationEvent}
          setOperationData={setOperationData}
          setOperationValue={setOperationValue}
          getTableColumn={getTableColumn}
          selectedformId={selectedformId}
          allTableListRef={allTableListRef}
          setConditionPanal={setConditionPanal}
          operationEvent={operationEvent}
          selectedTableDetail={selectedTableDetail}
          newColumnList={newColumnList}
          addExpression={addExpression}
          handleRowSelect={handleRowSelect}
          setNewColumnList={setNewColumnList}
          submitOperationPanal={submitOperationPanal}
          setOperationPanel={setOperationPanel}
          setSelectedformId={setSelectedformId}
        />
      )}

      {gateWayPanel && (
        <BpmnGateWay
          addExpression={addExpression}
          conditions={gatewayConditions}
          setConditions={setGatewayConditions}
          conditionText={conditionText}
          setConditionText={setConditionText}
          closeGateWayPanel={closeGateWayPanel}
          submitGateWay={submitGateWay}
          // tableColumns={oldColumnList}
        />
      )}

      {conditionPanal && (
        <ConditionPanel
          setConditionPanal={setConditionPanal}
          operationConditions={operationConditions}
          newColumnConditionList={newColumnConditionList}
          operationConditionHandler={operationConditionHandler}
          addExpression={addExpression}
          setOperationValue={setOperationValue}
          error={error}
        />
      )}

      {restApiDataPanel && (
        <ActionModal
          restApiSelectedData={restApiData}
          expression={restApiExpresion}
          ExpressionPanel={addExpression}
          modeler={modeler}
          element={element}
          restApiExpresionFlag={restApiExpresionFlag}
          setRestApiExpressionData={setRestApiExpressionData}
          setRestApiDataPanel={setRestApiDataPanel}
          setRestApiData={setRestApiData}
          restApiData={restApiData}
          restApiFieldObj={restApiFieldObj}
          addJsonPathPicker={addJsonPathPicker}
          nodePath={nodePath}
          setJsonContent={setJsonContent}
          jsonContent={jsonContent}
          jsonRef={jsonRef}
          jsonPathPickerPanel={jsonPathPickerPanel}
        />
      )}

      {expressionPanel && (
        <ExpressionPanel
          inputRef={inputRef}
          datePickerShow={datePickerShow}
          expression={expression}
          setExpression={setExpression}
          expressionColumn={expressionColumn}
          setError={setError}
          error={error}
          expresionByCatagory={expresionByCatagory}
          handleExpression={handleExpression}
          oldColumnList={oldColumnList}
          workFlowType={workFlowType}
          localStorageData={localStorageData}
          setLocalStorage={setLocalStorage}
          submitExpression={submitExpression}
          selectedFormField={selectedFormField}
          setOldColumnList={setOldColumnList}
          oldColumnListRef={oldColumnListRef}
          setExpresionByCatagory={setExpresionByCatagory}
          setSelectedFormField={setSelectedFormField}
          setExpressionPanel={setExpressionPanel}
          setDatePickerShow={setDatePickerShow}
        />
      )}
      {jsonPathPickerPanel && (
        <JsonPath
          jsonContent={jsonContent}
          elementId={jsonPathPreText || 'output'}
          nodePath={nodePath}
          setNodePath={setNodePath}
          jsonPathPickerPanel={jsonPathPickerPanel}
          onCancel={() => {
            setJsonPathPickerPanel(false);
            setJsonContent('');
          }}
          submitJsonPathExpression={submitJsonPathExpression}
        />
      )}
    </div>
  );
};
export default BpmnNew;
