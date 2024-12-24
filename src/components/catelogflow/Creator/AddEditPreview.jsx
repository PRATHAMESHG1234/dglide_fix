// /* eslint-disable no-fallthrough */
// /* eslint-disable default-case */

// import { useEffect, useState } from 'react';
// import './AddEditPreview.css';
// import 'react-quill/dist/quill.snow.css';
// import {
//   Autocomplete,
//   FormControlLabel,
//   FormLabel,
//   MenuItem,
//   Select,
//   Switch,
//   Tooltip,
//   Typography
// } from '@mui/material';
// import TextArea from '../../../elements/CreatorTextArea';
// import RadioField from '../../../elements/CreatorRadioField';
// import SelectField from '../../../elements/CreatorSelectField';
// import MultipleSelect from '../../../elements/CreatorMultiSelect';
// import CheckboxField from '../../../elements/CreatorCheckboxField';
// import TextField from '../../../elements/CreatorTextField';
// import { COLORS } from '../../../common/constants/styles';
// import ReactQuill, { Quill } from 'react-quill';
// import InfoIcon from '@mui/icons-material/Info';
// import { fetchCreatorLookupValues, fetchFieldLookupValues } from '../../../services/catalogFlow';
// import CreatorAddAttachment from '../../catelogflow/Creator/CreatorAddAttachment';
// import { Textarea } from '@mui/joy';
// import CreatorSinglAttchment from './CreatorSinglAttchment';
// import RequestDefaultAttachment from './RequestDefaultAttchment';
// import { fetchRecordbyFormName } from '../../../services/table';
// const NUMERIC_REGEX = /^[0-9-]+$/;

// const AddEditPreview = ({
//   formId,
//   fieldData,
//   onSubmit,
//   recursivData,
//   attachmentpanelFlag,
//   recordId,
//   catagoryType,
//   setAllAttachment,
//   setBehalfUserData
// }) => {
//   // console.log("recursivData", recursivData)
//   // console.log("fieldData", fieldData)
//   // const { currentForm, selectedRecordId } = useSelector(
//   //   (state) => state.current
//   // );
//   const [formObj, setFormObj] = useState({});
//   const [mandetoryField, setMandetoryField] = useState([]);
//   const [visibleItem, setVisibleItem] = useState({});
//   // const [refField, setRefField] = useState({
//   //   open: false,
//   //   formId: 0,
//   //   label: "",
//   //   fieldName: "",
//   // });
//   const [fields, setFields] = useState([]);
//   const [attachmentList, setAttachmentList] = useState([]);
//   const [previewListData, setPreviewListData] = useState({});
//   const [error, setError] = useState("");
//   const [onClickSubmit, setOnClickSubmit] = useState(false);
//   const [defaultAttacment, setDefaultAttacment] = useState([])
//   const [onBehalfUser, setOnBehalfUser] = useState(true);
//   const [customerList, setCustomerList] = useState([])

//   const Toolkit = {
//     toolbar: [
//       [{ header: [1, false, 2, 3, 4, 5, 6] }],
//       [{ size: ['small', false, 'large', 'huge'] }],
//       [{ font: [] }],

//       ['bold', 'italic', 'underline', 'strike'],
//       ['blockquote', 'code-block'],
//       ['link', 'image', 'video'],

//       [{ list: 'ordered' }, { list: 'bullet' }],
//       [{ script: 'sub' }, { script: 'super' }],
//       [{ indent: '-1' }, { indent: '+1' }],
//       [{ direction: 'rtl' }],

//       [{ color: [] }, { background: [] }],
//       [{ align: [] }],

//       ['clean']
//     ],
//     clipboard: {
//       matchVisual: false
//     },
//     imageResize: {
//       parchment: Quill.import('parchment'),
//       modules: ['Resize', 'DisplaySize']
//     }
//   };
//   function pushChildren(obj, arr, childArr, prop) {
//     childArr = obj?.child;
//     if (obj[prop]?.length > 0) {
//       childArr.forEach((elem) => {
//         fieldData.forEach((o) => {
//           if (o.name === elem.name) {
//             arr.push(o);
//           }
//         });
//       });
//       for (const childQue of obj[prop]) {
//         pushChildren(childQue, arr, childArr, prop); // Recursively push children
//       }
//       childArr = [];
//     }
//   }

