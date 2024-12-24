import React, { useEffect, useState } from 'react';
import { COLORS } from '../../../common/constants/styles';
import Selector from './CreatorSelector';
import Item from './CreatorItem';
import { StrictModeDroppable as Droppable } from '../../shared/StrictModeDroppable';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import {
  generateChild,
  generateUId,
  reorder,
  toSnakeCase
} from '../../../common/utils/helpers';
import { updateFieldsToForm } from '../../../redux/slices/fieldSlice';
import { useDispatch } from 'react-redux';
import { Stack, Typography } from '@mui/joy';
import { Button } from '@/componentss/ui/button';
import ConfirmationModal from '../../shared/ConfirmationModal';
import { fetchCatalogFlow } from '../../../services/catalogFlow';
import { updateCatalogFlow } from '../../../redux/slices/catalogFlowSlice';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import Property from './CreatorProperty';
import { ChevronRight } from 'lucide-react';
import { optionUniqeUId } from '../../../common/utils/helpers';
import { ArrowLeft } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import CreatorAddAttachment from './CreatorAddAttachment';
import { notify } from '../../../hooks/toastUtils';

export const Creator = ({ catalogFlowInfoId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [fields, setFields] = useState();
  const [catagoryType, setCatagoryType] = useState('');
  const [selectedField, setSelectedField] = useState();
  const [compile, setCompile] = useState(false);
  const [closeConfirmatn, setCloseConfirmatn] = useState(false);
  const [catalogFlow, setCatalogFlow] = useState(null);
  const [filedList, setFieldList] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const { fields } = useSelector((state) => state.field);
  const [allQuestionList, setAllQuestionList] = useState([]);

  useEffect(() => {
    if (fields && fields.length > 0 && filedList.length === 0) {
      let copyOfField = JSON.parse(JSON.stringify(fields));
      const result = generateChild(copyOfField);
      setFieldList(result);
    }
  }, [fields]);
  useEffect(() => {
    // dispatch(updateFieldsToForm({ fields: [] }));
    if (
      catalogFlowInfoId !== 'undefined' &&
      catalogFlowInfoId !== 'null' &&
      catalogFlowInfoId !== undefined &&
      catalogFlowInfoId !== null
    ) {
      fetchCatalogFlow(catalogFlowInfoId).then((response) => {
        if (response?.result) {
          let result = response?.result;
          setCatalogFlow(result);
          // const catalogTypeObj = catalogType.filter(
          //   (o) => o.value === result?.categoryType
          // );
          setCatagoryType(result?.type_display);
          if (
            result?.json_str !== null &&
            result?.json_str !== undefined &&
            result?.json_str !== 'null' &&
            result?.json_str !== 'undefined'
          ) {
            const fieldList = JSON.parse(result.json_str)?.fields;
            setAllQuestionList(fieldList);
            let data = generateChild(fieldList);
            setFieldList(data);
            // dispatch(updateFieldsToForm({ fields: data }));
          } else {
            const fieldList = '';
            setAllQuestionList([]);
            const result = generateChild(fieldList);
            setFieldList(result);
          }
        }
      });
    }
  }, [catalogFlowInfoId]);

  const onFieldAddHandler = (field) => {
    let updatedOptions;

    if (field.options) {
      updatedOptions = field.options.map((option, index) => ({
        ...option,
        optionId: optionUniqeUId()
      }));
    }

    setSelectedField();
    let uuid = generateUId();
    const modifiedStr = toSnakeCase(field.name);
    let obj = {
      ...field,
      inDependent: false,
      fieldInfoId: uuid,
      name: uuid,
      dependent: false,
      field_name: modifiedStr,
      child: [],
      variant: field?.category === 'Radio' ? 'Image' : field.variant,
      condition: [],
      formInfoId: 0,
      lookup: null,
      prependText: null,
      unique: false,
      attachmentFile: null,
      columnIndex: filedList.length + 1,
      instruction: '',
      options: updatedOptions,
      parentQueName: null,
      validation: null
    };
    let allQuestionListData = [...allQuestionList, obj];
    setAllQuestionList(allQuestionListData);
    let copyOfField = JSON.parse(JSON.stringify(allQuestionListData));

    const result = generateChild(copyOfField);
    setFieldList(result);
  };

  const onFieldUpdateHandler = (field) => {
    let allQuestionListData = JSON.parse(JSON.stringify(allQuestionList));

    field.forEach((element) => {
      allQuestionListData = allQuestionListData.map((fie) => {
        if (fie.name === element.name) {
          return { ...fie, ...element };
        }
        return fie;
      });
    });

    setAllQuestionList(allQuestionListData);
    dispatch(updateFieldsToForm({ fields: allQuestionListData }));

    let copyOfField = JSON.parse(JSON.stringify(allQuestionListData));
    const result = generateChild(copyOfField);

    setFieldList(result);
    setSelectedField(null);
  };

  // const updateChildField = (field) => {
  //   let allQuestionListData = JSON.parse(JSON.stringify(allQuestionList));
  //   field.forEach((element) => {
  //     allQuestionListData = allQuestionListData.map((fie) => {
  //       if (fie.name === element.name) {
  //         return element;
  //       }
  //       return fie;
  //     });
  //   });
  //   setAllQuestionList(allQuestionListData);
  //   let copyOfField = JSON.parse(JSON.stringify(allQuestionListData));
  //   const result = generateChild(copyOfField);
  //   setFieldList(result);
  // };

  const getChilOfChild = (Child, nthChildArr) => {
    if (Child?.options?.length > 0) {
      Child.options.forEach((elem) => {
        if (elem?.child?.length > 0) {
          elem.child.forEach((nested) => {
            nthChildArr.push(nested);
            getChilOfChild(nested, nthChildArr);
          });
        }
      });
    }
  };
  const updateQuestionList = (feildNameArr) => {
    let allQuestionListData = JSON.parse(JSON.stringify(allQuestionList));
    // updated = allQuestionListData?.filter(
    //   (fie) => !feildNameArr.includes(fie.name)
    // );
    const deletedChild = allQuestionListData?.filter((fie) =>
      feildNameArr.includes(fie.name)
    );
    let nthChildArr = [];
    if (deletedChild) {
      deletedChild.forEach((element) => {
        getChilOfChild(element, nthChildArr);
      });
      const updated = nthChildArr.reduce((acc, o) => {
        return acc.filter(
          (fie) => fie.name !== o.name || feildNameArr.includes(o.name)
        );
      }, allQuestionListData);

      const remaningArr = updated?.filter(
        (fie) => !feildNameArr.includes(fie.name)
      );
      setAllQuestionList(remaningArr);
    }
  };

  const DeleteQuestions = (field) => {
    let allQuestionListData = [...allQuestionList];
    // Update parent field's condition
    let fieldParent = allQuestionListData.filter(
      (f) => f.name === field?.parentQueName
    );
    let updatedFieldParent;
    if (fieldParent.length > 0) {
      const updatedCondition = fieldParent[0].condition.reduce((acc, o) => {
        if (o.fieldName.includes(field?.name)) {
          if (o.fieldName.length > 1) {
            // Remove the matching field name
            acc.push({
              ...o,
              fieldName: o.fieldName.filter((name) => name !== field?.name)
            });
          }
        } else {
          // Keep the condition as is if it doesn't include the field name
          acc.push(o);
        }
        return acc;
      }, []);
      updatedFieldParent = {
        ...fieldParent[0],
        condition: updatedCondition
      };
    }
    // filter selected Field
    let updated = allQuestionListData.filter((f) => f.name !== field?.name);
    // filter parent's condition
    updated = updated.map((elem) => {
      if (elem.name === updatedFieldParent?.name) {
        return updatedFieldParent;
      }
      return elem;
    });
    setAllQuestionList(updated);
    let copyOfField = JSON.parse(JSON.stringify(updated));

    notify.success('This Field was deleted.');
    const result = generateChild(copyOfField);
    setFieldList(result);
  };

  const onFieldDeleteHandler = (field) => {
    if (field?.child?.length > 0) {
      notify.error('This Field was not deleted.');
    } else {
      DeleteQuestions(field);
    }
  };

  const onDragEnd = (data) => {
    const { source, destination } = data;
    if (!destination) {
      return;
    }
    const reOrderedList = reorder(filedList, source.index, destination.index);
    const reOrderedListWithIndex = reOrderedList?.map((item, index) => {
      return { ...item, columnIndex: index + 1 };
    });
    const newArr = [];
    const Arr = [];
    reOrderedListWithIndex.forEach((e) => {
      const found = allQuestionList.some((element) => {
        if (element.name === e.name) {
          newArr.push(e);
          return true;
        }

        return false;
      });
    });
    allQuestionList.forEach((element) => {
      const found = newArr.some((e) => e.name === element.name);
      if (!found) {
        Arr.push(element);
      }
    });
    let allQuestionData = [...newArr, ...Arr];
    let copyOfField = JSON.parse(JSON.stringify(allQuestionData));
    setAllQuestionList(copyOfField);
    const result = generateChild(copyOfField);
    setFieldList(result);
  };

  const saveFieldsHandler = () => {
    let allQuestionListData = [...allQuestionList];
    const fieldData = allQuestionListData?.map((field) => {
      const fieldInfoId = isNaN(field.fieldInfoId) ? 0 : field.fieldInfoId;
      let options;
      if (field.type !== 'switch') {
        options = field.options?.map((optn, index) => {
          const optionId = optn.optionId;
          return {
            ...optn,
            fieldInfoId,
            optionId,
            value: index + 1
          };
        });
      } else {
        options = field.options;
      }

      return {
        ...field,
        fieldInfoId,
        options: options || null
      };
    });
    let payload = JSON.parse(JSON.stringify(catalogFlow));
    payload.json_str =
      fieldData && fieldData.length > 0
        ? JSON.stringify({ fields: fieldData })
        : null;

    payload.recursive_json =
      filedList && filedList.length > 0
        ? JSON.stringify({ fields: filedList })
        : null;
    dispatch(updateCatalogFlow(payload));
    setCompile(false);
  };

  const handleToggle = (field) => {
    setCollapsed(!collapsed);
    const index = allQuestionList.findIndex((item) =>
      item?.options?.some((option) => option.optionId === field?.optionId)
    );
    if (index !== -1) {
      const getField = allQuestionList[index];
      const updatedOptions = getField.options.map((option) => {
        if (option.optionId === field?.optionId) {
          return { ...option, collapsed: !option.collapsed };
        }
        return option;
      });
      const updatedField = { ...getField, options: updatedOptions };
      const updatedAllQuestionList = [...allQuestionList];
      updatedAllQuestionList[index] = updatedField;
      setAllQuestionList(updatedAllQuestionList);
      let copyOfField = JSON.parse(JSON.stringify(updatedAllQuestionList));
      const result = generateChild(copyOfField);
      setFieldList(result);
    }
  };
  const RecursiveArrayMapper = ({ data, index, label }) => {
    return (
      <Draggable
        key={data.columnIndex}
        draggableId={data.columnIndex.toString()}
        index={index}
      >
        {(provided) => (
          <div
            className="mx-3"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div
              className="item_container m-2 flex items-center rounded shadow-sm"
              style={{
                backgroundColor: COLORS.WHITE
              }}
            >
              {
                <div className="flex flex-col">
                  <div className="gap-2">
                    <Item
                      key={data.columnIndex}
                      field={data}
                      onSelect={setSelectedField}
                      onDelete={onFieldDeleteHandler}
                      type={catalogFlow?.type_display}
                      recordId={catalogFlow?.uuid}
                    />
                  </div>
                  {data?.options &&
                    data?.options.map((field, index) => (
                      <>
                        <label style={{ marginLeft: '28px', fontSize: '13px' }}>
                          {field.child?.length > 0 &&
                          field?.collapsed === true ? (
                            <ChevronDown
                              onClick={() => handleToggle(field)}
                            ></ChevronDown>
                          ) : (
                            <ChevronRight
                              onClick={() => handleToggle(field)}
                            ></ChevronRight>
                          )}
                          {field?.label}
                        </label>
                        {field?.collapsed === true
                          ? field.child.map((child, index) => (
                              <>
                                <RecursiveArrayMapper
                                  data={child}
                                  index={index}
                                  label={child?.label}
                                ></RecursiveArrayMapper>
                              </>
                            ))
                          : null}
                      </>
                    ))}
                </div>
              }
            </div>
            <div className="item_container m-2 rounded shadow-sm">
              {catagoryType === 'Document Type' ? (
                <CreatorAddAttachment
                  selectedRecordId={
                    catalogFlow?.uuid ? catalogFlow?.uuid : null
                  }
                  catlogFlag="catlogFlagTrue"
                />
              ) : null}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="col-xl-12 col-lg-12 p-0">
      <div className="mx-3 mb-3 flex justify-between">
        <div className="flex items-center px-1">
          {' '}
          <ArrowLeft
            onClick={() => navigate(-1)}
            style={{ marginRight: '7px', color: 'grey' }}
          />
          <Typography
            sx={{
              fontSize: '18px',
              color: COLORS.PRIMARY
            }}
            fontWeight="bold"
          >
            {catalogFlow?.catalog.charAt(0).toUpperCase() +
              catalogFlow?.catalog.slice(1)}
          </Typography>
        </div>
        <div className="flex items-center">
          <Stack spacing={1} direction="row">
            <Button
              variant="solid"
              type="submit"
              onClick={() => setCompile(true)}
              sx={{
                backgroundColor: COLORS.PRIMARY
              }}
            >
              Save
            </Button>

            <Button
              className="close-icon"
              sx={{
                backgroundColor: COLORS.PRIMARY
              }}
              onClick={() => setCloseConfirmatn(true)}
            >
              <X />
            </Button>
          </Stack>
        </div>
      </div>
      <div
        className="fields_container p-3"
        style={{
          backgroundColor: COLORS.WHITE
        }}
      >
        <div className="flex justify-center">
          <div className="flex w-full">
            <div
              className="selector_container rounded p-1"
              style={{
                backgroundColor: COLORS.TERTIARY
              }}
            >
              <Selector
                onFieldAdded={onFieldAddHandler}
                type={catalogFlow?.type_display}
              />
            </div>
            <div
              className="dragDropContext_container ms-2 flex-1 rounded"
              style={{
                maxHeight: 'calc(100vh - 210px)',
                backgroundColor: COLORS.TERTIARY
              }}
            >
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-id">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {filedList &&
                        filedList.map((field, index) => (
                          <RecursiveArrayMapper
                            data={field}
                            index={index}
                          ></RecursiveArrayMapper>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {selectedField && (
              <div
                className="col-sm-4 col-md-4 col-lg-4 ms-2 rounded"
                style={{
                  backgroundColor: COLORS.TERTIARY
                }}
              >
                <div className="p-2" style={{}}>
                  <Property
                    fields={allQuestionList}
                    setSelectedField={setSelectedField}
                    field={selectedField}
                    // updateChild={updateChildField}
                    updateQuestion={updateQuestionList}
                    onFieldUpdated={onFieldUpdateHandler}
                    handleClosePanel={() => setSelectedField(null)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {compile && (
        <ConfirmationModal
          open={compile}
          heading="Are you sure you want to save & create Question Form ?"
          message="This action will create Question Form"
          onConfirm={saveFieldsHandler}
          onCancel={() => setCompile(false)}
          firstButtonText="Submit"
          ButtonPosition="reversed"
        />
      )}
      {closeConfirmatn && (
        <ConfirmationModal
          open={closeConfirmatn}
          heading="Are you sure you want to Close Form ?"
          message="This action will Close Question Form"
          onConfirm={() => navigate('/catalogflow')}
          onCancel={() => setCloseConfirmatn(false)}
          firstButtonText="Confirm"
        />
      )}
    </div>
  );
};
