import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Textarea } from '@/componentss/ui/textarea';
import { Dropdown } from '@/componentss/ui/dropdown';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/componentss/ui/sheet';
import {
  createNewObject,
  updateObject
} from '../../../../services/integration';
import { Button } from '@/componentss/ui/button';
import { Input } from '@/componentss/ui/input';
import { Label } from '@/componentss/ui/label';
import { Switch } from '@/componentss/ui/switch';
import { notify } from '../../../../hooks/toastUtils';

export const ObjectModal = ({
  allPluginList,
  open,
  setOpen,
  selectedPluginId,
  objectEdit,
  operationType,
  setRefetch,
  setObjectEdit
}) => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state) => state.auth);
  const [configuredData, setConfiguredData] = useState({
    pluginId: '',
    description: '',
    name: '',
    isBulkApi: false
  });
  const [jsonText, setJsonText] = useState(
    JSON.stringify(configuredData.neededJson, null, 2) // Initial formatted JSON
  );
  const [singleObjStructure, setSingleObjStructure] = useState(
    JSON.stringify(configuredData.singleObjectStructure, null, 2) // Initial formatted JSON
  );
  const handleClose = () => {
    setOpen(false);
    setObjectEdit({
      type: '',
      data: ''
    });
  };

  const onSubmitHandler = async () => {
    if (objectEdit.type === 'edit') {
      const newObj = {
        ...configuredData,
        ['neededJson']: configuredData?.neededJson
      };
      const response = await updateObject(configuredData?.operationId, newObj);
      if (response.statusCode === 200) {
        notify.success('Operation Updated Successfully .');
        setRefetch((prev) => !prev);
        setOpen(false);
        setObjectEdit({});
      }
    } else {
      console.log(configuredData);
      const response = await createNewObject(configuredData);
      if (response.statusCode === 200) {
        notify.success('Operation Created Successfully .');
        setRefetch((prev) => !prev);
        setOpen(false);
      }
    }
    setObjectEdit({
      type: '',
      data: ''
    });
  };

  // const handleHeaderChange = (field, value) => {
  //   // if (field === 'json') {
  //   //   validateJson(value);
  //   // }
  //   setFilledJsonObj((prev) => ({
  //     ...prev,
  //     [field]: value
  //   }));
  // };

  useEffect(() => {
    if (selectedPluginId) {
      setConfiguredData((prev) => ({
        ...prev,
        pluginId: selectedPluginId
      }));
    }
  }, [selectedPluginId]);

  useEffect(() => {
    if (objectEdit?.type === 'edit') {
      const parcedJson = objectEdit?.data?.neededJson;

      const needeJsonObj = parcedJson;
      const keyOfJson = Object.keys(needeJsonObj).reduce((acc, key) => {
        acc[key] = ''; // Set each value to an empty string
        return acc;
      }, {});
      console.log(objectEdit?.data);
      setConfiguredData((prev) => ({
        ...prev,
        pluginId: objectEdit?.data?.pluginId,
        operationId: objectEdit?.data?.operationId,
        name: objectEdit?.data?.name,
        neededJson: needeJsonObj,
        type: objectEdit?.data?.type,
        isBulkApi: objectEdit?.data?.isBulkApi,
        singleObjectStructure: objectEdit?.data?.singleObjectStructure,
        description: objectEdit?.data?.description
      }));
      setJsonText(JSON.stringify(parcedJson));
      setSingleObjStructure(
        JSON.stringify(objectEdit?.data?.singleObjectStructure)
      );
    }
  }, [objectEdit]);

  const handleJsonChange = (e, field) => {
    const value = e.target.value;
    try {
      const parsedJson = JSON.parse(value);
      setConfiguredData((prev) => ({
        ...prev,
        [field]: parsedJson // Update state with the parsed JSON object
      }));
    } catch (err) {
      console.log('invalid Json');
    }
  };
  return (
    <>
      <Sheet key="right" open={open} onOpenChange={handleClose}>
        <SheetContent
          side={'right'}
          className="max-w-[600px] overflow-auto sm:max-w-[600px]"
        >
          <SheetHeader>
            <SheetTitle>
              <div className="my-4 flex items-center justify-between px-4">
                <div className="mb-4 flex items-center justify-between">
                  {/* Title */}
                  <Label className={`text-lg font-medium`}> Operation</Label>
                </div>

                {/* Secondary Section */}
                <div className="mb-4 flex h-12 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button className="p-2" onClick={onSubmitHandler}>
                      {objectEdit.type === 'edit' ? 'Save' : 'Create'}
                    </Button>
                  </div>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="">
            <div className="">
              <div>
                <Input
                  className="mb-2"
                  label="Name"
                  variant="outlined"
                  name="Name"
                  type="text"
                  value={configuredData?.name}
                  onChange={(e) =>
                    setConfiguredData((prev) => ({
                      ...prev,
                      name: e.target.value
                    }))
                  }
                />
                <Input
                  className="mb-2"
                  label="Description"
                  variant="outlined"
                  name="description"
                  type="text"
                  value={configuredData?.description}
                  onChange={(e) =>
                    setConfiguredData((prev) => ({
                      ...prev,
                      description: e.target.value
                    }))
                  }
                />
                <div className="my-2">
                  <Dropdown
                    label="Type"
                    options={operationType}
                    value={configuredData?.type}
                    onChange={(e) =>
                      setConfiguredData((prev) => ({
                        ...prev,
                        type: e.target.value
                      }))
                    }
                  />
                </div>
                <Textarea
                  className="mb-2 w-full"
                  label="Needed Json"
                  variant="outlined"
                  name="NeededJson"
                  type="json"
                  value={jsonText}
                  onChange={(e) => {
                    setJsonText(e.target.value);
                    handleJsonChange(e, 'neededJson');
                  }}
                  id={`textarea-needejson`}
                  minRows={4}
                  maxRows={Infinity}
                />

                <Textarea
                  className="mb-2 w-full"
                  id={`textarea-singleObj`}
                  minRows={4}
                  maxRows={Infinity}
                  label="Single Object Structure"
                  variant="outlined"
                  name="singleObjectStructure"
                  type="text"
                  value={singleObjStructure}
                  onChange={(e) => {
                    setSingleObjStructure(e.target.value);
                    handleJsonChange(e, 'singleObjectStructure');
                  }}
                />
                <div className="my-2">
                  <Switch
                    label="Is Bulk operation"
                    optionLabelPosition="end"
                    id="switch-margin"
                    checked={configuredData.isBulkApi}
                    onCheckedChange={(checked) =>
                      setConfiguredData((prev) => ({
                        ...prev,
                        isBulkApi: checked
                      }))
                    }
                  />
                </div>
                {/* {dynamicHeaderList &&
                    Object.entries(dynamicHeaderList).map(([key, type]) => (
                      <div key={key}>{renderInputByType(key, type)}</div>
                    ))} */}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