//   const QuestionAnsList = (fieldDataa) => {
//     let updatedIndexedArr = [];
//     let childArr = [];
//     for (const obj of recursivData) {
//       updatedIndexedArr.push(obj);
//       pushChildren(obj, updatedIndexedArr, childArr, 'child');
//     }
//     // setFields(updatedIndexedArr);
//     fetchFieldLookupValues(updatedIndexedArr, null).then((result) => {
//       setFields(result);
//     });
//     // setFields(fieldDataa);
//     let getAttchment = [];
//     const newObj = JSON.parse(JSON.stringify(fieldDataa));
//     let uniqueArr;
//     let QueAnsObj = {};
//     let mandetoryFieldList = []
//     let copyOfFormObj = Object.assign({}, formObj);

//     for (const obj of newObj) {
//       if (obj.mandatory === true) {
//         mandetoryFieldList.push(obj)
//       }
//       if (obj.defaultText) {
//         copyOfFormObj[obj.name] = obj.defaultText
//         setFormObj(copyOfFormObj)
//       }
//       setMandetoryField(mandetoryFieldList)

//       let fieldName = obj.name;
//       if (obj?.condition) {
//         let childArr = [];

//         for (const item of obj?.condition) {
//           if (item?.fieldName) {
//             childArr.push(...item?.fieldName);
//           }
//         }
//         uniqueArr = [...new Set(childArr)];
//         QueAnsObj[fieldName] = uniqueArr;
//       } else {
//         QueAnsObj[fieldName] = [];
//       }
//       if (obj?.category === 'Attachment') {
//         getAttchment.push(obj);
//         setAttachmentList(getAttchment);
//       }
//     }
//     // console.log(QueAnsObj)
//     setPreviewListData(QueAnsObj);
//   };

//   useEffect(() => {
//     QuestionAnsList(fieldData);
//   }, [fieldData]);

//   const onFormValueChanged = (e, field) => {

//     let attachmentArray = []
//     if (e === 'attachment') {
//       field.forEach(elem => {
//         attachmentArray.push(elem?.uploadResult[0])
//       });
//       setDefaultAttacment(field)
//       setAllAttachment(attachmentArray)
//     } else {
//       const name = e.target.name;
//       let value = e.target.value;
//       if (
//         field.type === 'number' &&
//         field?.dataType !== 'Float' &&
//         value !== '' &&
//         !NUMERIC_REGEX.test(value)
//       ) {
//         return;
//       }

//       const type = e.target.type ? e.target.type : field.type;
//       let obj = Object.assign({}, formObj);
//       if (field.type === 'switch') {
//         obj[name] = e.target.checked;
//       } else if (type === 'checkbox') {
//         // Handle checkbox fields
//         let objData = obj[name];
//         if (objData) {
//           objData = objData.split(',');
//         } else {
//           objData = [];
//         }
//         value = e.target.checked;

//         // Update the array of selected values based on checkbox state
//         if (value === false) {
//           if (objData.indexOf(e.target.value) !== -1) {
//             objData.splice(objData.indexOf(e.target.value), 1);
//           }
//         } else {
//           if (objData.indexOf(e.target.value) === -1) {
//             objData.push(e.target.value);
//           }
//         }
//         obj[name] = objData.join(',');
//       } else if (type === 'select' && field.variant === 'multiple') {
//         // Handle multiple-select fields
//         const selectedOptions = Array.from(
//           e.target.selectedOptions,
//           (option) => option.value
//         );
//         obj[name] = selectedOptions.join(',');
//       } else if (type === 'file') {
//         obj[field?.name] = field?.attachmentFile;
//       } else {
//         // Handle other field types
//         obj[name] = value;
//       }

