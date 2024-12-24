import { Button } from '@/componentss/ui/button';
import { colors } from '../../../common/constants/styles';
import AddEditRecord from '../../modify-record/addEditRecord/AddEditRecord';
import { useEffect, useState } from 'react';
import { fetchFieldsWithValuesForReference } from '../../../services/field';
import { useSelector } from 'react-redux';
import MainCard from '../../../elements/MainCard';
import { fetchFieldGroups } from '../../../services/fieldGroup';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/componentss/ui/tooltip';
import { ArrowLeft, X as LucideX, X } from 'lucide-react';
const ReferenceFieldGridDataAdd = ({ refField, onConfirm, onCancel }) => {
  const [fields, setFields] = useState([]);
  const [fieldGroups, setFieldGroups] = useState([]);

  const formInfoId =
    refField?.parentFormInfoId > 0
      ? refField?.parentFormInfoId
      : refField?.formId;
  const fetchGroups = async (formInfoId) => {
    const res = await fetchFieldGroups(formInfoId);
    setFieldGroups(res);
  };
  useEffect(() => {
    if (formInfoId) {
      fetchFieldsWithValuesForReference(formInfoId)
        .then((data) => {
          setFields(data);
        })
        .catch((error) => {
          console.error('Error fetching form fields:', error);
        });
      fetchGroups(formInfoId);
    }
  }, [formInfoId]);

  return (
    <>
      <div className="relative" style={{ borderRadius: '5px' }}>
        <MainCard
          title={
            <div className="ps-3 text-lg font-semibold">
              Add {refField?.field.label}
            </div>
          }
          secondary={
            <span className="flex gap-2 pb-1">
              <Button type={'submit'} form={'referenceDataAdd'}>
                Submit
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onCancel}
                    title="Close"
                    className="w-6"
                    variant="outline"
                  >
                    <X size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close</TooltipContent>
              </Tooltip>
            </span>
          }
        >
          {fields.length > 0 && (
            <AddEditRecord
              formId="referenceDataAdd"
              fieldData={fields}
              showSystemDefaultField={false}
              onSubmit={onConfirm}
              activeFormId={formInfoId}
              fieldGroups={fieldGroups}
            />
          )}
        </MainCard>
      </div>
    </>
  );
};

export default ReferenceFieldGridDataAdd;
