import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExternalLink } from 'lucide-react';
import { X } from 'lucide-react';
import { Box } from '@mui/joy';
import { Grid, Tooltip, Button as Buttons } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { colors, COLORS } from '../../common/constants/styles';
import { Button } from '@/componentss/ui/button';
import { Label } from '@/componentss/ui/label';
import {
  createTableRecord,
  fetchBatchTableCountValues
} from '../../redux/slices/tableSlice';
import AddAttachment from './AddAttachment';
import AddEditRecord from './addEditRecord/AddEditRecord';
import { fetchFieldsWithValuesForReference } from '../../services/field';
import { fetchFormById } from '../../redux/slices/formSlice';
import Attachment from './Attachment';
import Drawer from '../../elements/Drawer';
import MainCard from '../../elements/MainCard';
import AnimateButton from '../../pages/Login/AnimateButton';
import { fetchFieldGroups } from '../../services/fieldGroup';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/componentss/ui/sheet';
const ModifyReferenceRecord = ({
  formName,
  formInfoId,
  lookupFormName,
  onSubmit,
  rowValue,
  formExpand,
  setFormExpand,
  openModal,
  setOpenModal,
  openFormModal,
  field,
  selectedTabDataRecordId,
  setSelectedTabDataRecordId,
  setTaggedEmails,
  taggedEmails,
  atValues,
  setAtValues
}) => {
  const dispatch = useDispatch();
  const { currentForm, selectedRecordId } = useSelector(
    (state) => state.current
  );
  const { form } = useSelector((state) => state.form);
  const { attachments } = useSelector((state) => state.attachment);
  const { currentTheme } = useSelector((state) => state.auth);
  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({});
  const [richTextFieldsValue, setRichTextFieldsValue] = useState({});
  const [showAttachmentField, setShowAttachmentField] = useState(false);
  const [fieldGroups, setFieldGroups] = useState([]);

  useEffect(() => {
    setValues(rowValue);
  }, [rowValue]);
  const fetchGroups = async (formInfoId) => {
    const res = await fetchFieldGroups(formInfoId);
    setFieldGroups(res);
  };
  useEffect(() => {
    const formId = parseInt(formInfoId, 10);

    if (!isNaN(formId)) {
      fetchGroups(formInfoId);
      fetchFieldsWithValuesForReference(formInfoId)
        .then((data) => {
          setFields(data);
        })
        .catch((error) => {
          console.error('Error fetching form fields:', error);
        });
      dispatch(fetchFormById({ id: formInfoId }));
    }
  }, [formInfoId]);

  const submitHandler = (values) => {
    if (values) {
      if (fields?.length > 0) {
        fields.forEach((field) => {
          if (field.category === 'Reference') {
            const fieldName = field.name;
            if (currentForm?.name === field?.lookup?.formName) {
              values[fieldName] = selectedRecordId;
            }
          }
        });
      }
      if (
        (field?.category === 'TableLookup' && field?.activityReferenceField) ||
        field?.category === 'activity'
      ) {
        dispatch(
          createTableRecord({
            tableName: lookupFormName,
            data: {
              ...values,
              ...richTextFieldsValue,
              files: attachments || null,
              form_info_id: currentForm?.formInfoId,
              record_id: selectedRecordId
            }
          })
        );
      } else {
        dispatch(
          createTableRecord({
            tableName: lookupFormName,
            data: {
              ...values,
              ...richTextFieldsValue,
              files: attachments || null
            }
          })
        );
      }

      setValues({});
      setFormExpand(false);
      setOpenModal(false);
      onSubmit();
      setTimeout(() => {
        const tablePayload = {};
        tablePayload[field.fieldInfoId] = {
          recordId: selectedRecordId,
          type: field.category,
          where: []
        };
        // dispatch(fetchBatchTableCountValues({ data: tablePayload }));
      }, 500);
    }
  };

  const attachmentField = form?.attachment;

  const renderAttachmentField = () =>
    attachmentField && (
      <>
        {attachmentField && !showAttachmentField && (
          <Buttons
            variant="contained"
            style={{
              backgroundColor: colors.primary.light,
              color: colors.primary.main,
              boxShadow: 'none',

              '&:hover': {
                backgroundColor: colors.primary.light,
                color: colors.primary.main,
                textTransform: 'none',
                boxShadow: 'none'
              },
              textTransform: 'none'
            }}
            onClick={() => setShowAttachmentField(true)}
            size="small"
          >
            Attachment
          </Buttons>
        )}
        {showAttachmentField &&
          (!selectedTabDataRecordId ? (
            <AddAttachment
              attachmentTab={true}
              selectedRecordId={null}
              form={form}
            />
          ) : (
            <Attachment
              attachmentTab={true}
              selectedRecordId={selectedTabDataRecordId || null}
              form={form}
            />
          ))}
      </>
    );

  const renderAddEditRecord = (formId) => (
    <AddEditRecord
      formId={formId}
      fieldData={fields}
      fieldValues={values}
      showSystemDefaultField={selectedTabDataRecordId && true}
      onSubmit={submitHandler}
      otherFields={renderAttachmentField()}
      setTaggedEmails={setTaggedEmails}
      taggedEmails={taggedEmails}
      atValues={atValues}
      setAtValues={setAtValues}
      fieldGroups={fieldGroups}
    />
  );

  return (
    <Box>
      <Sheet
        key={'right'}
        open={openModal}
        onOpenChange={() => {
          setOpenModal(false);
          setSelectedTabDataRecordId('');
          setShowAttachmentField(false);
        }}
      >
        <SheetContent
          side={'right'}
          className="w-[800px] max-w-[700px] p-4 sm:max-w-[700px]"
          autoFocus={false}
        >
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between ps-3 pt-5 text-lg font-semibold">
              {selectedTabDataRecordId ? 'Edit' : 'Add'} {formName}
              <Button
                type="submit"
                form="reference-modal"
                className="bg-primary"
              >
                {selectedTabDataRecordId ? 'Update' : 'Submit'}
              </Button>
            </SheetTitle>
          </SheetHeader>
          {/* Content */}
          <div>
            {fields?.length > 0 && renderAddEditRecord('reference-modal')}
          </div>
        </SheetContent>
      </Sheet>
    </Box>
  );
};

export default ModifyReferenceRecord;
