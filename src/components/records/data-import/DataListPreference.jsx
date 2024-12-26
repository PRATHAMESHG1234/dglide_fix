import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import SelectField from '../../../elements/SelectField';
import ArrowIcon from '@mui/icons-material/East';
import { COLORS } from '../../../common/constants/styles';

const DataListPreference = ({
  fields,
  headerKeys,
  fieldsData,
  setFieldsData
}) => {
  const { currentTheme } = useSelector((state) => state.auth);

  const onFormValueChanged = (e, field) => {
    const value = e.target.value;
    if (!value || !field) return;

    setFieldsData((prevFieldsData) => ({
      ...prevFieldsData,
      [field.name]: value
    }));
  };

  useEffect(() => {
    const updateFieldsData = () => {
      fields.forEach((field) => {
        if (headerKeys.includes(field?.label)) {
          setFieldsData((prevFieldsData) => ({
            ...prevFieldsData,
            [field.name]: field.label
          }));
        }
      });
    };

    updateFieldsData();
  }, [fields, headerKeys]);

  return (
    <div className="p-2">
      {fields?.map((field, index) => (
        <div key={index} className="flex gap-2">
          <span
            style={{
              width: '40%',
              fontSize: '13px',
              color:
                currentTheme === 'Light' ? COLORS.SECONDARY : COLORS.WHITESMOKE
            }}
          >
            {field.label}
          </span>
          <span style={{ width: '7%', color: COLORS.SECONDARY }}>
            <ArrowIcon style={{ fontSize: '15px' }} />
          </span>

          <SelectField
            name={field.name}
            value={fieldsData[field.name] || ''}
            onChange={(e) => onFormValueChanged(e, field)}
            options={headerKeys.map((h) => ({ label: h, value: h }))}
            style={{ height: '27px', fontSize: '14px', bgcolor: COLORS.WHITE }}
            fieldstyle={{ width: '50%' }}
            labelstyle={{ fontWeight: '500' }}
          />
        </div>
      ))}
    </div>
  );
};

export default DataListPreference;
