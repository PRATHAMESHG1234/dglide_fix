import { forwardRef, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Select from 'react-select';
import {
  Autocomplete,
  Backdrop,
  Box,
  // Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  // Link,
  Slide,
  TextField,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconArrowsDiagonal2 } from '@tabler/icons-react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import 'react-quill/dist/quill.snow.css';
import * as Yup from 'yup';
import { Button } from '@/componentss/ui/button';

import { colors } from '../common/constants/styles';
import RichTextEditor from '../elements/RichTextEditor';
import { uploadAttachment } from '../services/attachment';
import { fetchRefLookupValuesByFieldInfoId } from '../services/field';
import { sendMail } from '../services/form';
import {
  createTableRecord,
  fetchRecordById,
  fetchRecordsBytableName
} from '../services/table';
import AttachmentCard from './AttachmentCard';
import { notify } from '../hooks/toastUtils';
import { Input } from '@/componentss/ui/input';
import { Modal } from '@/componentss/ui/modal';
import { FileUp, Link } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/componentss/ui/collapsible';
const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const ComposeDialog = ({
  selectedRecordId,
  setRefetch,
  fieldInfoId,
  uploadTab,
  setOpen,
  open,
  fields
}) => {
  const theme = useTheme();
  // const [open, setOpen] = useState(false);
  const [width, setWidth] = useState('md');
  const [ccBccValue, setCcBccValue] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [requester, setRequester] = useState([]);
  const [systemUserData, setSystemUserData] = useState(null);
  const [fromValue, setFromValue] = useState(null);
  const [inititalRequesterId, setinitialRequesterId] = useState(null);
  const { currentForm } = useSelector((state) => state.current);
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);

  const URL = process.env.REACT_APP_STORAGE_URL;

  const fileInputRef = useRef(null);
  const getRequesterDetails = async () => {
    try {
      const res = await fetchRefLookupValuesByFieldInfoId(fieldInfoId, {
        pagination: null,
        payload: {},
        search: null
      });
      console.log(res, 'ress');
      if (res.status) {
        setRequester(res?.result?.data);
      }
    } catch (error) {
      console.error('Failed to fetch requester details:', error);
    }
  };

  useEffect(() => {
    getRequesterDetails();
    fetchRecordsBytableName('system_user').then((data) => {
      const fetchedFormData = data?.data;

      const systemUserOptions = Array.isArray(fetchedFormData)
        ? fetchedFormData.map((item, index) => ({
            label: item?.user_email,
            id: index + 1
          }))
        : [];

      setRequester((prevRequesterOptions) => {
        const safePrevRequesterOptions = Array.isArray(prevRequesterOptions)
          ? prevRequesterOptions
          : [];

        return [
          ...safePrevRequesterOptions,
          ...systemUserOptions.map((item, index) => ({
            ...item,
            id: safePrevRequesterOptions.length + index + 1,
            uuid: item?.uuid
          }))
        ];
      });

      setSystemUserData(fetchedFormData);
    });
  }, [fieldInfoId]);
  const fetchDataForRequester = async () => {
    setLoading(true);
    try {
      const record = await fetchRecordById(currentForm?.name, selectedRecordId);

      setinitialRequesterId(record?.requester);
    } catch (error) {
      console.error('Error fetching record:', error);
    }
  };
  useEffect(() => {
    if (open) {
      fetchRecordsBytableName('system_email_setting').then((data) => {
        const fromVal = data?.data;
        setFromValue(fromVal);
      });
    }
  }, [open]);

  useEffect(() => {
    fetchDataForRequester().then(() => {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    });
  }, []);

  const handleAttachmentUpload = async (event) => {
    const files = event.target.files;
    const uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const uploadedFile = await uploadAttachmentsHandler(files[i]);
      if (uploadedFile) {
        setUploading(false);
        uploadedFiles.push(uploadedFile);
      }
    }

    setAttachments((prev) => [...prev, ...uploadedFiles]);
  };

  const uploadAttachmentsHandler = async (file) => {
    if (!file || !currentForm) return null;
    setUploading(true);
    try {
      const res = await uploadAttachment(referenceFormName, file);

      return res.result;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      return null;
    }
  };

  const dispatch = useDispatch();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
    setAttachments([]);
  };
  const handleCcBccChange = () => {
    setCcBccValue((prev) => !prev);
  };

  const emailValidation = Yup.string()
    .test(
      'validEmails',
      'Invalid email format. Please enter valid comma-separated emails.',
      (value) => {
        if (!value) return false;

        const emails = value.split(',').map((email) => email.trim());

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emails.every((email) => emailRegex.test(email));
      }
    )
    .required('To is required');

  const validationSchema = Yup.object().shape({
    to: emailValidation,
    subject: Yup.string().required('Subject is required'),
    messageText: Yup.string()
      .required('Content is required')
      .test(
        'messageText',
        'Message cannot be empty',
        (value) => value && value.trim().length > 0
      )
  });

  const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }]
  ];
  // const modules = {
  //   toolbar: { container: TOOLBAR_OPTIONS },
  //   clipboard: { matchVisual: false },
  //   imageResize: {
  //     parchment: Quill.import('parchment'),
  //     modules: ['Resize', 'DisplaySize']
  //   }
  // };
  const systemUserOptions = Array.isArray(systemUserData)
    ? systemUserData.map((item, index) => ({
        label: item?.user_email,
        value: item?.user_email,
        id: index + 1,
        uuid: item?.uuid
      }))
    : [];
  const requesterOptions = Array.isArray(requester)
    ? requester.map((item, index) => ({
        label: item?.user_email,
        value: item?.user_email,
        id: index + 1,
        uuid: item?.uuid
      }))
    : [];

  const reqData = requester?.filter(
    (item) => item?.uuid === inititalRequesterId
  );

  const reqInitial = requesterOptions?.find(
    (item) => item?.uuid === reqData[0]?.uuid
  );
  console.log(reqInitial, 'reqInitial');
  const handleImageUpload = async (file) => {
    const response = await uploadAttachmentsHandler(file);
    const { baseUrl, filePath, fileName } = response; // Extract relevant details from the response
    const imageUrl = `${process.env.REACT_APP_STORAGE_URL}/${filePath}/${fileName}`; // Construct the image URL

    const editor = quillRef.current?.getEditor();
    // Check the constructed image URL

    if (editor && imageUrl) {
      const range = editor.getSelection();
      if (range) {
        editor.insertEmbed(range.index, 'image', imageUrl);
      } else {
        console.warn('No selection found. Image not inserted.');
      }
    } else {
      console.warn('Editor not initialized or image upload failed.');
    }
  };

  const openImageDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        await handleImageUpload(file);
      }
    };
    input.click();
  };

  // if (loading) {
  //   return '...Loading';
  // }
  const ReferenceField = fields?.filter((item) => item.category === 'activity');
  const referenceFormName = ReferenceField?.[0]?.lookup?.formName;

  return (
    <>
      {}
      <Modal
        isOpen={open}
        onClose={handleCloseDialog}
        title="Mail"
        description=""
        onConfirm={() => {}}
        onCancel={handleCloseDialog}
        width={'75rem'}
        firstButtonVariant="Delete"
        className="overflow-hidden"
      >
        {' '}
        {open ? (
          <DialogContent
            sx={{
              overflowY: 'auto',
              height: width === 'lg' ? '100vh' : 'auto'
            }}
          >
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="relative h-10 w-10">
                  <div className="absolute left-0 top-0 h-full w-full rounded-full border-4 border-gray-200"></div>
                  <div className="absolute left-0 top-0 h-full w-full animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
                </div>
              </div>
            ) : (
              <Formik
                initialValues={{
                  to: reqInitial?.value || '',
                  subject: '',
                  messageText: '',
                  cc: '',
                  bcc: '',
                  recordId: selectedRecordId,
                  notificationType: 'Email',
                  operation: 'string',
                  formId: currentForm?.formInfoId,
                  files: attachments
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  console.log('called');
                  try {
                    setButtonLoading(true);

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(
                      values.messageText,
                      'text/html'
                    );
                    const imgTags = doc.querySelectorAll('img');

                    if (imgTags.length > 0) {
                      const imgUploadPromises = Array.from(imgTags).map(
                        async (img) => {
                          const src = img.src;

                          if (
                            src.startsWith('data:') ||
                            src.startsWith('blob:')
                          ) {
                            const file = await fetch(src).then((res) =>
                              res.blob()
                            );

                            const uploadedImage =
                              await uploadAttachmentsHandler(file);

                            if (
                              uploadedImage?.filePath &&
                              uploadedImage?.fileName
                            ) {
                              img.src = `${URL}/${uploadedImage.filePath}/${uploadedImage.fileName}`;
                            }
                          }
                        }
                      );
                      await Promise.all(imgUploadPromises);

                      values.messageText = doc.body.innerHTML;
                    }

                    values.files = attachments;

                    const res = await sendMail(values);

                    if (res.status) {
                      const activityPayload = {
                        type: '4',
                        summary: values.subject,
                        ticketid: selectedRecordId,
                        record_id: selectedRecordId,
                        form_info_id: currentForm?.formInfoId,
                        description: values?.messageText,
                        details: values?.messageText,
                        files: attachments,

                        json: {
                          from:
                            fromValue.find(
                              (item) => item.mailboxtype === 'Outgoing'
                            )?.username || '',
                          to: values.to || ''
                        }
                      };
                      const logActivity = await createTableRecord(
                        referenceFormName,
                        activityPayload
                      );
                      setRefetch((prev) => true);
                      setOpen(false);

                      notify.success('Email sent successfully');
                      setAttachments([]);
                    } else {
                      notify.success(res?.message || 'Something went wrong');
                    }
                  } catch (error) {
                    console.error('Error:', error);
                  } finally {
                    setSubmitting(false);
                    setButtonLoading(false);
                  }
                }}
              >
                {({
                  setFieldValue,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                  setFieldTouched
                }) => (
                  <Form>
                    {loading ? (
                      <></>
                    ) : (
                      <div class="flex flex-wrap space-x-1">
                        <div class="w-full">
                          <div class="flex items-center space-x-0">
                            <div className="flex w-full items-center justify-end p-2">
                              <span
                                to="#"
                                onClick={handleCcBccChange}
                                className="cursor-pointer text-secondary"
                              >
                                CC & BCC
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="w-full pb-2">
                          <span classname="text-sm text-black py-2">To</span>
                          <Select
                            // styles={customStyles}
                            options={
                              values.to &&
                              values.to.length >= 4 &&
                              ((requesterOptions &&
                                requesterOptions.length > 0) ||
                                (systemUserOptions &&
                                  systemUserOptions.length > 0))
                                ? [...requesterOptions, ...systemUserOptions] ||
                                  []
                                : []
                            }
                            // defaultValue={options[0]}
                            getOptionLabel={(option) =>
                              option.value || `ID: ${option.id}`
                            }
                            onChange={(value) => {
                              setFieldValue(
                                'to',
                                typeof value === 'string' ? value : value?.value
                              );
                            }}
                            onInputChange={(value, { action }) => {
                              if (action === 'input-change') {
                                setFieldValue('to', value);
                              }
                            }}
                            isClearable
                            defaultValue={reqInitial ? reqInitial : null}
                            placeholder="To"
                          />
                          {console.log(reqInitial, 'reqinitial')}
                        </div>
                        {console.log(values, 'values')}
                        <div className="w-full pb-2">
                          <Input
                            name="subject"
                            as={TextField}
                            fullWidth
                            value={values.subject}
                            label="Subject"
                            onChange={(e) => {
                              setFieldValue('subject', e.target.value);
                            }}
                            required
                            size="small"
                            error={touched.subject && Boolean(errors.subject)}
                            helperText={<ErrorMessage name="subject" />}
                          />
                        </div>
                        <div className="w-full pb-2">
                          <Collapsible open={ccBccValue}>
                            <CollapsibleTrigger asChild>
                              <div></div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="flex flex-wrap gap-2">
                                <div className="flex w-full flex-col pb-2">
                                  <div classname="text-sm text-black py-2">
                                    Cc
                                  </div>
                                  <Select
                                    options={
                                      values.cc &&
                                      values.cc.length >= 4 &&
                                      ((requesterOptions &&
                                        requesterOptions.length > 0) ||
                                        (systemUserOptions &&
                                          systemUserOptions.length > 0))
                                        ? [
                                            ...requesterOptions,
                                            ...systemUserOptions
                                          ] || []
                                        : []
                                    }
                                    onChange={(value) => {
                                      setFieldValue(
                                        'cc',
                                        typeof value === 'string'
                                          ? value
                                          : value?.label || ''
                                      );
                                    }}
                                    onInputChange={(value, { action }) => {
                                      if (action === 'input-change') {
                                        setFieldValue('cc', value);
                                      }
                                    }}
                                    placeholder="CC"
                                    getOptionLabel={(option) =>
                                      option.label || `ID: ${option.id}`
                                    }
                                    getOptionValue={(option) => option.value}
                                    isClearable
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        fontSize: '0.875rem'
                                      }),
                                      placeholder: (base) => ({
                                        ...base,
                                        fontSize: '0.875rem'
                                      })
                                    }}
                                  />
                                </div>
                                <div className="flex w-full flex-col pb-2">
                                  <div classname="text-sm text-black py-2">
                                    Bcc
                                  </div>
                                  <Select
                                    options={
                                      values.bcc &&
                                      values.bcc.length >= 4 &&
                                      ((requesterOptions &&
                                        requesterOptions.length > 0) ||
                                        (systemUserOptions &&
                                          systemUserOptions.length > 0))
                                        ? [
                                            ...requesterOptions,
                                            ...systemUserOptions
                                          ] || []
                                        : []
                                    }
                                    placeholder="Bcc"
                                    onChange={(value) => {
                                      setFieldValue(
                                        'bcc',
                                        typeof value === 'string'
                                          ? value
                                          : value?.label || ''
                                      );
                                    }}
                                    onInputChange={(value, { action }) => {
                                      if (action === 'input-change') {
                                        setFieldValue('bcc', value);
                                      }
                                    }}
                                    defaultValue={null}
                                    getOptionLabel={(option) =>
                                      option.label || `ID: ${option.id}`
                                    }
                                    getOptionValue={(option) => option.value}
                                    isClearable
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        fontSize: '0.875rem'
                                      }),
                                      placeholder: (base) => ({
                                        ...base,
                                        fontSize: '0.875rem'
                                      }),
                                      width: '100%'
                                    }}
                                  />
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                        <div
                          className="flex w-full"
                          style={{
                            position: 'relative',
                            '& .quill': {
                              bgcolor:
                                theme.palette.mode === 'dark'
                                  ? 'dark.main'
                                  : colors.white,
                              borderRadius: '12px',
                              '& .ql-toolbar': {
                                bgcolor:
                                  theme.palette.mode === 'dark'
                                    ? 'dark.light'
                                    : colors.white,
                                borderColor:
                                  theme.palette.mode === 'dark'
                                    ? `${theme.palette.dark.light + 20}`
                                    : `${theme.palette.grey[400]}`,
                                borderTopLeftRadius: '12px',
                                borderTopRightRadius: '12px'
                              },
                              '& .ql-container': {
                                borderColor:
                                  theme.palette.mode === 'dark'
                                    ? `${theme.palette.dark.light + 20}` +
                                      ' !important'
                                    : `${theme.palette.grey[400]}` +
                                      ' !important',
                                borderBottomLeftRadius: '12px',
                                borderBottomRightRadius: '12px',
                                height: width === 'lg' ? '320px' : '100px'
                              }
                            }
                          }}
                        >
                          <RichTextEditor
                            label={'Enter content here'}
                            value={values.messageText}
                            required={true}
                            maxLength={2000}
                            onChange={(value) =>
                              setFieldValue('messageText', value)
                            }
                            placeholder="Enter..."
                            form={currentForm}
                            atValues={[]}
                            // taggedEmails={taggedEmails}
                            // setTaggedEmails={setTaggedEmails}
                          />

                          {touched.messageText && errors.messageText && (
                            <Typography color="error" variant="body2">
                              {errors.messageText}
                            </Typography>
                          )}
                        </div>
                        <div className="flex w-full">
                          <div className="my-2 gap-x-2 rounded-lg border border-gray-100 py-2">
                            <div
                              className="flex max-w-52 items-center rounded-lg bg-white p-2 text-sm text-secondary"
                              onClick={() => fileInputRef.current.click()}
                              size="small"
                            >
                              <FileUp size={16} className="mr-2" />
                              Attach Files
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              hidden
                              onChange={handleAttachmentUpload}
                            />

                            {attachments.length > 0 && (
                              <div className="flex w-full flex-wrap gap-2 py-2">
                                {attachments.map((file, index) => (
                                  <AttachmentCard
                                    key={index}
                                    title={file.fileName}
                                    link={`${URL}/${file.filePath}/${file.fileName}`}
                                    fileType={file?.fileExtension}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex basis-1/6">
                          <Button
                            type="submit"
                            disabled={buttonLoading || uploading}
                          >
                            {buttonLoading || uploading ? (
                              <>
                                <div
                                  className="mr-1 h-4 w-4 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"
                                  style={{ borderColor: 'currentColor' }} // Adjust the color as needed
                                ></div>
                                <span>
                                  {buttonLoading ? 'Sending...' : 'Uploading'}
                                </span>
                              </>
                            ) : (
                              'Send'
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            )}
          </DialogContent>
        ) : null}
      </Modal>
    </>
  );
};

export default ComposeDialog;
