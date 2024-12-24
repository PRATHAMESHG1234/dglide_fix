import PropTypes from 'prop-types';

import { colors } from '../../common/constants/styles';
import { useState } from 'react';

import { MODAL } from '../../common/utils/modal-toggle';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import moment from 'moment-timezone';
import { getTimeDifference } from '../../common/constants/helperFunction';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/componentss/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/componentss/ui/tooltip';

import {
  CircleCheck,
  Ellipsis,
  Trash,
  Info,
  Move,
  Settings,
  AlignJustify,
  Type,
  Edit
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/componentss/ui/avatar';

const LightCard = ({
  Item,
  goToPanel,
  onActionClick,
  type,
  goToSchemaList,
  goToFields
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentTheme } = useSelector((state) => state.auth);

  const handleClose = () => {
    setAnchorEl(null);
    setFlag(false);
  };

  function truncateAfterTwentyChars(input, limit) {
    if (!input) return '';
    if (input.length > limit) {
      return input.slice(0, limit) + '...';
    } else {
      return input;
    }
  }
  const navigate = useNavigate();

  const { currentModule } = useSelector((state) => state.current);
  const [flag, setFlag] = useState(false);

  const menuItems = [
    {
      action: MODAL.edit,
      icon: <Edit size={16} className="text-secondary" />,
      label: 'Edit'
    },
    {
      action: MODAL.delete,
      icon: <Trash size={16} className="text-secondary" />,
      label: 'Delete'
    }
  ];

  const additionalMenuItems = [
    {
      action: () => goToFields(Item),
      icon: <AlignJustify size={16} className="text-secondary" />,
      label: 'Fields'
    }
  ];

  const formSpecificItems = [
    {
      action: MODAL.moveTo,
      icon: <Move size={16} className="text-secondary" />,
      label: 'Move'
    }
  ];

  const lastUpdatedTime = getTimeDifference(Item?.updatedOn);
  const updatedByName =
    Item?.updatedByName === 'Super Admin'
      ? 'admin'
      : Item?.updatedByName || 'admin';

  return (
    <>
      <div
        className={`h-[220px] min-w-[260px] max-w-[260px] transform cursor-pointer rounded-2xl border border-white bg-white p-4 transition-transform hover:scale-95 dark:border dark:border-transparent dark:bg-slate-800 ${
          currentTheme === 'Light'
            ? 'shadow-[0px_8px_24px_rgba(149,157,165,0.2)]'
            : ''
        } `}
        onClick={() => (!flag ? goToPanel(Item) : null)}
      >
        <div className="flex max-w-52 flex-col items-start justify-start gap-y-4">
          <div className="flex w-full">
            <div className="flex justify-between gap-x-[8.5rem]">
              <div className="flex">
                <Avatar className="h-12 w-12 bg-secondary">
                  <AvatarImage
                    src={
                      Item?.logo &&
                      `${process.env.REACT_APP_STORAGE_URL}/${Item?.logo}`
                    }
                  />
                  <AvatarFallback className="bg-secondary text-2xl text-white dark:text-slate-800">
                    {Item?.displayName && typeof Item.displayName === 'string'
                      ? Item.displayName[0]?.toUpperCase()
                      : ''}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div
                className="flex"
                onMouseEnter={() => setFlag(true)}
                onMouseLeave={() => setFlag(false)}
              >
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger>
                      <DropdownMenuTrigger asChild>
                        <div ref={anchorEl} onClick={handleClose} className="">
                          <Ellipsis
                            size={20}
                            className="rounded-full text-slate-400 hover:text-black"
                          />
                        </div>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="mb-12">
                      <p>view more option</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    sideOffset={4}
                    className="rounded-md border border-gray-200 bg-white shadow-md"
                  >
                    {menuItems.map(({ action, icon, label }) => (
                      <DropdownMenuItem
                        key={label}
                        onClick={() => {
                          onActionClick(action, Item.id);
                          handleClose();
                        }}
                        className="hover:bg-primary-light flex cursor-pointer items-center space-x-2"
                      >
                        <span className="text-primary-main text-sm">
                          {icon}
                        </span>
                        <span className="text-primary-main text-sm">
                          {label}
                        </span>
                      </DropdownMenuItem>
                    ))}

                    {type === 'Form' &&
                      additionalMenuItems.map(({ action, icon, label }) => (
                        <DropdownMenuItem
                          key={label}
                          onClick={action}
                          className="hover:bg-primary-light flex cursor-pointer items-center space-x-2"
                        >
                          <span className="text-primary-main text-sm">
                            {icon}
                          </span>
                          <span className="text-primary-main text-sm">
                            {label}
                          </span>
                        </DropdownMenuItem>
                      ))}

                    {type === 'Form' && (
                      <>
                        {formSpecificItems.map(({ action, icon, label }) => (
                          <DropdownMenuItem
                            key={label}
                            onClick={() => {
                              onActionClick(action, Item.id);
                              handleClose();
                            }}
                            className="hover:bg-primary-light flex cursor-pointer items-center space-x-2"
                          >
                            <span className="text-primary-main text-sm">
                              {icon}
                            </span>
                            <span className="text-primary-main text-sm">
                              {label}
                            </span>
                          </DropdownMenuItem>
                        ))}

                        {Item?.tree && (
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(
                                `/app/${currentModule?.name}/${Item?.name}/tree-structure`
                              )
                            }
                            className="hover:bg-primary-light"
                          >
                            <span className="text-primary-main text-sm">
                              Tree view
                            </span>
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="flex min-h-16 w-full flex-col">
            <span className="line-clamp-1 flex items-center gap-x-2 text-xl font-semibold text-slate-900">
              <span className="line-clamp-1 max-w-44">{Item?.displayName}</span>
              <CircleCheck
                size={16}
                strokeWidth={3}
                className="mr-1 rounded-full text-green-400"
              />
            </span>

            <span
              className="line-clamp-2 flex items-center gap-x-2 text-xs font-medium text-slate-400"
              key={Item?.displayName}
            >
              {lastUpdatedTime ? (
                <>
                  {lastUpdatedTime} by {updatedByName}
                </>
              ) : (
                'updated by admin'
              )}
            </span>
          </div>
          <div className="flex max-h-12 max-w-52 flex-col">
            <span className="line-clamp-1 flex items-center gap-x-2 text-xs font-normal text-slate-700">
              {truncateAfterTwentyChars(Item?.description, 68)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

LightCard.propTypes = {
  isLoading: PropTypes.bool
};

export default LightCard;
