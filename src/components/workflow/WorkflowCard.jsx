import PropTypes from 'prop-types';

// material-ui

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { Label } from '@/componentss/ui/label';
import { Switch } from '@/componentss/ui/switch';

import {
  CircleCheckBig,
  CircleX,
  EllipsisVertical,
  Pencil,
  Trash2
} from 'lucide-react';

import { useState } from 'react';

import { useSelector } from 'react-redux';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { colors } from '../../common/constants/styles';

const WorkflowCard = ({
  items,
  goToRecordPanel,
  modalActionHandler,
  updateStatus
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentTheme } = useSelector((state) => state.auth);
  const { isOpen } = useSelector((state) => state.sidebar);
  const [flag, setFlag] = useState(false);

  const color = [colors.primary.main];

  function assignColorById(id) {
    const colorIndex = id % color.length;
    const assignedColor = color[colorIndex];

    return assignedColor;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function truncateAfterTwentyChars(input, limit) {
    if (!input) return '';
    if (input.length > limit) {
      return input.slice(0, limit) + '...';
    } else {
      return input;
    }
  }

  const menuItems = [
    {
      onClick: () => {
        modalActionHandler('edit', items?.uuid);
        handleClose();
      },
      icon: <ModeEditOutlineIcon fontSize="small" color="primary" />,
      label: <Label>Edit</Label>
    },
    {
      onClick: () => {
        modalActionHandler('delete', items?.uuid);
        handleClose();
      },
      icon: (
        <DeleteForeverIcon
          fontSize="small"
          color="primary"
          sx={{
            color: colors.error.main
          }}
        />
      ),
      label: <Label sx={{ color: 'red' }}>Delete</Label>
    }
  ];

  return (
    <>
      <div
        className={`p-4 shadow-sm ${
          currentTheme === 'Dark' ? 'bg-dark-level-1' : 'bg-white'
        } min-h-[135px] w-[98%] cursor-pointer rounded-lg transition-transform hover:outline hover:outline-1 hover:outline-secondary`}
        onClick={() => (!flag ? goToRecordPanel(items) : null)}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-secondary`}
              style={{
                // backgroundColor: assignColorById(items?.workflow_id),
                color: currentTheme === 'Dark' ? colors.white : ''
              }}
            >
              {items?.logo ? (
                <img
                  src={`${process.env.REACT_APP_STORAGE_URL}/${items?.logo}`}
                  alt="User Logo"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <Label className="text-sm text-white">
                  {items?.name?.charAt(0).toUpperCase()}
                </Label>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-grow flex-col">
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900">
                  {truncateAfterTwentyChars(items?.name, 50)}
                </span>
                <div className="ml-1">
                  <span className="tooltip" data-tooltip={items?.status}>
                    {items.status === 'Enabled' ? (
                      <CircleCheckBig
                        style={{
                          color: colors.white,
                          background: colors.success.main,
                          width: 16,
                          height: 16,
                          marginLeft: 0.5,
                          borderRadius: '100px'
                        }}
                      />
                    ) : (
                      <CircleX
                        style={{
                          color: colors.white,
                          background: colors.error.main,
                          width: 16,
                          height: 16,
                          marginLeft: 0.5,
                          borderRadius: '100px'
                        }}
                      />
                    )}
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-500">
                {items?.operation}
              </span>
            </div>
            {console.log(items.status)}
            {/* Switch  items.status */}
            <div onClick={(e) => e.stopPropagation()}>
              <Switch
                id="airplane-mode"
                checked={Boolean(items.status)}
                onCheckedChange={(checked) => updateStatus(checked, items)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label
              style={{
                color: colors.grey[700],
                fontSize: '0.75rem',
                fontWeight: 400,
                width: '50%'
              }}
            >
              {truncateAfterTwentyChars(items?.description, 80)}
            </Label>

            {/* Menu Button */}
            <div
              onMouseEnter={() => setFlag(true)}
              onMouseLeave={() => setFlag(false)}
              className="relative"
            >
              <button
                className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
                onClick={handleClick}
              >
                <EllipsisVertical size={16} />
              </button>

              {/* Dropdown Menu */}
              {anchorEl && (
                <div
                  className="absolute right-0 top-full mt-2 w-32 rounded-md bg-white p-2 shadow-lg"
                  onMouseLeave={handleClose}
                >
                  <button
                    onClick={() => {
                      modalActionHandler('edit', items?.uuid);
                      handleClose();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                  >
                    <Pencil size={16} style={{ color: 'blue' }} />
                    <Label style={{ color: 'blue', fontSize: '14px' }}>
                      Edit
                    </Label>
                  </button>
                  <button
                    onClick={() => {
                      modalActionHandler('delete', items?.uuid);
                      handleClose();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 size={16} style={{ color: 'red' }} />
                    <Label style={{ color: 'red', fontSize: '14px' }}>
                      Delete
                    </Label>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

WorkflowCard.propTypes = {
  isLoading: PropTypes.bool
};

export default WorkflowCard;
