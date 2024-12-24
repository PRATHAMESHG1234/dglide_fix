/* eslint-disable no-loop-func */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';
import { Send } from 'lucide-react';
import {
  FormControlLabel,
  IconButton,
  ListItem,
  Switch,
  Tooltip,
  Typography
} from '@mui/material';

import { colors, COLORS } from '../../common/constants/styles';
import { Button } from '@/componentss/ui/button';
import TextField from '../../elements/TextField';
import {
  fetchCatalogFlows,
  updateCatelogRequest
} from '../../redux/slices/catalogFlowSlice';
import {
  fetchCreatorLookupValues,
  fetchFieldLookupValues
} from '../../services/catalogFlow';
import './Chatbot.css';
import CreatorAddAttachment from '../catelogflow/Creator/CreatorAddAttachment';
import { Textarea } from '@mui/joy';
import CreatorSinglAttchment from '../catelogflow/Creator/CreatorSinglAttchment';
import { fetchRecords, updateTableRecord } from '../../services/table';
import MyRequestGridView from '../catelogflow/Creator/MyRequestGridView ';
// import { fetchRecords } from '../../redux/slices/tableSlice';
import { Paperclip } from 'lucide-react';
import RequestDefaultAttachment from '../catelogflow/Creator/RequestDefaultAttchment';
import { Box } from 'lucide-react';
import { X } from 'lucide-react';

let rootIndex = 0;

