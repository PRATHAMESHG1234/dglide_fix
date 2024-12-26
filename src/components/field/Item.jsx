import { useState } from 'react';

import { GripVertical, Trash2 } from 'lucide-react';
import Icon from '../../elements/Icon';
import ConfirmationModal from '../shared/ConfirmationModal';
import { COLORS, colors } from '../../common/constants/styles';
import { useSelector } from 'react-redux';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/componentss/ui/tooltip';

const Item = ({ field, onSelect, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStyle, setShowStyle] = useState(false);
  const { currentTheme } = useSelector((state) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = (field) => {
    if (!isProcessing) {
      onSelect(field);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  return (
    <>
      <div
        className="relative flex w-full items-center border transition-all"
        style={{
          backgroundColor: showStyle
            ? '#CCD0D780'
            : currentTheme === 'Dark'
              ? colors.darkTab
              : COLORS.WHITE,
          borderColor: showStyle ? COLORS.SECONDARY : '#D9D9D900'
        }}
        onMouseOver={() => setShowStyle(true)}
        onMouseOut={() => setShowStyle(false)}
      >
        <div className="flex cursor-grab items-center space-x-2 pr-2">
          <GripVertical size={18} style={{ color: COLORS.SECONDARY }} />
          <Icon
            name={field.category}
            size={18}
            style={{ margin: '2px' }}
            className="text-xs"
          />
        </div>

        <div
          className="flex min-h-8 flex-grow cursor-pointer items-center truncate text-xs font-normal text-black dark:text-white"
          onClick={() => handleClick(field)}
        >
          {field.label}
        </div>

        <div
          className="flex items-center border-l"
          style={{
            borderColor: showStyle ? COLORS.SECONDARY : 'transparent',
            cursor: 'pointer'
          }}
        >
          {(!field.default || !field.systemDefaultField) && (
            <Tooltip>
              <TooltipTrigger>
                <div
                  className="px-2"
                  onClick={() => setShowDeleteModal(!showDeleteModal)}
                >
                  <Trash2
                    size={16}
                    style={{
                      color: showStyle ? 'red' : 'transparent',
                      fontSize: '20px'
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete this field</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmationModal
          open={showDeleteModal}
          heading={`Delete field ?`}
          message={'Are you sure you want to delete this field ?'}
          onConfirm={() => onDelete(field)}
          onCancel={() => setShowDeleteModal(!showDeleteModal)}
          firstButtonText="Cancel"
          secondButtonText="Confirm"
        />
      )}
    </>
  );
};

export default Item;
