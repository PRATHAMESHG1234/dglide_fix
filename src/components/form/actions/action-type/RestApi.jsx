import React from 'react';
import { Input } from '@/componentss/ui/input';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Switch } from '@/componentss/ui/switch';
import { RadioGroup } from '@/componentss/ui/radio-group';
import { Textarea } from '@/componentss/ui/textarea';
import { Checkbox } from '@/componentss/ui/checkbox';
import { Plus, Trash } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/componentss/ui/tooltip';

const RestApi = ({
  actionObj,
  handleChange,
  addOperationHandler,
  fields,
  fieldDeleteHandler,
  optionsCheckType
}) => {
  const requestType = [
    { value: 'Post', label: 'Post' },
    { value: 'Get', label: 'Get' },
    { value: 'Delete', label: 'Delete' }
  ];

  const encodingType = [
    { value: 'JSON', label: 'JSON' },
    { value: 'XML', label: 'XML' }
  ];

  const authType = [
    { value: 'apiKey', label: 'Api Key' },
    { value: 'userNamePassword', label: 'Username & Password' }
  ];

  const columns = fields?.map((field) => ({
    label: field.label,
    value: field.fieldInfoId
  }));

  return (
    <>
      {actionObj?.options &&
        optionsCheckType(actionObj?.options)?.map((restApiObj) => (
          <div
            key={restApiObj.id}
            style={{
              width: '100%',
              marginBottom: 3,
              paddingBottom: 3
            }}
          >
            <div className="flex w-full flex-col space-y-1">
              <Dropdown
                label="Request Type"
                name="method"
                value={restApiObj.method || ''}
                onChange={(e) =>
                  handleChange('method', e.target.value, restApiObj)
                }
                options={requestType}
              />
              <Input
                label="URL"
                name="url"
                value={restApiObj.url}
                onChange={(e) =>
                  handleChange('url', e.target.value, restApiObj)
                }
              />

              <Switch
                id={`switch-authentication`}
                label={'Required Authentication'}
                name={'isRequireAuthentication'}
                checked={restApiObj.isRequireAuthentication}
                onCheckedChange={(checked) =>
                  handleChange('isRequireAuthentication', checked, restApiObj)
                }
              />

              {restApiObj.isRequireAuthentication && (
                <>
                  <RadioGroup
                    label={'Auth Type'}
                    name="authType"
                    value={restApiObj?.authenticationData?.authType || ''}
                    onChange={(e) =>
                      handleChange('authType', e.target.value, restApiObj)
                    }
                    options={authType}
                  />

                  {restApiObj?.authenticationData?.authType === 'apiKey' && (
                    <Input
                      label="API Key"
                      name="apiKey"
                      value={restApiObj?.authenticationData?.apiKey}
                      onChange={(e) =>
                        handleChange('apiKey', e.target.value, restApiObj)
                      }
                    />
                  )}
                  {restApiObj?.authenticationData?.authType ===
                    'userNamePassword' && (
                    <div className="flex gap-2">
                      <Input
                        label="User Name"
                        name="userName"
                        value={restApiObj?.authenticationData.userName}
                        onChange={(e) =>
                          handleChange('userName', e.target.value, restApiObj)
                        }
                      />
                      <Input
                        label="Password"
                        name="password"
                        value={restApiObj?.authenticationData.password}
                        onChange={(e) =>
                          handleChange('password', e.target.value, restApiObj)
                        }
                      />
                    </div>
                  )}
                </>
              )}

              <Switch
                id={`switch-isRequireHeader`}
                label={'Custom Header'}
                name={'isRequireHeader'}
                checked={restApiObj.isRequireHeader}
                onCheckedChange={(checked) =>
                  handleChange('isRequireHeader', checked, restApiObj)
                }
              />

              {restApiObj.isRequireHeader && (
                <Textarea
                  label="Header"
                  name="header"
                  value={restApiObj?.headerData}
                  onChange={(e) =>
                    handleChange('headerData', e.target.value, restApiObj)
                  }
                  minRows={4}
                  maxRows={4}
                />
              )}

              <RadioGroup
                label="Encoding"
                name="encoding"
                value={restApiObj.encoding || ''}
                onChange={(e) =>
                  handleChange('encoding', e.target.value, restApiObj)
                }
                options={encodingType}
              />

              <Textarea
                label="Payload"
                name="payload"
                value={restApiObj.payload || ''}
                onChange={(e) =>
                  handleChange('payload', e.target.value, restApiObj)
                }
                minRows={4}
                maxRows={4}
              />
            </div>
            {restApiObj.fieldData?.map((fldObj) => (
              <div key={fldObj.fieldDataId} style={{ width: '100%' }}>
                <div className="flex w-full items-center gap-2 pt-2">
                  <Dropdown
                    label="Field"
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
                  />
                  <Input
                    label="Value"
                    value={fldObj.fieldDataValue}
                    onChange={(e) =>
                      handleChange(
                        'fieldDataValue',
                        e.target.value,
                        restApiObj,
                        fldObj.fieldDataId
                      )
                    }
                  />
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className="mt-7 flex items-center justify-center p-1"
                        onClick={() =>
                          fieldDeleteHandler(restApiObj, fldObj.fieldDataId)
                        }
                        style={{
                          border: '1px solid lightgrey',
                          color: 'red',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash size={18} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Delete Field</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
            <div className="my-2">
              <div className="flex items-center justify-center">
                <div
                  className="flex cursor-pointer rounded-full border border-accent bg-accent p-1 px-2 hover:bg-slate-200"
                  onClick={() => addOperationHandler(actionObj, restApiObj)}
                >
                  <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-slate-500 bg-accent">
                    <Plus size={12} />
                  </div>
                  <span className="text-xs">Add Field</span>
                </div>
              </div>
            </div>
            <Checkbox
              name="isRequireConformation"
              checked={restApiObj.isRequireConformation}
              onCheckedChange={(checked) => {
                handleChange('isRequireConformation', checked, restApiObj);
              }}
              endLabel={'Confirm the value before updating the field'}
              id={'checkbox-isRequireConformation'}
            />
          </div>
        ))}
    </>
  );
};

export default RestApi;
