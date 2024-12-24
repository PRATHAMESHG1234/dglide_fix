import { Button } from '@/componentss/ui/button';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Label } from '@/componentss/ui/label';
import { Input } from '@/componentss/ui/input';
import { getArryFromObj } from '../../../../workflow/BPMN/Helper/helper';
import { ArrowLeft, ChevronsLeftRight, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { JsonPath } from '../../../../workflow/BPMN/Panels/JsonPathPicker';
import { generateUId } from '../../../../../common/utils/helpers';
import { ObjectGrid } from '../ObjectGrid';
import { Modal } from '@/componentss/ui/modal';

export const TransformationPanel = ({
  allPluginList,
  selectedJob,
  setJobPanel,
  handleAddNew,
  destObjectDetail,
  setDestObjectDetail,
  sorceObjectDetail,
  setJsonContent,
  addExpression,
  handleDeleteKey,
  modeler,
  jsonContent,
  element,
  AddExternalJsontoJob
}) => {
  const [mappingExpresion, setMappingExpresion] = useState({
    id: '',
    path: ''
  });
  const [pathText, setPathText] = useState('');
  const [externalJsonList, setExternalJsonList] = useState([]);
  const [mappingField, setMappingField] = useState(false);
  const [mapperPanel, setMapperPanel] = useState(false);
  const [createMappingList, setCreateMappingList] = useState(false);
  const [userMappingPanel, setUserMappingPanel] = useState(false);
  const [mappingObj, setMappingObj] = useState({
    id: generateUId(),
    name: '',
    stage: 'mapper',
    mapper: ''
  });
  const [keyValueArr, setkeyValueArr] = useState([
    {
      key: '',
      value: ''
    }
  ]);

  useEffect(() => {
    if (selectedJob) {
      setExternalJsonList(selectedJob?.externalJson);
    }
  }, [selectedJob]);

  useEffect(() => {
    if (pathText) {
      setMappingExpresion((prev) => ({
        ...prev,
        path: pathText
      }));
    }
  }, [pathText]);

  useEffect(() => {
    if (sorceObjectDetail) {
      setJsonContent(JSON.stringify(sorceObjectDetail));
    }
  }, [sorceObjectDetail]);
  const getLabel = (id) => {
    return allPluginList?.find((o) => o.pluginId === id)?.name;
  };

  const handleSubmitTransformPanel = () => {
    const newObj = Object.assign({}, destObjectDetail);
    if (newObj) {
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, {
        variables: JSON.stringify(newObj),
        s_type: 'transformation'
      });

      setJobPanel({
        SourcePlugin: false,
        destinationPlugin: false,
        transformation: false
      });
    }
  };

  const handleAddMapping = (index) => {
    console.log('wqwqw', index);
    setMappingField(true);
  };
  const handleAddKeyVal = () => {
    setkeyValueArr((prev) => [...prev, { key: '', value: '' }]);
  };
  const handleChange = (index, field, value) => {
    setkeyValueArr((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };
  const handleSubmitMapping = () => {
    let newObj = {};
    const copyOfObj = { ...mappingObj };
    keyValueArr.forEach((o) => {
      newObj[o.key] = o.value;
    });
    copyOfObj.mapper = newObj;
    console.log(copyOfObj);
    setMappingObj(copyOfObj);
    console.log('externalJsonList before update:', externalJsonList);
    setExternalJsonList([...externalJsonList, copyOfObj]);
  };
  const headers = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'MappingId', field: 'id', sortable: true, filter: true }
  ];

  console.log(mappingExpresion);

  return (
    <>
      <div id="condition-panel" className="panel notify-panel">
        {createMappingList === true ? (
          <div className="">
            <div className="align-center flex justify-between">
              <span
                className={`hover:bg-primary-dark z-10 mx-2 mb-2 flex cursor-pointer items-center justify-center rounded-md bg-accent p-2 hover:text-primary`}
              >
                <ArrowLeft
                  size={16}
                  className="cursor-pointer"
                  onClick={() => {
                    AddExternalJsontoJob(externalJsonList);
                    setCreateMappingList(false);
                  }}
                />
              </span>
              <Button onClick={() => setUserMappingPanel(true)}>
                Add Mapping
              </Button>
            </div>
            {userMappingPanel && (
              <>
                <div className="max-w-50">
                  <Input
                    className="mb-2"
                    label="Name"
                    variant="outlined"
                    name="Name"
                    type="text"
                    value={mappingObj.name}
                    onChange={(e) =>
                      setMappingObj((prev) => ({
                        ...prev,
                        name: e.target.value
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col items-center">
                  {keyValueArr.map((obj, index) => (
                    <div key={index} className="mb-4 flex flex-row gap-4">
                      <Input
                        className="mb-2"
                        label="Key"
                        variant="outlined"
                        name={`key-${index}`}
                        type="text"
                        value={obj.key}
                        onChange={(e) =>
                          handleChange(index, 'key', e.target.value)
                        }
                      />
                      <Input
                        className="mb-2"
                        label="Value"
                        variant="outlined"
                        name={`value-${index}`}
                        type="text"
                        value={obj.value}
                        onChange={(e) =>
                          handleChange(index, 'value', e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <Button className="mt-4" onClick={handleAddKeyVal}>
                    Add New Key-Value
                  </Button>
                </div>
                <Button className="mt-4" onClick={handleSubmitMapping}>
                  save
                </Button>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => setUserMappingPanel(false)}
                >
                  Close
                </Button>
              </>
            )}
            <div className="">
              {externalJsonList && (
                <ObjectGrid
                  items={externalJsonList?.map((object, index) => {
                    return {
                      ...object,
                      id: object.id
                    };
                  })}
                  headers={headers}
                  // onChartClick={chartModalChartHandler}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="">
            <form id="setForm">
              <p>
                <Label className="text-xl font-bold">
                  Type mapping configuration
                </Label>
              </p>
              <Button
                id="close"
                className="close-btn"
                onClick={() =>
                  setJobPanel({
                    transformation: false
                  })
                }
              >
                &times;
              </Button>
              <div className="mt-2">
                <div className="flex">
                  <div className="mb-4 flex flex-col">
                    <Label className="text-xl font-bold">
                      Plugin Integration Overview
                    </Label>
                    <Label className="mt-2 text-sm">
                      {`Source Plugin : ${getLabel(selectedJob?.sourcePluginId)}
                   |  Destination Plugin : ${getLabel(selectedJob?.destinationPluginId)}`}
                    </Label>
                  </div>
                  <div className="">
                    <Button onClick={() => setCreateMappingList(true)}>
                      Add Mapping
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex bg-gray-100 p-2">
                <div className="flex basis-1/2 flex-col bg-white">
                  <div className="mb-1 bg-gray-100">
                    <Label className="text-lg font-bold">Source Object</Label>
                  </div>
                  <div className="mb-1 flex flex-col">
                    {Object.entries(sorceObjectDetail).map(
                      ([key, type], index) => (
                        <div
                          className="m-1 bg-gray-100 p-2"
                          onClick={() => handleAddMapping(key)}
                        >
                          <Label>{key}</Label>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="flex basis-1/2 flex-col bg-white">
                  <div className="mb-1 bg-gray-100">
                    <Label className="text-lg font-bold">
                      Destination Object
                    </Label>
                  </div>
                  <div className="mb-1 flex flex-col">
                    {Object.entries(destObjectDetail).map(
                      ([key, type], index) => (
                        <div
                          className="m-1 bg-gray-100 p-2"
                          onClick={() => handleAddMapping(key)}
                        >
                          <Label>{key}</Label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex">
                <div>
                  <Button onClick={(e) => handleSubmitTransformPanel(e)}>
                    Ok
                  </Button>
                </div>
                <div className="mx-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setJobPanel({
                        SourcePlugin: false
                      })
                    }
                  >
                    Close
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
      {mappingField && (
        <div id="condition-panel" className="panel notify-panel1">
          <form id="setForm">
            <p>
              <b> Mapping Field</b>
            </p>
            <Button
              id="close"
              variant="outline"
              className="close-btn"
              type="button"
              onClick={() => setMappingField(false)}
            >
              &times;
            </Button>
            <div className="flex items-center justify-between">
              <div className="max-w-50">
                <Input
                  className="mb-2"
                  label="Name"
                  variant="outlined"
                  name="Name"
                  type="text"
                  // value={}
                  // onChange={(e) =>
                  //   setConfiguredData((prev) => ({
                  //     ...prev,
                  //     name: e.target.value
                  //   }))
                  // }
                />
              </div>
              <span className="mt-6">
                <Plus onClick={() => addExpression('', 'needeJson', '')} />
              </span>
              <div className="w-100">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setMapperPanel(true);
                  }}
                >
                  Mapper
                </Button>
              </div>
            </div>
            {mapperPanel && (
              <>
                <Dropdown
                  label="Select mapping"
                  options={externalJsonList?.map((group) => {
                    return {
                      value: group.id,
                      label: group.name
                    };
                  })}
                  type="text"
                  value={mappingExpresion?.id}
                  onChange={(event) => {
                    setMappingExpresion((prev) => ({
                      ...prev,
                      id: event.target.value
                    }));
                  }}
                />

                <JsonPath
                  jsonContent={jsonContent}
                  elementId={'source_object'}
                  pathText={pathText}
                  setPathText={setPathText}
                  jsonPathPickerPanel={'noCancle'}
                  onCancel={() => {
                    // setPathPickerPanel(false);
                    // setJsonContent('');
                  }}
                  // submitJsonPathExpression={submitJsonPathExpression}
                />
              </>
            )}
            <div className="mt-4 flex">
              <div item>
                <Button
                // onClick={(e) => handleSubmitPanel(e, 'source')}
                >
                  Ok
                </Button>
              </div>
              <div className="mx-2">
                <Button
                  variant="outline"
                  onClick={() => setMappingField(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