//       let selectedValues = obj[name];
//       let visibleData = Object.assign({}, visibleItem);
//       if (field.type === 'switch') {
//         let option = field?.options?.filter((o) => o.value === selectedValues);
//         if (option.length > 0) {
//           option = option[0];
//         }
//         let condition = field.condition?.filter(
//           (o) => o.value === option.optionId
//         );
//         if (condition.length > 0) {
//           condition = condition[0];
//         }
//         visibleData[field.name] = condition.fieldName;
//       } else if (field?.options) {
//         for (const item of selectedValues.split(',')) {
//           let option = field?.options?.filter((o) => o.label === item);
//           if (option.length > 0) {
//             option = option[0];
//           }
//           let condition = field.condition?.filter(
//             (o) => o.value === option.optionId
//           );
//           if (condition.length > 0) {
//             condition = condition[0];
//           }
//           visibleData[field.name] = condition.fieldName;
//         }
//       } else {
//         visibleData[field.name] = selectedValues;
//       }
//       setVisibleItem(visibleData);
//       setFormObj(obj);

//       makeDependentCall(field.type, field.field_name, value);
//     }
//   };

//   const submitHandler = (e) => {
//     setOnClickSubmit(true)
//     e.preventDefault();
//     const transformedObj = {};
//     for (const key in formObj) {
//       if (Object.prototype.hasOwnProperty.call(formObj, key)) {
//         for (const elem of fields) {
//           if (elem.name === key) {
//             const newKey = elem.field_name
//               .split('_')
//               .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//               .join(' ');
//             transformedObj[newKey] = formObj[key];
//           }
//         }
//       }
//     }
//     if (attachmentpanelFlag === true) {
//       transformedObj[`case:attachment`] = defaultAttacment
//     }

//     const missingFields = mandetoryField.filter(element => {
//       return !Object.keys(formObj).includes(element.name);
//     });
//     if (missingFields.length < 1) {
//       onSubmit(transformedObj);
//     }
//   };

//   const makeDependentCall = (type, label, selectedValue) => {
//     const newFields = fields?.filter(
//       (fld) => fld.category === 'Reference' || fld.category === 'Lookup'
//     );

//     newFields?.forEach((field) => {
//       field?.lookup?.conditions?.forEach((condition) => {
//         if (
//           condition.dependent &&
//           condition.value.toLowerCase() === label.toLowerCase()
//         ) {
//           const payloadObj = {
//             conditions: [
//               {
//                 dependent: condition.dependent,
//                 fieldInfoId: condition.fieldInfoId,
//                 operator: condition.operator,
//                 value: condition.value
//               }
//             ],
//             dependent: condition.dependent,
//             fieldInfoId: field?.lookup?.fieldInfoId,
//             filter: { [label.toLowerCase()]: selectedValue },
//             formInfoId: field?.lookup?.formInfoId,
//             grid: false,
//             requestFieldType: type.toLowerCase(),
//             responseFieldType: field.type.toLowerCase()
//           };
//           fetchDependentReferenceLookupValues(field, payloadObj);
//         } else if (condition.dependent === false) {
//           const payloadObj = {
//             conditions: [
//               {
//                 dependent: condition.dependent,
//                 fieldInfoId: condition.fieldInfoId,
//                 operator: condition.operator,
//                 value: condition.value
//               }
//             ],
//             dependent: condition.dependent,
//             fieldInfoId: field?.lookup?.fieldInfoId,
//             filter: { [label.toLowerCase()]: selectedValue },
//             formInfoId: field?.lookup?.formInfoId,
//             grid: false,
//             requestFieldType: type.toLowerCase(),
//             responseFieldType: type.toLowerCase()
//           };
//           fetchDependentReferenceLookupValues(field, payloadObj);
//         }
//       });
//     });
//   };

//   const fetchDependentReferenceLookupValues = async (field, payload) => {

