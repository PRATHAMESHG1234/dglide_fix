import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { PackagePlus, PlusCircle } from 'lucide-react';
import { Trash, Trash2 } from 'lucide-react';
import { Typography } from '@mui/joy';
import { Checkbox, FormControlLabel, Tooltip } from '@mui/material';

import { COLORS } from '../../common/constants/styles';
import { generateUId } from '../../common/utils/helpers';
import SelectField from '../../elements/SelectField';
import TextField from '../../elements/TextField';
import {
  fetchFieldsByFormId,
  fetchParentFormByFieldInfoId
} from '../../services/field';
import { fetchCompliedFormsByModuleId } from '../../services/form';

const operators = {
  String: [
    { label: 'equal to', value: '=' },
    { label: 'not equal to', value: '<>' },
    { label: 'like', value: 'LIKE' },
    { label: 'not like', value: 'NOT LIKE' }
  ]
};

const DataSourceDynamic = ({
  form,
  onOptionChange,
  columns,
  setColumns,
  isDynamic
}) => {
  const { fields } = useSelector((state) => state.field);

  const [sourceValues, setSourceValues] = useState();
  const [compiledTables, setCompiledTables] = useState([]);
  const [refPreferenceColumns, setRefPreferenceColumns] = useState([]);
  const [refLookupFields, setRefLookupFields] = useState([]);
  const [refPrefFields, setRefPrefFields] = useState([]);

  const category = form?.category;
  const dynamicOptions = form?.lookup;

  useEffect(() => {
    const fieldArr = fields
      ?.filter((f) => f.category === 'Reference' || f.category === 'Lookup')
      ?.map((f) => {
        return { name: f.name, label: f.label };
      });
    setRefLookupFields(fieldArr);
  }, [fields]);

  useEffect(() => {
    const fetchCompiledTables = async () => {
      try {
        const res = await fetchCompliedFormsByModuleId(0);
        const tables = res.result;
        setCompiledTables(tables);
      } catch (error) {
        console.error('Error fetching compiled tables:', error);
      }
    };

    fetchCompiledTables();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (dynamicOptions) {
        handleLookupChange('formId', dynamicOptions.formInfoId);

        const fields = await fetchFieldsById(dynamicOptions?.parentFormInfoId);
        const options = fields
          ?.filter(
            (f) =>
              f.category !== 'TableReference' && f.category !== 'TableLookup'
          )
          .map(({ label, fieldInfoId }) => ({
            label,
            value: fieldInfoId
          }));

        const fieldOptions =
          dynamicOptions?.parentFormInfoId === 0 ? columns : options;
        setRefPreferenceColumns(fieldOptions);
        setRefPrefFields(fields);
        const selectedFieldIds =
          dynamicOptions.referenceFieldPreferences?.map(
            (item) => item.selectedFieldInfoId
          ) || [];

        const dynamicOptionsObj = {
          ...dynamicOptions,
          referenceFieldPreferences: selectedFieldIds
        };
        setSourceValues(dynamicOptionsObj);
      } else {
        setSourceValues({
          formInfoId: 0,
          fieldInfoId: 0,
          lookupId: 0,
          conditions: [],
          defaultTabExpanded: false,
          defaultOpenModal: false,
          parentFormInfoId: 0,
          referenceFieldPreferences: []
        });
      }
    };

    fetchData();
  }, [dynamicOptions]);

  useEffect(() => {
    if (!sourceValues) return;

    const refFieldPref = sourceValues.referenceFieldPreferences;

    if (!refFieldPref) return;

    const data = refFieldPref.map((selectedFieldId) => {
      const field = refPreferenceColumns?.find(
        (column) => column.value === selectedFieldId
      );
      const label = field?.label || '';
      const name = refPrefFields?.find(
        (column) => column.fieldInfoId === selectedFieldId
      )?.name;
      return {
        fieldInfold: 0,
        referenceFieldPreferenceInfoId: 0,
        selectedFieldInfoId: selectedFieldId,
        selectedFieldLabel: `${form?.label} ${label}`,
        selectedFieldName: `${form?.name}.${name}`
      };
    });

    const sourceValuesObj = {
      ...sourceValues,
      referenceFieldPreferences: data
    };

    onOptionChange(sourceValuesObj);
  }, [sourceValues]);

  const fetchParentForm = async (fieldId) => {
    if (!fieldId) return;

    try {
      const res = await fetchParentFormByFieldInfoId(fieldId);
      const parentFormData = await res.result;

      const parentFormId =
        parentFormData?.formInfoId || sourceValues?.formInfoId;
      const fields = await fetchFieldsById(parentFormId);
      const fieldOptions = fields?.map(({ label, fieldInfoId }) => ({
        label,
        value: fieldInfoId
      }));
      setRefPreferenceColumns(fieldOptions);
      setRefPrefFields(fields);
      setSourceValues((prev) => ({
        ...prev,
        parentFormInfoId: parentFormId
      }));
    } catch (error) {
      console.error('Error fetching parent form:', error);
    }
  };

  const fetchFieldsById = async (id) => {
    if (!id) return;
    try {
      const res = await fetchFieldsByFormId(id);
      return res.result || [];
    } catch (error) {
      console.error(`Error fetching fields by form ID ${id}:`, error);
      return [];
    }
  };
  const options = columns
    ?.filter(
      (column) =>
        column.category !== 'TableReference' &&
        column.category !== 'TableLookup'
    )
    ?.map((f) => {
      return {
        label: f.label,
        value: f.fieldInfoId
      };
    });

  const getFieldsBySelectedForms = async (formId) => {
    const fields = await fetchFieldsById(formId);
    setColumns(fields);
  };

  useEffect(() => {
    if (isDynamic && compiledTables) {
      const systemActivity = compiledTables?.find(
        (f) => f.displayName === 'System Activity'
      );
      if (systemActivity) {
        setSourceValues((prev) => {
          return { ...prev, formInfoId: systemActivity.formInfoId };
        });
        getFieldsBySelectedForms(systemActivity.formInfoId);
      }
    }
  }, [isDynamic, compiledTables]);

  useEffect(() => {
    const filteredData = options?.filter(
      (item) => item.label === 'Form Info Id' || item.label === 'Record Id'
    );
    if (isDynamic) {
      setTimeout(() => {
        const newConditions = [
          {
            conditionId: generateUId(),
            fieldInfoId: filteredData[1]?.value,
            lookupId: 0,
            operator: '=',
            value: `\${${filteredData[1]?.label.replace(/\s+/g, '_')}}`,
            dependent: false,
            valueDynamic: true,
            dependentFieldType: ''
          },
          {
            conditionId: generateUId(),
            fieldInfoId: filteredData[0].value,
            lookupId: 0,
            operator: '=',
            value: `\${${filteredData[0]?.label.replace(/\s+/g, '_')}}`,
            dependent: false,
            valueDynamic: true,
            dependentFieldType: ''
          }
        ];

        setSourceValues((prev) => {
          const existingConditions = prev.conditions || [];
          const updatedConditions = [
            ...existingConditions,
            ...newConditions.filter(
              (newCondition) =>
                !existingConditions.some(
                  (existingCondition) =>
                    existingCondition.value === newCondition.value
                )
            )
          ];

          return {
            ...prev,
            conditions: updatedConditions
          };
        });
      }, 2000);
    } else {
      // Remove the conditions when isDynamic is false based on the value field
      setSourceValues((prev) => {
        const updatedConditions = (prev.conditions || []).filter(
          (condition) =>
            condition.value !== '${Record_Id}' &&
            condition.value !== '${Form_Info_Id}'
        );

        return {
          ...prev,
          conditions: updatedConditions
        };
      });
    }
  }, [isDynamic, compiledTables, columns]);

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
      fetchParentForm(value);
    } else if (name === 'prefFieldId') {
      setSourceValues((prev) => {
        return {
          ...prev,
          referenceFieldPreferences: value
        };
      });
    } else if (name === 'defaultOpenModal') {
      setSourceValues((prev) => {
        return { ...prev, defaultOpenModal: value };
      });
    } else if (name === 'defaultTabExpanded') {
      setSourceValues((prev) => {
        return { ...prev, defaultTabExpanded: value };
      });
    } else if (name === 'fieldInfoId') {
      const selectedOption = columns.find(
        (column) => column.fieldInfoId === value
      );

      // Update the condition with the new fieldInfoId
      setSourceValues((prev) => {
        return {
          ...prev,
          conditions: prev.conditions?.map((con) => {
            if (con.conditionId === currCondition.conditionId) {
              return {
                ...con,
                fieldInfoId: value,
                dependentFieldType:
                  fields?.find((ref) => ref.name === value)?.category || ''
              };
            }
            return con;
          })
        };
      });

      // Check if "Is Dynamic" is checked, and update the text field immediately
      if (currCondition.valueDynamic && selectedOption) {
        const newValue = `\${${selectedOption.label.replace(/\s+/g, '_')}}`; // Replace spaces with underscores
        setSourceValues((prev) => {
          return {
            ...prev,
            conditions: prev.conditions?.map((con) => {
              if (con.conditionId === currCondition.conditionId) {
                return {
                  ...con,
                  value: newValue // Update the value for the text field
                };
              }
              return con;
            })
          };
        });
      }
    } else if (name === 'valueDynamic') {
      // Handle the "Is Dynamic" checkbox toggle
      setSourceValues((prev) => {
        return {
          ...prev,
          conditions: prev.conditions?.map((con) => {
            if (con.conditionId === currCondition.conditionId) {
              const updatedCondition = {
                ...con,
                valueDynamic: value // Update the dynamic state
              };

              // When the checkbox is checked, update the value with the current field
              if (value) {
                const selectedOption = columns.find(
                  (column) => column.fieldInfoId === con.fieldInfoId
                );
                if (selectedOption) {
                  const newValue = `\${${selectedOption.label.replace(
                    /\s+/g,
                    '_'
                  )}}`;
                  updatedCondition.value = newValue; // Set the new value
                }
              } else {
                updatedCondition.value = ''; // Clear the value if unchecked
              }

              return updatedCondition;
            }
            return con;
          })
        };
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
            valueDynamic: false,
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

  const isDefaultTabExpanded = sourceValues?.defaultTabExpanded === true;
  const isDefaultOpenModal = sourceValues?.defaultOpenModal === true;

  return (
    <div className="my-3 flex flex-col justify-between">
      <Typography level="title-sm" paddingY="10px">
        Data Source
      </Typography>

      {(category === 'TableReference' ||
        category === 'TableLookup' ||
        category === 'activity') && (
        <div className="flex flex-col py-2">
          <div className="flex justify-evenly">
            <FormControlLabel
              style={{
                '& .MuiFormControlLabel-label': { fontSize: '13px' },
                margin: 0.5
              }}
              control={
                <Checkbox
                  size="sm"
                  name="defaultTabExpanded"
                  checked={isDefaultTabExpanded}
                  onChange={(e) =>
                    handleLookupChange(e.target.name, e.target.checked)
                  }
                />
              }
              label="Default Tab Expanded"
            />

            <FormControlLabel
              style={{
                '& .MuiFormControlLabel-label': { fontSize: '13px' },
                margin: 0.5
              }}
              control={
                <Checkbox
                  size="sm"
                  name="defaultOpenModal"
                  checked={isDefaultOpenModal}
                  onChange={(e) =>
                    handleLookupChange(e.target.name, e.target.checked)
                  }
                />
              }
              label="Default Open Modal"
            />
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <SelectField
          name="formId"
          value={sourceValues?.formInfoId ?? ''}
          onChange={(e) => handleLookupChange(e.target.name, e.target.value)}
          options={compiledTables?.map((f) => {
            return {
              label: f.displayName,
              value: f.formInfoId
            };
          })}
          style={{
            height: '37.5px',
            minWidth: '180px',
            fontSize: '0.875rem',
            bgcolor: COLORS.WHITE
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                overflowY: 'auto'
              }
            }
          }}
          fieldstyle={{
            minWidth: '180px'
          }}
          labelstyle={{
            fontWeight: '500'
          }}
          disabled={isDynamic}
        />

        {category !== 'TableLookup' && category !== 'activity' && (
          <SelectField
            name="fieldId"
            value={sourceValues?.fieldInfoId ?? ''}
            onChange={(e) => handleLookupChange(e.target.name, e.target.value)}
            options={columns
              ?.filter((column) =>
                category === 'TableReference'
                  ? column.category === 'Reference'
                  : column.category !== 'TableReference' &&
                    column.category !== 'TableLookup'
              )
              ?.map((f) => {
                return {
                  label: f.name,
                  value: f.fieldInfoId
                };
              })}
            style={{
              height: '37.5px',
              minWidth: '180px',
              fontSize: '0.875rem',
              bgcolor: COLORS.WHITE
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 300,
                  overflowY: 'auto'
                }
              }
            }}
            fieldstyle={{
              minWidth: '180px'
            }}
            labelstyle={{
              fontWeight: '500'
            }}
          />
        )}
        {category === 'Reference' && (
          <SelectField
            name="prefFieldId"
            value={sourceValues?.referenceFieldPreferences || []}
            multiple
            onChange={(e) => handleLookupChange(e.target.name, e.target.value)}
            options={refPreferenceColumns
              ?.filter(
                (column) =>
                  column.category !== 'TableReference' &&
                  column.category !== 'TableLookup'
              )
              ?.map((f) => {
                return {
                  label: f.label,
                  value: f.value
                };
              })}
            style={{
              height: '37.5px',
              minWidth: '180px',
              fontSize: '0.875rem',
              bgcolor: COLORS.WHITE
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 300,
                  overflowY: 'auto'
                }
              }
            }}
            fieldstyle={{
              minWidth: '180px'
            }}
            labelstyle={{
              fontWeight: '500'
            }}
          />
        )}
      </div>

      {(category === 'Reference' ||
        category === 'activity' ||
        category === 'Lookup' ||
        category === 'TableLookup') && (
        <div className="my-3 flex items-center justify-between">
          <Typography level="title-sm" paddingY="10px">
            Add Condition
          </Typography>

          <Tooltip title="Add" variant="solid">
            <PlusCircle
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

      {(category === 'Reference' ||
        category === 'Lookup' ||
        category === 'activity' ||
        category === 'TableLookup') &&
        sourceValues?.conditions?.map((condition, index) => {
          return (
            <div
              className="card bg-light mb-3 flex flex-col p-1 shadow-sm"
              key={condition.conditionId}
            >
              <div className={`bg-light flex items-center justify-between p-1`}>
                {category === 'TableLookup' || category === 'activity' ? (
                  <div>
                    <FormControlLabel
                      style={{
                        '& .MuiFormControlLabel-label': { fontSize: '13px' },
                        margin: 0
                      }}
                      control={
                        <Checkbox
                          name="valueDynamic"
                          checked={condition?.valueDynamic}
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
                          disabled={isDynamic && (index === 0 || index === 1)}
                        />
                      }
                      label="Is Dynamic"
                    />
                  </div>
                ) : (
                  <div>
                    <FormControlLabel
                      style={{
                        '& .MuiFormControlLabel-label': { fontSize: '13px' },
                        margin: 0
                      }}
                      control={
                        <Checkbox
                          name="dependent"
                          checked={condition?.dependent}
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
                )}
                <Tooltip title="Delete">
                  <Trash
                    className="pointer"
                    color="error"
                    onClick={() => {
                      if (!(isDynamic && (index === 0 || index === 1))) {
                        deleteCondition(condition);
                      }
                    }}
                    style={{
                      cursor:
                        isDynamic && (index === 0 || index === 1)
                          ? 'not-allowed'
                          : 'pointer'
                    }}
                  />
                </Tooltip>
              </div>
              <div className="flex gap-3 pb-2">
                <SelectField
                  name="fieldInfoId"
                  value={condition?.fieldInfoId ?? ''}
                  onChange={(e) =>
                    handleLookupChange(e.target.name, e.target.value, condition)
                  }
                  options={columns
                    ?.filter(
                      (column) =>
                        column.category !== 'TableReference' &&
                        column.category !== 'TableLookup'
                    )
                    .map((f) => {
                      return {
                        label: f.label,
                        value: f.fieldInfoId
                      };
                    })}
                  style={{
                    height: '37.5px',
                    minWidth: '180px',
                    fontSize: '0.875rem',
                    bgcolor: COLORS.WHITE
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        overflowY: 'auto'
                      }
                    }
                  }}
                  fieldstyle={{
                    minWidth: '180px'
                  }}
                  labelstyle={{
                    fontWeight: '500'
                  }}
                  disabled={isDynamic && (index === 0 || index === 1)}
                />
                <SelectField
                  name="operator"
                  value={condition.operator || ''}
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    handleLookupChange('operator', selectedValue, condition);
                  }}
                  options={operators.String || []}
                  style={{
                    height: '37.5px',
                    minWidth: '180px',
                    fontSize: '0.875rem',
                    bgcolor: COLORS.WHITE
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300,
                        overflowY: 'auto'
                      }
                    }
                  }}
                  fieldstyle={{
                    minWidth: '180px'
                  }}
                  labelstyle={{
                    fontWeight: '500'
                  }}
                  disabled={isDynamic && (index === 0 || index === 1)}
                />
                {condition.dependent ? (
                  <SelectField
                    name="value"
                    value={condition?.value ?? ''}
                    onChange={(e) =>
                      handleLookupChange(
                        e.target.name,
                        e.target.value,
                        condition
                      )
                    }
                    options={refLookupFields?.map((f) => {
                      return {
                        label: f.label,
                        value: f.name
                      };
                    })}
                    style={{
                      height: '37.5px',
                      minWidth: '180px',
                      fontSize: '0.875rem',
                      bgcolor: COLORS.WHITE
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          overflowY: 'auto'
                        }
                      }
                    }}
                    fieldstyle={{
                      minWidth: '180px'
                    }}
                    labelstyle={{
                      fontWeight: '500'
                    }}
                    disabled={isDynamic && (index === 0 || index === 1)}
                  />
                ) : (
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
                    size="small"
                    variant="outlined"
                    type="text"
                    style={{
                      '& .MuiInputBase-root': {
                        height: '37.5px',
                        fontSize: '0.875rem',
                        bgcolor: COLORS.WHITE,
                        minWidth: '180px'
                      }
                    }}
                    fieldstyle={{
                      minWidth: '180px'
                    }}
                    labelstyle={{
                      fontWeight: '500'
                    }}
                    disabled={isDynamic && (index === 0 || index === 1)}
                  />
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default DataSourceDynamic;
