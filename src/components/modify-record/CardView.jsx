import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Tooltip, Zoom, tooltipClasses } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import MoreVert from '@mui/icons-material/MoreVert';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { COLORS } from '../../common/constants/styles';
const CardView = ({
  groupedData,
  filteredColumns,
  formatDate,
  tab,
  onRecordSelected
}) => {
  const [showMoreItems, setShowMoreItems] = useState({});

  const toggleShowMore = (itemId) => {
    setShowMoreItems((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };
  return (
    <div>
      <div className="mb-5">
        {Object.keys(groupedData).map((date, dateIndex) => (
          <div key={dateIndex} className="flex justify-start">
            <div
              style={{
                marginRight: '20px',
                paddingLeft: '10px',
                minWidth: '130px',
                fontSize: '13px'
              }}
              className="mw-130 border-end mr-20 flex items-start justify-center pl-10"
            >
              <p className="mw-20 pt-2">{formatDate(date)}</p>
            </div>
            <div className="flex flex-wrap justify-start">
              <div className="flex flex-wrap justify-start pt-2">
                {groupedData[date].map((item, itemIndex) => {
                  const itemId = `${date}-${itemIndex}`;
                  const showMore = showMoreItems[itemId] || false;

                  return (
                    <div key={itemId} className="card-cover">
                      <div className="position-absolute flex w-full justify-end">
                        <Dropdown>
                          <Tooltip title="more">
                            <MenuButton
                              slots={{ root: IconButton }}
                              slotProps={{
                                root: {
                                  variant: 'plain',
                                  color: 'neutral',
                                  size: 'small'
                                }
                              }}
                              sx={{
                                // transform: "rotate(90deg)",
                                padding: 0
                              }}
                            >
                              <MoreVert
                                sx={{
                                  color: COLORS.SECONDARY
                                }}
                              />
                            </MenuButton>
                          </Tooltip>
                          <Menu placement="bottom-end">
                            <MenuItem
                              onClick={() => onRecordSelected(item?.id, tab)}
                            >
                              <ListItemDecorator>
                                <Edit />
                              </ListItemDecorator>
                              Edit
                            </MenuItem>
                          </Menu>
                        </Dropdown>
                      </div>
                      {filteredColumns?.map((column, columnIndex) => (
                        <p
                          key={columnIndex}
                          style={{
                            display:
                              !showMore && columnIndex >= 4 ? 'none' : '',
                            marginBottom: '4px'
                          }}
                        >
                          <span className="column-data">
                            {column.headerName.charAt(0).toUpperCase() +
                              column.headerName.slice(1)}
                          </span>
                          : {item[column.field]}
                        </p>
                      ))}
                      {!showMore && (
                        <div className="more-button">
                          <p
                            onClick={() => toggleShowMore(itemId)}
                            className="more-text"
                          >
                            More
                          </p>
                          <KeyboardArrowDownIcon className="more-icon" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardView;