//     if (field.dependent) {
//       if (field.category === 'Reference') {
//         const response = await fetchCreatorLookupValues(
//           payload
//         );
//         const data = await response?.result;

//         const newFields = fields?.map((f) => {
//           if (f.name === field.name) {
//             return {
//               ...f,
//               referenceDropdownData: data
//             };
//           }
//           return f;
//         });

//         QuestionAnsList([...newFields]);
//       }
//       if (field.category === 'Lookup') {
//         const response = await fetchCreatorLookupValues(
//           payload
//         );
//         const data = await response?.result;

//         const newFields = fields?.map((f) => {
//           if (f.name === field.name) {
//             return {
//               ...f,
//               lookupDropdownData: data
//             };
//           }
//           return f;
//         });
//         QuestionAnsList([...newFields]);
//       }
//     }
//   };

//   const onReactQuillValueChanged = (content, e, field) => {
//     const name = field.name;
//     let obj = { ...formObj };
//     obj[name] = content;
//     setFormObj(obj);
//   };

//   const dependentField = (field) => {
//     const urlRegex = /(https?:\/\/[^\s]+)/g;
//     let newUrl;
//     if (field?.instruction) {
//       newUrl = field?.instruction.match(urlRegex)?.[0];
//     }
//     let visible = true;
//     // console.log("previewListData", previewListData)
//     for (const key in previewListData) {
//       const element = previewListData[key];
//       if (element && element.indexOf(field.name) !== -1) {
//         visible = false;
//       }
//     }
//     for (const key in visibleItem) {
//       const element = visibleItem[key];
//       if (element && element.indexOf(field.name) !== -1) {
//         visible = true;
//       }
//     }
//     if (visible) {
//       switch (field.type) {
//         case 'text':
//         case 'number':
//         case 'password':
//           return (
//             <div className="flex mb-4">
//               <TextField
//                 key={field.name}
//                 labelname={field.label}
//                 id="outlined-basic"
//                 variant="outlined"
//                 submitFlag={onClickSubmit}
//                 name={field.name}
//                 regex={field.validation}
//                 maxLength={field?.length}
//                 type={field.type}
//                 required={field.mandatory}
//                 value={formObj[field.name] || ''}
//                 onChange={(e) => onFormValueChanged(e, field)}
//                 inputProps={{
//                   autoComplete: 'new-password'
//                 }}
//                 sx={{
//                   '& .MuiInputBase-root': {
//                     height: '30px',
//                     width: '100%',
//                     fontSize: '13px'
//                   },
//                   bgcolor: COLORS.WHITE
//                 }}
//                 fieldstyle={{
//                   width: field.readOnly ? '100%' : '730px',
//                   minWidth: field.readOnly ? '100%' : '200px',
//                 }}
//               />
//               {field?.instruction && (
//                 <Tooltip
//                   title={
//                     <a
//                       href={newUrl}
//                       target="blank"
//                       style={{
//                         color: '#dee2e6',
//                         fontSize: '13px'
//                       }}
//                     >
//                       {field?.instruction}
//                     </a>
//                   }
//                   arrow
//                 >
//                   <InfoIcon
//                     sx={{ color: COLORS.GRAY, cursor: 'pointer' }}
//                   ></InfoIcon>
//                 </Tooltip>
//               )}
//             </div>
//           );

