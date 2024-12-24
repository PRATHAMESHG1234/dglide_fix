import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/componentss/ui/sheet';
import { Separator } from '@/componentss/ui/separator';

import { Input } from '@/componentss/ui/input';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Button } from '@/componentss/ui/button';

import { useEffect, useState } from 'react';
import { generateUId } from '../../../common/utils/helpers';
import { fetchFieldsByFormId } from '../../../services/field';
import './Action.css';
import RestApi from './action-type/RestApi';
import Update from './action-type/Update';
import Url from './action-type/Url';
import { useSelector } from 'react-redux';

const type = [
  {
    value: 'Update',
    label: 'Update'
  },
  {
    value: 'url',
    label: 'URL'
  },
  {
    value: 'REST API',
    label: 'REST API'
  }
];

const visibilityOptions = [
  {
    value: 'List',
    label: 'List'
  },
  {
    value: 'Record',
    label: 'Record'
  },
  {
    value: 'Both',
    label: 'Both'
  }
];

const ActionModal = ({
  state,
  onCancel,
  onConfirm,
  onDelete,
  compiledTables
}) => {
  const { currentTheme } = useSelector((state) => state.auth);
  const [fields, setFields] = useState([]);
  const [visibility, setvisibility] = useState('List');
  const [actionObj, setActionObj] = useState({
    formInfoId: '',
    name: '',
    type: '',
    visibility: 'List',
    options: []
  });

  useEffect(() => {
    if (state.selected) {
      setActionObj({
        formInfoId: state.selected.formInfoId,
        name: state.selected.name,
        type: state.selected.type,
        options: state.selected.options,
        visibility: state.selected.visibility
      });
    }
  }, [state]);

  useEffect(() => {
    async function fetchData() {
      if (actionObj.formInfoId) {
        await fetchFieldsByFormId(actionObj.formInfoId).then((res) => {
          setFields(res?.result);
        });
      }
    }
    fetchData();
  }, [actionObj]);

  const optionsCheckType = (options) => {
    if (typeof options === 'string') {
      let formatOptions = JSON.parse(options);

      return formatOptions;
    } else {
      return options;
    }
  };

  const addOperationHandler = (val, optn) => {
    if (val.actionInfoId === actionObj.actionInfoId) {
      if (actionObj.type === 'Update') {
        setActionObj((prev) => {
          return {
            ...prev,
            options: [
              ...prev.options,
              {
                id: generateUId(),
                fieldInfoId: '',
                value: ''
              }
            ]
          };
        });
      }

      if (actionObj.type === 'url') {
        setActionObj((prev) => {
          return {
            ...prev,
            options: [
              ...prev.options,
              {
                id: generateUId(),
                url: ''
              }
            ]
          };
        });
      }

      if (actionObj.type === 'REST API') {
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
    }
  };

  const handleChange = (name, value, dataObj, fieldId) => {
    if (name === 'name' || name === 'formInfoId') {
      setActionObj((prev) => {
        return {
          ...prev,
          [name]: value
        };
      });
      return;
    }

    if (name === 'type') {
      if (value === 'Update') {
        setActionObj((prev) => {
          return {
            ...prev,
            [name]: value,
            visibility: visibility,
            options: [
              {
                id: generateUId(),
                fieldInfoId: '',
                value: '',
                fieldOption: ''
              }
            ]
          };
        });
      }

      if (value === 'url') {
        setActionObj((prev) => {
          return {
            ...prev,
            [name]: value,
            visibility: visibility,
            options: [
              {
                id: generateUId(),
                url: ''
              }
            ]
          };
        });
      }

      if (value === 'REST API') {
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
            [name]: value,
            visibility: visibility,
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

      fetchFieldsByFormId(actionObj.formInfoId).then((res) =>
        setFields(res?.result)
      );
      return;
    }
    if (name === 'visibility') {
      setvisibility(value);
      setActionObj((prevState) => ({
        ...prevState,
        visibility: value
      }));
    }

    if (dataObj) {
      if (actionObj.type === 'Update' || actionObj.type === 'url') {
        const operationData = optionsCheckType(actionObj?.options)?.map(
          (opr) => {
            if (name === 'fieldInfoId') {
              const fieldOption = fields?.find(
                (column) => column.fieldInfoId === value
              );

              if (dataObj.id === opr.id) {
                return {
                  ...opr,
                  [name]: value,
                  fieldOption: fieldOption?.options || ''
                };
              }
            }
            if (name === 'value' || name === 'url') {
              if (dataObj.id === opr.id) {
                return {
                  ...opr,
                  [name]: value
                };
              }
            }

            return opr;
          }
        );

        setActionObj((prev) => {
          return {
            ...prev,
            options: operationData
          };
        });
      }
      if (actionObj.type === 'REST API') {
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
      }
      return;
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

  const fieldDeleteHandlerURl = (optnObjId) => {
    setActionObj((prevActionObj) => {
      // Filter out the option with the given id
      const updatedOptions = prevActionObj.options.filter(
        (option) => option.id !== optnObjId
      );
      // Return the updated actionObj
      return {
        ...prevActionObj,
        options: updatedOptions
      };
    });
  };

  const fieldDeleteHandlerUpdate = (index, options) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setActionObj((prevActionObj) => {
      return {
        ...prevActionObj,
        options: updatedOptions
      };
    });
  };

  const onSubmitHandler = () => {
    if (!actionObj) return;
    const obj = {
      actionInfoId: actionObj.actionInfoId,
      formInfoId: actionObj.formInfoId,
      name: actionObj.name,
      type: actionObj.type,
      visibility: actionObj.visibility,
      options: actionObj.options && JSON.stringify(actionObj.options)
    };
    onConfirm(obj);
  };

  return (
    <Sheet key={'right'} open={state.show} onOpenChange={onCancel}>
      <SheetContent
        side={'right'}
        className="w-[700px] min-w-[700px] max-w-[700px] sm:max-w-[700px]"
      >
        <SheetHeader className="flex flex-row items-center justify-between pt-3">
          <SheetTitle className="flex w-full flex-row items-center justify-between text-lg font-semibold">
            Add edit action
            <div className="flex items-center gap-2">
              <Button onClick={onSubmitHandler}>
                {state.type === 'edit' ? 'Update' : 'Save'}
              </Button>
              {state.type === 'edit' ? (
                <Button variant="outline" onClick={onDelete}>
                  Delete
                </Button>
              ) : null}
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="py-2">
          <Separator className="h-[1px]" />
        </div>
        <div
          className="mt-1 p-1"
          style={{
            height: 'calc(100vh - 171px)',
            zIndex: 6,
            overflowY: 'auto'
          }}
        >
          <div
            key={actionObj.formInfoId}
            style={{
              borderBottom: actionObj.type && '1px solid grey',
              marginBottom: '10px'
            }}
          >
            <Dropdown
              label="Select Form"
              value={actionObj.formInfoId}
              onChange={(e) => handleChange('formInfoId', e.target.value)}
              options={compiledTables?.map((ele) => ({
                label: ele.displayName,
                value: ele.formInfoId
              }))}
              style={{
                width: '20vw',
                minWidth: '100%'
              }}
            />

            <div className="flex space-x-4 py-3">
              <Input
                label="Name"
                name="name"
                value={actionObj.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />

              <Dropdown
                label="Type"
                name="type"
                value={actionObj.type || ''}
                onChange={(e) => handleChange('type', e.target.value)}
                options={type}
              />
            </div>
          </div>

          {actionObj.type === 'Update' && (
            <Update
              actionObj={actionObj}
              handleChange={handleChange}
              addOperationHandler={addOperationHandler}
              fields={fields}
              optionsCheckType={optionsCheckType}
              fieldDeleteHandler={fieldDeleteHandlerUpdate}
            />
          )}

          {actionObj.type === 'url' && (
            <Url
              actionObj={actionObj}
              handleChange={handleChange}
              addOperationHandler={addOperationHandler}
              fieldDeleteHandler={fieldDeleteHandlerURl}
              optionsCheckType={optionsCheckType}
            />
          )}

          {actionObj.type === 'REST API' && (
            <>
              <RestApi
                actionObj={actionObj}
                handleChange={handleChange}
                addOperationHandler={addOperationHandler}
                fields={fields}
                fieldDeleteHandler={fieldDeleteHandler}
                optionsCheckType={optionsCheckType}
              />
              <Dropdown
                label="Show Action"
                name="visibility"
                value={actionObj.visibility || ''}
                onChange={(e) => handleChange('visibility', e.target.value)}
                options={visibilityOptions}
              />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActionModal;
