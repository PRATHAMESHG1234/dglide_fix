import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import Dialog from '../shared/Dialog';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CloudUpload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MODAL } from '../../common/utils/modal-toggle';
import { COLORS } from '../../common/constants/styles';
import { uploadModuleLogo } from '../../services/module';
import {
  fetchCatalogFlow,
  getCatagoryList,
  getSubCatagoryList
} from '../../services/catalogFlow';
import { catalogType } from '../../common/utils/fields';
import { getOptions } from '../../services/workFlow';
import dummyLogo from '../../assets/add-profile-for-module-form.svg';

export const EditCatalogFlow = ({ state, onConfirm, onCancel }) => {
  // const allTableList = useSelector((state) => {
  //   return state?.form;
  // });

  const [logo, setLogo] = useState('');
  const [catagoryList, setCatagoryList] = useState([]);
  const [subCatagory, setSubCatagory] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  // const [form, setForm] = useState({

  // });
  const formik = useFormik({
    initialValues: {
      category: '',
      subCategory: '',
      catalog: '',
      status: '1',
      visibility: '',
      categoryType: '',
      exportToChatbot: false,
      logo: ''
    },
    validationSchema: Yup.object({
      category: Yup.string().required('Required'),
      subCategory: Yup.string().required('Required'),
      catalog: Yup.string().required('Required'),
      status: Yup.string(),
      visibility: Yup.string().required('Required'),
      categoryType: Yup.string().required('Required'),
      exportToChatbot: Yup.boolean(),
      logo: Yup.string()
    }),
    onSubmit: (values) => {
      onConfirm(values);
    }
  });
  const getcatagory = async () => {
    const getAllCatagory = await getCatagoryList({});

    setCatagoryList(getAllCatagory?.result);
  };
  const getWorkFlowStatus = async () => {
    const StatusData = await getOptions('system_workflow', 'status');
    setStatusList(StatusData?.result);
  };

  useEffect(() => {
    getcatagory();
    getWorkFlowStatus();
  }, []);

  useEffect(() => {
    let getStatusValue;
    const fetchData = async () => {
      if (state.selected?.uuid) {
        try {
          getStatusValue = await fetchCatalogFlow(state.selected?.uuid);
        } catch (error) {
          console.error('Error fetching Catalog:', error);
        }
      }
      if (getStatusValue?.result) {
        formik.setValues({
          catalogFlowInfoId: getStatusValue?.result.catelogflow_id
            ? getStatusValue?.result.catelogflow_id
            : null,
          catalog: getStatusValue?.result.catalog,
          category: getStatusValue?.result.category,
          subCategory: getStatusValue?.result.sub_category,
          status: getStatusValue?.result.status,
          jsonStr: getStatusValue?.result.json_str
            ? getStatusValue?.result.json_str
            : '',
          visibility: getStatusValue?.result.visibility,
          logo: getStatusValue?.result.logo ? getStatusValue?.result.logo : '',
          recursiveJson: getStatusValue?.result.recursive_json
            ? getStatusValue?.result.recursive_json
            : '',
          categoryType: getStatusValue?.result.type,
          exportToChatbot:
            getStatusValue?.result.chatbot === 'true'
              ? true
              : getStatusValue?.result.chatbot === 'false'
                ? false
                : getStatusValue?.result.chatbot
        });
        setLogo(state.selected.logo);
        let imageUrl = createImageUrl(getStatusValue?.result.logo);
        setUploadedFile(imageUrl);
      }
    };
    fetchData();
  }, [state]);

  const getSubCatagory = async (data) => {
    const SubCatagory = await getSubCatagoryList({ category: data });
    setSubCatagory(SubCatagory?.result);
  };

  const createImageUrl = (file) => {
    const URL = process.env.REACT_APP_STORAGE_URL;
    if (!file) return null;
    return `${URL}/${file}`;
  };

  const uploadLogoHandler = async (file) => {
    const fileData = await uploadModuleLogo(file);
    let imageUrl = createImageUrl(fileData.result?.filePath);
    setUploadedFile(imageUrl);
    formik.setFieldValue('logo', fileData?.result.filePath);
    setLogo(fileData?.result.filePath);
  };

  // const setFormValue = (e) => {
  //   const type = e.target.name;
  //   const value = e.target.value;
  //   switch (type) {
  //     // case 'logo':
  //     //   const logo = uploadLogoHandler(e.target.files[0]);
  //     //   setForm({
  //     //     ...form,
  //     //     logo
  //     //   });
  //     //   break;
  //     case 'category':
  //       setForm({
  //         ...form,
  //         category: value
  //       });
  //       getSubCatagory(value);
  //       break;
  //     case 'subCategory':
  //       setForm({
  //         ...form,
  //         subCategory: value
  //       });
  //       break;
  //     case 'catalog':
  //       setForm({
  //         ...form,
  //         catalog: value
  //       });
  //       break;
  //     case 'visibility':
  //       setForm({
  //         ...form,
  //         visibility: value
  //       });
  //       break;
  //     case 'status':
  //       setForm({
  //         ...form,
  //         status: value
  //       });
  //       break;
  //     case 'exportToChatbot':
  //       setForm({
  //         ...form,
  //         exportToChatbot: e.target.checked
  //       });
  //       break;
  //     case 'categoryType':
  //       setForm({
  //         ...form,
  //         categoryType: value
  //       });
  //       break;
  //     default:
  //       console.log('setFormValue default');
  //   }
  // };
  const hiddenFileInput = React.useRef(null);

  const onImportFile = async (e) => {
    e.preventDefault();
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (formik.values.category) {
      getSubCatagory(formik.values.category);
    }
  }, [formik.values.category]);
  return (
    <Dialog
      Header={{
        open: state.show,
        close: onCancel,
        maxWidth: 'sm',
        dialogTitle:
          state.type === MODAL.create ? 'CREATE CATALOG' : 'EDIT CATALOG'
      }}
      Footer={{
        clear: onCancel,
        confirm: formik.handleSubmit,
        cancelBtnLabel: 'Cancel',
        saveBtnLabel: state.type === MODAL.create ? 'Save' : 'Update'
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box className="m-3 rounded">
          <div className="flex justify-center">
            <div className="flex items-center justify-center">
              <div className="logo_file_container flex flex-col items-center justify-center gap-2">
                <Avatar
                  style={{ height: '90px', width: '90px' }}
                  src={uploadedFile || dummyLogo}
                />
                <Chip
                  onClick={onImportFile}
                  icon={<Upload />}
                  label="Upload Picture"
                  style={{
                    height: '40px',
                    width: '160px',
                    fontSize: '15px',
                    bgcolor: '#D2E5FF',
                    color: COLORS.SECONDARY,
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
          </div>

          <input
            ref={hiddenFileInput}
            className="p-2"
            type="file"
            name="logo"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={(e) => uploadLogoHandler(e.target.files[0])}
          />
          <TextField
            fullWidth
            value={logo ? logo.split('/').pop() : null}
            placeholder="No file Chosen"
            style={{
              '& .MuiInputBase-root': {
                fontSize: '15px',
                height: '40px'
              }
            }}
          />
          <FormLabel style={{ fontSize: '13px', fontWeight: 'bold' }}>
            Name
          </FormLabel>
          <TextField
            fullWidth
            type="text"
            name="catalog"
            value={formik.values.catalog}
            placeholder="catalog"
            onChange={formik.handleChange}
            error={formik.touched.catalog && Boolean(formik.errors.catalog)}
            helperText={formik.touched.catalog && formik.errors.catalog}
            maxLength={40}
            style={{
              '& .MuiInputBase-root': {
                fontSize: '15px',
                height: '40px'
              }
            }}
          />
          <FormLabel
            style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '10px' }}
          >
            Category
          </FormLabel>
          <TextField
            select
            fullWidth
            value={formik.values.category}
            placeholder="Category"
            onChange={formik.handleChange}
            error={formik.touched.category && Boolean(formik.errors.category)}
            helperText={formik.touched.category && formik.errors.category}
            name="category"
            style={{
              '& .MuiInputBase-root': {
                fontSize: '15px',
                height: '40px'
              }
            }}
          >
            {catagoryList &&
              catagoryList.map((item, i) => (
                <MenuItem key={i} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
          </TextField>
          <FormLabel
            style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '10px' }}
          >
            SubCategory
          </FormLabel>
          <TextField
            select
            fullWidth
            value={formik.values.subCategory}
            placeholder="SubCategory"
            onChange={formik.handleChange}
            error={
              formik.touched.subCategory && Boolean(formik.errors.subCategory)
            }
            helperText={formik.touched.subCategory && formik.errors.subCategory}
            name="subCategory"
            style={{
              '& .MuiInputBase-root': {
                fontSize: '15px',
                height: '40px'
              }
            }}
          >
            {subCatagory &&
              subCatagory.map((subCatagory) => (
                <MenuItem value={subCatagory?.value}>
                  {subCatagory?.label}
                </MenuItem>
              ))}
          </TextField>
          <FormLabel
            style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '10px' }}
          >
            Visibility
          </FormLabel>
          <TextField
            select
            fullWidth
            value={formik.values.visibility}
            placeholder="visibility"
            onChange={formik.handleChange}
            error={
              formik.touched.visibility && Boolean(formik.errors.visibility)
            }
            helperText={formik.touched.visibility && formik.errors.visibility}
            name="visibility"
            style={{
              '& .MuiInputBase-root': {
                fontSize: '15px',
                height: '40px'
              }
            }}
          >
            <MenuItem value="Customer">Customer</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="Restricted">Restricted</MenuItem>
            <MenuItem value="Everyone">Everyone</MenuItem>
          </TextField>
          {state.type === 'create' ? (
            ''
          ) : (
            <>
              <FormLabel
                style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  marginTop: '10px'
                }}
              >
                Status
              </FormLabel>
              <TextField
                select
                fullWidth
                value={formik.values.status}
                placeholder="Status"
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
                name="status"
                style={{
                  '& .MuiInputBase-root': {
                    fontSize: '15px',
                    height: '40px'
                  }
                }}
              >
                {statusList &&
                  statusList.map((item) => (
                    <MenuItem value={item.value} key={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
              </TextField>
            </>
          )}
          <FormLabel
            style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '10px' }}
          >
            Type
          </FormLabel>
          <TextField
            select
            fullWidth
            value={formik.values.categoryType}
            placeholder="CategoryType"
            onChange={formik.handleChange}
            error={
              formik.touched.categoryType && Boolean(formik.errors.categoryType)
            }
            helperText={
              formik.touched.categoryType && formik.errors.categoryType
            }
            name="categoryType"
            style={{
              '& .MuiInputBase-root': {
                fontSize: '15px',
                height: '40px'
              }
            }}
          >
            {catalogType.map((o) => (
              <MenuItem value={o.value}>{o.label}</MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                name="exportToChatbot"
                checked={formik.values.exportToChatbot}
                onChange={formik.handleChange}
                error={
                  formik.touched.exportToChatbot &&
                  Boolean(formik.errors.exportToChatbot)
                }
                helperText={
                  formik.touched.exportToChatbot &&
                  formik.errors.exportToChatbot
                }
                size="small"
              />
            }
            label={
              <Typography
                style={{ fontSize: '11px' }}
                color="textSecondary"
                fontWeight="500"
              >
                Enable to Chatbot
              </Typography>
            }
          />
        </Box>
      </form>
    </Dialog>
  );
};