//         case 'date':
//           return (
//             <div className="flex mb-4">
//               <TextField
//                 key={field.name}
//                 labelname={field.label}
//                 submitFlag={onClickSubmit}
//                 id="outlined-basic"
//                 variant="outlined"
//                 name={field.name}
//                 type={field.variant === 'DateTime' ? 'datetime-local' : 'date'}
//                 required={field.mandatory}
//                 value={
//                   field.variant === 'DateTime' && formObj[field.name]
//                     ? formObj[field.name] || ""
//                     : formObj[field.name]?.split('T')[0] || ""
//                 }
//                 onChange={(e) => onFormValueChanged(e, field)}
//                 sx={{
//                   '& .MuiInputBase-root': {
//                     height: '30px',
//                     fontSize: '13px',
//                     width: "100%"
//                   },
//                   bgcolor: COLORS.WHITE
//                 }}
//                 fieldstyle={{
//                   width: '730px',
//                   minWidth: '200px',
//                 }}
//               />
//               {field?.instruction && (
//                 <Tooltip
//                   title={
//                     <a
//                       href={newUrl}
//                       target="blank"
//                       style={{
//                         color: '#dee2e6',
//                         fontSize: '13px'
//                       }}
//                     >
//                       {field?.instruction}
//                     </a>
//                   }
//                   arrow
//                 >
//                   <InfoIcon
//                     sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
//                   ></InfoIcon>
//                 </Tooltip>
//               )}
//             </div>
//           );

//         case 'textarea':
//           if (!field.variant || field.variant.toLowerCase() === 'plaintext') {
//             return (
//               <div className="flex  flex-col -reverse mb-4">
//                 {field.readOnly === true ? (
//                   <div className="input-wrapper flex  flex-col ">
//                     <FormLabel
//                       sx={{
//                         fontSize: '13px',
//                         fontWeight: 'bold',
//                         marginBottom: '8px'
//                       }}
//                     >
//                       {field.label}
//                     </FormLabel>
//                     <Textarea
//                       name={field.name}
//                       labelname={field.label}
//                       variant="plain"
//                       value={decodeURIComponent(field.readOnlyText)}
//                       readOnly={field.readOnly}
//                     />
//                   </div>
//                 ) : (
//                   <TextArea
//                     key={field.name}
//                     labelname={field.label}
//                     submitFlag={onClickSubmit}
//                     id={field.name}
//                     minRows={4}
//                     maxRows={4}
//                     type={field.type}
//                     name={field.name}
//                     required={field.mandatory}
//                     maxcharacter={field?.length}
//                     value={
//                       field.readOnly === true
//                         ? field.readOnlyText
//                         : formObj[field.name] || ''
//                     }
//                     onChange={(e) => onFormValueChanged(e, field)}
//                     fieldstyle={{
//                       minWidth: '200px',
//                       width: '98%',
//                       // height: '150px'
//                     }}
//                   />
//                 )}
//                 {field?.instruction && (
//                   <Tooltip
//                     title={
//                       <a
//                         href={newUrl}
//                         target="blank"
//                         style={{
//                           color: '#dee2e6',
//                           fontSize: '13px'
//                         }}
//                       >
//                         {field?.instruction}
//                       </a>
//                     }
//                     arrow
//                   >
//                     <InfoIcon
//                       sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
//                     ></InfoIcon>
//                   </Tooltip>
//                 )}
//               </div>
//             );
//           } else {
//             return (
//               <div className="ReactQuill flex  flex-col  reactQuillExtra mb-4 ">
//                 <FormLabel sx={{ fontSize: '13px', fontWeight: 'bold' }}>
//                   {field.label}
//                   {field.mandatory && <span className="text-danger"> *</span>}
//                 </FormLabel>

//                 <ReactQuill
//                   theme="snow"
//                   value={formObj[field.name] || ''}
//                   onChange={(content, e) => {
//                     onReactQuillValueChanged(content, e, field);
//                   }}
//                   modules={Toolkit}
//                   placeholder="Enter..."
//                   style={{ width: '100%', height: '200px' }}
//                 />

//                 {field?.instruction && (
//                   <Tooltip
//                     title={
//                       <a
//                         href={newUrl}
//                         target="blank"
//                         style={{
//                           color: '#dee2e6',
//                           fontSize: '13px'
//                         }}
//                       >
//                         {field?.instruction}
//                       </a>
//                     }
//                     arrow
//                   >
//                     <InfoIcon
//                       sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
//                     ></InfoIcon>
//                   </Tooltip>
//                 )}
//               </div>
//             );
//           }

