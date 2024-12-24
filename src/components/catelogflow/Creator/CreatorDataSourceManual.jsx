import { memo, useEffect, useRef, useState } from 'react';

import { PlusSquare, CheckCircle2, Minus, PlusCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { Circle } from 'lucide-react';
import { Typography } from '@mui/joy';
import {
  Badge,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip
} from '@mui/material';
import { Paperclip } from 'lucide-react';
import { generateUId, optionUniqeUId } from '../../../common/utils/helpers';
import { COLORS } from '../../../common/constants/styles';
import { uploadImage } from '../../../services/catalogFlow';
import { IconCirclePlusFilled } from '@tabler/icons-react';

const DataSourceManual = ({ staticOptions, onOptionChange, field, form }) => {
  const [options, setOptions] = useState([]);
  const [fileAttachment, setFileAttachment] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (staticOptions) {
      setOptions(staticOptions);
    }
  }, [staticOptions]);

  useEffect(() => {
    onOptionChange(options);
  }, [options, onOptionChange]);

  const handleOptionChange = (value, option) => {
    setOptions((prev) =>
      prev?.map((opt) => {
        if (opt.optionId === option.optionId) {
          return {
            ...option,
            label: value
          };
        }
        return opt;
      })
    );
  };
  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        optionId: optionUniqeUId(),
        label: `Option ${prev.length + 1}`,
        active: true,
        default: false,
        collapsed: true
      }
    ]);
  };

  const deleteOption = (option) => {
    setOptions((prev) =>
      prev?.filter((opt) => opt.optionId !== option.optionId)
    );
  };

  const setDefaultOption = (option) => {
    const currentDefault = options?.find((def) => def.default);
    if (currentDefault && currentDefault.optionId === option.optionId) {
      const updated = options?.map((optn) => {
        if (currentDefault.optionId === option.optionId) {
          return {
            ...optn,
            default: false
          };
        }
      });
      setOptions(updated);
      return;
    }

    const updated = options?.map((optn) => {
      if (optn.optionId === option.optionId) {
        return {
          ...optn,
          default: true
        };
      } else {
        return {
          ...optn,
          default: false
        };
      }
    });
    setOptions(updated);
  };

  const handleButtonClick = (id) => {
    fileInputRef.current.setAttribute('data-id', id);
    fileInputRef.current.click(id);
  };

  const handleChange = async (e) => {
    const id = fileInputRef.current.getAttribute('data-id');
    let attachedFile;

    attachedFile = await uploadImage(e.target.files[0]);
    setFileAttachment(attachedFile);
    const updated = options?.map((optn) => {
      if (optn.optionId === id) {
        return {
          ...optn,
          image: attachedFile?.result
        };
      }
      return optn;
    });
    setOptions(updated);
  };

  return (
    <>
      <div className="flex items-center justify-between pt-1">
        <Typography level="title-sm" paddingY="10px">
          Options
        </Typography>
        {field.type === 'switch' ? null : (
          <Tooltip title="Add" variant="solid">
            <IconCirclePlusFilled
              fontSize="medium"
              onClick={addOption}
              sx={{
                color: COLORS.SECONDARY,
                cursor: 'pointer'
              }}
            />
          </Tooltip>
        )}
      </div>
      <div>
        <div className="flex justify-end pb-1">
          <Typography color={COLORS.SECONDARY} sx={{ fontSize: '13px' }}>
            Select the default option by clicking the Radio button
          </Typography>
        </div>
        {options &&
          options?.map((option) => {
            return (
              <div className="mb-2 flex items-center" key={option.optionId}>
                <FormControl fullWidth className="flex items-center">
                  <TextField
                    fullWidth
                    type="text"
                    name="option"
                    InputProps={{
                      startAdornment: (
                        <>
                          {option.default ? (
                            <IconButton
                              onClick={() => setDefaultOption(option)}
                            >
                              <CheckCircle2
                                fontSize="medium"
                                sx={{ color: COLORS.PRIMARY }}
                              />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => setDefaultOption(option)}
                            >
                              <Circle fontSize="medium" />
                            </IconButton>
                          )}
                        </>
                      ),

                      endAdornment: (
                        <>
                          {form.variant === 'Image' ? (
                            <>
                              {option.image && (
                                <span>
                                  {option.image ? option.image?.fileName : ''}
                                </span>
                              )}
                              <Tooltip title="Attachments">
                                <input
                                  type="file"
                                  id="getFile"
                                  style={{ display: 'none' }}
                                  ref={fileInputRef}
                                  onChange={(e) => handleChange(e)}
                                />
                                <Button
                                  style={{ 'min-width': '19px' }}
                                  onClick={() =>
                                    handleButtonClick(option.optionId)
                                  }
                                  startIcon={<Paperclip />}
                                ></Button>
                              </Tooltip>
                            </>
                          ) : null}
                          <IconButton
                            className="btn p-0"
                            onClick={() => deleteOption(option)}
                          >
                            <Minus
                              fontSize="medium"
                              sx={{
                                color: '#bc3c3c'
                              }}
                            />
                          </IconButton>
                        </>
                      )
                    }}
                    value={option.label}
                    onChange={(e) => handleOptionChange(e.target.value, option)}
                    sx={{
                      bgcolor: COLORS.WHITE,
                      '& .MuiInputBase-root': {
                        height: '32px',
                        fontSize: '13px',
                        borderRadius: 1,
                        paddingLeft: 0.5
                      }
                    }}
                  />
                </FormControl>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default memo(DataSourceManual);
