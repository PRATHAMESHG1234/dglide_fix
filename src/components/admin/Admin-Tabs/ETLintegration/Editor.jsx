import { useEffect, useRef, useState } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import qaExtension from '../../../workflow/BPMN/resources/qa.json';
import { useLocalStorage } from '../../../workflow/BPMN/custom/useLocalStorage';
// import { xml2json } from 'xml-js';
import StaticRestApiModule from '../ETLintegration/bpmn/custom/rest-api-static';
import DynamicRestApiModule from '../ETLintegration/bpmn/custom/rest-api-dynamic';
import { Button } from '@/componentss/ui/button';
import { Input } from '@/componentss/ui/input';
import customRendererModule from './bpmn/custom/customRenderer';
import {
  createNewEtlJobs,
  fetchAllObjectById,
  fetchAllPluginById,
  fetchAllTransformation,
  fetchEnvByPluinId,
  updateJobByJobID
} from '../../../../services/integration';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ChevronsLeftRight, Plus, Trash2, X } from 'lucide-react';
import ActionModal from './bpmn/BpmnActionModal';
import { notify } from '../../../../hooks/toastUtils';
import { addDataAtCursor } from '../../../workflow/BPMN/BpmnCommonFunctions';
import { Textarea } from '@/componentss/ui/textarea';
import { JsonPath } from '../../../workflow/BPMN/Panels/JsonPathPicker';
import { SourcePluginPanel } from './bpmn/SourcePluginPanel';
import { OperationPanel } from './bpmn/OperationPanel';
import { TransformationPanel } from './bpmn/TransformationPanel';
import { ExpressionPanel } from './bpmn/ExpressionPanel';
export const defaultExpresion = [
  {
    label: 'SourceObject',
    value: 'sourceObject'
  },
  {
    label: 'SourceEnvironment',
    value: 'sourceEnvironment'
  },
  {
    label: 'DestinationEnvironment',
    value: 'destinationEnvironment'
  },
  {
    label: 'Transformation',
    value: 'transformation'
  }
];
const JobEditor = ({}) => {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [expression, setExpression] = useState([]);
  const [expressionPanel, setExpressionPanel] = useState(false);
  const [secondExp, setSecondExp] = useState(false);
  const [panelName, setPanelName] = useState('');
  const [staticText, setStaticText] = useState('');
  const [selectedJob, setSelectedJob] = useState();
  const [modeler, setModeler] = useState();
  const [elementId, setElementId] = useState('');
  const [srcSelectedPlugin, setSrcSelectedPlugin] = useState('');
  const [destSelectedPlugin, setDestSelectedPlugin] = useState('');

  const [allPluginList, setAllPluginList] = useState([]);
  const allPluginListRef = useRef([]);
  const [transformationList, setTransformationList] = useState([]);
  const [expresionPanelList, setExpresionPanelList] =
    useState(defaultExpresion);
  const [selectedType, setSelectedType] = useState('');
  const [sourceEnvList, setSourceEnvList] = useState([]);
  const [destinationEnvList, setDestinationEnvList] = useState([]);
  const [sourceObject, setSourceObject] = useState([]);
  const [destinationObject, setDestinationObject] = useState([]);
  const [sorceObjectDetail, setSorceObjectDetail] = useState({});
  const [destObjectDetail, setDestObjectDetail] = useState({});
  const destObjectDetailRef = useRef(null);
  const [filledJsonObj, setFilledJsonObj] = useState({});
  const [pluginJsonObj, setPluginJsonObj] = useState({});
  const [mergedSrcJson, setMergedSrcJson] = useState({});
  const [mergedDestJson, setMergedDestJson] = useState({});

  const [destEnvDetail, setDestEnvDetail] = useState({});
  const [srcOperationObj, setSrcOperationObj] = useState();
  const [desOperationObj, setDesOperationObj] = useState();

  const [sourceEnvDetail, setSourceEnvDetail] = useState({});
  const [transInputModel, setTransInputModel] = useState(false);
  const [transInputData, setTransInputData] = useState({});
  const [pathPickerPanel, setPathPickerPanel] = useState(false);
  const [nodePath, setNodePath] = useState('');
  const [jsonContent, setJsonContent] = useState({});
  const [jsonText, setJsonText] = useState({});
  const [soucePanelData, setSoucePanelData] = useState({
    source: '',
    sourceEnv: '',
    logo: '',
    neededJson: ''
  });
  const [sourceObjData, setsourceObjData] = useState({
    sourceId: '',
    neededJson: ''
  });
  const [destinatnObjData, setDestinatnObjData] = useState({
    destinationId: '',
    neededJson: ''
  });
  const [destinationPanelData, setDestinationPanelData] = useState({
    destination: '',
    destinationEnv: '',
    logo: '',
    neededJson: ''
  });
  const [staticRestExpresion, setStaticRestExpresion] = useState({
    url: '',
    payload: '',
    headerData: '',
    apiKey: ''
  });
  const [staticRestData, setStaticRestData] = useState({
    value: '',
    type: ''
  });
  const [sourceFilledJsonData, setSourceFilledJsonData] = useState({});
  const [dynamicRestExpresion, setdynamicRestExpresion] = useState({
    url: '',
    payload: '',
    headerData: '',
    apiKey: ''
  });
  const [dynamicRestData, setDynamicRestData] = useState({
    value: '',
    type: ''
  });
  const [selectedOptn, setselectedOptn] = useState({
    firstExp: '',
    secondExp: ''
  });
  const [element, setElement] = useState(null);
  const HIGH_PRIORITY = 1500;
  const { get, set } = useLocalStorage();
  const [jobPanel, setJobPanel] = useState({
    SourcePlugin: false,
    destinationPlugin: false,
    transformation: false,
    sourceObject: false,
    destinationObject: false,
    staticRestPanel: false,
    dynamicRestPanel: false
  });

  const [error, setError] = useState(false);
  const elementIdArr = ['INS-639', 'LEN-800', 'Flow_0is1op0', 'Flow_0i12k3k'];
  const sourceEleobj = ['INS-639', 'Flow_0is1op0'];
  const destElemArr = ['LEN-800', 'Flow_0i12k3k'];

  // const destObjIdArr = ['LEN-800'];

  const ObjectElemArr = ['DYN-101', 'Flow_0xepdea', 'Flow_0nry13u'];

  const getArryObj = (obj) => {
    const keysArray = Object.keys(obj).map((key) => ({
      label: key,
      value: key
    }));
    return keysArray;
  };

  const handleChangeSourcePlugin = async (id) => {
    const allObject = await fetchAllObjectById(id);
    if (allObject?.statusCode) {
      setSourceObject(
        allObject?.result.map((obj) => ({
          ...obj,
          label: obj.name,
          value: obj.operationId
        }))
      );

      if (selectedJob?.sourceOpId) {
        const selectedOpe = allObject?.result.filter(
          (o) => o.operationId === selectedJob?.sourceOpId
        );
        setSrcOperationObj(selectedOpe[0]);
        setSorceObjectDetail(selectedOpe[0]?.singleObjectStructure);
      }
    }
  };

  const handleChangeDestintnPlugin = async (id) => {
    const allObject = await fetchAllObjectById(id);
    if (allObject?.statusCode) {
      setDestinationObject(
        allObject?.result.map((obj) => ({
          ...obj,
          label: obj.name,
          value: obj.operationId
        }))
      );
      if (selectedJob?.destinationOpId) {
        const selectedOpe = allObject?.result.filter(
          (o) => o.operationId === selectedJob?.destinationOpId
        );
        const clearedValue = Object.keys(
          selectedOpe[0]?.singleObjectStructure
        ).reduce((acc, key) => {
          acc[key] = null; // or use '' for empty strings
          return acc;
        }, {});
        // destObjectDetailRef.current = clearedValue;
        // setDestObjectDetail(clearedValue);
        destObjectDetailRef.current = clearedValue;
        setDesOperationObj(selectedOpe[0]);
      }
    }
  };
  useEffect(() => {
    if (state?.type === 'create') {
      const newObj = { ...state?.Job };
      setSelectedJob(newObj);
    } else {
      setSelectedJob(state?.Job);
    }
  }, [state]);

  useEffect(() => {
    if (
      sourceObjData.sourceId !== '' &&
      destinatnObjData?.destinationId !== ''
    ) {
      ObjectElemArr.forEach((element) => {
        const elementRegistry = modeler.get('elementRegistry');
        const gfx = elementRegistry.getGraphics(element);
        if (gfx) {
          gfx.style.display = 'block';
        }
      });
    }
  }, [sourceObjData, destinatnObjData]);

  useEffect(() => {
    if (soucePanelData.source !== '') {
      sourceEleobj.forEach((element) => {
        const elementRegistry = modeler.get('elementRegistry');
        const gfx = elementRegistry.getGraphics(element);
        gfx.style.display = 'block';
      });
      handleChangeSourcePlugin(soucePanelData.source);
    }
  }, [soucePanelData]);

  useEffect(() => {
    if (destinationPanelData?.destination !== '') {
      handleChangeDestintnPlugin(destinationPanelData?.destination);

      destElemArr.forEach((element) => {
        const elementRegistry = modeler.get('elementRegistry');
        const gfx = elementRegistry.getGraphics(element);
        gfx.style.display = 'block';
      });
    }
  }, [destinationPanelData]);

  const getEnvironment = async (pluginId, envId, field) => {
    try {
      const response = await fetchEnvByPluinId(pluginId);
      if (response?.statusCode === 200) {
        if (field === 'source') {
          setSourceEnvList(
            response?.result.map((item) => ({
              ...item,
              label: item.name,
              value: item.environmentId
            }))
          );
          const sourceEnv = response?.result.filter(
            (o) => o.environmentId === envId
          );
          if (sourceEnv[0]?.filledJson) {
            const result = getArryObj(sourceEnv[0]?.filledJson);
            setSourceEnvDetail(result);
          }
        } else {
          setDestinationEnvList(
            response?.result.map((item) => ({
              ...item,
              label: item.name,
              value: item.environmentId
            }))
          );
          const destEnv = response?.result.filter(
            (o) => o.environmentId === envId
          );
          if (destEnv) {
            const result = getArryObj(destEnv[0]?.filledJson);
            setDestEnvDetail(result);
          }
        }
      }
    } catch (error) {
      console.log('Error:-', error);
    }
  };

  const initDiagram = (xmlData) => {
    const container = document.getElementById('container-admin');
    if (!modeler) {
      const bpmnModeler = new BpmnModeler({
        container,
        additionalModules: [
          customRendererModule,
          StaticRestApiModule,
          DynamicRestApiModule
        ],
        keyboard: {
          bindTo: document
        },
        moddleExtensions: {
          qa: qaExtension
        }
      });

      bpmnModeler.importXML(xmlData).then(() => {
        setModeler(bpmnModeler);
        const canvas = bpmnModeler.get('canvas');
        canvas.zoom('fit-viewport');

        let element;
        const definitions = bpmnModeler.getDefinitions();
        const pluginElemntArr = [];
        for (const process of definitions.rootElements) {
          const sequenceFlows = process.flowElements?.filter((element) =>
            ['NOT-619', 'DES-888', 'INS-639', 'LEN-800', 'DYN-101'].includes(
              element.id
            )
          );

          if (sequenceFlows?.length) {
            pluginElemntArr.push(...sequenceFlows);
          }
        }

        //check both plugin's variable data
        pluginElemntArr.forEach((elem) => {
          const { $attrs } = elem;
          if (!$attrs?.hasOwnProperty('variables')) {
            elementIdArr.forEach((element) => {
              const elementRegistry = bpmnModeler.get('elementRegistry');
              const gfx = elementRegistry.getGraphics(element);
              gfx.style.display = 'none';
            });
            ObjectElemArr.forEach((element) => {
              const elementRegistry = bpmnModeler.get('elementRegistry');
              const gfx = elementRegistry.getGraphics(element);

              gfx.style.display = 'none';
            });
          }
        });
        // display hidden initially

        bpmnModeler
          .on('element.dblclick', HIGH_PRIORITY, (event) => {
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
              variables = variables;
            }
            if (
              elem.type === 'bpmn:Task' &&
              elem.businessObject.id === 'NOT-619'
            ) {
              setJobPanel({
                SourcePlugin: true
              });
              setPanelName('destinationEnvironment');
              setStaticText('source_env');
              let {
                $attrs: { variables }
              } = elem.businessObject;

              if (variables) {
                set(`sourcePlginId`, variables);
                const parcedSouce = JSON.parse(variables);
                setSoucePanelData((prev) => ({
                  ...prev,
                  logo: parcedSouce?.logo,
                  neededJson: parcedSouce?.neededJson
                }));
                setJsonText(JSON.stringify(parcedSouce?.neededJson));
                const plugin = allPluginListRef.current?.filter(
                  (o) => o.pluginId === selectedJob?.sourcePluginId
                );
                setSrcSelectedPlugin(plugin[0]);
                if (parcedSouce?.neededJson) {
                  setPluginJsonObj(parcedSouce?.neededJson);
                }
              }
            } else if (
              elem.type === 'bpmn:Task' &&
              elem.businessObject.id === 'DES-888'
            ) {
              setStaticText('source_env');
              setStaticText('destination_env');
              setPanelName('sourceEnvironment');
              let {
                $attrs: { variables }
              } = elem.businessObject;
              setJobPanel({
                destinationPlugin: true
              });
              if (variables) {
                set(`destinationPlugin`, variables);

                const parcedData = JSON.parse(variables);
                setDestinationPanelData((prev) => ({
                  ...prev,
                  logo: parcedData?.logo,
                  neededJson: parcedData?.neededJson
                }));
                setJsonText(JSON.stringify(parcedData?.neededJson));
                const plugin = allPluginListRef.current?.filter(
                  (o) => o.pluginId === selectedJob?.sourcePluginId
                );
                setDestSelectedPlugin(plugin[0]);
                if (parcedData?.neededJson) {
                  setPluginJsonObj(parcedData?.neededJson);
                }
              }
            } else if (
              elem.type === 'bpmn:Task' &&
              elem.businessObject.id === 'DYN-101'
            ) {
              setJobPanel({
                transformation: true
              });
              let {
                $attrs: { variables }
              } = elem.businessObject;
              if (variables) {
                // set(`transformation_`, variables);
                // const parcedSouce = JSON.parse(variables);
                // setDestObjectDetail(parcedSouce);
              }
            } else if (
              elem.type === 'bpmn:Task' &&
              elem.businessObject.id === 'INS-639'
            ) {
              setPanelName('destinationEnvironment');
              setJobPanel({
                sourceObject: true
              });
              let {
                $attrs: { variables }
              } = elem.businessObject;
              if (variables) {
                set(`sourceOperation`, variables);
                const parcedSouce = JSON.parse(variables);
                setsourceObjData((prev) => ({
                  sourceId: parcedSouce?.sourceId,
                  neededJson: parcedSouce?.neededJson
                }));
                if (parcedSouce?.neededJson) {
                  setPluginJsonObj(parcedSouce?.neededJson);
                }
              }
            } else if (
              elem.type === 'bpmn:Task' &&
              elem.businessObject.id === 'LEN-800'
            ) {
              setStaticText('destination_env');
              setPanelName('sourceEnvironment');
              setJobPanel({
                destinationObject: true
              });
              let {
                $attrs: { variables }
              } = elem.businessObject;
              if (variables) {
                set(`destOperation`, variables);
                const parcedObject = JSON.parse(variables);
                setDestinatnObjData((prev) => ({
                  destinationId: parcedObject?.destinationId,
                  neededJson: parcedObject?.neededJson
                }));
                if (parcedObject?.neededJson) {
                  setPluginJsonObj(parcedObject?.neededJson);
                }
              }
            } else if (
              elem.type === 'bpmn:Task' &&
              elem.businessObject.name === 'StaticRestApi'
            ) {
              setJobPanel({
                staticRestPanel: true
              });
              let {
                $attrs: { variables }
              } = elem.businessObject;
              if (variables) {
                set(`restApi_${elem.id}`, variables);
                let restApiData = JSON.parse(variables);

                setStaticRestData({
                  value: restApiData,
                  type: 'restApi'
                });
              } else {
                setStaticRestData({
                  value: '',
                  type: ''
                });
              }
            } else if (
              elem.type === 'bpmn:Task' &&
              elem.businessObject.name === 'DynamicRestApi'
            ) {
              setJobPanel({
                dynamicRestPanel: true
              });
              let {
                $attrs: { variables }
              } = elem.businessObject;
              if (variables) {
                set(`restApi_${elem.id}`, variables);
                let restApiData = JSON.parse(variables);

                setDynamicRestData({
                  value: restApiData,
                  type: 'restApi'
                });
              } else {
                setDynamicRestData({
                  value: '',
                  type: ''
                });
              }
            }
          })
          .catch((err) => console.log(err));
      });
    }
  };

  const submitJsonPathExpression = () => {
    setError(false);
    setPathPickerPanel(false);
    setJsonContent('');
    setExpression((prevExpression) =>
      prevExpression ? prevExpression + nodePath : nodePath
    );
    // let expressionIndex = localStorage.getItem("expressionIndex") || -1;
    // let expressionType = localStorage.getItem("expressionType") || "";
    // const currentCondtn = localStorage.getItem(`currCondition`);
    // console.log("JSON,", expressionIndex, expressionType, currentCondtn);
  };
  const setRestApiExpressionData = (value, field) => {
    let restApiRef = Object.assign({}, staticRestData);
    restApiRef[field] = value;
    setStaticRestExpresion(restApiRef);
  };

  const addJsonPathPicker = (index, type, obj, currCondition) => {
    setPathPickerPanel(true);
    // setRestApiFieldObj(obj);
    localStorage.setItem(`expressionIndex`, index);
    localStorage.setItem(`expressionType`, type);
  };

  const addSecondExpression = (index, type, value, currCondition) => {
    setSecondExp(true);
    localStorage.setItem(`etlCoType`, type);
    localStorage.setItem(`etlCoIndex`, index);
    setExpression(value);
  };
  const addExpression = (index, type, value, currCondition) => {
    localStorage.setItem(`etlIndex`, index);
    localStorage.setItem(`etlType`, type);
    setExpression(value);
    setExpressionPanel(true);
  };

  const getAllTransformation = async () => {
    try {
      const getTarnsformation = await fetchAllTransformation();
      setTransformationList(
        getTarnsformation.result.map((obj) => ({
          ...obj,
          label: obj.name,
          value: obj.id
        }))
      );
    } catch (error) {
      console.log('error:', error);
    }
  };

  const getAllPlugin = async (tenantId) => {
    try {
      const getPlugin = await fetchAllPluginById(tenantId);
      allPluginListRef.current = getPlugin.result;
      setAllPluginList(
        getPlugin.result.map((obj) => ({
          ...obj,
          label: obj.name,
          value: obj.pluginId
        }))
      );
    } catch (error) {
      console.log('error:', error);
    }
  };

  useEffect(() => {
    getAllPlugin('tenant1');
  }, []);

  useEffect(() => {
    if (!selectedJob?.xmlString) return;
    if (selectedJob?.sourcePluginId && selectedJob?.destinationPluginId) {
      getEnvironment(
        selectedJob?.sourcePluginId,
        selectedJob?.sourcePluginEnvId,
        'source'
      );
      getEnvironment(
        selectedJob?.destinationPluginId,
        selectedJob?.destinationPluginEnvId,
        'destination'
      );
      handleChangeSourcePlugin(selectedJob?.sourcePluginId);
      handleChangeDestintnPlugin(selectedJob?.destinationPluginId);
    }

    setSoucePanelData({
      source: selectedJob?.sourcePluginId || '',
      sourceEnv: selectedJob?.sourcePluginEnvId || ''
    });

    setDestinationPanelData({
      destination: selectedJob?.destinationPluginId || '',
      destinationEnv: selectedJob?.destinationPluginEnvId || ''
    });

    setsourceObjData({
      sourceId: selectedJob?.sourceOpId || ''
    });

    setDestinatnObjData({
      destinationId: selectedJob?.destinationOpId || ''
    });
    if (selectedJob?.mappingJson) {
      const formateKey = Object.fromEntries(
        Object.entries(selectedJob?.mappingJson).map(([key, value]) => [
          key.replace('destination_object.', '').replace(/{|}/g, ''),
          value
        ])
      );
      setDestObjectDetail(formateKey);
    }
    let xmlString = selectedJob?.xmlString;
    xmlString = xmlString.replace(/\n|\t/g, '');

    const initializeDiagram = () => {
      return new Promise((resolve) => {
        initDiagram(xmlString);
        resolve();
      });
    };

    initializeDiagram();
    getAllTransformation();
  }, [selectedJob]);

  const handleJsonChange = (field, type, value) => {
    // if (type === 'json12') {
    //   try {
    //     const parsedJson = JSON.parse(value);
    //     setPluginJsonObj((prev) => ({
    //       ...prev,
    //       [field]: parsedJson
    //     }));
    //   } catch (err) {
    //     console.log('invalid Json');
    //   }
    // } else {
    setPluginJsonObj((prev) => ({
      ...prev,
      [field]: value
    }));
    // }
  };

  const submitCoExpression = (e) => {
    e.preventDefault();
    setError(false);
    let expressionCoIndex = localStorage.getItem('etlCoIndex');
    let expressionCoType = localStorage.getItem('etlCoType');
    if (expression) {
      if (expressionCoType === 'childexpresion') {
        setFilledJsonObj((prev) => ({
          ...prev,
          [expressionCoIndex]: expression
        }));
        setSecondExp(false);
      }
    }
  };
  const submitExpression = (e) => {
    e.preventDefault();
    setError(false);
    let expressionIndex = localStorage.getItem('etlIndex');
    let expressionType = localStorage.getItem('etlType');
    if (expression) {
      if (expressionType === 'transformation') {
        const copyOfObj = Object.assign({}, destObjectDetail);
        copyOfObj[expressionIndex] = expression;
        setDestObjectDetail(copyOfObj);
        setExpressionPanel(false);
      } else if (expressionType === 'needeJson') {
        setPluginJsonObj((prev) => ({
          ...prev,
          [expressionIndex]: expression
        }));

        setExpressionPanel(false);
      }
    }
  };

  const handleSubmit = async () => {
    localStorage.setItem(`etlCoType`, '');
    localStorage.setItem(`etlType`, '');
    const formateKey = Object.fromEntries(
      Object.entries(destObjectDetail).map(([key, value]) => [
        `{destination_object.${key}}`,
        value
      ])
    );
    let xml = await modeler?.saveXML({ format: true });
    try {
      const newObj = {
        ...selectedJob,
        sourcePluginId: soucePanelData.source,
        destinationPluginId: destinationPanelData.destination,
        sourcePluginEnvId: soucePanelData.sourceEnv,
        destinationPluginEnvId: destinationPanelData.destinationEnv,
        sourceOpId: sourceObjData?.sourceId,
        sourceFilledJson:
          mergedSrcJson && Object.keys(mergedSrcJson).length > 0
            ? mergedSrcJson
            : selectedJob?.sourceFilledJson,
        destinationFilledJson:
          mergedDestJson && Object.keys(mergedDestJson).length > 0
            ? mergedDestJson
            : selectedJob?.destinationFilledJson,
        destinationOpId: destinatnObjData?.destinationId,
        mappingJson:
          destObjectDetail && Object.keys(destObjectDetail).length > 0
            ? formateKey
            : selectedJob?.mappingJson,
        xmlString: xml.xml
      };
      if (state?.type === 'create') {
        const response = await createNewEtlJobs(newObj);
        if (response.statusCode === 200) {
          notify.success('Job Created Successfully .');
        } else {
          notify.error(response.message);
        }
      } else {
        const response = await updateJobByJobID(selectedJob.jobId, newObj);
        if (response.statusCode === 200) {
          notify.success('Job Updated Successfully .');
        } else {
          notify.error(response.message);
        }
      }
      set('jobXml', xml.xml);
    } catch (error) {
      console.error('Error converting BPMN XML to JSON:', error);
    }
  };
  const handleSubmitObjectPanel = (e, field) => {
    e.preventDefault();
    let local = {};
    let SelectedObj = {};

    if (field === 'sourceId') {
      const newObj = { ...mergedSrcJson, ...pluginJsonObj };
      setMergedSrcJson(newObj);

      local = Object.assign({}, sourceObjData);
      local.neededJson = pluginJsonObj;
      SelectedObj = sourceObject.filter((item) => item.value === local[field]);
    } else {
      const newObj = { ...mergedDestJson, ...pluginJsonObj };
      setMergedDestJson(newObj);
      local = Object.assign({}, destinatnObjData);
      SelectedObj = destinationObject.filter(
        (item) => item.value === local[field]
      );
      local.neededJson = pluginJsonObj;
    }
    if (local) {
      element.businessObject.name = `${SelectedObj[0]?.name}`;

      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: JSON.stringify(local),
        s_type: `${field}`
      });
      setJobPanel({
        SourcePlugin: false,
        destinationPlugin: false,
        sourceObject: false,
        destinationObject: false
      });
      setPluginJsonObj({});
      setPanelName('');
    }
  };

  const handleSubmitPanel = (e, field) => {
    e.preventDefault();
    let local = {};

    if (field === 'source') {
      const newObj = { ...mergedSrcJson, ...pluginJsonObj };
      setMergedSrcJson(newObj);

      local = Object.assign({}, soucePanelData);
      local.neededJson = pluginJsonObj;
    } else {
      const newObj = { ...mergedDestJson, ...pluginJsonObj };
      setMergedDestJson(newObj);

      local = Object.assign({}, destinationPanelData);
      local.neededJson = pluginJsonObj;
    }
    element.businessObject.name = ``;
    if (local) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: JSON.stringify(local),
        s_type: `${field}`
      });
      setJobPanel({
        SourcePlugin: false,
        destinationPlugin: false,
        transformation: false
      });
      setPanelName('');
      setPluginJsonObj({});
    }
  };

  const handleDeleteKey = (key) => {
    const newObj = { ...destObjectDetail };
    delete newObj[key];
    setDestObjectDetail(newObj);
  };
  const mergeAndRemoveDuplicates = (obj1, obj2) => {
    const result = {};

    // Retain keys from obj1
    Object.keys(obj1).forEach((key) => {
      result[key] = obj1[key];
    });

    // Add extra keys from obj2 that aren't in obj1
    Object.keys(obj2).forEach((key) => {
      if (!(key in obj1)) {
        result[key] = obj2[key];
      }
    });
    return result;
  };
  const handleAddNew = (e) => {
    e.preventDefault();

    const mergedObject = mergeAndRemoveDuplicates(
      destObjectDetail,
      destObjectDetailRef.current
    );
    setDestObjectDetail(mergedObject);
  };

  const handleHeaderChange = (field, type, value) => {
    setFilledJsonObj((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const AddExternalJsontoJob = (data) => {
    setSelectedJob((prev) => ({ ...prev, ['externalJson']: data }));
    // console.log(data);
  };
  const renderInputByType = (key, value) => {
    const type = value.type;
    const label = value.label;
    switch (type) {
      case 'string':
        return (
          <div className="align-center mb-2 flex">
            <Input
              label={label}
              variant="outlined"
              name={label}
              type="text"
              value={filledJsonObj[key]}
              onChange={(e) => handleHeaderChange(key, type, e.target.value)}
            />
            <span className="mt-6">
              <Plus
                onClick={() => addSecondExpression(key, 'childexpresion')}
              />
            </span>
          </div>
        );

      case 'numeric':
        return (
          <div className="align-center mb-2 flex">
            <Input
              label={label}
              variant="outlined"
              name={label}
              type="number"
              value={filledJsonObj[key]}
              onChange={(e) => handleHeaderChange(key, type, e.target.value)}
            />
            <span className="mt-6">
              <Plus
                onClick={() => addSecondExpression(key, 'secondExpresion')}
              />
            </span>
          </div>
        );

      default:
        return (
          <div className="align-center mb-2 flex">
            <Input
              label={label}
              variant="outlined"
              name={label}
              type="text"
              value={filledJsonObj[key]}
              onChange={(e) => handleHeaderChange(key, type, e.target.value)}
            />
            <span className="mt-6">
              <Plus onClick={() => addSecondExpression(key, 'needeJson')} />
            </span>
          </div>
        );
    }
  };
  const renderNeededJsonByType = (key, type) => {
    const defaultValue = `{${staticText}.${key}}`;
    if (!pluginJsonObj[key]) {
      handleJsonChange(key, type, defaultValue);
    }

    switch (type) {
      case 'string':
        return (
          <div className="align-center mb-2 flex">
            <Input
              label={key}
              variant="outlined"
              name={key}
              type="text"
              value={pluginJsonObj[key] || defaultValue}
              onChange={(e) => handleJsonChange(key, type, e.target.value)}
            />
            <span className="mt-6">
              <Plus
                onClick={() =>
                  addExpression(key, 'needeJson', pluginJsonObj[key])
                }
              />
            </span>
          </div>
        );
      case 'json':
        return (
          <div className="align-center mb-2 flex max-w-96">
            <Textarea
              className=""
              label={key}
              minRows={4}
              maxRows={Infinity}
              type={type}
              name={key}
              value={pluginJsonObj[key] || defaultValue}
              onChange={(e) => {
                setJsonText((prev) => ({
                  ...prev,
                  [key]: e.target.value
                }));
                handleJsonChange(key, type, e.target.value);
              }}
            />
            <span className="mt-6">
              <Plus
                onClick={() =>
                  addExpression(key, 'needeJson', pluginJsonObj[key])
                }
              />
            </span>
          </div>
        );
      case 'int':
        return (
          <div className="align-center mb-2 flex">
            <Input
              label={key}
              variant="outlined"
              name={key}
              type="number"
              value={pluginJsonObj[key] || defaultValue}
              onChange={(e) => handleJsonChange(key, type, e.target.value)}
            />
            <span className="mt-6">
              <Plus
                onClick={() =>
                  addExpression(key, 'needeJson', pluginJsonObj[key])
                }
              />
            </span>
          </div>
        );
      default:
        return (
          <div className="align-center mb-2 flex">
            <Input
              label={key}
              variant="outlined"
              name={key}
              type="text"
              value={pluginJsonObj[key] || defaultValue}
              onChange={(e) => handleJsonChange(key, type, e.target.value)}
            />
            <span className="mt-6">
              <Plus
                onClick={() =>
                  addExpression(key, 'needeJson', pluginJsonObj[key])
                }
              />
            </span>
          </div>
        );
    }
  };
  return (
    <>
      <div id="container-admin" className="diagram-box border-top m-0">
        <div className="align-center border-bottom flex justify-between bg-white py-3">
          <div className="mx-2 mt-2 font-semibold">{selectedJob?.name}</div>
          <div className="flex justify-end">
            {selectedJob?.type === 1 && (
              <div className="mx-2">
                <Button variant="outline">Run</Button>
              </div>
            )}
            <div className="mx-2">
              <Button onClick={handleSubmit}>save</Button>
            </div>
            <div className=" ">
              <Button onClick={() => navigate(-1)} variant="outline">
                <X />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {(jobPanel?.SourcePlugin || jobPanel?.destinationPlugin) && (
        <SourcePluginPanel
          jobPanel={jobPanel}
          setJobPanel={setJobPanel}
          allPluginList={allPluginList}
          soucePanelData={soucePanelData}
          setSourceEnvList={setSourceEnvList}
          setSoucePanelData={setSoucePanelData}
          sourceEnvList={sourceEnvList}
          setSourceEnvDetail={setSourceEnvDetail}
          renderNeededJsonByType={renderNeededJsonByType}
          handleSubmitPanel={handleSubmitPanel}
          srcSelectedPlugin={srcSelectedPlugin}
          destinationPanelData={destinationPanelData}
          destinationEnvList={destinationEnvList}
          setDestEnvDetail={setDestEnvDetail}
          destSelectedPlugin={destSelectedPlugin}
          setDestinationPanelData={setDestinationPanelData}
          setDestSelectedPlugin={setDestSelectedPlugin}
          getEnvironment={getEnvironment}
          setSrcSelectedPlugin={setSrcSelectedPlugin}
          setPluginJsonObj={setPluginJsonObj}
          submitExpression={submitExpression}
        />
      )}
      {(jobPanel?.sourceObject || jobPanel?.destinationObject) && (
        <OperationPanel
          jobPanel={jobPanel}
          setJobPanel={setJobPanel}
          sourceObject={sourceObject}
          sourceObjData={sourceObjData}
          setsourceObjData={setsourceObjData}
          setSrcOperationObj={setSrcOperationObj}
          setSorceObjectDetail={setSorceObjectDetail}
          srcOperationObj={srcOperationObj}
          renderNeededJsonByType={renderNeededJsonByType}
          destinationObject={destinationObject}
          setDestinatnObjData={setDestinatnObjData}
          destinatnObjData={destinatnObjData}
          setDesOperationObj={setDesOperationObj}
          setDestObjectDetail={setDestObjectDetail}
          desOperationObj={desOperationObj}
          handleSubmitObjectPanel={handleSubmitObjectPanel}
        />
      )}
      {jobPanel?.staticRestPanel && (
        <ActionModal
          panelaName="Static RestApi Panel"
          restApiSelectedData={staticRestData}
          expression={staticRestExpresion}
          ExpressionPanel={addExpression}
          modeler={modeler}
          element={element}
          // restApiExpresionFlag={restApiExpresionFlag}
          setRestApiExpressionData={setRestApiExpressionData}
          setJobPanel={setJobPanel}
          setRestApiData={setStaticRestData}
          restApiData={staticRestData}
          // restApiFieldObj={restApiFieldObj}
          addJsonPathPicker={addJsonPathPicker}
          // nodePath={nodePath}
          // setJsonContent={setJsonContent}
          // jsonContent={jsonContent}
          // jsonRef={jsonRef}
          // jsonPathPickerPanel={jsonPathPickerPanel}
        />
      )}
      {jobPanel?.dynamicRestPanel && (
        <ActionModal
          panelaName="Dynamic RestApi Panel"
          restApiSelectedData={dynamicRestData}
          expression={dynamicRestExpresion}
          ExpressionPanel={addExpression}
          modeler={modeler}
          element={element}
          // restApiExpresionFlag={restApiExpresionFlag}
          setRestApiExpressionData={setRestApiExpressionData}
          setJobPanel={setJobPanel}
          setRestApiData={setDynamicRestData}
          restApiData={dynamicRestData}
          // restApiFieldObj={restApiFieldObj}
          addJsonPathPicker={addJsonPathPicker}
          // nodePath={nodePath}
          // setJsonContent={setJsonContent}
          // jsonContent={jsonContent}
          // jsonRef={jsonRef}
          // jsonPathPickerPanel={jsonPathPickerPanel}
        />
      )}
      {jobPanel?.transformation && (
        <TransformationPanel
          allPluginList={allPluginList}
          selectedJob={selectedJob}
          setJobPanel={setJobPanel}
          handleAddNew={handleAddNew}
          destObjectDetail={destObjectDetail}
          setDestObjectDetail={setDestObjectDetail}
          sorceObjectDetail={sorceObjectDetail}
          addExpression={addExpression}
          handleDeleteKey={handleDeleteKey}
          jsonContent={jsonContent}
          modeler={modeler}
          element={element}
          setJsonContent={setJsonContent}
          AddExternalJsontoJob={AddExternalJsontoJob}
        />
      )}
      {(expressionPanel || secondExp || transInputModel) && (
        <ExpressionPanel
          setExpressionPanel={setExpressionPanel}
          selectedOptn={selectedOptn}
          setselectedOptn={setselectedOptn}
          selectedType={selectedType}
          expresionPanelList={expresionPanelList}
          panelName={panelName}
          inputRef={inputRef}
          expression={expression}
          submitExpression={submitExpression}
          setSelectedType={setSelectedType}
          setExpresionPanelList={setExpresionPanelList}
          sourceEnvDetail={sourceEnvDetail}
          setTransInputModel={setTransInputModel}
          transformationList={transformationList}
          setTransInputData={setTransInputData}
          setExpression={setExpression}
          setPathPickerPanel={setPathPickerPanel}
          setJsonContent={setJsonContent}
          destEnvDetail={destEnvDetail}
          secondExp={secondExp}
          setFilledJsonObj={setFilledJsonObj}
          setSecondExp={setSecondExp}
          sorceObjectDetail={sorceObjectDetail}
          defaultExpresion={defaultExpresion}
          transInputModel={transInputModel}
          transInputData={transInputData}
          renderInputByType={renderInputByType}
          filledJsonObj={filledJsonObj}
        />
      )}
      {pathPickerPanel && (
        <JsonPath
          jsonContent={jsonContent}
          elementId={'source_object'}
          nodePath={nodePath}
          setNodePath={setNodePath}
          jsonPathPickerPanel={pathPickerPanel}
          onCancel={() => {
            setPathPickerPanel(false);
            // setJsonContent('');
          }}
          submitJsonPathExpression={submitJsonPathExpression}
        />
      )}
    </>
  );
};

export default JobEditor;
