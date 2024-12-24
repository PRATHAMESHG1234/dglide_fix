import React, { useState } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import Loader from '../shared/Loader';
import { StrictModeDroppable as Droppable } from '../shared/StrictModeDroppable';
import Item from './Item';
import Selector from './Selector';
import { colors, COLORS } from '../../common/constants/styles';
import { useSelector } from 'react-redux';
import { updateFieldsToForm } from '../../redux/slices/fieldSlice';
import { useDispatch } from 'react-redux';
import { generateUId, reorder } from '../../common/utils/helpers';
import { fetchFormById } from '../../services/form';
import { fetchModuleById } from '../../services/module';
import { useNavigate } from 'react-router-dom';
import Property from './property/Property';

const FieldEditor = ({
  selectedModuleId,
  selectedFormId,
  selectedField,
  setSelectedField
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fields } = useSelector((state) => state.field);
  const { currentTheme } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.module);
  const { fieldGroups } = useSelector((state) => state.fieldGroup);
  const [onFieldClick, setOnFieldClick] = useState(false);

  const onFieldAddHandler = (field) => {
    setSelectedField();
    setOnFieldClick(true);
    dispatch(
      updateFieldsToForm({
        fields: [
          ...fields,
          {
            fieldInfoId: generateUId(),
            columnIndex: fields.length + 1,
            ...field
          }
        ]
      })
    );
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const reOrderedList = reorder(fields, source.index, destination.index);
    const reOrderedListWithIndex = reOrderedList?.map((item, index) => {
      return { ...item, columnIndex: index + 1 };
    });

    dispatch(updateFieldsToForm({ fields: reOrderedListWithIndex }));
  };

  const onFieldDeleteHandler = (field) => {
    const newObj = fields?.filter((f) => f.fieldInfoId !== field.fieldInfoId);
    dispatch(updateFieldsToForm({ fields: newObj }));
  };

  const onFieldUpdateHandler = (field) => {
    const newObj = [...fields];
    const updated = newObj?.map((fie) => {
      if (fie.fieldInfoId === field.fieldInfoId) {
        return field;
      }
      return fie;
    });
    dispatch(updateFieldsToForm({ fields: updated }));
  };

  const getDetails = async (fetchFunction, id) => {
    try {
      const res = await fetchFunction(id);
      return res?.result;
    } catch (error) {
      console.error(`Error fetching details for id ${id}:`, error);
      return null;
    }
  };

  const handleAddEditTreeStructure = async (field) => {
    const { name: fieldName, formInfoId: formId } = field;

    if (!formId) return;

    const formDetails = await getDetails(fetchFormById, formId);
    if (!formDetails) return;

    const { moduleInfoId: moduleId, name: formName } = formDetails;

    if (!moduleId) return;

    const moduleDetails = await getDetails(fetchModuleById, moduleId);
    if (!moduleDetails) return;

    const url = `/app/${moduleDetails.name}/${formName}/${fieldName}/tree-structure`;
    navigate(url);
  };
  const color = ['#2196F3', '#673AB7', '#00C853', '#FFC107', '#F44336'];

  function assignColorById(id) {
    const colorIndex = id % color.length;
    const assignedColor = color[colorIndex];

    return assignedColor;
  }
  return (
    <div className="flex justify-center">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex w-full">
          <div
            className="selector_container rounded border"
            style={{
              backgroundColor: colors.white
            }}
          >
            <Selector onFieldAdded={onFieldAddHandler} />
          </div>
          {selectedFormId && fields.length > 0 ? (
            <div
              className="dragDropContext_container ms-2 flex-grow rounded"
              style={{
                backgroundColor:
                  currentTheme === 'Dark' ? colors.darkLevel2 : colors.white,
                border: `1px solid${colors.grey[100]}`,
                boxShadow:
                  currentTheme === 'Light' &&
                  'rgba(149, 157, 165, 0.2) 0px 8px 24px'
              }}
            >
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-id">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {fields?.map((field, index) => (
                        <Draggable
                          draggableId={field.fieldInfoId.toString()}
                          index={index}
                          key={field.fieldInfoId}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <div
                                className="m-2 flex items-center rounded border shadow-sm"
                                style={{
                                  backgroundColor: COLORS.WHITE,
                                  borderLeft: `4px solid ${assignColorById(field?.fieldGroupInfoId)}`
                                }}
                              >
                                <Item
                                  key={field.fieldInfoId}
                                  field={field}
                                  onSelect={setSelectedField}
                                  onDelete={onFieldDeleteHandler}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div
                className="flex flex-col items-center justify-center gap-2"
                style={{
                  height: '140px',
                  width: '320px',
                  border: '2px dashed lightgrey',
                  borderRadius: '5px'
                }}
              >
                <div>
                  <svg
                    width="47"
                    height="47"
                    viewBox="0 0 47 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_159_1576)">
                      <path
                        d="M22.1874 5.21786L23.6562 2.28036C23.8305 1.93196 24.1361 1.66709 24.5057 1.544C24.8753 1.42091 25.2787 1.44969 25.6271 1.62401C25.9754 1.79833 26.2403 2.1039 26.3634 2.47351C26.4865 2.84312 26.4577 3.24649 26.2834 3.59489L24.8147 6.53239C24.7283 6.70489 24.6089 6.85871 24.4631 6.98505C24.3174 7.1114 24.1482 7.20779 23.9651 7.26874C23.7821 7.32969 23.5889 7.35399 23.3965 7.34027C23.2041 7.32654 23.0163 7.27505 22.8438 7.18873C22.6713 7.10242 22.5175 6.98298 22.3911 6.83722C22.2648 6.69146 22.1684 6.52224 22.1074 6.33923C22.0465 6.15622 22.0222 5.96299 22.0359 5.77058C22.0496 5.57818 22.1011 5.39036 22.1874 5.21786ZM2.93762 19.0939H4.40637C4.79591 19.0939 5.16949 18.9391 5.44493 18.6637C5.72038 18.3882 5.87512 18.0147 5.87512 17.6251C5.87512 17.2356 5.72038 16.862 5.44493 16.5866C5.16949 16.3111 4.79591 16.1564 4.40637 16.1564H2.93762C2.54808 16.1564 2.1745 16.3111 1.89906 16.5866C1.62361 16.862 1.46887 17.2356 1.46887 17.6251C1.46887 18.0147 1.62361 18.3882 1.89906 18.6637C2.1745 18.9391 2.54808 19.0939 2.93762 19.0939ZM17.6251 5.87512C18.0147 5.87512 18.3882 5.72038 18.6637 5.44493C18.9391 5.16949 19.0939 4.79591 19.0939 4.40637V2.93762C19.0939 2.54808 18.9391 2.1745 18.6637 1.89906C18.3882 1.62361 18.0147 1.46887 17.6251 1.46887C17.2356 1.46887 16.862 1.62361 16.5866 1.89906C16.3111 2.1745 16.1564 2.54808 16.1564 2.93762V4.40637C16.1564 4.79591 16.3111 5.16949 16.5866 5.44493C16.862 5.72038 17.2356 5.87512 17.6251 5.87512ZM5.21786 22.1874L2.28036 23.6562C1.93196 23.8305 1.66709 24.1361 1.544 24.5057C1.42091 24.8753 1.44969 25.2787 1.62401 25.6271C1.79833 25.9754 2.1039 26.2403 2.47351 26.3634C2.84312 26.4865 3.24649 26.4577 3.59489 26.2834L6.53239 24.8147C6.70489 24.7283 6.85871 24.6089 6.98505 24.4631C7.1114 24.3174 7.2078 24.1482 7.26874 23.9651C7.32969 23.7821 7.35399 23.5889 7.34027 23.3965C7.32654 23.2041 7.27505 23.0163 7.18873 22.8438C7.10242 22.6713 6.98298 22.5175 6.83722 22.3911C6.69146 22.2648 6.52224 22.1684 6.33923 22.1074C6.15622 22.0465 5.96299 22.0222 5.77059 22.0359C5.57818 22.0496 5.39036 22.1011 5.21786 22.1874ZM30.1224 25.1066L39.3645 21.0895C39.9059 20.8494 40.3621 20.4513 40.6733 19.9473C40.9844 19.4433 41.1359 18.857 41.1079 18.2654C41.0799 17.6737 40.8737 17.1044 40.5164 16.632C40.1591 16.1597 39.6673 15.8063 39.1056 15.6184L9.7159 6.022C9.20163 5.85368 8.65079 5.83116 8.12449 5.95692C7.5982 6.08267 7.11704 6.3518 6.73442 6.73442C6.3518 7.11704 6.08267 7.5982 5.95692 8.12449C5.83116 8.65079 5.85368 9.20163 6.022 9.7159L15.6184 39.1056C15.7993 39.6728 16.1501 40.1707 16.6233 40.5319C17.0965 40.8931 17.6692 41.1002 18.264 41.1251H18.4072C18.9777 41.1271 19.5362 40.9612 20.0132 40.6482C20.4901 40.3351 20.8644 39.8887 21.0895 39.3645L25.1066 30.1223L35.2501 40.2641C35.5229 40.5369 35.8468 40.7533 36.2032 40.901C36.5596 41.0487 36.9417 41.1247 37.3275 41.1247C37.7133 41.1247 38.0953 41.0487 38.4518 40.901C38.8082 40.7533 39.1321 40.5369 39.4049 40.2641L40.2641 39.4048C40.5369 39.1321 40.7533 38.8082 40.901 38.4518C41.0487 38.0953 41.1247 37.7133 41.1247 37.3275C41.1247 36.9417 41.0487 36.5596 40.901 36.2032C40.7533 35.8468 40.5369 35.5229 40.2641 35.2501L30.1224 25.1066Z"
                        fill="lightgrey"
                        fill-opacity="0.62"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_159_1576">
                        <rect width="47" height="47" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div style={{ color: 'lightgrey' }}>
                  Please select required fields...
                </div>
                {onFieldClick && !selectedFormId && (
                  <div
                    className="text-danger flex items-center justify-center text-center"
                    style={{
                      color: 'lightgrey',
                      fontSize: '11px',
                      opacity: '70%'
                    }}
                  >
                    Note: You need to select module and form before selecting
                    field
                  </div>
                )}
              </div>
            </div>
          )}
          {selectedField && (
            <div
              className="ml-2 rounded sm:w-5/12 md:w-5/12 lg:w-5/12"
              style={{
                backgroundColor: colors.white,
                border: `1px solid ${colors.grey[300]}`,
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
              }}
            >
              <div className="p-2">
                <Property
                  setSelectedField={setSelectedField}
                  field={selectedField}
                  onFieldUpdated={onFieldUpdateHandler}
                  fieldGroups={fieldGroups}
                  selectedFormId={selectedFormId}
                  addEditTreeStructure={handleAddEditTreeStructure}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FieldEditor;
