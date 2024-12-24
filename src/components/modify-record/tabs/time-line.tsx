import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/componentss/ui/card';
import { Laptop, Repeat2 } from 'lucide-react';
import Dialog from '../../../elements/Dialog';
import MailDetails from '../../../pages/MailDetails';
import { fetchTableReferenceDataByUUID } from '../../../services/table';
import SocialActivity from '../../../pages/SocialActivity';
import moment from 'moment';
import { Modal } from '@/componentss/ui/modal';
interface TimelineProps {
  rows: { id: string; type: string; [key: string]: any }[]; // Adjust properties as needed
  columns: [];
  tab: any;
  onRecordSelected: any;
  uploadTab: any;
  open?: boolean;
}

export default function Timeline({
  rows,
  columns,
  tab,
  onRecordSelected,
  uploadTab,
  open
}: TimelineProps) {
  const [showMailDialog, setShowMailDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedMail, setSelectedMail] = useState(null);
  const onMailSelected = (selectedRowId, tab) => {
    if (!selectedRowId || !tab) return null;
    // setSelectedTabDataRecordId(selectedRowId);

    fetchTableReferenceDataByUUID(tab?.fieldInfoId, selectedRowId).then(
      (res) => {
        setSelectedMail(res?.result);
      }
    );
    setShowMailDialog(true);
  };
  const onSocialSelected = (selectedRowId, tab) => {
    if (!selectedRowId || !tab) return null;
    // setSelectedTabDataRecordId(selectedRowId);
    fetchTableReferenceDataByUUID(tab?.fieldInfoId, selectedRowId).then(
      (res) => {
        setSelectedMail(res?.result);
      }
    );
    setShowActivityDialog(true);
  };
  const modifiedColumns = (columns as { field: string }[])
    ?.filter(
      (column) => column.field === 'description' || column.field === 'details'
    )
    .map((column) => column.field);
  function truncateString(str, maxLength) {
    if (str?.length > maxLength) {
      return str?.slice(0, maxLength) + '...';
    }

    return str;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 transform border-l-2 border-dashed border-gray-300"></div>

        {rows.map((item, index) => {
          const mappedArray = Object.entries(item).map(([key, value]) => ({
            key,
            value
          }));
          const Inbound = item['type'] === 'Inbound Email';
          return (
            <div
              key={index}
              className={`mb-8 flex w-full items-center justify-between ${Inbound ? 'flex-row' : 'flex-row-reverse'} `}
            >
              <div className="w-1/2 px-6 py-4">
                <Card
                  className={`${Inbound ? 'mr-auto' : 'ml-auto'} relative ${
                    Inbound ? 'bg-orange-100' : 'bg-blue-100'
                  } border border-dashed ${Inbound ? 'border-primary' : 'border-secondary'} h-14 cursor-pointer rounded-md p-0`}
                  onClick={() => {
                    if (item.type === 'Outbound Email') {
                      onMailSelected(item?.id, tab);
                      setSelectedId(item?.id);
                    } else if (item.type === 'Social Activity') {
                      onSocialSelected(item?.id, tab);
                    } else if (item.type === 'Inbound Email') {
                      onMailSelected(item?.id, tab);
                      setSelectedId(item?.id);
                    } else {
                      onRecordSelected(item?.id, tab);
                    }
                  }}
                >
                  <CardContent className="p-2 px-3">
                    <CardTitle
                      className={
                        Inbound
                          ? 'text-xs font-semibold text-primary'
                          : 'text-xs font-semibold text-secondary'
                      }
                    >
                      {item['type']}
                    </CardTitle>
                    {mappedArray
                      ?.filter((data) => modifiedColumns?.includes(data?.key))
                      .map((d, index) => (
                        <div
                          className="flex"
                          key={index}
                          style={{ marginBottom: '4px' }}
                        >
                          <span
                            className="line-clamp-1 w-3/4 break-words ps-1 text-sm"
                            dangerouslySetInnerHTML={{
                              __html: d?.value
                            }}
                          />
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </div>
              <div
                className={`z-20 flex h-8 w-8 items-center rounded-full shadow-xl ${Inbound ? 'bg-primary' : 'bg-secondary'}`}
              >
                <h1 className="mx-auto text-lg font-semibold text-white">
                  {Inbound ? <Laptop size={16} /> : <Repeat2 size={16} />}
                </h1>
              </div>
              <div
                className={`flex w-1/2 px-2 text-xs ${Inbound ? 'justify-start' : 'justify-end'}`}
              >
                {moment(item?.created_at).format('DD MMM hh:mm a')}
              </div>
            </div>
          );
        })}
      </div>
      {showMailDialog && (
        <Modal
          isOpen={showMailDialog}
          onClose={() => setShowMailDialog(false)}
          onConfirm={() => {}}
          title={`Email`}
          description=""
          width={'75rem'}
        >
          <MailDetails
            mailData={selectedMail}
            formId={tab?.id}
            uploadTab={uploadTab}
            selectedId={selectedId}
            open={open}
          />
        </Modal>
      )}

      {showActivityDialog && (
        <Dialog
          title={'Social Activity'}
          // width="sm"
          secondButtonText={'Close'}
          open={showActivityDialog}
          setOpen={setShowActivityDialog}
          body={
            selectedMail && (
              <SocialActivity socialData={selectedMail} formId={tab?.id} />
            )
          }
        />
      )}
    </div>
  );
}
