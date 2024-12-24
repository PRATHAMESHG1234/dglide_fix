import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'ITEM';

const DraggableItem = ({ item, index, moveItem }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index }
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

  return <div ref={(node) => ref(drop(node))}>{item}</div>;
};

export default DraggableItem;