const MyChatbot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, currentTheme } = useSelector((state) => state.auth);
  const { tableData } = useSelector((state) => state.table);
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const countRef = useRef(0);
  const optionRef = useRef();
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [catalogData, setCatalogData] = useState({});
  // const [perentQuestionList, setPerentQuestionList] = useState([]);
  const [allFieldList, setAllFieldList] = useState([]);
  const [inputData, setInputData] = useState('');
  const [switchData, setSwitchData] = useState(false);
  const [chatbotData, setChatbotData] = useState({});
  const [userName, setUserName] = useState();
  const [questions, setQuestions] = useState([]);
  const [ticketCard, setTicketCard] = useState(false);
  const [ticketDetail, setTicketDetail] = useState({});
  const { catalogFlows } = useSelector((state) => state.catalogFlow);
  const [attachmentpanel, setAttachmentPanel] = useState(false);
  const [myReqestFlag, setMyReqestFlag] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const initialData = () => {
    if (currentUser) {
      setUserName(currentUser?.role?.name);
      let result = chatbotData?.menu_data2?.replace(
        '{UserName}',
        currentUser?.role?.name
      );
      let queObj = {
        id: 1,
        text: result,
        options: [
          'Log a new Ticket',
          'My tickets',
          'Service Catalog',
          'Product Catalog',
          'Search'
        ],
        answer: '',
        category: 'select'
      };
      setQuestions([queObj]);
    }
  };
  useEffect(() => {
    dispatch(fetchCatalogFlows());
    fetchRecords('system_menudata', {}).then((data) => {
      let responceList = data?.data;

      if (responceList) {
        responceList.forEach((elem) => {
          if (elem?.menu_type === 'Chatbot_Options') {
            setChatbotData(elem);
          }
        });
      }
    });
    initialData();
  }, []);

  useEffect(() => {
    initialData();
  }, [chatbotData]);
  // const [fields, setFields] = useState();

  const makeDependentCall = (type, label, selectedValue) => {
    const newFields = allFieldList?.filter(
      (fld) => fld.category === 'Reference' || fld.category === 'Lookup'
    );
    newFields?.forEach((field) => {
      field?.lookup?.conditions?.forEach((condition) => {
        if (
          condition.dependent &&
          condition.value.toLowerCase() === label.toLowerCase()
        ) {
          const payloadObj = {
            conditions: [
              {
                dependent: condition.dependent,
                fieldInfoId: condition.fieldInfoId,
                operator: condition.operator,
                value: condition.value
              }
            ],
            dependent: condition.dependent,
            fieldInfoId: field?.lookup?.fieldInfoId,
            filter: { [label.toLowerCase()]: selectedValue },
            formInfoId: field?.lookup?.formInfoId,
            grid: false,
            requestFieldType: type.toLowerCase(),
            responseFieldType: field.type.toLowerCase()
          };
          fetchDependentReferenceLookupValues(field, payloadObj);
        } else if (condition.dependent === false) {
          const payloadObj = {
            conditions: [
              {
                dependent: condition.dependent,
                fieldInfoId: condition.fieldInfoId,
                operator: condition.operator,
                value: condition.value
              }
            ],
            dependent: condition.dependent,
            fieldInfoId: field?.lookup?.fieldInfoId,
            filter: { [label.toLowerCase()]: selectedValue },
            formInfoId: field?.lookup?.formInfoId,
            grid: false,
            requestFieldType: type.toLowerCase(),
            responseFieldType: type.toLowerCase()
          };
          fetchDependentReferenceLookupValues(field, payloadObj);
        }
      });
    });

    // const moduleField = fields?.find((data) => data.name === changedField);
    // if (moduleField && moduleField.variant === "Module") {
    //   fetchDependentForms(moduleField.name, selectedValue);
    // }
  };

  const fetchDependentReferenceLookupValues = async (field, payload) => {
    if (field.dependent) {
      if (field.category === 'Reference' || field.category === 'Lookup') {
        const response = await fetchCreatorLookupValues(payload);
        const data = await response?.result;
        // const newData = data.length > 0 ? data : [{ label: "No data available", value: "" }];
        const updatedOptn = questions?.map((o) => {
          if (o.text === field?.label) {
            return {
              ...o,
              [field.category.toLowerCase() + 'DropdownData']: data
            };
          }
          return o;
        });
        setQuestions(updatedOptn);
        countRef.current = countRef.current + 1;
        // const newFields = allFieldList?.map((f) => {
        //   if (f.name === field.name) {
        //     return {
        //       ...f,
        //       [field.category.toLowerCase() + 'DropdownData']: data,
        //     };
        //   }
        //   return f;
        // });
      }
    }
  };

  const attachmentField = allFieldList?.filter(
    (o) => o?.category === 'Attachment'
  );
  const onChangeAttachment = (e, field) => {
    addToChatHistory(questions[countRef.current].text, field?.attachmentFile);
    countRef.current = countRef.current + 1;
    // setAttachmentPanel(!attachmentpanel)
  };

  const findParent = (updatedChatHistory, value) => {
    rootIndex += 1;
    if (
      (questions[rootIndex]?.category === 'lookup' ||
        questions[rootIndex]?.category === 'reference') &&
      questions[rootIndex + 1]?.dependent === true
    ) {
      makeDependentCall(
        questions[rootIndex]?.category,
        questions[rootIndex]?.text,
        value
      );
    } else if (rootIndex < questions.length) {
      for (let i = 0; i < questions.length; i++) {
        let nextQuestion = updatedChatHistory.some(
          (item) =>
            item.question === questions[rootIndex]?.text ||
            questions[rootIndex]?.inDependent
        );
        if (nextQuestion) {
          rootIndex += 1;
        }
      }
    }
    countRef.current = rootIndex;
  };
  const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const addToChatHistory = (question, answer) => {
    const modifyiedAns =
      typeof answer === 'boolean'
        ? capitalizeFirstLetter(String(answer))
        : typeof answer === 'object'
          ? answer?.fileName || ''
          : answer;
    const updatedChatHistory = [
      ...chatHistory,
      { question, answer: modifyiedAns }
    ];

    setChatHistory(updatedChatHistory);
  };

  const submitHandler = () => {
    let chatHistoryObj = {};
    // console.log(chatHistory)
    chatHistory.forEach((ele) => {
      chatHistoryObj[ele.question] = ele.answer;
    });
    const previewObj = {
      catalog_id: catalogData?.catalog_id,
      catalog: catalogData?.catalog,
      customer: currentUser?.userUUID ? currentUser?.userUUID : null,
      details: chatHistoryObj ? JSON.stringify(chatHistoryObj) : null,
      files: [],
      status: '1'
    };

    dispatch(updateCatelogRequest(previewObj));
    navigate('/');
  };
  const RefreshBot = () => {
    window.location.reload();
  };

  const handleOptionSelect = (e, selctOption) => {
    if (selctOption?.uuid) {
      setCatalogData(selctOption);
    }
    if (selctOption === 'Log a new Ticket') {
      const catlogWiseList = catalogFlows.filter((o) => o.category === null);
      if (catlogWiseList) {
        selctOption = catlogWiseList[0];
      }
    }

    let value = e.currentTarget.closest('li').getAttribute('data-value');
    let updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[countRef.current];
    let nextQue;

    if (selctOption === 'Product Catalog' || selctOption === 'Search') {
      rootIndex = countRef.current;
      // option = selctOption;
      optionRef.current = selctOption;
      // currentQuestion.answer = selctOption;
      // addToChatHistory(currentQuestion.text, selctOption);

      const catlogWiseList = catalogFlows.filter(
        (o) => o.category === optionRef.current
      );
      nextQue = [
        {
          id: 2,
          text: 'Please Select catalog from list',
          options: catlogWiseList,
          answer: '',
          category: 'select'
        }
      ];
      setQuestions([...questions, ...nextQue]);
      setSelectedOption(optionRef.current);
      countRef.current = countRef.current + 1;
    } else if (selctOption === 'My tickets') {
      let queArr = [];
      fetchRecords('requests', {}).then((data) => {
        let responceList = data?.data;
        responceList.map((ele) => {
          queArr.push(`${ele.id}-(${ele.catalog})`);
        });

        nextQue = [
          {
            id: 2,
            text: 'My tickets',
            options: responceList,
            answer: '',
            category: 'tickets'
          }
        ];
        setQuestions([...questions, ...nextQue]);
      });
      rootIndex = countRef.current;
      optionRef.current = selctOption;
      // currentQuestion.answer = selctOption;
      // addToChatHistory(currentQuestion.text, selctOption);
      setSelectedOption(optionRef.current);
      countRef.current = countRef.current + 1;
    } else if (selctOption === 'Service Catalog') {
      rootIndex = countRef.current;
      // option = selctOption;
      optionRef.current = selctOption;
      // currentQuestion.answer = selctOption;
      // addToChatHistory(currentQuestion.text, selctOption);
      nextQue = [
        {
          id: 2,
          text: ' Please select Catagory',
          options: ['Application', 'Hardware', 'Software'],
          answer: '',
          category: 'select'
        }
      ];
      setQuestions([...questions, ...nextQue]);
      setSelectedOption(optionRef.current);
      countRef.current = countRef.current + 1;
    } else if (
      selctOption === 'Software' ||
      selctOption === 'Application' ||
      selctOption === 'Hardware' ||
      selctOption === 'null'
    ) {
      rootIndex = countRef.current;
      // option = selctOption;
      optionRef.current = selctOption;
      // currentQuestion.answer = selctOption;
      addToChatHistory(currentQuestion.text, selctOption);

      const catlogWiseList = catalogFlows.filter(
        (o) => o.category === optionRef.current
      );
      nextQue = [
        {
          id: 2,
          text: 'Please Select catalog from list',
          options: catlogWiseList,
          type: 'single',
          answer: '',
          category: 'select'
        }
      ];
      setQuestions([...questions, ...nextQue]);
      setSelectedOption(optionRef.current);
      countRef.current = countRef.current + 1;
    } else if (selctOption?.json_str === null) {
      countRef.current = countRef.current + 1;
      // currentQuestion.answer = selctOption?.catalog;
      addToChatHistory(currentQuestion.text, selctOption?.catalog);
      setQuestions([...questions]);
    } else if (selctOption?.json_str) {
      const fetchDataAndUpdateState = async () => {
        rootIndex = countRef.current;

        const previewFieldList = JSON.parse(selctOption?.json_str)?.fields;
        // dispatch(resetTableStore());
        const result = await fetchFieldLookupValues(previewFieldList, null);
        optionRef.current = result;
        setAllFieldList(optionRef.current);

        // let parentArr = optionRef.current.filter(
        //   (o) => o.inDependent === false
        // );
        // setPerentQuestionList(parentArr);

        let addChildQue = [];
        for (let i = 0; i < optionRef.current.length; i++) {
          nextQue = [
            {
              id: i + 3,
              text: optionRef.current[i]?.label,
              options: optionRef.current[i].options
                ? optionRef.current[i].options
                : null,

              referenceDropdownData: optionRef.current[i].referenceDropdownData
                ? optionRef.current[i].referenceDropdownData
                : null,
              lookupDropdownData: optionRef.current[i].lookupDropdownData
                ? optionRef.current[i].lookupDropdownData
                : null,
              answer: '',
              dependent: optionRef.current[i].dependent
                ? optionRef.current[i].dependent
                : null,
              readOnlyText: optionRef.current[i]?.readOnlyText
                ? optionRef.current[i]?.readOnlyText
                : null,
              category: optionRef.current[i]?.type,
              inDependent: optionRef.current[i]?.inDependent
                ? optionRef.current[i]?.inDependent
                : false
            }
          ];
          addChildQue = [...addChildQue, ...nextQue];

          updatedQuestions = [...questions, ...addChildQue];
          setQuestions([...questions, ...addChildQue]);
        }
        // currentQuestion.answer = selctOption?.catalog;
        addToChatHistory(currentQuestion.text, selctOption?.catalog);
        const nextQueIndex = updatedQuestions.findIndex(
          (o) => o.inDependent === false
        );
        countRef.current = nextQueIndex;
        // setSelectedOption(option);
      };
      fetchDataAndUpdateState();
    } else if (typeof selctOption === 'object') {
      const updatedChatHistory = [...chatHistory];
      if (Object.keys(selctOption).length > 0) {
        updatedChatHistory.push({
          question: questions[countRef.current].text,
          answer: selctOption?.label
        });
      } else {
        if (currentQuestion?.options?.length > 0) {
          const checkedOption = currentQuestion.options.filter(
            (o) => o.value === switchData
          );
          value = checkedOption[0].optionId;
          // countRef.current = countRef.current + 1;
          updatedChatHistory.push({
            question: questions[countRef.current].text,
            answer: switchData
          });
        } else {
          updatedChatHistory.push({
            question: questions[countRef.current].text,
            answer: inputData
          });
        }
      }
      setChatHistory(updatedChatHistory);

      const queFieldObj = allFieldList.filter(
        (o) => o.label === questions[countRef.current]?.text
      );
      if (queFieldObj[0]) {
        if (queFieldObj[0]?.condition && queFieldObj[0]?.condition.length > 0) {
          const condition = (queFieldObj[0]?.condition).filter(
            (fie) => fie.value === value
          );
          if (condition.length > 0) {
            for (const item of condition) {
              const nextqueName = allFieldList.filter(
                (o) => o.name === item?.fieldName[0]
              );
              if (nextqueName) {
                const nextQueIndex = questions.findIndex(
                  (o) => o.text === nextqueName[0].label
                );
                countRef.current = nextQueIndex;
              }
              return item;
            }
          } else {
            findParent(updatedChatHistory, value);
          }
        } else {
          findParent(updatedChatHistory, value);
        }
      }
    }
    setInputData('');
  };
  const goToRecordPanel = (data) => {
    setTicketDetail(data);
    setTicketCard(true);
  };
  const cancelTicket = async (ticketDetail) => {
    let updateStatus = await updateTableRecord('requests', ticketDetail?.uuid, {
      status: '5'
    });
  };
  return (
    <div
      className="chatbot-container"
      style={{
        background: currentTheme === 'Dark' ? colors.darkLevel2 : colors.white
      }}
    >
      <div className="chat-history">
        {/* <div className="flex  justify-between chatbot-header">
          <Button onClick={RefreshBot}>
            <RefreshIcon></RefreshIcon>
          </Button>
          <Tooltip title="Attachments">
            <IconButton
              onClick={() => setAttachmentPanel(!attachmentpanel)}
              sx={{
                height: '30px',
                width: '30px',
                color: COLORS.PRIMARY,
                border: '1px solid #1976d1'
              }}
            >
              <AttachFileIcon
                sx={{ transform: 'rotate(135deg)', color: 'inherit' }}
              />
            </IconButton>
          </Tooltip>
        </div> */}
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-item">
            <p className="flex">
              <strong>{chatbotData?.menu_cat2}:</strong> {chat.question}
            </p>
            <p className="flex justify-end">
              {/* <strong>{currentUser?.role?.name}:</strong>{" "} */}
              {Array.isArray(chat.answer)
                ? chat.answer.map((o) =>
                    [...o.uploadResult].map((file, fileIndex) => (
                      <span>{file.fileName}</span>
                    ))
                  )
                : chat.answer}
            </p>
          </div>
        ))}
      </div>
      {questions[countRef.current] ? (
        <div>
          <div className="flex items-center justify-between">
            <Typography
              level="title-lg"
              sx={{
                color:
                  currentTheme === 'Dark' ? colors.grey[500] : COLORS.SECONDARY,
                marginTop: '10px',
                fontWeight: 600,
                fontSize: '15px'
              }}
            >
              {questions[countRef.current].text}
            </Typography>
            {questions[countRef.current]?.category === 'tickets' && (
              <span className="flex">
                <Button
                  className="close-icon"
                  sx={{
                    backgroundColor: COLORS.PRIMARY
                  }}
                  onClick={() => setMyReqestFlag(!myReqestFlag)}
                >
                  {`${myReqestFlag === true ? 'All' : 'Open'}`}
                </Button>
              </span>
            )}
          </div>
          <ul className="chatbot-option-container">
            {(() => {
              switch (questions[countRef.current]?.category) {
                case 'text':
                case 'number':
                case 'password':
                  return (
                    <li className="listItem_none">
                      <TextField
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        sx={{
                          '& .MuiInputBase-root': {
                            height: '40px',
                            fontSize: '15px',
                            width: '100%'
                          },
                          // hover
                          '&:hover': {
                            backgroundColor: 'green'
                          },
                          bgcolor:
                            currentTheme === 'Dark'
                              ? colors.darkTab
                              : colors.white
                        }}
                        fieldstyle={{
                          minWidth: '200px',
                          width: '73%'
                        }}
                      />
                      <Button
                        className="close-icon-chatbot"
                        sx={{
                          backgroundColor: COLORS.PRIMARY
                        }}
                        onClick={(e) => handleOptionSelect(e, {})}
                      >
                        <SendIcon />
                      </Button>
                    </li>
                  );
                case 'date':
                  return (
                    <li className="listItem_none">
                      <TextField
                        // value={inputData}
                        // labelname={questions[countRef.current].text}
                        id="outlined-basic"
                        variant="outlined"
                        name="date"
                        type="date"
                        // required={field.mandatory}
                        // value={
                        //   field.variant === "DateTime" && formObj[field.name]
                        //     ? formObj[field.name]
                        //     : formObj[field.name]?.split("T")[0]
                        // }
                        onChange={(e) => setInputData(e.target.value)}
                        sx={{
                          '& .MuiInputBase-root': {
                            height: '40px',
                            fontSize: '15px',
                            width: '100%'
                          },
                          bgcolor: COLORS.WHITE
                        }}
                        fieldstyle={{
                          minWidth: '200px',
                          width: '73%'
                        }}
                      />
                      <Button
                        className="close-icon-chatbot"
                        sx={{
                          backgroundColor: COLORS.PRIMARY
                        }}
                        onClick={(e) => handleOptionSelect(e, {})}
                      >
                        <SendIcon />
                      </Button>
                    </li>
                  );
                case 'radio':
                case 'select':
                case 'checkbox':
                  return questions[countRef.current].options.map((option) => {
                    const dataValue =
                      typeof option !== 'object'
                        ? option
                        : option.optionId ||
                          option.name ||
                          option.catelogflow_id;

                    return (
                      <li
                        sx={{
                          position: 'relative',
                          '&:hover .end-icon': {
                            opacity: 1
                          }
                        }}
                        className="listItem_none"
                        key={option?.catelogflow_id}
                        data-value={dataValue}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            borderRadius: '20px',
                            Padding: '8px 20px',
                            margin: '3px 0',
                            border: `1px solid lightgrey`,
                            color: COLORS.SECONDARY,
                            '&:hover': {
                              backgroundColor: COLORS.PRIMARY,
                              color: '#FFFFFF' // Adjust text color to be white on hover
                            }
                          }}
                          endIcon={
                            <SendIcon
                              sx={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                // opacity: 0,
                                transition: 'opacity 0.3s'
                              }}
                              className="end-icon"
                            />
                          }
                          className="option-list"
                          onClick={(e) => handleOptionSelect(e, option)}
                        >
                          {typeof option !== 'object'
                            ? option
                            : option?.catalog || option?.label}
                        </Button>
                      </li>
                    );
                  });
                case 'lookup':
                  return questions[countRef.current]?.lookupDropdownData.map(
                    (option, index) => (
                      <li
                        sx={{
                          position: 'relative',
                          '&:hover .end-icon': {
                            opacity: 1
                          }
                        }}
                        className="listItem_none"
                        key={index}
                        data-value={option?.value}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            borderRadius: '20px',
                            Padding: '8px 20px',
                            margin: '3px 0',
                            border: `1px solid lightgrey`,
                            color: COLORS.SECONDARY,
                            '&:hover': {
                              backgroundColor: COLORS.PRIMARY,
                              color: '#FFFFFF' // Adjust text color to be white on hover
                            }
                          }}
                          endIcon={
                            <SendIcon
                              sx={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                // opacity: 0,
                                transition: 'opacity 0.3s'
                              }}
                              className="end-icon"
                            />
                          }
                          className="option-list"
                          onClick={(e) => handleOptionSelect(e, option)}
                        >
                          {option?.label || 'No data available'}
                        </Button>
                      </li>
                    )
                  );
                case 'reference':
                  return questions[countRef.current]?.referenceDropdownData.map(
                    (option, index) => (
                      <li
                        sx={{
                          position: 'relative',
                          '&:hover .end-icon': {
                            opacity: 1
                          }
                        }}
                        className="listItem_none"
                        key={index}
                        data-value={option?.value}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            borderRadius: '20px',
                            Padding: '8px 20px',
                            margin: '3px 0',
                            border: `1px solid lightgrey`,
                            color: COLORS.SECONDARY,
                            '&:hover': {
                              backgroundColor: COLORS.PRIMARY,
                              color: '#FFFFFF' // Adjust text color to be white on hover
                            }
                          }}
                          endIcon={
                            <SendIcon
                              sx={{
                                position: 'absolute',
                                right: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                // opacity: 0,
                                transition: 'opacity 0.3s'
                              }}
                              className="end-icon"
                            />
                          }
                          className="option-list"
                          onClick={(e) => handleOptionSelect(e, option)}
                        >
                          {option?.label || 'No data available'}
                        </Button>
                      </li>
                    )
                  );
                case 'textarea':
                  return (
                    <li className="listItem_none flex items-center">
                      {catalogData?.type === 'Document Type' ? (
                        <div className="flex w-full flex-col">
                          <Textarea
                            name={questions[countRef.current].category}
                            variant="plain"
                            value={questions[countRef.current].readOnlyText}
                            readOnly={catalogData.readOnly}
                          />
                          <CreatorAddAttachment
                            selectedRecordId={
                              catalogData?.uuid ? catalogData?.uuid : null
                            }
                            catlogFlag="DocumentType"
                          />
                        </div>
                      ) : (
                        <>
                          <TextField
                            minRows={4}
                            maxRows={4}
                            variant="outlined"
                            multiline
                            value={inputData}
                            name={questions[countRef.current].category}
                            onChange={(e) => setInputData(e.target.value)}
                            placeholder="Description here....."
                            fieldstyle={{
                              minWidth: '200px',
                              width: '500px'
                            }}
                          />
                          <Button
                            className="close-icon"
                            sx={{
                              backgroundColor: COLORS.PRIMARY
                            }}
                            onClick={(e) => handleOptionSelect(e, {})}
                          >
                            <SendIcon />
                          </Button>
                        </>
                      )}
                    </li>
                  );
                case 'switch':
                  return (
                    <li className="listItem_none">
                      <FormControlLabel
                        name={questions[countRef.current].text}
                        type={questions[countRef.current].type}
                        control={
                          <Switch
                            checkedLabel={switchData}
                            color="secondary"
                            size="medium"
                          />
                        }
                        onChange={(e) => setSwitchData(e.target.checked)}
                        label={questions[countRef.current].text}
                      />
                      <Button
                        className="close-icon"
                        sx={{
                          backgroundColor: COLORS.PRIMARY
                        }}
                        onClick={(e) => handleOptionSelect(e, {})}
                      >
                        <SendIcon />
                      </Button>
                    </li>
                  );
                case 'file':
                  countRef.current = rootIndex;
                  return attachmentField.length > 1 ? (
                    <CreatorSinglAttchment
                      attachmentFieldList={attachmentField}
                      handleAttachFile={onChangeAttachment}
                    />
                  ) : (
                    <CreatorAddAttachment
                      field={attachmentField[0]}
                      attachmentTab={true}
                      selectedRecordId={null}
                      // handleAttachFile={onChangeAttachment}
                    />
                  );
                case 'tickets':
                  return (
                    <>
                      <div className="ticket-box">
                        <MyRequestGridView
                          type="Form"
                          items={
                            myReqestFlag === true
                              ? questions[countRef.current].options
                              : questions[countRef.current].options.filter(
                                  (option) => option?.status !== 'Completed'
                                )
                          }
                          goToPanel={goToRecordPanel}
                          // onActionClick={actionHandler}
                          // goToFields={goToFields}
                          // modalActionHandler={actionHandler}
                        />
                      </div>
                    </>
                  );
                default:
                  console.log('Chatbot default');
              }
            })()}
          </ul>
          {attachmentpanel && (
            <RequestDefaultAttachment
              // selectedRecordId={recordId ? recordId : null}
              catlogFlag="catlogFlagTrue"
              handleAttachFile={onChangeAttachment}
            />
          )}
          {/* <button onClick={handleNextQuestion}>Next</button> */}
        </div>
      ) : (
        <div>
          <Typography
            level="title-lg"
            sx={{
              color:
                currentTheme === 'Dark' ? colors.grey[500] : COLORS.SECONDARY,
              margin: '10px 0',
              fontSize: '18px'
            }}
          >
            Please review and submit your request
          </Typography>
          {chatHistory.map((chat, index) => (
            <div key={index} className="chat-item">
              <p>
                <strong>{chat.question}:</strong>{' '}
                {Array.isArray(chat.answer)
                  ? chat.answer.map((o) =>
                      [...o.uploadResult].map((file, fileIndex) => (
                        <span>{file.fileName}</span>
                      ))
                    )
                  : chat.answer}
              </p>
            </div>
          ))}
          <Button
            className="close-icon"
            sx={{
              backgroundColor: COLORS.PRIMARY
            }}
            onClick={submitHandler}
          >
            Submit
          </Button>
        </div>
      )}
      {ticketCard && (
        <div className="ticket-container">
          <div className="flex justify-end">
            <Button
              sx={{
                backgroundColor: COLORS.PRIMARY
              }}
              onClick={() => setTicketCard(false)}
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="">
            {ticketDetail.id}
            <div>{ticketDetail.catalog}</div>
            <div>{ticketDetail.status}</div>
          </div>
          <div className="flex">
            <Button
              sx={{
                margin: '0 10px',
                Padding: '10px'
              }}
            >
              Add worklog
            </Button>
            <Button
              sx={{
                margin: '0 10px'
              }}
            >
              Escalate{' '}
            </Button>
            <Button className="my-2" onClick={() => cancelTicket(ticketDetail)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyChatbot;