//         case 'radio':
//           if (!formObj[field.name]) {
//             const defaultValueOption = field.options?.find(
//               (option) => option.default
//             );
//             if (defaultValueOption) {
//               formObj[field.name] = defaultValueOption.value;
//             }
//           }
//           return (
//             <div className="flex mb-4">
//               <RadioField
//                 key={field.name}
//                 submitFlag={onClickSubmit}
//                 labelname={field.label}
//                 value={formObj[field.name] || ''}
//                 name={field.name}
//                 required={field.mandatory}
//                 onChange={(e) => onFormValueChanged(e, field)}
//                 options={field.options}
//                 fieldstyle={{
//                   width: '20vw'
//                   // minWidth: "100%",
//                 }}
//               />
//               {field?.instruction && (
//                 <Tooltip
//                   title={
//                     <a
//                       href={newUrl}
//                       target="blank"
//                       style={{
//                         color: '#dee2e6',
//                         fontSize: '13px'
//                       }}
//                     >
//                       {field?.instruction}
//                     </a>
//                   }
//                   arrow
//                 >
//                   <InfoIcon
//                     sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
//                   ></InfoIcon>
//                 </Tooltip>
//               )}
//             </div>
//           );

//         case 'select':
//           if (!formObj[field.name]) {
//             const defaultValueOption = field.options?.find(
//               (option) => option.default
//             );
//             if (defaultValueOption) {
//               formObj[field.name] = defaultValueOption.value;
//             }
//           }
//           if (!field.variant || field.variant.toLowerCase() === 'single') {
//             return (
//               <div className="flex mb-4">
//                 <SelectField
//                   key={field.name}
//                   labelname={field.label}
//                   submitFlag={onClickSubmit}
//                   name={field.name}
//                   value={formObj[field.name]}
//                   required={field.mandatory}
//                   onChange={(e) => onFormValueChanged(e, field)}
//                   options={field.options}
//                   fieldstyle={{
//                     width: '730px',
//                     minWidth: '200px',
//                     // maxWidth: '320px',
//                     marginBottom: '10px'
//                   }}
//                 />
//                 {field?.instruction && (
//                   <Tooltip
//                     title={
//                       <a
//                         href={newUrl}
//                         target="blank"
//                         style={{
//                           color: '#dee2e6',
//                           fontSize: '13px'
//                         }}
//                       >
//                         {field?.instruction}
//                       </a>
//                     }
//                     arrow
//                   >
//                     <InfoIcon
//                       sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
//                     ></InfoIcon>
//                   </Tooltip>
//                 )}
//               </div>
//             );
//           } else if (field.variant.toLowerCase() === 'multiple') {
//             return (
//               <div className="flex mb-4">
//                 <MultipleSelect
//                   key={field.name}
//                   labelname={field.label}
//                   name={field.name}
//                   value={
//                     formObj[field.name]
//                       ? formObj[field.name]?.toString().split(',')
//                       : []
//                   }
//                   onChange={(e) => onFormValueChanged(e, field)}
//                   options={field.options}
//                   required={field.mandatory}
//                   fieldstyle={{
//                     width: '730px',
//                     minWidth: '200px',
//                     maxWidth: '320px',
//                     marginBottom: '10px'
//                   }}
//                 />
//                 {field?.instruction && (
//                   <Tooltip
//                     title={
//                       <a
//                         href={newUrl}
//                         target="blank"
//                         style={{
//                           color: '#dee2e6',
//                           fontSize: '13px'
//                         }}
//                       >
//                         {field?.instruction}
//                       </a>
//                     }
//                     arrow
//                   >
//                     <InfoIcon
//                       sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
//                     ></InfoIcon>
//                   </Tooltip>
//                 )}
//               </div>
//             );
//           }

