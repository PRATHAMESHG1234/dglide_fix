/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import AccountCircleTwoTone from '@mui/icons-material/AccountCircleTwoTone';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import { CircularProgress, Typography } from '@mui/material';

import { COLORS, colors } from '../../../common/constants/styles';
import UserCountCard from '../../../elements/UserCountCard';
import { fetchDashboardByDashboardInfoId } from '../../../redux/slices/dashboardSlice';
import { fetchConfigDetail } from '../../../services/chart';

const CardSection = ({
  droppedItemIds,
  setDroppedItemIds,
  data,
  setData,
  setPreviousDashboardItemInfoIds,
  droppedItems,
  setDroppedItems,
  previousDashboardItemInfoIds,
  checkedDashItem,
  setCheckedDashItem,
  currentItem,
  handleSaveClick,
  loadingCard,
  setLoadingCard,
  uncheck,
  setUncheck,
  type,
  isDelete
}) => {
  const dispatch = useDispatch();

  const [cardData, setCardData] = useState();
  const [responseData, setResponseData] = useState();
  const [shiftedIds, setShiftedIds] = useState(null);
  const { currentTheme } = useSelector((state) => state.auth);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const icons = [
    AccountCircleTwoTone,
    DescriptionTwoToneIcon,
    MonetizationOnTwoToneIcon,
    AccountBalanceRoundedIcon
  ];

  const color = ['#2196F3', '#673AB7', '#00C853', '#FFC107'];
  const getIconByIndex = (index) => {
    return icons[index % icons.length];
  };
  const getColorByIndex = (index) => {
    return color[index % color.length];
  };
  useEffect(() => {
    if (queryParams && queryParams.get('selectedId')) {
      dispatch(
        fetchDashboardByDashboardInfoId({
          dashboardInfoId: queryParams.get('selectedId'),
          data: {
            range: null
          }
        })
      ).then((response) => setResponseData(response.payload));
    }
  }, []);

  useEffect(() => {
    if (currentItem || uncheck) {
      if (currentItem && currentItem.type.toLowerCase() === 'card') {
        setLoadingCard(true);
        getCardData(currentItem?.dashboardItemInfoId);
      }
      if (uncheck && type === 'card') {
        setPreviousDashboardItemInfoIds(
          checkedDashItem.map((item) => item?.dashboardItemInfoId)
        );
        setUncheck(false);
      }
    }
  }, [currentItem, uncheck]);

  async function getCardData(id) {
    const result = await fetchConfigDetail(id);
    if (result) {
      let cardFieldName = JSON.parse(result?.options);
      let cardNames = cardFieldName[0].where[0].fieldName;

      if (result?.type === 'card') {
        let id = new Date().getTime();
        if (
          !previousDashboardItemInfoIds.includes(result.dashboardItemInfoId)
        ) {
          setData((prevItems) => ({
            ...prevItems,
            items: [
              ...prevItems.items,
              {
                dashboardItemInfoId: result?.dashboardItemInfoId,
                formDisplayName: result?.formDisplayName,
                id: id,
                type: result?.type,
                data: result?.result,
                cardDisplayName: cardNames,
                result: result?.result,
                formName: result?.formName,
                name: result?.name
              }
            ]
          }));

          setPreviousDashboardItemInfoIds((prevIds) => [
            ...prevIds,
            result.dashboardItemInfoId
          ]);
        } else {
          notify.error('Card already exists.');
        }
      }
    }
    setLoadingCard(false);
  }

  // }

  const ItemType = 'ITEM';

  const finalItems = data?.items?.filter((item) => item.type === 'card');

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...finalItems];

    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);

    setData((prevData) => {
      const newItems = prevData.items.map((item) => {
        if (item.type === 'card') {
          return updatedItems.shift();
        }
        return item;
      });
      setShiftedIds(newItems.map((item) => item.dashboardItemInfoId));

      return {
        ...prevData,
        items: newItems
      };
    });
    const newArray = [
      ...shiftedIds,
      ...previousDashboardItemInfoIds.filter((id) => !shiftedIds.includes(id))
    ];
    if (shiftedIds.length > 0) {
      setPreviousDashboardItemInfoIds(newArray);
    }
  };

  const DraggableItem = ({ item, index, moveItem }) => {
    const [{ isDragging }, ref] = useDrag({
      type: ItemType,
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    });

    const [, drop] = useDrop({
      accept: ItemType,
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveItem(draggedItem.index, index);
          draggedItem.index = index;
        }
      }
    });

    return (
      <div
        ref={(node) => ref(drop(node))}
        style={{
          opacity: isDragging ? 0.5 : 1,

          padding: '0.5rem 0.5rem',
          marginBottom: '.5rem',
          backgroundColor: isDragging ? 'lightblue' : '#eef2f6',
          cursor: 'move',
          position: 'relative'
        }}
        className=""
      >
        {item}
      </div>
    );
  };

  const handleCrossIconClick = (dashboardItemInfoIds) => {
    setData((prevData) => ({
      ...prevData,
      items: prevData.items.filter(
        (_, i) => _.dashboardItemInfoId !== dashboardItemInfoIds
      )
    }));
    setPreviousDashboardItemInfoIds((prevItemIds) =>
      prevItemIds.filter((id) => id !== dashboardItemInfoIds)
    );
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          // justifyContent: 'center',
          alignItems: 'center',
          border: `2px dashed ${COLORS.GRAYSCALE}`,
          borderRadius: '10px',
          width: '100%',
          height: 'auto',
          minHeight: '150px',
          background: '#eef2f6',
          boxShadow: '0px 10px 24px -3px rgba(0,0,0,0.1)'
        }}
      >
        {data?.items?.filter(
          (item) => item?.type === 'card' && item?.result !== null
        ).length === 0 ? (
          <Typography style={{ color: colors.grey[500], fontSize: '16px' }}>
            Select cards using the{' '}
            <CheckBoxIcon style={{ fontSize: 'inherit' }} /> checkbox.
          </Typography>
        ) : (
          data?.items?.length > 0 &&
          data?.items
            .filter((item) => item.type === 'card' && item.result !== null)
            ?.map((item, index) => (
              <DraggableItem
                key={item?.dashboardItemInfoId}
                item={
                  <span
                    key={item?.dashboardItemInfoId}
                    className="relative cursor-move"
                  >
                    <div>
                      {item.result &&
                        item.result.map((resultItem, resultIndex) => (
                          <div
                            key={resultIndex}
                            className="relative flex-grow cursor-pointer rounded-lg border bg-white"
                          >
                            {console.log(item, 'item')}
                            <UserCountCard
                              primary={
                                item.options
                                  ? JSON?.parse(item?.options)?.[0]?.cardname
                                  : item?.formName
                              }
                              index={item?.dashboardItemInfoId}
                              secondary={resultItem?.totalCount}
                              iconPrimary={getIconByIndex(
                                item?.dashboardItemInfoId
                              )}
                              color={getColorByIndex(item?.dashboardItemInfoId)}
                              style={{}}
                              // onClick={() => redirect(item)}
                              onCrossClick={() =>
                                handleCrossIconClick(item.dashboardItemInfoId)
                              }
                              showCrossIcon
                            />
                          </div>
                        ))}
                    </div>
                  </span>
                }
                index={index}
                moveItem={moveItem}
              />
            ))
        )}
        {
          <span
            className="flex-1"
            style={{
              position: 'relative',
              cursor: 'move'
            }}
          >
            {loadingCard && currentItem.type.toLowerCase() === 'card' && (
              <div
                className="border p-1"
                style={{
                  m: 1,
                  bgcolor: COLORS.WHITE,
                  // flexGrow: 1,
                  backgroundColor: COLORS.WHITE,
                  borderRadius: '10px',
                  position: 'relative',
                  flexGrow: 1
                }}
              >
                <UserCountCard
                  primary={'Loading'}
                  secondary={<CircularProgress style={{ color: 'inherit' }} />}
                  iconPrimary={getIconByIndex(
                    loadingCard && currentItem.type.toLowerCase() === 'card'
                      ? currentItem?.dashboardItemInfoId
                      : 0
                  )}
                  color={getColorByIndex(
                    loadingCard && currentItem.type.toLowerCase() === 'card'
                      ? currentItem?.dashboardItemInfoId
                      : 0
                  )}
                  index={currentItem?.dashboardItemInfoId}
                />
              </div>
            )}
          </span>
        }
      </div>
    </DndProvider>
  );
};

export default CardSection;
