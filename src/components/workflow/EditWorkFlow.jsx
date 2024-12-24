import { Autocomplete } from '@mui/material';
import { Separator } from '@/componentss/ui/separator';

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { colors, COLORS } from '../../common/constants/styles';
import { fetchWorkFlow, getOptions } from '../../services/workFlow';
import { fetchCatalogFlows } from '../../redux/slices/catalogFlowSlice';
import Drawer from '../../elements/Drawer';
import { MODAL } from '../../common/utils/modal-toggle';
import { convertToMinutes } from '../../common/utils/helpers';
import { X } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/componentss/ui/tooltip';
import { Button } from '@/componentss/ui/button';
import { Label } from '@/componentss/ui/label';
import { Input } from '@/componentss/ui/input';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Switch } from '@/componentss/ui/switch';
import { Textarea } from '@/componentss/ui/textarea';
import { RadioGroup } from '@/componentss/ui/radio-group';
import { Checkbox } from '@/componentss/ui/checkbox';
import { MultiSelect } from '@/componentss/ui/multi-select';
import { Sheet, SheetContent } from '@/componentss/ui/sheet';

export const EditWorkFlow = ({
  state,
  onConfirm,
  onCancel,
  modalActionHandler
}) => {
  const { currentTheme } = useSelector((state) => state.auth);
  const [typeWorkFlow, setTypeWorkFlow] = useState('');
  const [operationList, setOperationList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [sourceTypeList, setSourceTypeList] = useState([]);
  const [catalogFlowList, setCatalogFlowList] = useState([]);
  const dispatch = useDispatch();
  const { catalogFlows } = useSelector((state) => state.catalogFlow);
  const allTableList = useSelector((state) => state?.form);
  const [tableList, setTableList] = useState([]);
  const [errorMsg, setErrorMsg] = useState({});
  const [dateTime, setDateTime] = useState({
    month: '',
    days: '',
    hours: '',
    minutes: ''
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      sourceType: '',
      operation: '',
      status: '',
      tableName: '',
      formInfoId: null,
      catalog: '',
      is_time_trigger: 0,
      triggering_time: '',
      temp_time: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      sourceType: Yup.string().required('Required'),
      operation: Yup.string(),
      status: Yup.string().required('Required'),
      tableName: Yup.string().when('sourceType', {
        is: (val) => val === 'table',
        then: Yup.string().required('Required')
      }),
      catalog: Yup.string().when('sourceType', {
        is: (val) => val === 'Catalog',
        then: Yup.string().required('Required')
      })
    }),
    onSubmit: (values) => {
      const totalMinutes = convertToMinutes(dateTime);
      let newValue;
      if (typeWorkFlow === 'Catalog') {
        newValue = {
          ...values,
          formInfoId: '',
          tableName: '',
          triggering_time: totalMinutes,
          temp_time: JSON.stringify(dateTime)
        };
      } else if (typeWorkFlow === 'Form') {
        newValue = {
          ...values,
          catalog: '',
          triggering_time: totalMinutes,
          temp_time: JSON.stringify(dateTime)
        };
      }

      onConfirm(newValue);
    }
  });

  useEffect(() => {
    if (catalogFlows.length > 0) {
      setCatalogFlowList(catalogFlows);
    }
  }, [catalogFlows]);

  const getWorkFlowStatus = async () => {
    const StatusData = await getOptions('system_workflow', 'status');
    setStatusList(StatusData?.result);
  };

  const getWorkFlowOperationDta = async () => {
    const OperationList = await getOptions('system_workflow', 'operation');
    setOperationList(OperationList?.result);
  };

  const getWorkFlowSourceType = async () => {
    const sourcetype = await getOptions('system_workflow', 'source_type');
    setSourceTypeList(sourcetype?.result);
  };

  useEffect(() => {
    getWorkFlowStatus();
    getWorkFlowOperationDta();
    dispatch(fetchCatalogFlows());
    getWorkFlowSourceType();
  }, []);

  useEffect(() => {
    if (allTableList) {
      let AllTableList = [...allTableList?.forms];
      AllTableList.sort((a, b) => {
        const nameA = a.displayName
          ? a.displayName.toLowerCase()
          : a.name.toLowerCase();
        const nameB = b.displayName
          ? b.displayName.toLowerCase()
          : b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      let list = [];
      for (const item of AllTableList) {
        if (item) {
          list.push({
            label: item?.displayName ? item?.displayName : '',
            value: item?.name ? item?.name : '',
            formInfoId: item?.formInfoId ? item?.formInfoId : null
          });
        }
      }

      setTableList(list);
    }
  }, [allTableList]);

  useEffect(() => {
    let getStatusValue;
    const fetchData = async () => {
      if (state.selected?.uuid) {
        try {
          getStatusValue = await fetchWorkFlow(state.selected.uuid);
        } catch (error) {
          console.error('Error fetching workflow:', error);
        }
      }
      setTypeWorkFlow(getStatusValue?.result?.source_type_display);
      if (getStatusValue?.result) {
        setDateTime(JSON.parse(getStatusValue?.result?.temp_time));
        formik.setValues({
          name: getStatusValue?.result.name,
          description: getStatusValue?.result.description,
          sourceType: getStatusValue?.result.source_type,
          operation: getStatusValue?.result.operation,
          status: state.selected?.status === 'Enabled' ? 1 : 2,
          tableName: getStatusValue?.result.form_info_id_display
            ? getStatusValue?.result.form_info_id_display
            : '',
          formInfoId: getStatusValue?.result.form_info_id
            ? getStatusValue?.result.form_info_id
            : '',
          catalog: getStatusValue?.result.catalog_id
            ? getStatusValue?.result.catalog_id
            : '',
          is_time_trigger:
            getStatusValue?.result.is_time_trigger === '1' ? 1 : 0
        });
      }
    };
    fetchData();
  }, [state]);

  useEffect(() => {
    const selectedSourceType = sourceTypeList.find(
      (option) => option.value === formik.values.sourceType
    );
    if (selectedSourceType) {
      setTypeWorkFlow(selectedSourceType?.label);
      if (selectedSourceType?.label === 'Catalog') {
        formik.setFieldValue('operation', '1');
      }
    }
  }, [formik.values.sourceType]);

  return (
    <Sheet key={'right'} open={state.show} onOpenChange={onCancel}>
      <SheetContent
        side={'right'}
        className="max-w-[800px] overflow-auto sm:max-w-[600px]"
      >
        <div className="min-h-screen w-full bg-accent">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between space-x-6">
              <div className="">
                <Label className="text-lg font-bold">WorkFlow</Label>
              </div>
              <div class="flex gap-2.5">
                <Button form="normal" type="submit">
                  Save
                </Button>
                {state.type === 'edit' ? (
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      modalActionHandler(MODAL.delete, state?.selected?.uuid);
                    }}
                  >
                    Delete
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
          <Separator className="mb-4 h-1" />
          {/* {console.log(formik.values)} */}
          <form onSubmit={formik.handleSubmit} id="normal">
            <div className="mx-3 my-3 rounded">
              <div className="flex-1">
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  maxLength={40}
                  placeholder="Name"
                />
              </div>

              <Textarea
                label="Description"
                type="text"
                multiline
                rows={3}
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                placeholder="Description"
              />
              <div className="mt-2">
                <RadioGroup
                  label={' Type of WorkFlow'}
                  value={formik.values.sourceType}
                  name="sourceType"
                  onChange={formik.handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      formik.setFieldValue('sourceType', e.target.value); // Update the value on Enter key press
                    }
                  }}
                  options={sourceTypeList}
                />
              </div>

              {typeWorkFlow === 'Catalog' ? (
                <>
                  <MultiSelect
                    id={`autocompleteField-`}
                    label={'Select Catalog'}
                    name="catalog"
                    selectedValues={[formik.values.catalog]}
                    options={catalogFlowList.map((o) => ({
                      label: o.catalog,
                      value: o.catelogflow_id
                    }))}
                    onChange={(event, newValue) => {
                      const selectedValue = event.target.value[0];
                      formik.setFieldValue('catalog', selectedValue);
                    }}
                    disabled={state.type === 'edit'}
                    selectType="single"
                  />
                </>
              ) : (
                <>
                  <MultiSelect
                    id={`multiSelect-shift2"`}
                    label="Select Form"
                    name="shift_name"
                    selectedValues={[
                      tableList.find(
                        (option) => option.label === formik.values?.tableName
                      )?.value
                    ]}
                    onChange={(event) => {
                      const selectedValue = event.target.value[0];
                      const selectedOption = tableList.find(
                        (option) => option.value === selectedValue
                      );

                      formik.setFieldValue(
                        'tableName',
                        selectedOption?.value || ''
                      );
                      formik.setFieldValue(
                        'formInfoId',
                        selectedOption?.formInfoId || null
                      );
                    }}
                    selectType="single"
                    options={tableList}
                  />
                </>
              )}

              {sourceTypeList.find(
                (option) => option.value === formik.values.sourceType
              )?.label === 'Form' ? (
                <>
                  <Dropdown
                    label=" Select Operation"
                    name="operation"
                    value={formik.values.operation}
                    options={operationList}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.operation &&
                      Boolean(formik.errors.operation)
                    }
                    helperText={
                      formik.touched.operation && formik.errors.operation
                    }
                    maxLength={400}
                  />
                </>
              ) : null}

              <Dropdown
                label="Select Status"
                options={statusList}
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
              />
              <Switch
                label="Time Triggering"
                name="is_time_trigger"
                id="airplane-mode"
                checked={formik.values.is_time_trigger === 1}
                onCheckedChange={(checked) =>
                  formik.setFieldValue('is_time_trigger', checked ? 1 : 0)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    formik.setFieldValue(
                      'is_time_trigger',
                      formik.values.is_time_trigger === 1 ? 0 : 1
                    );
                  }
                }}
              />

              {formik.values.is_time_trigger === 1 ? (
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
                      sx={{
                        width: '93%',
                        marginTop: '2px',
                        '& .MuiInputBase-root': {
                          fontSize: '15px',
                          height: '40px'
                        }
                      }}
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
                      sx={{
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
                    <Label className="mt-1 text-xs text-red-500">
                      {errorMsg?.hours}
                    </Label>
                  </div>
                  <div className="mb-1 flex flex-col">
                    <Input
                      label="Minutes"
                      type="number"
                      sx={{
                        width: '93%',
                        marginTop: '2px',
                        '& .MuiInputBase-root': {
                          fontSize: '15px',
                          height: '40px'
                        }
                      }}
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
                      sx={{
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
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
