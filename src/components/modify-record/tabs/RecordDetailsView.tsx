import { Button } from '@/componentss/ui/button';
import { useSidebar } from '@/componentss/ui/sidebar';
import { SquareArrowOutUpRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/componentss/ui/tooltip';

import { Modal } from '@/componentss/ui/modal';
const URL = process.env.REACT_APP_STORAGE_URL;

interface RecordDetailsViewProps {
  showEditRecord: (show: boolean) => void;
  fields: any;
  fieldGroups: any;
  fieldValues: any;
  toggle: string;
  minimizeView?: boolean;
}
interface DescModalState {
  isOpen: boolean;
  fieldInfoId: number;
  isExpanded: boolean;
}
const RecordDetailsView: React.FC<RecordDetailsViewProps> = ({
  showEditRecord,
  fields,
  fieldGroups,
  fieldValues,
  toggle,
  minimizeView
}) => {
  const { currentForm } = useSelector((state: any) => state.current);
  const [groupOfFields, setGroupOfFields] = useState([]);
  // const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  const [descModal, setDescModal] = useState<DescModalState>({
    isOpen: false,
    fieldInfoId: 0,
    isExpanded: false
  });

  const descriptionRef = useRef<HTMLDivElement>(null);
  const { open: isSidebarOpen } = useSidebar();

  useEffect(() => {
    const groupOfFieldArr = [];

    const filteredFields = fields?.filter((field) => {
      if (
        field.category === 'TableReference' ||
        field.category === 'TableLookup'
      ) {
        return false;
      }
      return true;
    });

    for (let i = 0; i <= fieldGroups?.length; i++) {
      const groupArr = filteredFields
        ?.filter((field) => field.fieldGroup?.name === fieldGroups[i]?.name)
        ?.map((fld) => fld);
      if (groupArr.length !== 0) {
        groupOfFieldArr.push(groupArr);
      }
    }
    setGroupOfFields([...groupOfFieldArr]);
  }, [fieldGroups, fields]);

  useEffect(() => {
    if (descriptionRef.current) {
      const isOverflowing =
        descriptionRef.current.scrollHeight >
        descriptionRef.current.clientHeight;
      setShowReadMore(isOverflowing);
    }
  }, [fieldValues]);
  //
  return (
    <div className={`${minimizeView ? 'pl-4 pr-4' : 'pl-4 pr-4'} bg-[#f7f8fa]`}>
      {/* Header */}
      <div className="flex justify-between gap-4">
        <div className="pb-1 text-xl text-black">
          {currentForm?.displayName} {minimizeView ? 'Summary' : 'Details'}
        </div>
      </div>
      {/* Body */}
      <div className="h-[calc(100vh-132px)] overflow-y-auto pb-12 pt-4">
        <div
          className={` ${minimizeView ? 'flex w-full flex-col' : 'grid w-full'} ${
            !minimizeView
              ? toggle === 'Format-1'
                ? 'grid-cols-2'
                : 'grid-cols-3'
              : 'grid-cols-1'
          } gap-4 pr-2`}
        >
          {groupOfFields?.map((fields, ind) => {
            const isFullWidthEnabled =
              fields?.[0]?.fieldGroup?.enableFullWidth ?? false;
            const isLabelHidden = fields?.[0]?.fieldGroup?.hideLabel ?? false;

            return (
              <div
                key={ind}
                className={`rounded-md border-2 bg-[#ffffff] px-4 py-1 ${
                  isFullWidthEnabled
                    ? toggle === 'Format-1'
                      ? 'col-span-2'
                      : 'col-span-3'
                    : 'grid-cols-1'
                }`}
              >
                {!isLabelHidden && fields?.[0]?.fieldGroup?.name && (
                  <div className="h-9 py-2 text-sm font-semibold">
                    {fields?.[0]?.fieldGroup?.name}
                  </div>
                )}
                {fields?.map((field) => {
                  const options = field?.type === 'select' && field?.options;
                  const value = fieldValues[field?.name];
                  const updatedValue =
                    typeof value === 'string'
                      ? value.replace(/STORAGE_URL/g, URL)
                      : value;

                  const selectedOption =
                    options &&
                    options.find(
                      (option) =>
                        option.label === fieldValues[field?.name + '_display']
                    );
                  //
                  const optionStyle =
                    selectedOption && JSON.parse(selectedOption?.style);

                  const renderFieldContent = () => {
                    if (field?.type?.toLowerCase() === 'textarea')
                      return (
                        <div
                          key={field.name}
                          className={`${
                            descModal?.isExpanded &&
                            descModal?.fieldInfoId === field?.fieldInfoId
                              ? ''
                              : 'line-clamp-6'
                          } flex justify-start gap-8 py-1 text-sm font-normal text-slate-600`}
                        >
                          <div className="flex flex-col">
                            <div
                              ref={descriptionRef}
                              className={`${
                                descModal?.isExpanded &&
                                descModal?.fieldInfoId === field?.fieldInfoId
                                  ? ''
                                  : 'line-clamp-6'
                              } whitespace-normal break-words ${
                                isSidebarOpen
                                  ? 'max-w-[calc(100vw-110px)]'
                                  : 'max-w-[calc(100vw-50px)]'
                              }`}
                              dangerouslySetInnerHTML={{
                                __html:
                                  fieldValues[field?.name + '_display'] ||
                                  updatedValue ||
                                  '<span class="tracking-tighter">- - -</span>'
                              }}
                            ></div>
                            <div className="flex items-center gap-2">
                              {showReadMore && (
                                <span
                                  className="my-2 w-20 cursor-pointer rounded-md bg-[#D5E6FB] p-1 px-2 text-xs text-secondary"
                                  onClick={() =>
                                    setDescModal((prev) => ({
                                      ...prev,
                                      isOpen: false,
                                      fieldInfoId: field?.fieldInfoId,
                                      isExpanded: !prev?.isExpanded
                                    }))
                                  }
                                  aria-label={
                                    descModal?.isExpanded &&
                                    descModal?.fieldInfoId ===
                                      field?.fieldInfoId
                                      ? 'Show Less Content'
                                      : 'Read More Content'
                                  }
                                >
                                  {descModal?.isExpanded &&
                                  descModal?.fieldInfoId === field?.fieldInfoId
                                    ? 'Show Less'
                                    : 'Read More'}
                                </span>
                              )}
                              {descModal?.isExpanded &&
                                descModal?.fieldInfoId ===
                                  field?.fieldInfoId && (
                                  <div className="flex w-auto cursor-pointer items-center rounded-md bg-[#D5E6FB] px-2 py-1 text-xs text-secondary">
                                    <Tooltip>
                                      <TooltipTrigger className="">
                                        <span
                                          onClick={() =>
                                            setDescModal((prev) => ({
                                              ...prev,
                                              isOpen: true,
                                              fieldInfoId: field?.fieldInfoId
                                            }))
                                          }
                                          aria-label="Read More Content"
                                        >
                                          <SquareArrowOutUpRight size={16} />
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="right"
                                        align="center"
                                        className="ms-2"
                                      >
                                        Open Detailed View
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      );

                    return (
                      fieldValues[field?.name + '_display'] ||
                      fieldValues[field?.name] || (
                        <span className="tracking-tighter">- - -</span>
                      )
                    );
                  };

                  return (
                    <div
                      key={field.name}
                      className={`flex justify-start gap-0 py-1 text-sm font-normal text-slate-600 ${isFullWidthEnabled && field?.type?.toLowerCase() === 'textarea' && 'flex-col gap-[0px]'}`}
                    >
                      <div className={`line-clamp-1 w-56`}>{field.label}</div>

                      <div
                        className={`line-clamp-1 ${isFullWidthEnabled ? (field?.type?.toLowerCase() === 'textarea' ? 'w-full' : 'w-full ps-5') : 'w-3/4'}`}
                      >
                        {optionStyle?.backgroundColor || optionStyle?.color ? (
                          <div
                            className="inline-block min-w-14 items-center justify-center rounded-full px-2 py-1 text-center"
                            style={{
                              backgroundColor: optionStyle?.backgroundColor,
                              color: optionStyle?.color
                            }}
                          >
                            {renderFieldContent()}
                          </div>
                        ) : (
                          renderFieldContent()
                        )}
                      </div>
                      {field?.type === 'textarea' &&
                        field?.fieldInfoId === descModal?.fieldInfoId && (
                          <Modal
                            isOpen={descModal?.isOpen}
                            onClose={() =>
                              setDescModal((prev) => ({
                                ...prev,
                                isOpen: false
                              }))
                            }
                            title={field?.label || 'Description'}
                            description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                            onConfirm={() => console.log('conformed..!')}
                            onCancel={() =>
                              setDescModal((prev) => ({
                                ...prev,
                                isOpen: false
                              }))
                            }
                            width={'75'}
                            firstButtonText={'Close'}
                            firstButtonVariant="Delete"
                            secondButtonText=""
                            // className="overflow-hidden"
                          >
                            <div
                              key={field.name}
                              className={`${
                                descModal?.isExpanded ? '' : 'line-clamp-6'
                              } flex justify-start gap-8 py-1 text-sm font-normal text-slate-600`}
                            >
                              <div className="flex flex-col">
                                <div
                                  ref={descriptionRef}
                                  className={`${
                                    descModal?.isExpanded ? '' : 'line-clamp-6'
                                  } w-[90%] whitespace-normal break-words ${
                                    isSidebarOpen
                                      ? 'max-w-[calc(100vw-110px)]'
                                      : 'max-w-[calc(100vw-50px)]'
                                  }`}
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      fieldValues[field?.name + '_display'] ||
                                      updatedValue ||
                                      '<span class="tracking-tighter">- - -</span>'
                                  }}
                                ></div>
                              </div>
                            </div>
                          </Modal>
                        )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecordDetailsView;
