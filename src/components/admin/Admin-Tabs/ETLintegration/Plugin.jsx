import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/componentss/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/componentss/ui/avatar';

import { colors } from '../../../../common/constants/styles';

import {
  fetchAllObjectById,
  fetchEnvByPluinId,
  fetchNeededJsonById,
  fetchTypeOfIntegration,
  getPluginDetailBypluginID,
  updatePluginById
} from '../../../../services/integration';
import { PluginList } from './PluginList';
import { Input } from '@/componentss/ui/input';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Label } from '@/componentss/ui/label';
import { ObjectLanding } from './ObjectLanding';
import { EnvironMentGrid } from './EnvironMentGrid';
import { Plus, PlusCircle } from 'lucide-react';
import { notify } from '../../../../hooks/toastUtils';

export const Plugin = ({
  open,
  setOpen,
  allPluginList,
  pluginEdit,
  setpluginEdit,
  setRefetch,
  refetch
}) => {
  const dispatch = useDispatch();

  const { currentTheme } = useSelector((state) => state.auth);
  const [error, setError] = useState('');
  const [pluginTypeList, setPluginTypeList] = useState([]);
  const [nonConfiguredList, setNonConfiguredList] = useState([]);
  const [filledJsonObj, setFilledJsonObj] = useState({});
  const [dynamicHeaderList, setDynamicHeaderList] = useState({});
  const [selectedPluginId, setSelectedPluginId] = useState('');
  const [envList, setEnvList] = useState([]);
  const [allObjectList, setAllObjectList] = useState([]);
  const [envEdit, setEnvEdit] = useState({});

  const [objectEdit, setObjectEdit] = useState({
    type: '',
    data: ''
  });
  const [configuredData, setConfiguredData] = useState({
    pluginId: '',
    tenantId: 'tenant1',
    name: '',
    logoUrl: '',
    neededJson: '',
    filledJson: '',
    isConfigured: false,
    type: '',
    description: ''
  });

  const handleClose = () => {
    setOpen(false);
  };
  const getPluginType = async () => {
    try {
      const getPluginType = await fetchTypeOfIntegration('pulgin');
      setPluginTypeList(
        getPluginType?.result.map((type, index) => ({
          label: type,
          value: index + 1
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  // const neededJsonList = async () => {
  //   const data = await fetchNeededJsonById(configuredData?.pluginId);
  //   const keyOfJson = Object.keys(data.result).reduce((acc, key) => {
  //     acc[key] = ''; // Set each value to an empty string
  //     return acc;
  //   }, {});
  //   setDynamicHeaderList(data?.result);
  //   setFilledJsonObj(keyOfJson);
  //   setConfiguredData((prev) => ({
  //     ...prev,
  //     neededJson: JSON.stringify(data?.result),
  //     filledJson: keyOfJson
  //   }));
  // };

  useEffect(() => {
    if (allPluginList.length > 0) {
      const nonConfigerd = allPluginList.filter(
        (ele) => ele.isConfigured === false
      );
      setNonConfiguredList(nonConfigerd);
    }
  }, [allPluginList]);

  useEffect(() => {
    getPluginType();
  }, []);

  // useEffect(() => {
  //   if (configuredData?.pluginId) {
  //     neededJsonList();
  //   }
  // }, [configuredData?.pluginId]);

  const handleHeaderChange = (field, value) => {
    // if (field === 'json') {
    //   validateJson(value);
    // }
    setFilledJsonObj((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const onSubmitHandler = async () => {
    try {
      const newObj = {
        ...configuredData
      };
      const updatePlugin = await updatePluginById(
        configuredData.pluginId,
        newObj
      );
      if (updatePlugin.statusCode === 200) {
        setpluginEdit((prev) => ({
          ...prev,
          data: newObj
        }));

        notify.success('Pluign Updated Successfully .');
        setRefetch((prev) => !prev);
        setOpen(false);
      }
    } catch (error) {
      console.log('Error:-', error);
    }
  };

  const getEnvironment = async (pluginId) => {
    try {
      const response = await fetchEnvByPluinId(pluginId);
      if (response?.statusCode === 200) {
        setEnvList(response?.result);
      }
    } catch (error) {
      console.log('Error:-', error);
    }
  };

  useEffect(() => {
    if (pluginEdit?.data) {
      setConfiguredData((prev) => ({
        ...prev,
        type: pluginEdit?.data?.type,
        tenantId: pluginEdit?.data?.tenantId,
        isConfigured: pluginEdit?.data?.isConfigured,
        description: pluginEdit?.data?.description,
        pluginId: pluginEdit?.data?.pluginId,
        name: pluginEdit?.data?.name,
        logoUrl: pluginEdit?.data?.logoUrl
      }));
      getEnvironment(pluginEdit?.data?.pluginId);
      if (pluginEdit?.data?.filledJson) {
        setFilledJsonObj(JSON.parse(pluginEdit?.data?.filledJson));
      }
    }
  }, [pluginEdit, refetch]);

  const getObjectById = async (pluginId) => {
    const allObject = await fetchAllObjectById(pluginId);
    if (allObject?.statusCode === 200) {
      setAllObjectList(allObject?.result);
    }
  };

  useEffect(() => {
    if (pluginEdit?.data) {
      getObjectById(pluginEdit?.data?.pluginId);
    }
  }, [pluginEdit?.data, refetch]);
  return (
    <>
      {allPluginList && !pluginEdit?.data ? (
        <PluginList
          allPluginList={allPluginList}
          pluginTypeList={pluginTypeList}
          setpluginEdit={setpluginEdit}
        />
      ) : pluginEdit.type === 'edit' ? (
        <div className="">
          <div className="">
            <div className="flex flex-col">
              <div className="m-3 flex flex-row">
                <div className="mx-2">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={configuredData?.logoUrl} />
                    <AvatarFallback>
                      <Label className="text-primary-600 label-logo text-3xl font-bold">
                        {configuredData.name?.trim().charAt(0).toUpperCase()}
                      </Label>
                    </AvatarFallback>
                  </Avatar>
                  {/* <Avatar
                    style={{
                      width: '70px',
                      height: '60px',
                      borderRadius: '8px',
                      padding: '10px',
                      backgroundColor: colors.grey[100],

                      img: {
                        objectFit: 'contain'
                      }
                    }}
                    alt="User 1"
                    src={configuredData?.logoUrl}
                  >
                    <Label className="text-primary-600 label-logo text-3xl font-bold">
                      {configuredData.name?.trim().charAt(0).toUpperCase()}
                    </Label>
                  </Avatar> */}
                </div>
                <div className="flex flex-col justify-center">
                  <Label className="mb-1">{configuredData?.name}</Label>
                  <Label className="text-accent-50 admin-lable-color">
                    {configuredData?.description}
                  </Label>
                </div>
              </div>
              <div className="mt-4 flex w-full max-w-4xl items-center justify-between">
                <div className="flex-1 px-2">
                  <Label className="admin-lable-color text-xs font-semibold">
                    Name
                  </Label>
                  <Input
                    placeholder="Name"
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
                </div>
                <div className="flex-1 px-2">
                  <Label className="admin-lable-color text-xs font-semibold">
                    Plugin Type
                  </Label>
                  <Dropdown
                    name="Plugin Type"
                    value={configuredData?.type}
                    onChange={(e) =>
                      setConfiguredData((prev) => ({
                        ...prev,
                        type: e.target.value
                      }))
                    }
                    options={pluginTypeList}
                  />
                </div>
                <div className="flex-1 px-2">
                  <Label className="admin-lable-color text-xs font-semibold">
                    Description
                  </Label>
                  <Input
                    placeholder="Description"
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
                </div>
                <div className="mt-4 flex h-10 items-center justify-between">
                  <Button className="bg-primary" onClick={onSubmitHandler}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-7 flex flex-row">
            <div className="w-1/2 border">
              <div className="flex justify-between">
                <Label className="m-5 text-lg font-semibold">Operation</Label>
                <div
                  className="m-4"
                  onClick={() => {
                    setOpen(true);
                    setObjectEdit({ type: 'create' });
                  }}
                >
                  <Plus />
                </div>
              </div>
              <ObjectLanding
                open={open}
                setOpen={setOpen}
                setObjectEdit={setObjectEdit}
                objectEdit={objectEdit}
                allObjectList={allObjectList}
                setRefetch={setRefetch}
                pluginEdit={pluginEdit}
              />
            </div>
            <div className="w-1/2 border">
              <div className="flex justify-between">
                <Label className="m-5 text-lg font-semibold">Environment</Label>
                <div
                  className="m-4"
                  onClick={() => {
                    setEnvEdit({ type: 'create' });
                    setOpen(true);
                  }}
                >
                  <Plus />
                </div>
              </div>
              <EnvironMentGrid
                open={open}
                setOpen={setOpen}
                envEdit={envEdit}
                setEnvEdit={setEnvEdit}
                envList={envList}
                allObjectList={allObjectList}
                pluginEdit={pluginEdit}
                setRefetch={setRefetch}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
