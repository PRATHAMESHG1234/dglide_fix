import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './AddEditModal.css';
import { fetchModuleByName, uploadModuleLogo } from '../../services/module';

import { colors } from '../../common/constants/styles';

import { IconUserScan } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';

import { toSnakeCase } from '../../common/utils/helpers';
import { Sheet, SheetContent } from '@/componentss/ui/sheet';
import { Input } from '@/componentss/ui/input';
import { Button } from '@/componentss/ui/button';
import { Textarea } from '@/componentss/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/componentss/ui/avatar';
import { ArrowUpFromLine } from 'lucide-react';
import { notify } from '../../hooks/toastUtils';
const storageURL = process.env.REACT_APP_STORAGE_URL;

const validationSchema = Yup.object({
  name: Yup.string(),
  displayName: Yup.string().required('This field is required.'),
  description: Yup.string()
});

const AddEditModule = ({ state, onConfirm, onCancel }) => {
  const [logo, setLogo] = useState('');
  const [preview, setPreview] = useState('');
  const [name, setName] = useState('');
  const hiddenFileInput = useRef(null);
  const [modified, setModified] = useState(false);
  const dispatch = useDispatch();
  const { currentModule } = useSelector((state) => state.current);

  const formik = useFormik({
    initialValues: {
      name: '',
      displayName: '',
      description: ''
    },
    validationSchema,
    onSubmit: (values) => {
      values.name = values.displayName;
      onConfirm({ ...values, logo });
    }
  });

  useEffect(() => {
    if (state.selected) {
      formik.setValues({
        name: state.selected.name,
        displayName: state.selected.displayName,
        description: state.selected.description
      });
      setLogo(state.selected.logo);
      setPreview(`${storageURL}/${state.selected.logo}`);
      setModified(true);
    } else {
      setPreview('');
    }
  }, [state.selected]);

  useEffect(() => {
    const debouncedFetch = debounce(async () => {
      if (name) {
        const value = toSnakeCase(name);
        const data = await fetchModuleByName(value);
        if (data?.result) {
          formik.setFieldError('displayName', 'Module name already exists');
        }
      }
    }, 800);

    debouncedFetch();
    return () => {
      debouncedFetch.cancel();
    };
  }, [name]);

  const handleNameChange = (event) => {
    formik.setFieldError('displayName', '');
    setName(event.target.value);
  };

  const handleLogoUpload = async (file) => {
    const fileData = await uploadModuleLogo(file);
    setLogo(fileData?.result.filePath);
    setPreview(URL.createObjectURL(file));
  };

  const handleImportFile = (e) => {
    e.preventDefault();
    hiddenFileInput.current.click();
  };

  const handleClear = () => {
    formik.resetForm();
    setLogo('');
    setPreview('');
  };

  const handleRemoveImage = () => {
    setLogo('');
    setPreview('');
  };

  const color = [colors.primary.main];

  function assignColorById(id) {
    const colorIndex = id % color.length;
    const assignedColor = color[colorIndex];

    return assignedColor;
  }

  const submitData = () => {
    setTimeout(() => {
      if (!formik.errors.displayName) {
        formik.handleSubmit();
      } else {
        notify.error(formik.errors.displayName || 'Module name already exists');
      }
    }, 500);
  };
  console.log(state.show, 'show');
  return (
    <Sheet key={'right'} open={state.show} onOpenChange={onCancel}>
      <SheetContent
        side={'right'}
        className="w-[800px] max-w-[600px] sm:max-w-[600px]"
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            <div className="logo_file_container flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center">
                {preview ? (
                  <>
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={preview} />
                      <AvatarFallback className="text-2xl">
                        {formik?.values?.displayName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </>
                ) : (
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={preview} />
                    <AvatarFallback>
                      <IconUserScan
                        stroke={1.5}
                        className="text-primary"
                        size="60px"
                      />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              <Button onClick={handleImportFile}>
                <ArrowUpFromLine size={18} />
                Upload
              </Button>
            </div>
          </div>
          <input
            type="file"
            ref={hiddenFileInput}
            style={{ display: 'none' }}
            name="logo"
            accept="image/*"
            onChange={(e) => handleLogoUpload(e.target.files[0])}
          />
          <Input
            label="Name"
            fullWidth
            name="displayName"
            value={formik.values.displayName || ''}
            onChange={(e) => {
              formik.handleChange(e);
              handleNameChange(e);
            }}
            error={Boolean(formik.errors.displayName)}
            helperText={formik.errors.displayName}
            maxLength={40}
            placeholder="Name"
          />
          <Textarea
            label="Description"
            type="text"
            fullWidth
            multiline
            maxLength={400}
            rows={3}
            name="description"
            value={formik.values.description}
            placeholder="Description"
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            className="w-full"
          />
          <div className="flex gap-x-2 py-2">
            <Button onClick={submitData}>{modified ? 'Update' : 'Save'}</Button>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddEditModule;
