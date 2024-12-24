import {
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { COLORS, colors } from '../../../common/constants/styles';
import TextArea from '../../../elements/TextArea';
import RadioField from '../../../elements/RadioField';
import TextField from '../../../elements/TextField';
import SelectField from '../../../elements/SelectField';
import { Trash } from 'lucide-react';
import { Plus, PlusCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button } from '@/componentss/ui/button';

const RestApi = ({
  actionObj,
  jsonRef,
  handleChange,
  addOperationHandler,
  fields,
  fieldDeleteHandler,
  optionsCheckType,
  handleExpresionPanel,
  handleInputFileChange,
  addJsonPathPicker,
  fetchJsonContent
}) => {
  const workFlowDetail = useSelector((state) => state?.workflow);
  const requestType = [
    {
      value: 'Post',
      label: 'Post'
    },
    {
      value: 'Get',
      label: 'Get'
    },
    {
      value: 'Delete',
      label: 'Delete'
    }
  ];

  const encodingType = [
    {
      value: 'JSON',
      label: 'JSON'
    },
    {
      value: 'XML',
      label: 'XML'
    }
  ];

  const authType = [
    {
      value: 'apiKey',
      label: 'Api Key'
    },
    {
      value: 'userNamePassword',
      label: 'Username & Password'
    }
  ];

  const columns = fields?.map((field) => {
    return {
      label: field.label,
      value: field.fieldInfoId
    };
  });
  const addJsonText = () => {
    if (actionObj?.json) {
      const URL = process.env.REACT_APP_STORAGE_URL;
      const Json = `${URL}/${actionObj?.json.filePath}/${actionObj?.json.fileName}`;
      fetchJsonContent(Json);
    }
  };

  const addJson = (event) => {
    event.preventDefault();
    if (jsonRef.current) {
      jsonRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleInputFileChange(file);
    }
  };

  return (
    <>
      {actionObj?.options &&
        optionsCheckType(actionObj?.options)?.map((restApiObj) => {
          return (
            <div
              key={restApiObj.id}
              style={{
                // marginBottom: 3,
                paddingBottom: 3
              }}
            >
              <Stack
                spacing={1}
                fullWidth
                sx={{
                  display: 'flex',
                  width: '100%',
                  marginTop: '10px'
                }}
              >
                <SelectField
                  labelname={'Request Type'}
                  name={'method'}
                  value={restApiObj.method || ''}
                  onChange={(e) =>
                    handleChange('method', e.target.value, restApiObj)
                  }
                  options={requestType}
                  fieldstyle={{
                    width: '100%',
                    marginBottom: '10px'
                  }}
                />
                <div className="mt-3 flex items-center">
                  <TextField
                    labelname="URL"
                    name="url"
                    helpertext="none"
                    value={restApiObj.url}
                    onChange={(e) =>
                      handleChange('url', e.target.value, restApiObj)
                    }
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '35px',
                        fontSize: '13.5px'
                      },
                      bgcolor: COLORS.WHITE
                    }}
                    fieldstyle={{
                      width: '100%',
                      minWidth: '200px'
                    }}
                  />
                  <IconButton
                    className="mx-1"
                    sx={{
                      padding: '0px',
                      backgroundColor: colors.primary[200],
                      '&:hover': {
                        backgroundColor: colors.primary.dark
                      }
                    }}
                    onClick={() =>
                      handleExpresionPanel('url', 'restApi', restApiObj?.url)
                    }
                  >
                    <PlusCircle
                      sx={{
                        fontSize: '25px',
                        color: colors.primary.main,
                        '&:hover': {
                          color: colors.white
                        }
                      }}
                    />
                  </IconButton>
                </div>

                <FormControlLabel
                  control={
                    <Switch
                      name="isRequireAuthentication"
                      checked={restApiObj.isRequireAuthentication}
                      onChange={(e) =>
                        handleChange(
                          'isRequireAuthentication',
                          e.target.checked,
                          restApiObj
                        )
                      }
                    />
                  }
                  label={
                    <Typography
                      sx={{ fontSize: '12px' }}
                      color="textSecondary"
                      fontWeight="500"
                    >
                      Required Authentication
                    </Typography>
                  }
                />

                {restApiObj.isRequireAuthentication && (
                  <>
                    <RadioField
                      name={'authType'}
                      value={restApiObj?.authenticationData?.authType || ''}
                      onChange={(e) =>
                        handleChange('authType', e.target.value, restApiObj)
                      }
                      options={authType}
                      fieldstyle={{
                        minWidth: '100%'
                      }}
                    />
                    {restApiObj?.authenticationData?.authType === 'apiKey' && (
                      <div className="flex items-start justify-between">
                        <TextField
                          labelname={'API Key'}
                          name="apiKey"
                          helpertext="none"
                          value={restApiObj?.authenticationData?.apiKey}
                          onChange={(e) =>
                            handleChange('apiKey', e.target.value, restApiObj)
                          }
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '35px',
                              fontSize: '13.5px'
                            },
                            bgcolor: COLORS.WHITE
                          }}
                          fieldstyle={{
                            minWidth: '200px',
                            width: '100%'
                          }}
                        />
                        <IconButton
                          className="mx-1"
                          sx={{
                            padding: '0px',
                            backgroundColor: colors.primary[200],
                            '&:hover': {
                              backgroundColor: colors.primary.dark
                            }
                          }}
                          onClick={() =>
                            handleExpresionPanel(
                              'apiKey',
                              'restApi',
                              restApiObj?.authenticationData?.apiKey
                            )
                          }
                        >
                          <PlusCircle
                            sx={{
                              fontSize: '25px',
                              color: colors.primary.main,
                              '&:hover': {
                                color: colors.white
                              }
                            }}
                          />
                        </IconButton>
                      </div>
                    )}

                    {restApiObj?.authenticationData?.authType ===
                      'userNamePassword' && (
                      <div className="flex gap-2">
                        <TextField
                          labelname={'User Name'}
                          name="userName"
                          helpertext="none"
                          value={restApiObj?.authenticationData.userName}
                          onChange={(e) =>
                            handleChange('userName', e.target.value, restApiObj)
                          }
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '35px',
                              fontSize: '13.5px'
                            },
                            bgcolor: COLORS.WHITE
                          }}
                          fieldstyle={{
                            width: '100%',
                            minWidth: '200px'
                          }}
                        />
                        <TextField
                          labelname={'Password'}
                          name="password"
                          helpertext="none"
                          value={restApiObj?.authenticationData.password}
                          onChange={(e) =>
                            handleChange('password', e.target.value, restApiObj)
                          }
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '35px',
                              fontSize: '13.5px'
                            },
                            bgcolor: COLORS.WHITE
                          }}
                          fieldstyle={{
                            width: '100%',
                            minWidth: '200px'
                          }}
                        />
                      </div>
                    )}
                  </>
                )}

                <FormControlLabel
                  sx={{ marginBottom: '8px' }}
                  control={
                    <Switch
                      checked={restApiObj.isRequireHeader}
                      onChange={(e) =>
                        handleChange(
                          'isRequireHeader',
                          e.target.checked,
                          restApiObj
                        )
                      }
                    />
                  }
                  label={
                    <Typography
                      sx={{ fontSize: '12px' }}
                      color="textSecondary"
                      fontWeight="500"
                    >
                      Custom Header
                    </Typography>
                  }
                />

                {restApiObj.isRequireHeader && (
                  <div className="flex items-start justify-between">
                    <TextArea
                      labelname="Header"
                      name="header"
                      value={restApiObj?.headerData}
                      onChange={(e) =>
                        handleChange('headerData', e.target.value, restApiObj)
                      }
                      minRows={4}
                      maxRows={4}
                      fieldstyle={{
                        minWidth: '200px',
                        width: '100%'
                      }}
                    />
                    <IconButton
                      className=" "
                      sx={{
                        padding: '0px',
                        backgroundColor: colors.primary[200],
                        '&:hover': {
                          backgroundColor: colors.primary.dark
                        }
                      }}
                      onClick={() =>
                        handleExpresionPanel(
                          'headerData',
                          'restApi',
                          restApiObj?.headerData
                        )
                      }
                    >
                      <PlusCircle
                        sx={{
                          fontSize: '25px',
                          color: colors.primary.main,
                          '&:hover': {
                            color: colors.white
                          }
                        }}
                      />
                    </IconButton>
                  </div>
                )}
                <RadioField
                  labelname={'Encoding'}
                  name={'encoding'}
                  value={restApiObj.encoding || ''}
                  onChange={(e) =>
                    handleChange('encoding', e.target.value, restApiObj)
                  }
                  options={encodingType}
                  fieldstyle={{
                    minWidth: '100%'
                  }}
                />
                <div className="flex items-start justify-between">
                  <TextArea
                    labelname="Payload"
                    name="payload"
                    helpertext="none"
                    value={restApiObj.payload || ''}
                    onChange={(e) =>
                      handleChange('payload', e.target.value, restApiObj)
                    }
                    minRows={4}
                    fieldstyle={{
                      minWidth: '200px',
                      width: '100%'
                    }}
                  />
                  <IconButton
                    // className="mt-4 mx-2 "
                    sx={{
                      padding: '0px',
                      backgroundColor: colors.primary[200],
                      '&:hover': {
                        backgroundColor: colors.primary.dark
                      }
                    }}
                    onClick={() =>
                      handleExpresionPanel(
                        'payload',
                        'restApi',
                        restApiObj.payload
                      )
                    }
                  >
                    <PlusCircle
                      sx={{
                        fontSize: '25px',
                        color: colors.primary.main,
                        '&:hover': {
                          color: colors.white
                        }
                      }}
                    />
                  </IconButton>
                </div>
              </Stack>
              <div className="mb-3">
                <Button onClick={addJson}>Add Sample Response</Button>
                <input
                  type="file"
                  ref={jsonRef}
                  style={{ display: 'none' }}
                  accept=".json"
                  onChange={handleFileChange}
                />
              </div>
              {workFlowDetail.workFlow?.source_type_display !== 'Catalog' ? (
                <>
                  {restApiObj.fieldData?.map((fldObj, i) => {
                    return (
                      <div
                        key={fldObj.fieldDataId}
                        style={{
                          width: '100%',
                          margin: '13px 0px'
                        }}
                      >
                        <div className="flex items-start" fullWidth>
                          <SelectField
                            labelname={'Field'}
                            value={fldObj.fieldDataLabel || 0}
                            onChange={(e) =>
                              handleChange(
                                'fieldDataLabel',
                                e.target.value,
                                restApiObj,
                                fldObj.fieldDataId
                              )
                            }
                            options={columns}
                            fieldstyle={{
                              width: '95%',
                              minWidth: '170px',
                              maxWidth: '200px'
                              // marginBottom: "10px",
                            }}
                          />

                          <TextField
                            labelname="Value"
                            helpertext="none"
                            value={fldObj.fieldDataValue}
                            // onChange={(e) =>
                            //   handleChange(
                            //     "fieldDataValue",
                            //     e.target.value,
                            //     restApiObj,
                            //     fldObj.fieldDataId
                            //   )
                            // }
                            sx={{
                              '& .MuiInputBase-root': {
                                height: '35px',
                                fontSize: '13.5px'
                              },
                              bgcolor: COLORS.WHITE
                            }}
                            fieldstyle={{
                              width: '94%',
                              minWidth: '220px',
                              maxWidth: '320px',
                              marginRight: '8px'
                            }}
                          />
                          <div>
                            <IconButton
                              // className="mt-4"
                              sx={{
                                padding: '0px',
                                backgroundColor: colors.primary[200],
                                '&:hover': {
                                  backgroundColor: colors.primary.dark
                                }
                              }}
                              onClick={() => {
                                addJsonText();
                                addJsonPathPicker(
                                  'fieldDataValue',
                                  '',
                                  restApiObj,
                                  fldObj.fieldDataId
                                );
                              }}
                            >
                              <PlusCircle
                                sx={{
                                  fontSize: '25px',
                                  color: colors.primary.main,
                                  '&:hover': {
                                    color: colors.white
                                  }
                                }}
                              />
                            </IconButton>
                          </div>
                          <Tooltip title="Delete" variant="solid">
                            <div
                              className="flex items-center justify-center px-1"
                              onClick={() =>
                                fieldDeleteHandler(
                                  restApiObj,
                                  fldObj.fieldDataId
                                )
                              }
                              style={{
                                // border: "1px solid lightgrey",
                                color: 'red',
                                borderRadius: '3px',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash />
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    );
                  })}
                  <Divider className="my-2">
                    <Chip
                      variant="outlined"
                      label={
                        <div
                          className="flex items-center justify-center"
                          onClick={() =>
                            addOperationHandler(actionObj, restApiObj)
                          }
                        >
                          <IconButton
                            sx={{
                              marginY: '20px',
                              marginRight: '2px',
                              padding: '0px',
                              backgroundColor: 'lightgrey'
                            }}
                          >
                            <Plus sx={{ fontSize: '13px' }} />
                          </IconButton>
                          <Typography
                            sx={{ fontSize: '10px', cursor: 'pointer' }}
                            color="textSecondary"
                            fontWeight="500"
                          >
                            Add Fields
                          </Typography>
                        </div>
                      }
                      size="small"
                    />
                  </Divider>
                </>
              ) : null}
              {/* <FormControlLabel
                control={
                  <Checkbox
                    name="isRequireConformation"
                    checked={restApiObj.isRequireConformation}
                    onChange={(e) =>
                      handleChange(
                        "isRequireConformation",
                        e.target.checked,
                        restApiObj
                      )
                    }
                    size="small"
                  />
                }
                label={
                  <Typography
                    sx={{ fontSize: "11px" }}
                    color="textSecondary"
                    fontWeight="500"
                  >
                    Confirm the value before updating the field
                  </Typography>
                }
              /> */}
            </div>
          );
        })}
    </>
  );
};

export default RestApi;
