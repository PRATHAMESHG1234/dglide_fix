import React from 'react';
import { Button } from '@/componentss/ui/button';

interface ConditionButtonsProps {
  addSearchCondition: (condition: string) => void;
}

const ConditionButtons: React.FC<ConditionButtonsProps> = ({
  addSearchCondition
}) => {
  const buttons = [
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: 'OR', value: 'OR' },
    { label: 'AND', value: 'AND' }
  ];

  return (
    <div className="mb-1 flex w-full justify-evenly gap-2">
      {buttons.map((button, index) => (
        <Button
          key={index}
          variant="outline"
          className="flex flex-grow"
          onClick={() => addSearchCondition(button.value)}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};

export default ConditionButtons;
