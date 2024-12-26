import React from 'react';
import { Modal } from '@/componentss/ui/modal';

function ConfirmationModal(props) {
  const {
    open,
    heading,
    message,
    onConfirm,
    onCancel,
    buttonPosition,
    firstButtonText,
    secondButtonText
  } = props;

  return (
    <Modal
      isOpen={open}
      onClose={onCancel}
      title={heading}
      description={message}
      onConfirm={onConfirm}
      onCancel={onCancel}
      firstButtonText={firstButtonText}
      secondButtonText={secondButtonText}
      width={'32rem'}
      // firstButtonVariant={buttonPosition === 'delete' ? 'Delete' : ''}
    >
      {message}
    </Modal>
  );
}

export default ConfirmationModal;
