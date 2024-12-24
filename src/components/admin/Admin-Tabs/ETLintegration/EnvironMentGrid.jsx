import React, { useEffect, useState } from 'react';
import { ObjectGrid } from './ObjectGrid';
import { colors, COLORS } from '../../../../common/constants/styles';
import { Pencil, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Input } from '@/componentss/ui/input';
import {
  createEnvironment,
  updateEnvironment
} from '../../../../services/integration';
import { useDispatch } from 'react-redux';

import { Label } from '@/componentss/ui/label';
import { Button } from '@/componentss/ui/button';
import { Textarea } from '@/componentss/ui/textarea';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/componentss/ui/sheet';
import { notify } from '../../../../hooks/toastUtils';

export const EnvironMentGrid = ({
  open,
  setOpen,
  envList,
  allObjectList,
  pluginEdit,
  setRefetch,
  envEdit,
  setEnvEdit
}) => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state) => state.auth);
  const [neededJsonList, setNeededJsonList] = useState([]);
  const [filledJsonObj, setFilledJsonObj] = useState({});
  const [envData, setEnvData] = useState({});
  const [jsonText, setJsonText] = useState({});
  const [variablePanel, setVariablePanel] = useState(false);
  const [newVariable, setNewVariable] = useState({
    key: '',
    type: ''
  });

  const handleClose = () => {
    // setOpen(false);
    setEnvEdit({ type: '', data: '' });
    setEnvData({});
  };

  function getExtraVariableWithTypes(sourceObj, typeMap) {
    const updatedTypeMap = { ...typeMap }; // Create a copy of the type map

    for (const key in sourceObj) {
      if (!typeMap.hasOwnProperty(key)) {
        // Determine the type of the value in sourceObj
        const value = sourceObj[key];

        if (!typeMap.hasOwnProperty(key)) {
          updatedTypeMap[key] = Array.isArray(value)
            ? 'array'
            : value && typeof value === 'object'
              ? 'json'
              : typeof value;
        }
      }
    }
    return updatedTypeMap;
  }

  useEffect(() => {
    let filledJsonObj = {};
    let neededJsonObj = [];
    setEnvData((prev) => ({
      ...prev,
      pluginId: pluginEdit?.data?.pluginId
    }));
    if (allObjectList) {
      allObjectList.forEach((plugin) => {
        const parsedJson = plugin?.neededJson;
        if (
          parsedJson &&
          typeof parsedJson === 'object' &&
          !Array.isArray(parsedJson)
        ) {
          // Avoid adding duplicate keys
          const existingKeys = neededJsonObj.flatMap(Object.keys);
          const newKeys = Object.keys(parsedJson);

          if (!newKeys.some((key) => existingKeys.includes(key))) {
            neededJsonObj.push(parsedJson);
          }
        }
      });
    }
    if (
      pluginEdit?.data?.neededJson &&
      typeof pluginEdit.data.neededJson === 'object' &&
      !Array.isArray(pluginEdit.data.neededJson)
    ) {
      // Avoid adding duplicate keys
      const existingKeys = neededJsonObj.flatMap(Object.keys);
      const newKeys = Object.keys(pluginEdit.data.neededJson);

      if (!newKeys.some((key) => existingKeys.includes(key))) {
        neededJsonObj.push(pluginEdit.data.neededJson);
      }
    }

    let mergedObject = neededJsonObj.reduce(
      (acc, obj) => ({ ...acc, ...obj }),
      {}
    );
    filledJsonObj = Object.keys(mergedObject).reduce((acc, key) => {
      acc[key] = ''; // Set each value to an empty string
      return acc;
    }, {});
    let updatedJsonText = {};
    if (envEdit?.data?.filledJson) {
      setEnvData({
        ...envEdit?.data,
        filledJson: envEdit?.data?.filledJson
      });
      filledJsonObj = envEdit?.data?.filledJson || {};
      setFilledJsonObj(filledJsonObj);
      // get json field from filled json
      const jsonKeys = Object.keys(mergedObject).filter(
        (key) => mergedObject[key] === 'json'
      );
      let initialJsonState = jsonKeys.reduce((acc, key) => {
        acc[key] = '';
        return acc;
      }, {});
      updatedJsonText = { ...initialJsonState };

      Object.keys(initialJsonState).forEach((key) => {
        if (filledJsonObj[key]) {
          updatedJsonText[key] = JSON.stringify(filledJsonObj[key]);
        }
      });
      setJsonText(updatedJsonText);
    }
    const result = getExtraVariableWithTypes(filledJsonObj, mergedObject);
    const getArry = Object.keys(result).map((key, index) => ({
      id: index + 1,
      name: key,
      value: result[key] !== 'json' ? filledJsonObj[key] : updatedJsonText[key],
      type: result[key]
    }));

    setNeededJsonList(getArry);
    setFilledJsonObj(filledJsonObj);
  }, [envEdit.type]);

  // const handleHeaderChange = (field, type, value) => {
  //   if (type === 'json') {
  //     try {
  //       const parsedJson = JSON.parse(value);
  //       setFilledJsonObj((prev) => ({
  //         ...prev,
  //         [field]: parsedJson
  //       }));
  //     } catch (err) {
  //       console.log('invalid Json');
  //     }
  //   } else {
  //     setFilledJsonObj((prev) => ({
  //       ...prev,
  //       [field]: value
  //     }));
  //   }
  // };

  const onSubmitHandler = async () => {
    const newObj = {
      ...envData,
      filledJson: filledJsonObj
    };
    if (envEdit?.type === 'create') {
      const response = await createEnvironment(newObj);
      if (response?.statusCode === 200) {
        notify.success('Environment Created Successfully .');
        setRefetch((prev) => !prev);
      }
    } else {
      const response = await updateEnvironment(envData?.environmentId, newObj);
      if (response?.statusCode === 200) {
        notify.success('Environment Updated Successfully .');
        setRefetch((prev) => !prev);
      }
    }
    setEnvData({});
    setEnvEdit({ type: '', data: '' });
  };

  // const renderInputByType = (variable) => {
  //   const type = variable?.type;
  //   const key = variable?.name;
  //   switch (type) {
  //     case 'string':
  //       return (
  //         <div className="mb-2">
  //           <Input
  //             label={key}
  //             variant="outlined"
  //             name={key}
  //             type="text"
  //             value={filledJsonObj[key]}
  //             onChange={(e) => handleHeaderChange(key, type, e.target.value)}
  //           />
  //         </div>
  //       );
  //     case 'json':
  //       return (
  //         <div className="mb-2">
  //           <Textarea
  //             label={key}
  //             minRows={4}
  //             maxRows={Infinity}
  //             type={type}
  //             name={key}
  //             value={jsonText[key] || JSON.stringify(filledJsonObj[key])}
  //             onChange={(e) => {
  //               setJsonText((prev) => ({
  //                 ...prev,
  //                 [key]: e.target.value
  //               }));
  //               handleHeaderChange(key, type, e.target.value);
  //             }}
  //           />
  //         </div>
  //       );
  //     case 'int':
  //       return (
  //         <div className="mb-2">
  //           <Input
  //             label={key}
  //             variant="outlined"
  //             name={key}
  //             type="number"
  //             value={filledJsonObj[key]}
  //             onChange={(e) => handleHeaderChange(key, type, e.target.value)}
  //           />
  //         </div>
  //       );
  //     default:
  //       return (
  //         <div className="mb-2">
  //           <Input
  //             label={key}
  //             variant="outlined"
  //             name={key}
  //             type="text"
  //             value={filledJsonObj[key]}
  //             onChange={(e) => handleHeaderChange(key, type, e.target.value)}
  //           />
  //         </div>
  //       );
  //   }
  // };

  const headersMOdal = [
    // { headerName: 'Sr no', field: 'srNo', sortable: true, width: 20 },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Type', field: 'type', sortable: true, filter: true },
    {
      headerName: 'Value',
      field: 'value',
      sortable: true,
      filter: true,
      editable: true,
      valueSetter: (params) => {
        params.data[params.colDef.field] = params.newValue;
        handleOnChange(params.data); // Trigger on change
        return true;
      }
    }
  ];
  const headers = [
    { headerName: 'Sr no', field: 'srNo', sortable: true, width: 20 },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    {
      headerName: 'Variables',
      field: 'action',
      sortable: true,
      filter: true,
      cellRenderer: (params) => (
        <div>
          <div className="mt-2 text-primary">
            <Pencil
              className="h-4 w-4"
              onClick={(e) => {
                setEnvEdit({
                  type: 'edit',
                  data: params?.data
                });
                setOpen(true);
              }}
            />
          </div>
        </div>
      )
    }
  ];
  const handleAddVariable = () => {
    if (newVariable.key === '' || newVariable.type === '') {
      alert('please fill key and type of new variable');
    }
    const newObj = [
      ...neededJsonList,
      { name: [newVariable.key], type: newVariable.type, value: '' }
    ];
    setNeededJsonList(newObj);
    setVariablePanel(false);
    setNewVariable({ key: '', type: '' });
    const addVarObj = { ...filledJsonObj, [newVariable.key]: '' };
    setFilledJsonObj(addVarObj);
  };
  const updateArry = (event) => {
    const updatedJsonList = neededJsonList.map((entry) => {
      if (entry.id === event.id) {
        return { ...entry, ...event };
      }
      return entry;
    });
    setNeededJsonList(updatedJsonList);
  };
  const handleOnChange = (event) => {
    if (event.type === 'json') {
      try {
        const parsedJson = JSON.parse(event.value);
        setFilledJsonObj((prev) => ({
          ...prev,
          [event.name]: parsedJson
        }));
        updateArry(event);
      } catch (err) {
        alert('invalid Json');
      }
    } else {
      setFilledJsonObj((prev) => ({
        ...prev,
        [event.name]: event.value
      }));
      updateArry(event);
    }
  };
  return (
    <div>
      {envList.length > 0 && (
        <ObjectGrid
          items={envList?.map((object, index) => {
            return {
              ...object,
              srNo: index + 1,
              id: object.objectId
            };
          })}
          headers={headers}
          // onChartClick={chartModalChartHandler}
        />
      )}
      {envEdit?.type && (
        <Sheet key="right" open={envEdit?.type} onOpenChange={handleClose}>
          <SheetContent
            side={'right'}
            className="max-w-[1100px] overflow-auto sm:max-w-[700px]"
          >
            <SheetHeader>
              <SheetTitle>
                <div className="my-4 flex items-center justify-between px-4">
                  <div className="mb-4 flex items-center justify-between">
                    {/* Title */}
                    <Label className={`text-lg font-medium`}>
                      {envEdit?.data?.name
                        ? envEdit?.data?.name
                        : 'Environment'}
                    </Label>
                  </div>

                  {/* Secondary Section */}
                  <div className="mb-4 flex h-12 items-center justify-between">
                    <div className="mx-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setVariablePanel(true)}
                      >
                        Add new variable
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button className="p-2" onClick={onSubmitHandler}>
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>

            <div className="p-5">
              <div>
                {variablePanel && (
                  <div className="mb-2 border border-dashed border-gray-500 p-4">
                    <div className="flex justify-end">
                      <span>
                        <X onClick={() => setVariablePanel(false)} />
                      </span>
                    </div>
                    <div className="flex">
                      <Input
                        className=""
                        label="key"
                        variant="outlined"
                        placeholder="Add key for new Variable"
                        name="Name"
                        type="text"
                        value={newVariable?.key}
                        onChange={(e) =>
                          setNewVariable((prev) => ({
                            ...prev,
                            key: e.target.value
                          }))
                        }
                      />
                      <div className="mx-2">
                        <Input
                          placeholder="Add type for new Variable"
                          className=""
                          label="Type"
                          variant="outlined"
                          name="type"
                          type="text"
                          value={newVariable?.type}
                          onChange={(e) =>
                            setNewVariable((prev) => ({
                              ...prev,
                              type: e.target.value
                            }))
                          }
                        />
                      </div>

                      <div className="mt-4 flex items-center">
                        <Button className="p-2" onClick={handleAddVariable}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {envEdit?.type === 'create' ? (
                  <>
                    <Input
                      className="mb-2"
                      label="Name"
                      variant="outlined"
                      name="Name"
                      type="text"
                      value={envData?.name}
                      onChange={(e) =>
                        setEnvData((prev) => ({
                          ...prev,
                          name: e.target.value
                        }))
                      }
                    />
                    <Input
                      className="mb-2"
                      label="description"
                      variant="outlined"
                      name="description"
                      type="text"
                      value={envData?.description}
                      onChange={(e) =>
                        setEnvData((prev) => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }
                    />
                  </>
                ) : null}
                {
                  neededJsonList && (
                    <ObjectGrid
                      items={neededJsonList?.map((object, index) => {
                        return {
                          ...object,
                          // srNo: object.id,
                          id: object.id
                        };
                      })}
                      headers={headersMOdal}
                      // onCellValueChanged={onCellValueChanged}
                      // onChartClick={chartModalChartHandler}
                    />
                  )
                  // <div key={variable.name}>{renderInputByType(variable)}</div>
                }
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};
