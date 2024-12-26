import { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import { generateUId } from '../../common/utils/helpers';
import { colors } from '../../common/constants/styles';
import { Modal } from '@/componentss/ui/modal';
import { IconForOption } from './OptionFieldIcon';

import {
  IconIcons,
  IconPaint,
  IconSquareRoundedX,
  IconTextColor
} from '@tabler/icons-react';
import { Input } from '@/componentss/ui/input';
import { Label } from '@/componentss/ui/label';
import { Checkbox } from '@/componentss/ui/checkbox';
import { CheckCircle, Circle, SquarePlus, SquareX } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/componentss/ui/tooltip';
const DataSourceManual = ({ staticOptions, onOptionChange }) => {
  const [options, setOptions] = useState([
    {
      optionId: generateUId(),
      label: `Option 1`,
      active: true,
      default: false,
      backgroundColor: '#000000'
    }
  ]);
  const [colorType, setColorType] = useState('');
  const [colorPickerOpen, setColorPickerOpen] = useState(null);
  const [openIconPanel, setOpenIconPanel] = useState();
  const [selectedOptionIcon, setSelectedOptionIcon] = useState({});

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

  const addOption = (e) => {
    e.preventDefault();
    setOptions((prev) => [
      ...prev,
      {
        optionId: generateUId(),
        label: `Option ${prev.length + 1}`,
        active: true,
        default: false,
        backgroundColor: '#000000' // Default color
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

  const onClickOptionHandler = (data, option) => {
    const updatedOptions = options.map((optn) => {
      const preStyle = JSON.parse(optn.style);

      if (
        optn.optionId === option.optionId &&
        colorType === 'backgroundColor'
      ) {
        return {
          ...optn,
          style: JSON.stringify({
            ...preStyle,
            backgroundColor: data.hex
          })
        };
      }
      if (optn.optionId === option.optionId && colorType === 'color') {
        return {
          ...optn,
          style: JSON.stringify({
            ...preStyle,
            color: data.hex
          })
        };
      }
      if (optn.optionId === option.optionId && colorType === 'addIcon') {
        return {
          ...optn,
          style: JSON.stringify({
            ...preStyle,
            icon: data
          })
        };
      }
      return optn;
    });
    setOptions(updatedOptions);
    setOpenIconPanel();
  };
  const toggleColorPicker = (optionId, type) => {
    setColorPickerOpen((prevState) =>
      prevState === optionId ? null : optionId
    );
    setColorType(type);
  };

  const removeColor = (option) => {
    const updatedOptions = options.map((optn) => {
      const preStyle = JSON.parse(optn.style);
      if (
        optn.optionId === option.optionId &&
        colorType === 'backgroundColor'
      ) {
        return {
          ...optn,
          style: preStyle?.color
            ? JSON.stringify({
                color: preStyle?.color
              })
            : null
        };
      }
      if (optn.optionId === option.optionId && colorType === 'color') {
        return {
          ...optn,
          style: preStyle?.color
            ? JSON.stringify({
                backgroundColor: preStyle?.color
              })
            : null
        };
      }
      return optn;
    });
    setOptions(updatedOptions);
    setColorPickerOpen(null);
  };
  return (
    <>
      <div className="flex items-center justify-between pt-1">
        <Label level="title-sm" paddingY="10px">
          Options
        </Label>
        <Tooltip>
          <TooltipTrigger>
            <SquarePlus
              size={16}
              onClick={addOption}
              style={{
                cursor: 'pointer'
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="rounded-md bg-gray-800 px-2 py-1 text-white">
            Add
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
        <div className="flex justify-end pb-1">
          <Label className="text-[12px]">
            Select the default option by clicking the Radio button
          </Label>
        </div>
        {options &&
          options?.map((option, i) => {
            const bgColor = option.style
              ? JSON.parse(option.style)?.backgroundColor
              : '';
            const textColor = option.style
              ? JSON.parse(option.style)?.color
              : '';
            return (
              <div className="relative mb-2 flex items-center" key={i}>
                <div className="z-0 w-full">
                  <Input
                    id={'input-option'}
                    type="text"
                    name="option"
                    startIcon={
                      <div>
                        {option.default ? (
                          <CheckCircle
                            size={16}
                            onClick={() => setDefaultOption(option)}
                            className="text-primary"
                          />
                        ) : (
                          <Circle
                            size={16}
                            onClick={() => setDefaultOption(option)}
                          />
                        )}
                      </div>
                    }
                    endIcon={
                      <>
                        <div className="flex gap-2">
                          <span
                            onClick={() =>
                              toggleColorPicker(option.optionId, 'color')
                            }
                            className="relative cursor-pointer rounded border bg-white p-[1px]"
                          >
                            <span
                              style={{
                                position: 'absolute',
                                top: '16px',
                                height: '5px',
                                width: '20px',
                                backgroundColor: textColor
                              }}
                            />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <IconTextColor
                                  stroke={1.5}
                                  color={colors.grey[700]}
                                  size={20}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Change Text Color</p>
                              </TooltipContent>
                            </Tooltip>
                          </span>

                          <span
                            onClick={() =>
                              toggleColorPicker(
                                option.optionId,
                                'backgroundColor'
                              )
                            }
                            className="relative flex cursor-pointer rounded border bg-white p-[1px]"
                          >
                            <span
                              style={{
                                position: 'absolute',
                                top: '16px',
                                height: '5px',
                                width: '20px',
                                backgroundColor: bgColor
                              }}
                            />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <IconPaint
                                  stroke={1.5}
                                  color={colors.grey[700]}
                                  size={20}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Change Background Color</p>
                              </TooltipContent>
                            </Tooltip>
                          </span>

                          <span
                            className="btn cursor-pointer p-0"
                            onClick={() => deleteOption(option)}
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <IconSquareRoundedX
                                  stroke={1.5}
                                  color={colors.error.main}
                                  size="24px"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove</p>
                              </TooltipContent>
                            </Tooltip>
                          </span>
                        </div>
                      </>
                    }
                    value={option.label}
                    onChange={(e) => handleOptionChange(e.target.value, option)}
                  />
                </div>
                <div className="absolute right-28 z-50">
                  {colorPickerOpen === option.optionId && (
                    <div
                      style={{
                        backgroundColor: 'lightgrey',
                        padding: 5,
                        border: '1px solid grey'
                      }}
                    >
                      <span
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'end'
                        }}
                        onClick={() => setColorPickerOpen(null)}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SquareX className="cursor-pointer text-destructive" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Close</p>
                          </TooltipContent>
                        </Tooltip>{' '}
                      </span>
                      <ChromePicker
                        color={colorType === 'color' ? textColor : bgColor}
                        onChange={(color) =>
                          onClickOptionHandler(color, option)
                        }
                        style={{ backgroundColor: 'red', zIndex: 999 }}
                        disableAlpha={true}
                        border="1px solid green"
                      />
                      <span
                        className="my-1 flex cursor-pointer items-center justify-center bg-primary p-1 text-white"
                        onClick={() => removeColor(option)}
                      >
                        Remove Color
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      <Modal
        isOpen={openIconPanel}
        onClose={() => setOpenIconPanel()}
        title="Select Icon"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        width={'75rem'}
      >
        <div>
          {Object.entries(IconForOption).map(([key, value]) => {
            return (
              <div
                className="my-1 flex items-center justify-start gap-2 border p-2"
                key={key}
              >
                <Checkbox
                  color="primary"
                  checked={selectedOptionIcon?.key == key || false}
                  onChange={() => {
                    setSelectedOptionIcon({
                      label: key,
                      option: openIconPanel
                    });
                    setColorType('addIcon');
                  }}
                />
                <span className="px-1">{value}</span>: {key}
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default DataSourceManual;
