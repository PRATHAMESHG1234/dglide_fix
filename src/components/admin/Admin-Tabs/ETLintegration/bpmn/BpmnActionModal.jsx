import { useEffect, useState } from 'react';
import '../../../../form/actions/Action.css';
import { useLocalStorage } from '../../../../workflow/BPMN/custom/useLocalStorage';
import { uploadAttachment } from '../../../../../services/attachment';
import RestApi from '../../../../workflow/BPMN/BpmnRestApi';
import { generateUId } from '../../../../../common/utils/helpers';
import { fetchFieldsByFormId } from '../../../../../services/field';
import { Button } from '@/componentss/ui/button';

const ActionModal = ({
  panelaName,
  restApiSelectedData,
  state,
  ExpressionPanel,
  expression,
  restApiExpresionFlag,
  setRestApiExpressionData,
  addJsonPathPicker,
  nodePath,
  restApiFieldObj,
  setJsonContent,
  jsonRef,
  modeler,
  element,
  setJobPanel,
  setRestApiData,
  restApiData
}) => {
  const { get, set } = useLocalStorage();

  const [fields, setFields] = useState([]);
  const [formId, setFormId] = useState(null);
  const [actionObj, setActionObj] = useState({
    formInfoId: '',
    name: '',
    type: '',
    options: [],
    json: ''
  });
  // const [fieldInfo, setFieldInfo] = useState([
  //   {
  //     fieldDataId: generateUId(),
  //     fieldDataLabel: 0,
  //     fieldDataValue: "",
  //   },
  // ]);

  useEffect(() => {
    if (state?.selected) {
      setActionObj({
        formInfoId: state.selected.formInfoId,
        name: state.selected.name,
        type: state.selected.type,
        options: state.selected.options
      });
      fetchFieldsByFormId(state.selected.formInfoId).then((res) =>
        setFields(res?.result)
      );
    }
  }, [state]);
  useEffect(() => {
    if (nodePath) {
      let expressionIndex = localStorage.getItem('expressionIndex') || -1;
      if (expressionIndex === 'fieldDataValue') {
        const currentCondtnId = JSON.parse(
          localStorage.getItem(`currCondition`)
        );
        handleChange(
          expressionIndex,
          nodePath,
          restApiFieldObj,
          currentCondtnId
        );
      }
    }
  }, [nodePath]);

  useEffect(() => {
    if (expression.apiKey !== '') {
      setActionObj((prev) => {
        return {
          ...prev,
          options: prev.options.map((option) => {
            return {
              ...option,
              id: generateUId(),
              isRequireAuthentication: true,
              headerData: expression.headerData,
              authenticationData: {
                apiKey: expression.apiKey,
                authType: 'apiKey'
              },
              url: expression.url,
              payload: expression?.payload
            };
          })
        };
      });
    } else {
      setActionObj((prev) => {
        return {
          ...prev,
          options: prev.options.map((option) => {
            return {
              ...option,
              id: generateUId(),
              url: expression.url,
              headerData: expression.headerData,
              authenticationData: { apiKey: expression.apiKey },
              payload: expression?.payload
            };
          })
        };
      });
    }
  }, [restApiExpresionFlag]);

  const fetchJsonContent = async (url) => {
    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        const jsonString = JSON.stringify(data);
        setJsonContent(jsonString);
      }
    } catch (error) {
      console.error('Error fetching JSON content:', error);
    }
  };

  useEffect(() => {
    const sourcetableId = localStorage.getItem('tableId');
    setFormId(sourcetableId);
    if (sourcetableId) {
      fetchFieldsByFormId(sourcetableId).then((res) => setFields(res?.result));
    }

    if (restApiSelectedData.type !== '') {
      const URL = process.env.REACT_APP_STORAGE_URL;
      const Json = `${URL}/${restApiSelectedData?.value?.json?.filePath}/${restApiSelectedData?.value?.json?.fileName}`;
      setActionObj(restApiSelectedData?.value);

      fetchJsonContent(Json);
    } else {
      const fieldInfo = [
        {
          fieldDataId: generateUId(),
          fieldDataLabel: 0,
          fieldDataValue: ''
        }
      ];
      setActionObj((prev) => {
        return {
          ...prev,
          options: [
            {
              id: generateUId(),
              method: '',
              url: '',
              isRequireAuthentication: false,
              isRequireHeader: false,
              encoding: '',
              payload: '',
              isRequireConformation: false,
              fieldData: fieldInfo
            }
          ]
        };
      });
    }
  }, []);

  const addOperationHandler = (val, optn) => {
    if (val.actionInfoId === actionObj.actionInfoId) {
      const optionsArr = optionsCheckType(actionObj.options);
      let data = optionsArr;
      data = data[0].fieldData;
      data.push({
        fieldDataId: generateUId(),
        fieldDataLabel: 0,
        fieldDataValue: ''
      });
      if (optionsArr) {
        const fieldData = optionsArr?.map((d) => {
          if (d.id === optn.id) {
            return {
              ...d,
              fieldData: data
            };
          }
          return d;
        });
        setActionObj((prev) => {
          return {
            ...prev,
            options: [...fieldData]
          };
        });
      }
    }
  };

  const handleChange = (name, value, dataObj, fieldId) => {
    const restApiData = optionsCheckType(actionObj?.options)?.map((ele) => {
      if (
        name === 'method' ||
        name === 'url' ||
        name === 'isRequireAuthentication' ||
        name === 'isRequireHeader' ||
        name === 'encoding' ||
        name === 'payload' ||
        name === 'isRequireConformation' ||
        name === 'headerData'
      ) {
        if (dataObj.id === ele.id) {
          return {
            ...ele,
            [name]: value
          };
        }
      }
      if (
        name === 'authType' ||
        name === 'userName' ||
        name === 'password' ||
        name === 'apiKey'
      ) {
        if (dataObj.id === ele.id) {
          const authData = {
            ...ele?.authenticationData,
            [name]: value
          };
          return {
            ...ele,
            authenticationData: authData
          };
        }
      }
      if (name === 'fieldDataLabel' || name === 'fieldDataValue') {
        const selectedActionObj = actionObj.options;
        let datafieldArr = selectedActionObj[0].fieldData || [];

        const fields = datafieldArr?.map((f) => {
          if (f.fieldDataId === fieldId) {
            return {
              ...f,
              [name]: value
            };
          }
          return f;
        });

        if (dataObj.id === ele.id) {
          return {
            ...ele,
            fieldData: [...fields]
          };
        }
      }

      return ele;
    });
    setActionObj((prev) => {
      return {
        ...prev,
        options: restApiData
      };
    });
    if (['url', 'payload', 'headerData', 'apiKey'].includes(name)) {
      setRestApiExpressionData(value, name);
    }
  };

  const optionsCheckType = (options) => {
    if (typeof options === 'string') {
      let formatOptions = JSON.parse(options);
      return formatOptions;
    } else {
      return options;
    }
  };

  const fieldDeleteHandler = (optnObj, fieldId) => {
    const optionsArr = optionsCheckType(actionObj.options);
    const filteredFieldArr = optnObj.fieldData.filter(
      (d) => d.fieldDataId !== fieldId
    );

    if (optionsArr) {
      const optionData = optionsArr?.map((d) => {
        if (d.id === optnObj.id) {
          return {
            ...d,
            fieldData: filteredFieldArr
          };
        }
        return d;
      });
      setActionObj((prev) => {
        return {
          ...prev,
          options: [...optionData]
        };
      });
    }
  };
  const handleInputFileChange = async (file) => {
    try {
      const res = await uploadAttachment('system_workflow', file);

      setActionObj((prev) => {
        return {
          ...prev,
          json: res.result
        };
      });
    } catch (error) {
      console.error('Error uploading attachment:', error);
      return null;
    }
  };

  const submitRestApiPanal = () => {
    if (!actionObj) return;
    const obj = {
      formInfoId: actionObj.formInfoId,
      options: actionObj.options,
      json: actionObj?.json
    };
    const RestApi = Object.assign({}, restApiData);
    RestApi.value = obj;
    RestApi.type = 'restApi';
    setRestApiData(RestApi);
    const elementId = get(`currentElementId`) || '';
    set(`restApi_${elementId}`, JSON.stringify(obj));

    let local = get(`restApi_${elementId}`) || null;
    // local.elementType = 'restApi'

    if (local) {
      local = JSON.parse(local);
      // local.restApiValue = JSON.stringify(data);
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: JSON.stringify(local),
        s_type: 'restApi'
      });
      // setRestApiData({
      //   value: "",
      //   type: "",
      // });
      setJobPanel({ staticRestPanel: false, dynamicRestPanel: false });
    }
  };
  const closeRestApiPanel = () => {
    setJobPanel({ staticRestPanel: false, dynamicRestPanel: false });
  };

  return (
    <div
      id="restApi-panel"
      className="panel flex"
      style={{ width: '540px', height: 'auto', top: '9%' }}
    >
      <form id="setForm" style={{ width: '100%' }}>
        <p>
          <b>{panelaName}</b>
        </p>

        <Button
          id="close"
          className="close-btn"
          type="button"
          variant="outline"
          onClick={closeRestApiPanel}
        >
          &times;
        </Button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignContent: 'center',
            marginLeft: '10px'
          }}
        >
          <div className="w-full">
            <div>
              <RestApi
                jsonRef={jsonRef}
                handleExpresionPanel={ExpressionPanel}
                actionObj={actionObj}
                handleChange={handleChange}
                addOperationHandler={addOperationHandler}
                fields={fields}
                fieldDeleteHandler={fieldDeleteHandler}
                optionsCheckType={optionsCheckType}
                handleInputFileChange={handleInputFileChange}
                addJsonPathPicker={addJsonPathPicker}
                fetchJsonContent={fetchJsonContent}
              />
              <div className="mt-4 flex">
                <div>
                  <Button onClick={submitRestApiPanal}>Ok</Button>
                </div>
                <div className="mx-2">
                  <Button onClick={closeRestApiPanel} variant="outline">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ActionModal;
