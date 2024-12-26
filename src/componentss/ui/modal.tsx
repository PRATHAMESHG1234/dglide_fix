import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/componentss/ui/dialog';
import { Button } from '@/componentss/ui/button';

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  firstButtonText?: string;
  secondButtonText?: string;
  firstButtonVariant?: string;
  width?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | string;
}

const Modal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  onCancel,
  children,
  width,
  firstButtonText,
  secondButtonText,
  firstButtonVariant = ''
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-[${width}rem] min-w-[${width}rem] width-[${width}rem] `}
        style={{ width: width }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </DialogDescription>
        </DialogHeader>
        {(secondButtonText || secondButtonText) && (
          <DialogFooter>
            <div className="flex justify-end gap-4">
              {firstButtonText && (
                <Button variant="outline" onClick={onCancel}>
                  {firstButtonText}
                </Button>
              )}
              {secondButtonText && (
                <Button onClick={onConfirm} className="font-bold">
                  {secondButtonText}
                </Button>
              )}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { Modal };
