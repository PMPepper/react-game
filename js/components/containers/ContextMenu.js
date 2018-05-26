import React from 'react';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';
import WithStateHandlersComponent from '../highOrderComponents/WithStateHandlersComponent';


//Presentational
import ContextMenu, {SPACER} from '../presentational/ContextMenu';


//The component
export default compose(
  WithStateHandlersComponent(
    {
      selectedItems: [null]
    },
    {
      setSelectedItem: ({selectedItems}) => (selectedItemIndex, level, openChild = false) => {
        return {
          selectedItems: openChild ? //TODO only if valid?
            [...selectedItems.slice(0, level), selectedItemIndex, null]
            :
            [...selectedItems.slice(0, level), selectedItemIndex]//, ...selectedItems.slice(level+1)
        }
      },
      closeCurrentLevel: ({selectedItems}) => () => {
        return {
          selectedItems: selectedItems.length > 1 ? [...selectedItems.slice(0, -1)] : selectedItems
        }
      },
      openSelectedItem: ({selectedItems}) => (selectFirstItem = false) => {
        return {
          selectedItems: [...selectedItems, selectFirstItem ? -1 : null]
        };
      }
    },
    {}
  ),
  BEMComponent('contextMenu')
)(ContextMenu);
