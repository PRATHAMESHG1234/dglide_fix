import React, { useState, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Edit2, PackagePlus } from 'lucide-react';
import { ExecutionProcess } from './ExecutionProcess';
import { Button } from '@/componentss/ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@/componentss/ui/menubar';
import { ChevronDown } from 'lucide-react';

interface Action {
  actionInfoId: string | number;
  name: string;
  visibility: 'Record' | 'List' | 'Both';
}

interface ActionListProps {
  goToDataManagement: () => void;
  onActionClickHandler: (action: Action) => void;
  setDeleteRecordData: (value: boolean) => void;
  selectedRowsLength: number;
  children?: ReactNode[];
  Key: string;
  actions: Action[];
}

const ActionList: React.FC<ActionListProps> = ({
  goToDataManagement,
  onActionClickHandler,
  setDeleteRecordData,
  selectedRowsLength,
  children,
  Key,
  actions
}) => {
  const { currentForm } = useSelector((state: any) => state.current); // Replace `any` with your Redux state type if available
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionModal, setActionModal] = useState(false);
  const menuOpen = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const filterActionsByKey = (actions: Action[], keyname: string) => {
    if (!keyname) {
      return actions;
    } else if (keyname === 'dataPreview') {
      return actions.filter(
        (action) =>
          action.visibility === 'Record' || action.visibility === 'Both'
      );
    } else if (keyname === 'dataGrid') {
      return actions.filter(
        (action) => action.visibility === 'List' || action.visibility === 'Both'
      );
    } else {
      return actions;
    }
  };

  return (
    <>
      <Menubar className="border-none">
        <MenubarMenu>
          <MenubarTrigger
            asChild
            className="cursor-pointer focus:bg-primary focus:text-white data-[state=close]:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-white"
          >
            <Button
              className="cursor-pointer focus:bg-transparent focus:text-secondary data-[state=open]:bg-transparent data-[state=open]:text-secondary"
              variant="outline"
              size="sm"
            >
              Action <ChevronDown size={20} />
            </Button>
          </MenubarTrigger>
          <MenubarContent className="min-w-[6rem]">
            {Key !== 'dataGrid' && (
              <MenubarItem
                onClick={() => {
                  goToDataManagement();
                  handleClose();
                }}
                className="flex cursor-pointer items-center gap-x-2"
              >
                <Edit2 className="text-primary" /> Create New Record
              </MenubarItem>
            )}
            {filterActionsByKey(actions, Key)?.map((action) => (
              <MenubarItem
                key={action.actionInfoId}
                onClick={() => {
                  onActionClickHandler(action);
                  handleClose();
                }}
                className="flex cursor-pointer items-center gap-x-2"
              >
                {action.name}
              </MenubarItem>
            ))}
            {children?.map((tab, index) => (
              <MenubarItem
                key={index}
                onClick={handleClose}
                className="flex cursor-pointer items-center gap-x-2"
              >
                {tab}
              </MenubarItem>
            ))}
            {selectedRowsLength > 0 && (
              <MenubarItem
                onClick={() => {
                  setDeleteRecordData(true);
                  handleClose();
                }}
                className={`flex cursor-pointer items-center gap-x-2 text-destructive ${
                  selectedRowsLength ? 'bg-[COLORS.LAVENDER]' : ''
                }`}
              >
                {`Delete ${selectedRowsLength ? selectedRowsLength : ''} Records`}
              </MenubarItem>
            )}
            {currentForm?.name === 'requests' && (
              <MenubarItem
                onClick={() => {
                  setActionModal(true);
                  handleClose();
                }}
                className={`flex cursor-pointer items-center gap-x-2 ${
                  selectedRowsLength ? 'bg-[COLORS.LAVENDER]' : ''
                }`}
              >
                Action
              </MenubarItem>
            )}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {actionModal && (
        <ExecutionProcess
          actionModal={actionModal}
          onCancel={() => setActionModal(false)}
        />
      )}
    </>
  );
};

export default ActionList;
