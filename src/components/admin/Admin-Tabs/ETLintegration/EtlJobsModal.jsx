import { Switch } from '@/componentss/ui/switch';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  createNewEtlJobs,
  fetchAllObjectById,
  fetchAllPluginById,
  fetchEnvByPluinId
} from '../../../../services/integration';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/componentss/ui/sheet';
import {
  convertToMinutes,
  revertToFields
} from '../../../../common/utils/helpers';

import { useDispatch } from 'react-redux';
import { Button } from '@/componentss/ui/button';
import { Input } from '@/componentss/ui/input';
import { Label } from '@/componentss/ui/label';
import { Dropdown } from '@/componentss/ui/dropdown';
import { etlXml } from '../../../workflow/BPMN/util';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../../../hooks/toastUtils';

export const EtlJobsModal = ({
  setOpen,
  open,
  etlTypeList,
  handleClose,
  etlActionObj,
  setRefetch,
  setEtlActionObj,
  onUpdate
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state) => state.auth);
  const [configuredPlugin, setConfiguredPlugin] = useState([]);
  const [sourceObject, setSourceObject] = useState([]);
  const [destinationObject, setDestinationObject] = useState([]);
  const [sourceEnv, setSourceEnv] = useState([]);
  const [destinationEnv, setDestinationEnv] = useState([]);
  const [errorMsg, setErrorMsg] = useState({});
  const [dateTime, setDateTime] = useState({
    month: '',
    days: '',
    hours: '',
    minutes: ''
  });
  const [etlJob, setEtlJob] = useState({
    tenantId: 'tenant1',
    name: '',
    type: '',
    sourcePluginId: '',
    destinationPluginId: '',
    sourcePluginEnvId: '',
    destinationPluginEnvId: '',
    sourceOpId: '',
    destinationOpId: '',
    isActive: false,
    timeInterval: ''
  });

  const getAllPlugin = async (tenantId) => {
    try {
      const getPlugin = await fetchAllPluginById(tenantId);
      setConfiguredPlugin(
        getPlugin?.result.map((obj) => ({
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
    if (etlActionObj.type === 'edit') {
      handleChangeSourcePlugin(etlActionObj.data?.sourcePluginId);
      handleChangeDestintnPlugin(etlActionObj.data?.destinationPluginId);
      const fields = revertToFields(etlActionObj.data?.timeInterval);
      setDateTime(fields);

      setEtlJob((prev) => ({
        ...prev,
        jobId: etlActionObj.data?.jobId,
        tenantId: 'tenant1',
        name: etlActionObj.data?.name || prev.name,
        type: etlActionObj.data?.type || prev.type,
        sourcePluginId: etlActionObj.data?.sourcePluginId,
        destinationPluginId: etlActionObj.data?.destinationPluginId,
        sourcePluginEnvId: etlActionObj.data?.sourcePluginEnvId,
        destinationPluginEnvId: etlActionObj.data?.destinationPluginEnvId,
        sourceOpId: etlActionObj.data?.sourceOpId,
        destinationOpId: etlActionObj.data?.destinationOpId,
        isActive: etlActionObj.data?.isActive ?? prev.isActive,
        timeInterval: etlActionObj.data?.timeInterval
      }));
    }
  }, [etlActionObj.data]);

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
    }

    const envList = await fetchEnvByPluinId(id);
    if (envList?.statusCode) {
      setSourceEnv(
        envList?.result.map((obj) => ({
          ...obj,
          label: obj.name,
          value: obj.environmentId
        }))
      );
    }

    setEtlJob((prev) => ({
      ...prev,
      sourcePluginId: id
    }));
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
    }

    const allEnv = await fetchEnvByPluinId(id);
    if (allEnv?.statusCode) {
      setDestinationEnv(
        allEnv?.result.map((obj) => ({
          ...obj,
          label: obj.name,
          value: obj.environmentId
        }))
      );
    }
    setEtlJob((prev) => ({
      ...prev,
      destinationPluginId: id
    }));
  };
  const onSubmitHandler = async () => {
    let xmlString = etlXml;

    const totalMinutes = convertToMinutes(dateTime);
    if (etlActionObj.type !== 'edit') {
      const newObj = {
        ...etlJob,
        xmlString: xmlString,
        timeInterval: totalMinutes
      };

      const response = await createNewEtlJobs(newObj);
      if (response.statusCode === 200) {
        notify.success('Job Created Successfully .');
        setRefetch((prev) => !prev);
        setOpen(false);
        setEtlActionObj({});
      }
    } else {
      const newObj = {
        ...etlJob,
        xmlString: etlJob?.xmlString,
        timeInterval: totalMinutes
      };
      setOpen(false);
      onUpdate(etlJob?.jobId, newObj);
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
                  <Label className={`text-lg font-medium`}>Jobs</Label>
                </div>

                {/* Secondary Section */}
                {etlActionObj.type === 'edit' ? (
                  <div className="mb-4 flex h-12 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        type="submit"
                        form="reference-modal"
                        className="bg-primary"
                        onClick={onSubmitHandler}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="">
            <div>
              <div className="my-2">
                <Input
                  label="Name"
                  variant="outlined"
                  name="Name"
                  type="text"
                  value={etlJob?.name}
                  onChange={(e) =>
                    setEtlJob((prev) => ({
                      ...prev,
                      name: e.target.value
                    }))
                  }
                />
              </div>
              <div className="my-2">
                <Dropdown
                  label="Etl Type"
                  options={etlTypeList}
                  value={etlJob?.type}
                  onChange={(e) =>
                    setEtlJob((prev) => ({
                      ...prev,
                      type: e.target.value
                    }))
                  }
                />
              </div>

              {etlTypeList.find((o) => o.value === etlJob.type)?.label ===
              'Continuous sync' ? (
                <div className="mt-2 flex items-start">
                  <div className="mb-1 flex flex-col">
                    <Input
                      label="Month"
                      type="number"
                      value={dateTime.month}
                      onChange={(event) => {
                        const value = event.target.value;
                        const numberValue = Number(value);
                        if (numberValue >= 0 && numberValue <= 12) {
                          setDateTime((prevState) => ({
                            ...prevState,
                            month: value
                          }));
                          setErrorMsg({
                            month: ''
                          });
                        } else {
                          setErrorMsg({
                            month: 'Please enter a value between 0 and 12'
                          });
                        }
                      }}
                      inputProps={{ maxLength: 2 }}
                    />
                    {errorMsg?.month && <Label>{errorMsg.month}</Label>}
                  </div>

                  <div className="mb-1 flex flex-col">
                    <Input
                      label="Days"
                      type="number"
                      value={dateTime.days}
                      onChange={(event) => {
                        const value = event.target.value;
                        const numberValue = Number(value);
                        if (numberValue >= 0 && numberValue <= 31) {
                          setDateTime((prevState) => ({
                            ...prevState,
                            days: event.target.value
                          }));
                          setErrorMsg({
                            days: ''
                          });
                        } else {
                          setErrorMsg({
                            days: 'Please enter a value between 0 and 31'
                          });
                        }
                      }}
                      maxLength="2"
                    />
                    <Label
                      style={{
                        color: 'red',
                        fontSize: '12px',
                        marginTop: '4px'
                      }}
                    >
                      {errorMsg?.days}
                    </Label>
                  </div>
                  <div className="mb-1 flex flex-col">
                    <Input
                      label="Hours"
                      type="number"
                      value={dateTime.hours}
                      onChange={(event) => {
                        const value = event.target.value;
                        const numberValue = Number(value);
                        if (numberValue >= 0 && numberValue <= 23) {
                          setDateTime((prevState) => ({
                            ...prevState,
                            hours: value
                          }));
                          setErrorMsg({
                            hours: ''
                          });
                        } else {
                          setErrorMsg({
                            hours: 'Please enter a value between 0 and 23'
                          });
                        }
                      }}
                      maxLength="2"
                    />
                    <Label
                      style={{
                        color: 'red',
                        fontSize: '12px',
                        marginTop: '4px'
                      }}
                    >
                      {errorMsg?.hours}
                    </Label>
                  </div>
                  <div className="mb-1 flex flex-col">
                    <Input
                      label="Minutes"
                      type="number"
                      value={dateTime.minutes}
                      onChange={(event) => {
                        const value = event.target.value;
                        const numberValue = Number(value);
                        if (numberValue >= 0 && numberValue <= 59) {
                          setDateTime((prevState) => ({
                            ...prevState,
                            minutes: value
                          }));
                          setErrorMsg({
                            minutes: ''
                          });
                        } else {
                          setErrorMsg({
                            minutes: 'Please enter a value between 0 and 59'
                          });
                        }
                      }}
                      maxLength="2"
                    />
                    <Label
                      style={{
                        color: 'red',
                        fontSize: '12px',
                        marginTop: '4px'
                      }}
                    >
                      {errorMsg?.minutes}
                    </Label>
                  </div>
                </div>
              ) : null}
              {etlActionObj.type === 'edit' ? (
                <>
                  <div className="my-2">
                    <Dropdown
                      label="Source Plugin"
                      options={configuredPlugin}
                      value={etlJob?.sourcePluginId}
                      onChange={(e) => handleChangeSourcePlugin(e.target.value)}
                    />
                  </div>
                  <div className="my-2">
                    <Dropdown
                      label="Source Environment"
                      options={sourceEnv}
                      value={etlJob?.sourcePluginEnvId}
                      onChange={(e) =>
                        setEtlJob((prev) => ({
                          ...prev,
                          sourcePluginEnvId: e.target.value
                        }))
                      }
                    />
                  </div>
                  <div className="my-2">
                    <Dropdown
                      label="Source Object"
                      options={sourceObject}
                      value={etlJob?.sourceOpId}
                      onChange={(e) =>
                        setEtlJob((prev) => ({
                          ...prev,
                          sourceOpId: e.target.value
                        }))
                      }
                    />
                  </div>
                  <div className="my-2">
                    <Dropdown
                      label="Destination Plugin"
                      id="input_type2"
                      options={configuredPlugin}
                      value={etlJob?.destinationPluginId}
                      onChange={(e) =>
                        handleChangeDestintnPlugin(e.target.value)
                      }
                    />
                  </div>
                  <div className="my-2">
                    <Dropdown
                      label="Destination Environment"
                      options={destinationEnv}
                      value={etlJob?.destinationPluginEnvId}
                      onChange={(e) =>
                        setEtlJob((prev) => ({
                          ...prev,
                          destinationPluginEnvId: e.target.value
                        }))
                      }
                    />
                  </div>
                  <div className="my-2">
                    <Dropdown
                      label="Destination Object"
                      options={destinationObject}
                      value={etlJob?.destinationOpId}
                      onChange={(e) =>
                        setEtlJob((prev) => ({
                          ...prev,
                          destinationOpId: e.target.value
                        }))
                      }
                    />
                  </div>
                </>
              ) : null}
              <div className="my-2">
                <Switch
                  label="Is Active"
                  id="airplane-mode"
                  checked={Boolean(etlJob.isActive)}
                  onCheckedChange={(checked) =>
                    setEtlJob((prev) => ({
                      ...prev,
                      isActive: checked
                    }))
                  }
                />
              </div>
              {etlActionObj.type !== 'edit' ? (
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    form="reference-modal"
                    className="bg-primary"
                    onClick={() => {
                      let newObj = {};
                      if (
                        etlTypeList.find((o) => o.value === etlJob.type)
                          ?.label === 'Continuous sync'
                      ) {
                        const totalMinutes = convertToMinutes(dateTime);
                        newObj = {
                          ...etlJob,
                          xmlString: etlXml,
                          timeInterval: totalMinutes
                        };
                      } else {
                        newObj = {
                          ...etlJob,
                          xmlString: etlXml
                        };
                      }
                      navigate(`/admin/integration/job/${etlJob.jobId}`, {
                        state: {
                          type: 'create',
                          Job: newObj
                        }
                      });
                    }}
                  >
                    Create new job in Editor
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
