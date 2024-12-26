import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { XCircle } from 'lucide-react';
import { IconUserScan } from '@tabler/icons-react';

import { colors } from '../../common/constants/styles';
import { toSnakeCase } from '../../common/utils/helpers';
import { fetchFormByName, uploadFormLogo } from '../../services/form';
// import Avatar from '../../elements/Avatars';
import { debounce } from 'lodash';

import { useDispatch } from 'react-redux';
import { Input } from '@/componentss/ui/input';
import { Button } from '@/componentss/ui/button';
import { Textarea } from '@/componentss/ui/textarea';
import { Checkbox } from '@/componentss/ui/checkbox';
import { Label } from '@/componentss/ui/label';
import { Sheet, SheetContent } from '@/componentss/ui/sheet';
import { ArrowUpFromLine } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/componentss/ui/avatar';
import { notify } from '../../hooks/toastUtils';

const storageURL = process.env.REACT_APP_STORAGE_URL;

const validationSchema = Yup.object().shape({
  displayName: Yup.string().required('Name is required'),
  position: Yup.number().required('Position is required')
});

const AddEditModal = ({ state, onConfirm, onCancel }) => {
  const [logo, setLogo] = useState('');
  const [preview, setPreview] = useState('');
  const [name, setName] = useState('');
  const hiddenFileInput = useRef(null);
  const [modified, setModified] = useState(false);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
      displayName: '',
      description: '',
      position: '',
      showOnMenu: true,
      audit: false,
      showAttachmentOnActivity: false,
      enableModifiedFormUi: false,
      showAuditOnActivity: false,
      globalSearch: false,
      activity: false,
      attachment: false,
      enableSla: false
    },
    validationSchema,
    onSubmit: (values) => {
      const modifiedStr = toSnakeCase(values.displayName);
      onConfirm({ ...values, name: modifiedStr, logo });
    }
  });

  useEffect(() => {
    if (state.selected) {
      formik.setValues({
        name: state.selected.name,
        displayName: state.selected.displayName,
        description: state.selected.description,
        position: state.selected.position,
        showOnMenu: state.selected.showOnMenu,
        audit: state.selected.audit,
        enableModifiedFormUi: state.selected.enableModifiedFormUi,
        showAttachmentOnActivity: state.selected.showAttachmentOnActivity,
        showAuditOnActivity: state.selected.showAuditOnActivity,
        globalSearch: state.selected.globalSearch,
        activity: state.selected.activity,
        attachment: state.selected.attachment,
        enableSla: state.selected.enableSla
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

        const data = await fetchFormByName(value);
        if (data?.result) {
          formik.setFieldError('displayName', 'Form name already exists');
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
    const fileData = await uploadFormLogo(file);
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
        notify.error(formik.errors.displayName || 'Form name already exists');
      }
    }, 500);
  };

  const checkboxItems = [
    { name: 'showOnMenu', label: 'Shown on menu' },
    { name: 'activity', label: 'Activity' },
    { name: 'globalSearch', label: 'Enable global search' },
    { name: 'audit', label: 'Audit' },
    { name: 'showAuditOnActivity', label: 'Show audit on activity' },
    { name: 'attachment', label: 'Attachment' },
    { name: 'showAttachmentOnActivity', label: 'Show attachment on activity' },
    // { name: 'enableModifiedFormUi', label: 'Enable modified form ui' },
    { name: 'enableSla', label: 'Enable SLA' }
  ];

  return (
    <Sheet key={'right'} open={state.show} onOpenChange={onCancel}>
      <SheetContent
        side={'right'}
        className="max-w-[600px] overflow-auto sm:max-w-[600px]"
      >
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold">
            {state.selected ? 'Edit form' : 'Create form'}
          </div>
          <div className="flex justify-center">
            <div className="logo_file_container flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center">
                {preview ? (
                  <>
                    <Avatar className="h-20 w-20 shadow-sm">
                      <AvatarImage src={preview} />
                      <AvatarFallback className="text-2xl">
                        {formik?.values?.displayName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </>
                ) : (
                  <Avatar className="h-20 w-20 shadow-sm">
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
            value={formik.values.displayName}
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
          <Input
            label="Position"
            type="number"
            name="position"
            value={formik.values.position}
            onChange={formik.handleChange}
            placeholder="Position"
            onBlur={formik.handleBlur}
            error={formik.touched.position && Boolean(formik.errors.position)}
            helperText={formik.touched.position && formik.errors.position}
          />

          <div className="flex flex-col gap-y-2 py-2">
            {checkboxItems.map((item) => (
              <Checkbox
                checked={formik.values[item.name]}
                onCheckedChange={(checked) => {
                  formik.setFieldValue(item.name, checked);
                }}
                endLabel={item?.label}
                id={item.name}
              />
            ))}
          </div>
          <div className="flex items-center gap-x-2 py-2">
            <Button onClick={submitData}>{modified ? 'Update' : 'Save'}</Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddEditModal;
