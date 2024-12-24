import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import AddEditRecord from '../../modify-record/addEditRecord/AddEditRecord';
import { Input } from '@/componentss/ui/input';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Textarea } from '@/componentss/ui/textarea';
import { RadioGroup } from '@/componentss/ui/radio-group';

import { fetchFormsByModuleId } from '../../../services/form';
import { fetchFieldsWithValuesForReference } from '../../../services/field';
import {
  createTemplate,
  editTemplate,
  fetchTemplateByRecordId
} from '../../../services/formTemplate';
import { fetchRecordsBytableName } from '../../../services/table';
import { fetchFieldGroups } from '../../../services/fieldGroup';
import { notify } from '../../../hooks/toastUtils';

// Object mapping field names to labels
const fieldNameLabelObj = {
  avalabilityFor: 'avalability_for',
  description: 'description',
  formInfoId: 'form_info_id',
  name: 'name',
  payload: 'payload',
  templateId: 'template_id'
};

const templateAccessFormName = 'system_template_access';

const AddEditTemplate = ({ formName, selectedRecordId }) => {
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(window.location.search);
  const recordId = selectedRecordId || searchParams.get('id');
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [fieldsData, setFieldsData] = useState({
    avalabilityFor: '',
    description: '',
    formInfoId: 0,
    name: '',
    payload: {},
    templateId: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState();
  const [forms, setForms] = useState([]);
  const [accessedFormNames, setAccessedFormNames] = useState([]);
  const [templateFieldValues, setTemplateFieldValues] = useState({});
  const [fieldGroups, setFieldGroups] = useState([]);

  const handleApiResponse = (response) => {
    if (response && response.status === true) {
      notify.success(response.message);
      navigate(-1);
    } else {
      notify.error(response.message);
    }
  };
  const fetchGroups = async (formInfoId) => {
    const res = await fetchFieldGroups(formInfoId);
    setFieldGroups(res);
  };
  useEffect(() => {
    const fetchRecords = async () => {
      if (templateAccessFormName) {
        const res = await fetchRecordsBytableName(templateAccessFormName);
        const result = res?.data;
        const formNameList = result?.map((l) => l.form);
        setAccessedFormNames(formNameList);
      }
    };

    fetchRecords();
  }, [templateAccessFormName]);

  useEffect(() => {
    const getCompiledForms = async () => {
      const res = await fetchFormsByModuleId(0);
      const mappedForms = res?.result
        ?.filter((f) => accessedFormNames.includes(f.displayName))
        .map((d) => {
          return {
            label: d?.displayName,
            value: d?.formInfoId
          };
        });
      setForms(mappedForms);
    };
    getCompiledForms();
  }, [accessedFormNames]);

  useEffect(() => {
    const fetchData = async () => {
      if (!recordId) return;

      const response = await fetchTemplateByRecordId(recordId);

      if (!response || !response.result) return;

      const dataObject = response.result;
      const mappedObject = {};

      Object.keys(fieldNameLabelObj).forEach((key) => {
        const mappedKey = fieldNameLabelObj[key];
        if (dataObject[mappedKey] !== undefined) {
          mappedObject[key] = dataObject[mappedKey];
        }
      });

      const dataObj = JSON.parse(mappedObject.payload || '{}');
      setFieldsData(mappedObject);
      setTemplateFieldValues(dataObj);

      const formInfoId = mappedObject.formInfoId;
      setSelectedFormId(formInfoId);

      if (formInfoId) {
        fetchFields(formInfoId);
      }
    };

    fetchData();
  }, [recordId]);

  const fetchFields = (formInfoId) => {
    setLoading(true);
    if (formInfoId) {
      fetchFieldsWithValuesForReference(formInfoId)
        .then((data) => {
          setFields(data);
          if (data) {
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching form fields:', error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (selectedFormId) {
      fetchFields(selectedFormId);
      fetchGroups(selectedFormId);
    }
  }, [selectedFormId]);

  const onFormValueChanged = (e) => {
    const { name, value } = e.target;
    setFieldsData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === 'formInfoId') {
      setSelectedFormId(value);
    }
  };

  const submitHandler = (data) => {
    const { avalabilityFor, description, formInfoId, name, templateId } =
      fieldsData;
    const templateData = {
      avalabilityFor,
      description,
      formInfoId,
      name,
      payload: data || {},
      templateId
    };
    if (recordId) {
      modifyFormTeplate(templateData, recordId);
    } else {
      saveFormTeplate(templateData);
    }
  };

  const saveFormTeplate = async (data) => {
    if (data) {
      const res = await createTemplate(data);
      handleApiResponse(res);
    }
  };

  const modifyFormTeplate = async (data, id) => {
    if (data) {
      const res = await editTemplate(data, id);
      handleApiResponse(res);
    }
  };
  const loaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(50vh - 100px)'
  };


  return (
    <>
      <div className="flex flex-col gap-2 px-1">
        <Input
          label={'Name'}
          variant="outlined"
          name={'name'}
          type={'text'}
          required={true}
          value={fieldsData.name || ''}
          onChange={onFormValueChanged}
        />
        <Textarea
          label={'Description'}
          id="outlined-multiline-static"
          minRows={3}
          name={'description'}
          value={fieldsData.description || ''}
          onChange={onFormValueChanged}
        />
        <Dropdown
          label="Form"
          name="formInfoId"
          id="input_category"
          required={true}
          options={forms}
          value={
            Number(fieldsData.formInfoId) || Number(selectedRecordId) || null
          }
        />
        <RadioGroup
          id={`radioGroup-availablity_index`}
          label={'Avalability For'}
          value={1}
          name={'avalabilityFor'}
          onChange={onFormValueChanged}
          options={[
            { label: 'All', value: 1 },
            { label: 'Group', value: 2 }
          ]}
        />
      </div>
      <div>
        {loading ? (
          <div style={loaderStyle}>
            <div className="mx-auto flex min-w-full max-w-screen-lg items-center justify-center">
              <div className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
            </div>
          </div>
        ) : (
          selectedFormId && (
            <AddEditRecord
              formId={formName}
              fieldData={fields}
              fieldValues={templateFieldValues}
              showSystemDefaultField={recordId && true}
              onSubmit={submitHandler}
              activeFormId={selectedFormId}
              fieldGroups={fieldGroups}
              style={{
                height: 'calc(100vh - 500px)'
              }}
            />
          )
        )}
      </div>
    </>
  );
};

export default AddEditTemplate;
