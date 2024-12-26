// @ts-nocheck
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Home.css';
import { colors, COLORS } from '../../common/constants/styles';

import { fetchFieldsByFormId } from '../../redux/slices/fieldSlice';
import { fetchFormsByModuleId } from '../../redux/slices/formSlice';
import { createTable } from '../../redux/slices/tableSlice';
import ConfirmationModal from '../shared/ConfirmationModal';
import Header from './Header';
import { fetchFieldGroups } from '../../redux/slices/fieldGroupSlice';
import FieldEditor from './FieldEditor';
import { Button } from '@/componentss/ui/button';
import { Label } from '@/componentss/ui/label';

import MainCard from '../../elements/MainCard';

const Home = () => {
  const dispatch = useDispatch();
  const { modules, isLoading } = useSelector((state) => state.module);
  const { forms } = useSelector((state) => state.form);
  const { currentTheme } = useSelector((state) => state.auth);
  const { fields } = useSelector((state) => state.field);
  const [compile, setCompile] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState();
  const [selectedFormId, setSelectedFormId] = useState();
  const [selectedField, setSelectedField] = useState();

  useEffect(() => {
    dispatch(fetchFieldGroups({ formInfoId: selectedFormId }));
  }, [selectedFormId, dispatch]);

  const onFormDropdownSelect = (value) => {
    setSelectedFormId(value);
    dispatch(fetchFieldsByFormId({ formInfoId: value }));
  };

  const saveFieldsANdCreateTableHandler = () => {
    const data = fields?.map((field) => {
      const fieldInfoId = isNaN(field.fieldInfoId) ? 0 : field.fieldInfoId;

      const formInfoId = isNaN(selectedFormId) ? 0 : +selectedFormId;

      const options = field.options?.map((optn, index) => {
        const optionId = isNaN(optn.optionId) ? 0 : optn.optionId;
        return {
          ...optn,
          fieldInfoId,
          optionId,
          value: index + 1
        };
      });

      return {
        ...field,
        formInfoId,
        fieldInfoId,
        options
      };
    });

    createTableHandler(data);
  };

  const createTableHandler = (data) => {
    const form = forms?.find((form) => form.formInfoId === selectedFormId);
    if (form) dispatch(createTable({ formName: form?.name, fields: data }));
    if (!isLoading) {
      setCompile(false);
      setSelectedField();
    }
  };

  return (
    <>
      <MainCard
        sx={{
          width: '100%',
          // minHeight: '60vh',
          height: 'calc(100vh - 65px)',
          backgroundColor:
            currentTheme === 'Dark' ? colors.darkLevel2 : colors.white,
          borderRadius: '8px'
        }}
        title={
          <div className="flex w-full items-center justify-between">
            <div>
              <Label className="text-lg font-semibold">Fields</Label>
            </div>
            <div className="flex w-1/2 items-center justify-between gap-2">
              <Header
                moduleList={modules}
                formList={forms}
                onModuleSelect={(id) => {
                  dispatch(fetchFormsByModuleId({ moduleId: id }));
                  setSelectedModuleId(id);
                }}
                onFormSelect={onFormDropdownSelect}
              />
              <div className="flex h-full pt-6">
                <Button onClick={() => setCompile(true)} className="font-bold">
                  <span className="text-sm">Submit & Create</span>
                </Button>
              </div>
            </div>
          </div>
        }
      >
        <div
          className="w-full"
          style={{
            backgroundColor:
              currentTheme === 'Dark' ? colors.darkBackground : COLORS.WHITE
          }}
        >
          <FieldEditor
            selectedModuleId={selectedModuleId}
            selectedFormId={selectedFormId}
            selectedField={selectedField}
            setSelectedField={setSelectedField}
          />
        </div>
        {compile && (
          <ConfirmationModal
            open={compile}
            heading="Save & create table"
            message="This action will create table and columns"
            onConfirm={saveFieldsANdCreateTableHandler}
            onCancel={() => setCompile(false)}
            secondButtonText="Submit"
            firstButtonText="Cancel"
          />
        )}
      </MainCard>
    </>
  );
};

export default Home;