//         case 'checkbox':
//           if (!formObj[field.name]) {
//             const defaultValueOption = field.options?.find(
//               (option) => option.default
//             );
//             if (defaultValueOption) {
//               formObj[field.name] = defaultValueOption.value;
//             }
//           }
//           return (
//             <div className="flex mb-4" key={field.name}>
//               <CheckboxField
//                 labelname={field.label}
//                 name={field.name}
//                 submitFlag={onClickSubmit}
//                 options={field.options}
//                 required={field.mandatory}
//                 checkedLabel={formObj[field.name]}
//                 onChange={(e) => onFormValueChanged(e, field)}
//               />
//               {field?.instruction && (
//                 <Tooltip
//                   title={
//                     <a
//                       href={newUrl}
//                       target="blank"
//                       style={{
//                         color: '#dee2e6',
//                         fontSize: '13px'
//                       }}
//                     >
//                       {field?.instruction}
//                     </a>
//                   }
//                   arrow
//                 >
//                   <InfoIcon
//                     sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
//                   ></InfoIcon>
//                 </Tooltip>
//               )}
//             </div>
//           );
//         case 'lookup':
//           return (
//             <div className="flex mb-4">
//               <SelectField
//                 key={field.name}
//                 labelname={field.label}
//                 name={field.name}
//                 submitFlag={onClickSubmit}
//                 value={formObj[field.name]}
//                 required={field.mandatory}
//                 onChange={(e) => onFormValueChanged(e, field)}
//                 options={field.lookupDropdownData}
//                 fieldstyle={{
//                   width: '730px',
//                   minWidth: '200px',
//                   // maxWidth: '320px',
//                   marginBottom: '10px'
//                 }}
//               />
//               {field?.instruction && (
//                 <Tooltip
//                   title={
//                     <a
//                       href={newUrl}
//                       target="blank"
//                       style={{
//                         color: '#dee2e6',
//                         fontSize: '13px'
//                       }}
//                     >
//                       {field?.instruction}
//                     </a>
//                   }
//                   arrow
//                 >
//                   <InfoIcon
//                     sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
//                   ></InfoIcon>
//                 </Tooltip>
//               )}
//             </div>
//           );

