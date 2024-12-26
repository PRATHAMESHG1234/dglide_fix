import AddIcon from '@mui/icons-material/AddBox';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Typography } from '@mui/joy';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { generateUId } from '../../../common/utils/helpers';
import { fetchCompliedFormsByModuleId } from '../../../services/form';
import { COLORS } from '../../../common/constants/styles';
import { fetchFieldsByFormId } from '../../../services/field';
import SelectField from '../../../elements/SelectField';

const operators = {
  String: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'like', value: 'LIKE' },
    { label: 'not like', value: 'NOT LIKE' }
  ]
};

const DataSourceDynamic = ({ category, dynamicOptions, onOptionChange }) => {
  const { fields } = useSelector((state) => state.field);
  const [sourceValues, setSourceValues] = useState();
  const [compiledTables, setCompiledTables] = useState([]);
  const [columns, setColumns] = useState([]);
  const [refLookupFields, setRefLookupFields] = useState([]);

  useEffect(() => {
    const fieldArr = fields
      ?.filter((f) => f.category === 'Reference' || f.category === 'Lookup')
      ?.map((f) => {
        return { name: f.name, label: f.label, field_name: f.field_name };
      });
    setRefLookupFields(fieldArr);
  }, [fields]);

  useEffect(() => {
    const getCompiledTables = async () => {
      const res = await fetchCompliedFormsByModuleId(0);
      const tables = res.result;
      setCompiledTables(tables);
    };
    getCompiledTables();
  }, []);

  useEffect(() => {
    if (dynamicOptions) {
      handleLookupChange('formId', dynamicOptions.formInfoId);
      setSourceValues({ ...dynamicOptions });
    } else {
      setSourceValues({
        formInfoId: 0,
        fieldInfoId: 0,
        lookupId: 0,
        conditions: []
      });
    }
  }, [dynamicOptions]);

  useEffect(() => {
    onOptionChange(sourceValues);
  }, [sourceValues, onOptionChange]);

  const getFieldsBySelectedForms = async (formId) => {
    const res = await fetchFieldsByFormId(formId);
    const columns = res.result;
    setColumns(columns);
  };

  const handleLookupChange = (name, value, currCondition) => {
    if (name === 'formId') {
      setSourceValues((prev) => {
        return { ...prev, formInfoId: value };
      });
      getFieldsBySelectedForms(value);
    } else if (name === 'fieldId') {
      setSourceValues((prev) => {
        return { ...prev, fieldInfoId: value };
      });
    } else if (currCondition) {
      setSourceValues((prev) => {
        return {
          ...prev,
          conditions: prev.conditions?.map((con) => {
            if (con.conditionId === currCondition.conditionId) {
              if (con.dependent) {
                return {
                  ...con,
                  [name]: value,
                  dependentFieldType:
                    fields?.find((ref) => ref.name === value)?.category || ''
                };
              }
              return {
                ...con,
                [name]: value
              };
            }
            return con;
          })
        };
      });
    }
  };

  const addCondition = () => {
    setSourceValues((prev) => {
      return {
        ...prev,
        conditions: [
          ...prev.conditions,
          {
            conditionId: generateUId(),
            fieldInfoId: 0,
            lookupId: 0,
            operator: '',
            value: '',
            dependent: false,
            dependentFieldType: ''
          }
        ]
      };
    });
  };

  const deleteCondition = (condition) => {
    setSourceValues((prev) => {
      return {
        ...prev,
        conditions: prev.conditions?.filter(
          (opt) => opt.conditionId !== condition.conditionId
        )
      };
    });
  };
  return (
    <div className="my-3 flex flex-col justify-between">
      <Typography level="title-sm" paddingY="10px">
        Data Source
      </Typography>

      <div className="flex">
        <FormControl fullWidth style={{ bgcolor: COLORS.WHITE }}>
          <Select
            name="formId"
            value={sourceValues?.formInfoId ?? ''}
            onChange={(e) => handleLookupChange(e.target.name, e.target.value)}
            style={{
              height: '30px',
              fontSize: '13px'
            }}
          >
            {compiledTables?.map((app) => {
              return (
                <MenuItem
                  key={app.formInfoId}
                  value={app.formInfoId}
                  style={{
                    fontSize: '13px'
                  }}
                >
                  {app.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginLeft: 1, bgcolor: COLORS.WHITE }}>
          <Select
            name="fieldId"
            value={sourceValues?.fieldInfoId ?? ''}
            onChange={(e) => handleLookupChange(e.target.name, e.target.value)}
            style={{
              height: '30px',
              fontSize: '13px'
            }}
          >
            {columns
              ?.filter((column) =>
                category === 'TableReference'
                  ? column.category === 'Reference'
                  : column.category !== 'TableReference' &&
                    column.category !== 'TableLookup'
              )
              .map((column) => {
                return (
                  <MenuItem
                    key={column.fieldInfoId}
                    value={column.fieldInfoId}
                    style={{
                      fontSize: '13px'
                    }}
                  >
                    {column.name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </div>

      {(category === 'Reference' || category === 'Lookup') && (
        <div className="my-3 flex items-center justify-between">
          <Typography level="title-sm" paddingY="10px">
            Add Condition for Dynamic data
          </Typography>

          <Tooltip title="Add" variant="solid">
            <AddIcon
              fontSize="medium"
              onClick={addCondition}
              style={{
                color: COLORS.SECONDARY,
                cursor: 'pointer'
              }}
            />
          </Tooltip>
        </div>
      )}
      {(category === 'Reference' || category === 'Lookup') &&
        sourceValues?.conditions?.map((condition, i) => {
          return (
            <div className="card mb-3 flex flex-col shadow-sm" key={i}>
              <div className="bg-light flex items-center justify-between p-1">
                <div>
                  <FormControlLabel
                    style={{
                      '& .MuiFormControlLabel-label': { fontSize: '13px' },
                      margin: 0
                    }}
                    control={
                      <Checkbox
                        name="dependent"
                        checked={condition.dependent}
                        onChange={(e) =>
                          handleLookupChange(
                            e.target.name,
                            e.target.checked,
                            condition
                          )
                        }
                        style={{
                          '& .MuiSvgIcon-root': { fontSize: 18 }
                        }}
                      />
                    }
                    label="Is Dependent"
                  />
                </div>
                <Tooltip title="Delete">
                  <DeleteOutlinedIcon
                    className="pointer"
                    color="error"
                    onClick={() => deleteCondition(condition)}
                  />
                </Tooltip>
              </div>
              <div className="flex py-2">
                <FormControl fullWidth>
                  <Select
                    name="fieldInfoId"
                    value={condition?.fieldInfoId ?? ''}
                    onChange={(e) =>
                      handleLookupChange(
                        e.target.name,
                        e.target.value,
                        condition
                      )
                    }
                    style={{
                      height: '30px',
                      fontSize: '13px',
                      margin: 1
                    }}
                  >
                    {columns
                      ?.filter(
                        (column) =>
                          column.category !== 'TableReference' &&
                          column.category !== 'TableLookup'
                      )
                      .map((column) => {
                        return (
                          <MenuItem
                            key={column.fieldInfoId}
                            value={column.fieldInfoId}
                            style={{
                              fontSize: '13px'
                            }}
                          >
                            {column.label}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                <FormControl fullWidth style={{ my: 1 }}>
                  <SelectField
                    name="operator"
                    options={operators.String || []}
                    datakey={'label'}
                    datavalue={'value'}
                    value={condition.operator || ''}
                    onChange={(event) => {
                      const selectedValue = event.target.value;
                      handleLookupChange('operator', selectedValue, condition);
                    }}
                  />
                </FormControl>
                {condition.dependent ? (
                  <FormControl fullWidth>
                    <Select
                      name="value"
                      value={condition?.value ?? ''}
                      onChange={(e) =>
                        handleLookupChange(
                          e.target.name,
                          e.target.value,
                          condition
                        )
                      }
                      style={{
                        height: '30px',
                        fontSize: '13px',
                        margin: 1
                      }}
                    >
                      {refLookupFields?.map((field) => {
                        return (
                          <MenuItem
                            key={field.name}
                            value={field.field_name}
                            style={{
                              fontSize: '13px'
                            }}
                          >
                            {field.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                ) : (
                  <FormControl fullWidth>
                    <TextField
                      name="value"
                      value={condition?.value ?? ''}
                      onChange={(e) =>
                        handleLookupChange(
                          e.target.name,
                          e.target.value,
                          condition
                        )
                      }
                      type="text"
                      placeholder="value"
                      style={{
                        '& .MuiInputBase-root': {
                          height: '30px',
                          fontSize: '13px'
                        },
                        margin: 1
                      }}
                    />
                  </FormControl>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default DataSourceDynamic;
