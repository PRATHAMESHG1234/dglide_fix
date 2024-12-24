import React from 'react';
import { Button } from '@/componentss/ui/button';
import { ArrowDownAZ, Mail, Plus } from 'lucide-react';

interface HeaderActionsProps {
  onclickSort: () => void;
  addNewRecord: (tab: Tab) => void;
  tab: Tab | null;
  handleClickOpen: () => void;
}

interface Tab {
  field?: {
    mailEnabled?: boolean;
  };
  type?: string;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  onclickSort,
  addNewRecord,
  tab,
  handleClickOpen
}) => {
  return (
    <div
      className="absolute m-2 mx-3 flex justify-between"
      style={{ right: 0, top: 2 }}
    >
      <span className="relative flex items-center justify-center gap-1" />

      <span className="flex h-7 gap-3">
        {tab?.type !== 'audit' && tab?.type !== 'attachment' && (
          <Button onClick={onclickSort} variant="outline">
            <ArrowDownAZ size={14} />
          </Button>
        )}

        {tab?.field?.mailEnabled && (
          <Button onClick={handleClickOpen} variant="outline">
            <Mail size={14} />
            Mail
          </Button>
        )}
        {tab?.type !== 'audit' && tab?.type !== 'attachment' && (
          <Button
            onClick={() => addNewRecord(tab!)}
            className="font-bold text-white"
          >
            <Plus size={16} strokeWidth={3} className="text-white" /> Add
          </Button>
        )}
      </span>
    </div>
  );
};

export default HeaderActions;
