import { useEffect, useState } from 'react';
import QuestionComponent from './QuestionComponents';
import CreatorSinglAttchment from './CreatorSinglAttchment';
import CreatorAddAttachment from './CreatorAddAttachment';
import RequestDefaultAttachment from './RequestDefaultAttchment';
import {
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  Switch
} from '@mui/material';
import { fetchRecordbyFormName } from '../../../services/table';
import { COLORS } from '../../../common/constants/styles';

const Questionnaire = ({
  formId,
  fieldList,
  questions,
  onSubmit,
  attachmentpanelFlag,
  setBehalfUserData,
  catagoryType,
  setAllAttachment,
  recordId
}) => {
  const [onClickSubmit, setOnClickSubmit] = useState(false);
  const [defaultAttacment, setDefaultAttacment] = useState([]);
  const [onBehalfUser, setOnBehalfUser] = useState(true);
  const [customerList, setCustomerList] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [mandetoryField, setMandetoryField] = useState([]);

  // const [formObj, setFormObj] = useState({});
  const NUMERIC_REGEX = /^[0-9-]+$/;

  useEffect(() => {
    let mandetoryFieldList = [];
    let copyOfFormObj = Object.assign({}, formObj);
    let getAttchment = [];

    const newObj = JSON.parse(JSON.stringify(fieldList));
    for (const obj of newObj) {
      if (obj.mandatory === true) {
        mandetoryFieldList.push(obj);
      }
      setMandetoryField(mandetoryFieldList);

      if (obj.defaultText) {
        copyOfFormObj[obj.name] = obj.defaultText;
        setFormObj(copyOfFormObj);
      }

      if (obj?.category === 'Attachment') {
        getAttchment.push(obj);
        setAttachmentList(getAttchment);
      }
    }
  }, [fieldList]);

  const [formObj, setFormObj] = useState(
    questions.reduce((acc, question) => {
      acc[question.name] = '';
      if (question.child) {
        question.child.forEach((child) => {
          acc[child.name] = '';
        });
      }
      return acc;
    }, {})
  );
  const onBehalfCustomer = async (e) => {
    setOnBehalfUser(e.target.checked);
    if (!e.target.checked) {
      const customerResult = await fetchRecordbyFormName('system_user', {
        sort: [],
        where: []
      });
      setCustomerList(customerResult?.result);
    }
  };
  const handleChange = (e, field) => {
    let attachmentArray = [];
    if (e === 'attachment') {
      field.forEach((elem) => {
        attachmentArray.push(elem?.uploadResult[0]);
      });
      setDefaultAttacment(field);
      setAllAttachment(attachmentArray);
    } else {
      const name = e.target.name;
      let value = e.target.value;
      if (
        field.type === 'number' &&
        field?.dataType !== 'Float' &&
        value !== '' &&
        !NUMERIC_REGEX.test(value)
      ) {
        return;
      }
      const type = e.target.type ? e.target.type : field.type;
      let obj = Object.assign({}, formObj);
      if (field.type === 'switch') {
        obj[name] = e.target.checked;
      } else if (type === 'checkbox') {
        // Handle checkbox fields
        let objData = obj[name];
        if (objData) {
          objData = objData.split(',');
        } else {
          objData = [];
        }
        value = e.target.checked;

        // Update the array of selected values based on checkbox state
        if (value === false) {
          if (objData.indexOf(e.target.value) !== -1) {
            objData.splice(objData.indexOf(e.target.value), 1);
          }
        } else {
          if (objData.indexOf(e.target.value) === -1) {
            objData.push(e.target.value);
          }
        }
        obj[name] = objData.join(',');
      } else if (type === 'select' && field.variant === 'multiple') {
        // Handle multiple-select fields
        const selectedOptions = Array.from(
          e.target.selectedOptions,
          (option) => option.value
        );
        obj[name] = selectedOptions.join(',');
      } else if (type === 'file') {
        obj[field?.name] = field?.attachmentFile;
      } else {
        // Handle other field types
        obj[name] = value;
      }
      setFormObj(obj);
    }
  };
  const submitHandler = (e) => {
    setOnClickSubmit(true);
    e.preventDefault();
    const transformedObj = {};
    for (const key in formObj) {
      if (Object.prototype.hasOwnProperty.call(formObj, key)) {
        for (const elem of fieldList) {
          if (elem.name === key) {
            const newKey = elem.field_name;
            transformedObj[newKey] = formObj[key];
          }
        }
      }
    }
    if (attachmentpanelFlag === true) {
      transformedObj[`case:attachment`] = defaultAttacment;
    }

    const missingFields = mandetoryField.filter((element) => {
      return !Object.keys(formObj).includes(element.name);
    });
    if (missingFields.length < 1) {
      onSubmit(transformedObj);
    }
  };
  return (
    <form id={formId} onSubmit={submitHandler}>
      <div className="mt-2 flex flex-col items-center justify-between p-3 py-1">
        <div className="flex items-center">
          <FormControlLabel
            name="onBehalfUser"
            // type={field.type}
            control={
              <Switch
                // checkedLabel={formObj[field.name]}
                color="secondary"
                size="medium"
                defaultChecked
                sx={{
                  mx: '0'
                }}
              />
            }
            onChange={(e) => onBehalfCustomer(e)}
          />
          <FormLabel sx={{ fontSize: '15px', fontWeight: 'bold' }}>
            Would like to Submit request for you?
          </FormLabel>
        </div>
        {!onBehalfUser && (
          <Select
            labelname="wewew"
            name="customer"
            // value={formObj[field.name]}
            required
            onChange={(e) => setBehalfUserData(e.target.value)}
            sx={{
              height: '30px',
              marginBottom: '18px',
              width: '98%',
              fontSize: '13px',
              bgcolor: COLORS.WHITE
            }}
            fieldstyle={{
              minWidth: '200px',
              width: '98%',
              marginBottom: '10px'
            }}
          >
            {customerList &&
              customerList
                .sort((a, b) => (a.user_name > b.user_name ? 1 : -1))
                .map((user) => (
                  <MenuItem value={user?.uuid}>{user.user_name}</MenuItem>
                ))}
          </Select>
        )}
        {questions.map((question) => (
          <QuestionComponent
            formId={formId}
            key={question.name}
            field={question}
            value={formObj[question.name]}
            formObj={formObj}
            onFormValueChanged={handleChange}
            onClickSubmit={onClickSubmit}
          />
        ))}
      </div>
      {attachmentList.length > 0 && (
        <CreatorSinglAttchment
          attachmentFieldList={attachmentList}
          handleAttachFile={handleChange}
        />
      )}
      {catagoryType === 'Document Type' && (
        <CreatorAddAttachment
          field="attachment"
          selectedRecordId={recordId ? recordId : null}
          catlogFlag="DocumentType"
        />
      )}
      {attachmentpanelFlag && (
        <RequestDefaultAttachment
          catlogFlag="catlogFlagTrue"
          handleAttachFile={handleChange}
        />
      )}
    </form>
  );
};
export default Questionnaire;
