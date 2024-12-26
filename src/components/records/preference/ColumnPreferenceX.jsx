/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DragDropContext, Draggable } from 'react-beautiful-dnd';

//MUI

import { Box } from '@mui/joy';
import { Button } from '@/componentss/ui/button';
import { Checkbox } from '@/componentss/ui/checkbox';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/componentss/ui/tooltip';
import { colors, COLORS } from '../../../common/constants/styles';
import { reorder } from '../../../common/utils/helpers';
import { StrictModeDroppable as Droppable } from '../../shared/StrictModeDroppable';

import { GripHorizontal } from 'lucide-react';

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

const ColumnPreferenceX = ({
  open,
  setShowColumnPreference,
  columnPreferenceHandler,
  formInfoId = null,
  fields,
  currentForm,
  preferences,
  type = 'form',
  refField
}) => {
  const dispatch = useDispatch();
  // const { currentForm } = useSelector((state) => state.current);
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

      const sortedFields = allColumns
        ?.filter((field) => preferredCategories?.includes(field.category))
        ?.map((ele) => ({
          ...ele,
          preferred:
            preferences?.some((pre) => pre.fieldName === ele.name) ||
            preferences?.some((pre) => pre.datasourceFieldName === ele.name),
          isDisabled: !!defaultFields?.find((f) => f.name === ele.name)
        }))
        ?.sort((a, b) => {
          // Disabled fields first
          if (a.isDisabled && !b.isDisabled) return -1;
          if (!a.isDisabled && b.isDisabled) return 1;

          // Checked fields in the middle
          if (a.preferred && !b.preferred) return -1;
          if (!a.preferred && b.preferred) return 1;

          // Unchecked fields last
          return headersOrder.indexOf(a.name) - headersOrder.indexOf(b.name);
        });

      setFieldsForPref(sortedFields?.concat(refPrefFields));
    }
  }, [allColumns, preferences]);

  const submitHandler = async () => {
    const data = fieldsForPref?.filter((f) => f.preferred)?.map((f) => f.name);
    const formInfoId =
      type === 'field' ? refField?.fieldInfoId : currentForm?.formInfoId;
    columnPreferenceHandler(formInfoId, data);
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
  const data = fieldsForPref?.filter((f) => f.preferred)?.map((f) => f.name);

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    // margin: `0 0 2px 0`,
    background: isDragging ? '#ccc' : COLORS.WHITE,
    // border: `1px dashed ${colors.secondary.main}`,
    color: COLORS.SECONDARY,
    borderRadius: '5px',
    ...draggableStyle
  });

  const defaultFields = fields?.filter(
    (f) => f.defaultLabel || f.category === 'AutoIncrement'
  );

  return (
    <Box
      className="py-0"
      style={{
        backgroundColor:
          currentTheme === 'Dark' ? colors.darkLevel2 : colors.white,
        position: 'relative'
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="w-60 overflow-auto rounded p-4">
          <Droppable droppableId="droppable-id">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fieldsForPref?.map((column, index) => (
                  <Draggable
                    draggableId={column.name}
                    index={index}
                    key={column.name}
                    isDragDisabled={
                      defaultFields?.find((f) => f.name === column?.name)
                        ? true
                        : false
                    }
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
                        <div className="hover:bg-secondary-1/30 flex items-center gap-x-2 rounded-md py-1">
                          {/* <DragIcon style={{ color: COLORS.SECONDARY }} /> */}
                          <GripHorizontal
                            className={`${
                              defaultFields?.find(
                                (f) => f.name === column?.name
                              )
                                ? 'text-slate-400'
                                : 'text-black'
                            }`}
                            size={20}
                          />

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Checkbox
                                    checked={column.preferred}
                                    size="small"
                                    onCheckedChange={(checked) =>
                                      handleChange(checked, column.name)
                                    }
                                    disabled={defaultFields?.find(
                                      (f) => f.name === column?.name
                                    )}
                                  />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                {defaultFields?.find(
                                  (f) => f.name === column?.name
                                )
                                  ? 'This field is not editable'
                                  : ''}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <span className="line-clamp-1 overflow-hidden px-1 text-xs text-black">
                            {column?.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      <div className="sticky bottom-0 w-full border border-slate-300 bg-white p-1">
        <Button
          onClick={() => {
            submitHandler();
            setShowColumnPreference(false);
          }}
          size="sm"
          className="min-w-44 font-bold"
        >
          Save
        </Button>
      </div>
    </Box>
  );
};

export default ColumnPreferenceX;
