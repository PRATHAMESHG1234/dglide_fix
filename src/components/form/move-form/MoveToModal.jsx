import { useEffect, useState } from 'react';
import { Sheet, SheetContent } from '@/componentss/ui/sheet';

import { Button } from '@/componentss/ui/button';
import { Label } from '@/componentss/ui/label';
import { Separator } from '@/componentss/ui/separator';
import { Dropdown } from '@/componentss/ui/dropdown';

const MoveToModal = ({ state, moduleList, onConfirm, onCancel }) => {
  const [moduleSelected, setModuleSelected] = useState('');

  useEffect(() => {
    setModuleSelected(state?.selected?.moduleInfoId);
  }, [state]);

  const onModuleSelectHandler = (value) => {
    setModuleSelected(value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    onConfirm(moduleSelected);
  };

  return (
    <>
      <Sheet key={'right'} open={state.show} onOpenChange={onCancel}>
        <SheetContent
          side={'right'}
          className="max-w-[600px] bg-white sm:max-w-[600px]"
        >
          <div className="py-1.5 pr-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Label className={`text-sm font-medium text-gray-700`}>
                Transfer Form to Another Module
              </Label>
              <div></div>
            </div>
            <div className="py-2">
              <Separator className="h-[1px]" />
            </div>
          </div>
          <div className="pb-5 pt-2">
            <Dropdown
              label={'Select Module'}
              value={moduleSelected}
              onChange={(e) => onModuleSelectHandler(e.target.value)}
              options={moduleList.map((module) => ({
                label: module.displayName,
                value: module.moduleInfoId
              }))}
              placeholder="Select Module"
            />
          </div>
          <div className="flex items-center gap-x-2 py-2">
            <Button onClick={onSubmitHandler}>Save</Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MoveToModal;
