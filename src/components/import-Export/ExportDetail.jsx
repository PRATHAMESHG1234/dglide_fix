import React, { useEffect, useState } from 'react';
import { fetchForms, fetchFormsByModuleId } from '../../services/form';

import { useDispatch } from 'react-redux';
import { fetchFormByName } from '../../redux/slices/currentSlice';
import DataGridTableX from '../records/data-grid/DataGridTableX';
import {
  fetchFieldPreference,
  fetchFieldsByFormId
} from '../../redux/slices/fieldSlice';
import { createCsvDataDump, createDump } from '../../redux/slices/dumpSlice';
import { useSelector } from 'react-redux';
import { fetchModules } from '../../redux/slices/moduleSlice';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Checkbox } from '@/componentss/ui/checkbox';
import { Button } from '@/componentss/ui/button';

import { MultiSelect } from '@/componentss/ui/multi-select';

const menuItem = [
  { label: 'Form', value: 'form' },
  { label: 'Workflow', value: 'workflow' },
  { label: 'CatalogFlow', value: 'catalogFlow' }
];
export const ExportDetail = () => {
  const dispatch = useDispatch();
  const [allTableList, setAllTableList] = useState([]);
  const [exportFlag, setExportFlag] = useState(false);
  const [dataExport, setDataExport] = useState(false);
  const [schemaExport, setSchemaExport] = useState(false);
  const [selectedFormName, setselectedFormName] = useState();
  const [selectEvent, setSelectEvent] = useState('');
  const [selectedCard, setSelectedCard] = useState([]);
  const [conditionsForExport, setConditionsForExport] = useState([]);

  const { modules } = useSelector((state) => state.module);
  const { fields } = useSelector((state) => state.field);
  const [loading, setLoading] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);

  const handleSelectFields = (event) => {
    const {
      target: { value }
    } = event;
    setSelectedFields(typeof value === 'string' ? value.split(',') : value);
  };

  const getFormData = async () => {
    const tableListData = await fetchForms();
    setAllTableList(tableListData?.result);
  };

  useEffect(() => {
    getFormData();
  }, []);
  const handleSelectForm = async (event) => {
    if (event.target.value) {
      setselectedFormName(event.target.value);
      dispatch(fetchFormByName({ name: event.target.value }));

      let getId = allTableList.filter((o) => o.name === event.target.value);
      if (getId && getId.length > 0) {
        dispatch(fetchFieldPreference({ formInfoId: getId[0]?.formInfoId }));
        dispatch(fetchFieldsByFormId({ formInfoId: getId[0]?.formInfoId }));
      }
    }
  };

  const handleExport = async () => {
    setExportFlag(true);
    setLoading(true);
    try {
      if (selectedFormName) {
        if (schemaExport === true) {
          await dispatch(createDump({ formName: selectedFormName }));
        }
        if (dataExport) {
          const payloadObj = {
            recordIds: selectedCard,
            fieldNames: selectedFields || [],
            where: conditionsForExport || []
          };

          await dispatch(
            createCsvDataDump({ formName: selectedFormName, data: payloadObj })
          );
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectType = async (event) => {
    setSelectedFields([]);
    setSelectEvent(event.target.value);
    if (event.target.value === 'workflow') {
      setselectedFormName('system_workflow');
      dispatch(fetchFormByName({ name: 'system_workflow' }));

      let getId = allTableList.filter((o) => o.name === 'system_workflow');
      if (getId && getId.length > 0) {
        dispatch(fetchFieldPreference({ formInfoId: getId[0]?.formInfoId }));
        dispatch(fetchFieldsByFormId({ formInfoId: getId[0]?.formInfoId }));
      }
    } else if (event.target.value === 'catalogFlow') {
      setselectedFormName('system_catelogflow');
      dispatch(fetchFormByName({ name: 'system_catelogflow' }));

      let getId = allTableList.filter((o) => o.name === 'system_catelogflow');

      if (getId && getId.length > 0) {
        dispatch(fetchFieldPreference({ formInfoId: getId[0]?.formInfoId }));
        dispatch(fetchFieldsByFormId({ formInfoId: getId[0]?.formInfoId }));
      }
    } else {
      dispatch(fetchModules());
      setselectedFormName('');
      setDataExport(false);
    }
  };
  const handleSelectModule = async (id) => {
    const res = await fetchFormsByModuleId(id);
    setAllTableList(res?.result || []);
  };
  return (
    <div className="p-3">
      <div className="my-2 flex flex-col">
        <div className="flex items-center justify-start">
          <div className="me-2">
            <Dropdown
              label="Select"
              name="select"
              options={menuItem}
              value={selectEvent}
              onChange={(event) => handleSelectType(event)}
            />
          </div>

          {selectEvent === 'form' ? (
            <div className="me-2 flex gap-2">
              <Dropdown
                className="me-2"
                label="Select Module"
                name="select-form"
                options={modules.map((o) => ({
                  label: o.displayName,
                  value: o.moduleInfoId
                }))}
                // value={selectedFormName}
                onChange={(event) => handleSelectModule(event.target.value)}
              />
              <Dropdown
                className="me-2"
                label="Select Form"
                name="select-form"
                options={allTableList.map((o) => ({
                  label: o.displayName,
                  value: o.name
                }))}
                // value={selectedFormName}
                onChange={(event) => handleSelectForm(event)}
              />
            </div>
          ) : null}
          <div className="mt-5 flex gap-2">
            <Checkbox
              endLabel="Data"
              checked={dataExport}
              onCheckedChange={(checked) => {
                setDataExport(!dataExport);
                setSelectedFields([]);
              }}
            />
            <Checkbox
              endLabel="Schema"
              checked={schemaExport}
              onCheckedChange={(checked) => setSchemaExport(!schemaExport)}
            />
            {dataExport && (
              <MultiSelect
                className="mx-2 mt-5"
                id="demo-multiple-select-label"
                label="Select Fields"
                name="shift_name"
                selectedValues={selectedFields}
                onChange={(event) => handleSelectFields(event)}
                options={fields.map((shift) => ({
                  label: shift.label,
                  value: shift.name
                }))}
              />
            )}
            <div className="">
              <Button disabled={loading} onClick={handleExport}>
                {loading ? (
                  <>
                    <div className="mx-auto flex min-w-full max-w-screen-lg items-center justify-center">
                      <div className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
                    </div>
                    Exporting...
                  </>
                ) : (
                  'Export'
                )}
              </Button>
            </div>
          </div>
        </div>
        {dataExport && (
          <DataGridTableX
            dataExport={dataExport}
            exportFlag={exportFlag}
            setSelectedCard={setSelectedCard}
            setConditionsForExport={setConditionsForExport}
          />
        )}
      </div>
    </div>
  );
};
