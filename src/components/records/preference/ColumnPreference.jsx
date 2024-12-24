/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DragDropContext, Draggable } from 'react-beautiful-dnd';

//MUI
import DragIcon from '@mui/icons-material/DragIndicator';
import { Box } from '@mui/joy';
import { FormControlLabel, Switch, Tooltip, Typography } from '@mui/material';

import { FIELD } from '../../../common/constants/fields';
import { colors, COLORS } from '../../../common/constants/styles';
import { reorder } from '../../../common/utils/helpers';

import {
  createFieldPreference,
  createGridFieldPreference
} from '../../../services/fieldPreference';
import Dialog from '../../shared/Dialog';
import { StrictModeDroppable as Droppable } from '../../shared/StrictModeDroppable';
import { notify } from '../../../hooks/toastUtils';

const preferredCategories = [
  'Input',
  'Number',
  'AutoIncrement',
  'Date',
  'Radio',
  'Checkbox',
  'DropDown',
  'Lookup',
  'Reference',
  'Default',
  'ModuleForm',
  'Switch'
];

const ColumnPreference = ({
  open,
  setShowColumnPreference,
  onColumnPreference,
  formInfoId = null,
  fields,
  preferences,
  type = 'form',
  refField
}) => {
  const dispatch = useDispatch();
  const { currentForm } = useSelector((state) => state.current);
  const { currentTheme } = useSelector((state) => state.auth);
  const [allColumns, setAllColumns] = useState([]);
  const [fieldsForPref, setFieldsForPref] = useState([]);

  useEffect(() => {
    if (fields) {
      setAllColumns([...fields]);
    }
  }, [fields]);

  const processFields = (fields) =>
    fields
      ?.filter(
        (field) =>
          field.category === 'Reference' &&
          field.lookup?.referenceFieldPreferences
      )
      ?.flatMap((field) =>
        Object.values(field.lookup.referenceFieldPreferences)
      );

  const refPrefFields = processFields(fields)?.map((f) => ({
    ...f,
    name: f.selectedFieldLabel || f.datasourceFieldName,
    label: f.selectedFieldLabel || f.datasourceFieldName,
    preferred: preferences?.some((pre) =>
      type === 'form'
        ? pre.fieldName === f.selectedFieldLabel
        : pre.datasourceFieldName === f.datasourceFieldName || false
    )
  }));

  useEffect(() => {
    if (allColumns?.length > 0 && preferences) {
      const headersOrder = preferences?.map(
        (pre) => pre.fieldName || pre.datasourceFieldName
      );
      const data = allColumns
        ?.filter((field) => preferredCategories?.includes(field.category))
        ?.map((ele) => ({
          ...ele,
          preferred:
            preferences?.some((pre) => pre.fieldName === ele.name) ||
            preferences?.some((pre) => pre.datasourceFieldName === ele.name)
        }))
        ?.sort(
          (a, b) => headersOrder.indexOf(a.name) - headersOrder.indexOf(b.name)
        );

      setFieldsForPref(data?.concat(refPrefFields));
    }
  }, [allColumns, preferences]);

  const submitHandler = async () => {
    const data = fieldsForPref?.filter((f) => f.preferred)?.map((f) => f.name);

    const fieldPreference =
      type === 'field'
        ? createGridFieldPreference(refField?.fieldInfoId, {
            fieldNames: data
          })
        : createFieldPreference(formInfoId || currentForm?.formInfoId, {
            fieldNames: data
          });

    await fieldPreference;
    fieldPreference.then((data) => {
      if (data.statusCode === 200) {
        onColumnPreference();

        notify.success('Column Preference successful');
      } else {
        notify.error('Column Preference failed');
      }
    });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reOrderedList = reorder(
      fieldsForPref,
      source.index,
      destination.index
    );
    setFieldsForPref(reOrderedList);
  };

  const handleChange = (checked, fieldName) => {
    setFieldsForPref((prevFields) =>
      prevFields.map((fieldPref) =>
        fieldName === fieldPref.name
          ? { ...fieldPref, preferred: checked }
          : fieldPref
      )
    );
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    margin: `0 0 8px 0`,
    background: isDragging ? '#ccc' : COLORS.WHITE,
    border: `1px dashed ${colors.secondary.main}`,
    color: COLORS.SECONDARY,
    borderRadius: '5px',
    ...draggableStyle
  });

  const defaultFields = fields?.filter(
    (f) => f.defaultLabel || f.category === 'AutoIncrement'
  );

  return (
    <Dialog
      Header={{
        open: open,
        close: () => setShowColumnPreference(false),
        maxWidth: 'xs',
        dialogTitle: 'Column Preference'
      }}
      Footer={{
        clear: () => setShowColumnPreference(false),
        confirm: submitHandler,
        cancelBtnLabel: 'Cancel',
        saveBtnLabel: 'Save'
      }}
    >
      <Box
        className="mb-2 py-0"
        sx={{
          backgroundColor:
            currentTheme === 'Dark' ? colors.darkLevel2 : colors.white
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Box
            style={{
              overflow: 'auto',
              borderRadius: '5px'
            }}
          >
            <Droppable droppableId="droppable-id">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {fieldsForPref?.map((column, index) => (
                    <Draggable
                      draggableId={column.name}
                      index={index}
                      key={column.name}
                    >
                      {(provided, snapshot) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Box className="flex items-center">
                            <DragIcon sx={{ color: COLORS.SECONDARY }} />
                            <FormControlLabel
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  color: colors.grey[900]
                                },
                                margin: 0,
                                p: 1
                              }}
                              control={
                                <Tooltip
                                  title={
                                    defaultFields?.find(
                                      (f) => f.name === column?.name
                                    )
                                      ? 'This field is not editable'
                                      : ''
                                  }
                                  placement="top"
                                  arrow
                                >
                                  <span>
                                    <Switch
                                      checked={column.preferred}
                                      size="small"
                                      onChange={(e) =>
                                        handleChange(
                                          e.target.checked,
                                          column.name
                                        )
                                      }
                                      disabled={defaultFields?.find(
                                        (f) => f.name === column?.name
                                      )}
                                      sx={{
                                        color: colors.secondary.main,
                                        '& .Mui-checked': {
                                          color: defaultFields?.find(
                                            (f) => f.name === column?.name
                                          )
                                            ? `${colors.secondary[200]} !important`
                                            : `${colors.secondary.main} !important`
                                        },
                                        '& .Mui-checked+.MuiSwitch-track': {
                                          bgcolor: `${colors.secondary[200]} !important`
                                        }
                                      }}
                                    />
                                  </span>
                                </Tooltip>
                              }
                              label={
                                <Typography
                                  sx={{
                                    fontSize: '0.875rem',
                                    color: colors.grey[900],
                                    fontWeight: 500,
                                    px: 1
                                  }}
                                >
                                  {column?.label}
                                </Typography>
                              }
                            />
                          </Box>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Box>
        </DragDropContext>
      </Box>
    </Dialog>
  );
};

export default ColumnPreference;