//         case 'reference':
//           if (
//             (formId === "reference" || formId === "reference-modal") &&
//             currentForm?.name === field.lookup?.formName
//           ) {
//             return null;
//           }
//           if (field.variant === 'Dropdown') {
//             return (<div className="mb-5">
//               <div className="flex mb-1">
//                 <Autocomplete
//                   disablePortal
//                   id={`autocomplete-${field.name}`}
//                   options={field.referenceDropdownData || []}
//                   value={field.referenceDropdownData?.find(
//                     (option) => option.value === formObj[field.name]
//                   )}
//                   name={field.name}
//                   getOptionLabel={(option) =>
//                     option.label ? option.label : ''
//                   }
//                   onChange={(event, newValue) => {
//                     const syntheticEvent = {
//                       target: {
//                         name: field.name,
//                         value: newValue ? newValue.value : ''
//                       }
//                     };
//                     onFormValueChanged(syntheticEvent, field);
//                   }}
//                   renderInput={(params) => (
//                     <TextField
//                       labelname={
//                         <Typography style={{
//                           color: COLORS.SECONDARY,
//                           fontSize: '13px',
//                           fontWeight: 500
//                         }}>
//                           {field.label}
//                           {field.mandatory && <span style={{ color: 'red' }}> *</span>}
//                         </Typography>
//                       }
//                       fullWidth
//                       {...params}
//                       variant="outlined"
//                       placeholder=""
//                       sx={{
//                         '& .MuiInputBase-root': {
//                           width: "100%",
//                           height: '30px',
//                           fontSize: '13px',
//                           p: 0,
//                           px: 1
//                         },
//                         bgcolor: COLORS.WHITE
//                       }}
//                       fieldstyle={{
//                         width: '730px',
//                         minWidth: '200px',
//                         // maxWidth: '320px'
//                       }}
//                       {...params}
//                     />
//                   )}
//                 />
//                 {field?.instruction && (
//                   <Tooltip
//                     title={
//                       <a
//                         href={newUrl}
//                         target="blank"
//                         style={{
//                           color: '#dee2e6',
//                           fontSize: '13px'
//                         }}
//                       >
//                         {field?.instruction}
//                       </a>
//                     }
//                     arrow
//                   >
//                     <InfoIcon
//                       sx={{ color: COLORS.SECONDARY, cursor: 'pointer' }}
//                     ></InfoIcon>
//                   </Tooltip>
//                 )}
//               </div>
//               {!formObj[field.name] && field.mandatory && onClickSubmit && (
//                 <Typography className="error" sx={{ height: "15px" }}>
//                   {`${field.label}
//           field can't be empty..!`}
//                 </Typography>
//               )}
//             </div>);
//           }
//         case 'switch':
//           return (
//             <FormControlLabel
//               name={field.name}
//               type={field.type}
//               control={
//                 <Switch
//                   checkedLabel={formObj[field.name]}
//                   color="secondary"
//                   size="medium"
//                 />
//               }
//               onChange={(e) => onFormValueChanged(e, field)}
//               label={field?.label}
//             />
//           );
//         // case "file":
//         //   return (
//         //     <CreatorSinglAttchment
//         //       selectedRecordId={recordId ? recordId : null}
//         //     />
//         //   )
//       }
//     }
//   };
//   const onBehalfCustomer = async (e) => {
//     setOnBehalfUser(e.target.checked)
//     if (!e.target.checked) {
//       const customerResult = await fetchRecordbyFormName("system_user", {
//         "sort": [],
//         "where": []
//       })
//       setCustomerList(customerResult?.result)
//     }
//   }
//   return (
//     <>
//       <form id={formId} onSubmit={submitHandler}>
//         <div className="flex  flex-col     items-center    justify-between py-1 p-3 mt-2">
//           <FormControlLabel
//             name="onBehalfUser"
//             // type={field.type}
//             control={
//               <Switch
//                 // checkedLabel={formObj[field.name]}
//                 color="secondary"
//                 size="medium"
//                 defaultChecked
//               />
//             }
//             onChange={(e) => onBehalfCustomer(e)}
//             label="Would like to Submit request for you?"
//           />
//           {
//             !onBehalfUser && (
//               <Select
//                 labelname="wewew"
//                 name="customer"
//                 // value={formObj[field.name]}
//                 required
//                 onChange={(e) => setBehalfUserData(e.target.value)}
//                 sx={{ height: "30px" }}
//                 fieldstyle={{
//                   width: '20vw',
//                   minWidth: '200px',
//                   maxWidth: '320px',
//                   marginBottom: '10px'
//                 }}
//               >
//                 {customerList && customerList.map((user) => (
//                   <MenuItem value={user?.uuid}>{user.user_name}</MenuItem>
//                 ))
//                 }

//               </Select>
//             )
//           }
//           {fields &&
//             fields?.length > 0 &&
//             fields
//               // ?.filter((field) => field.category !== "AutoIncrement")
//               .map((field, index) => (
//                 <>
//                   <div className="" key={index}>
//                     {dependentField(field)}
//                   </div>
//                 </>
//               ))}
//         </div>
//         {attachmentList.length > 0 && (
//           <CreatorSinglAttchment
//             attachmentFieldList={attachmentList}
//             handleAttachFile={onFormValueChanged}
//           //  selectedRecordId={recordId ? recordId : null}
//           />
//         )}
//         {catagoryType === 'Document Type' && (
//           <CreatorAddAttachment
//             field="attachment"
//             selectedRecordId={recordId ? recordId : null}
//             catlogFlag="DocumentType"
//           />
//         )}
//         {attachmentpanelFlag && (
//           <RequestDefaultAttachment
//             // selectedRecordId={recordId ? recordId : null}
//             catlogFlag="catlogFlagTrue"
//             handleAttachFile={onFormValueChanged}
//           />
//         )}
//       </form>
//     </>
//   );
// };

// export default AddEditPreview;
