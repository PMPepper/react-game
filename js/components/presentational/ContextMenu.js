import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import {connect} from 'react-redux';

//HOCs
//import WithStateHandlersComponent from '../highOrderComponents/WithStateHandlersComponent';
import PositionedToChildComponent from '../highOrderComponents/PositionedToChildComponent';
import FocusOnMountComponent from '../highOrderComponents/FocusOnMountComponent';

//Others
import {propTypes} from '../highOrderComponents/BEMComponent';
import {isReactRenderable, isValue} from '../../helpers/ExtendedPropTypes';


//Consts
export const SPACER = 'spacer';
const SPACER_MODIFIERS = {spacer: null};

//TODO change this:
//-stop being 'context menu' and just become 'menu'
//-fix the below:

//Not happy that the presentational component knows/cares about or controls:
//-bounds
//-keyboard input
//-the sub-context menus
//-focus on mount

//-only 'top level' context menu takes keyboard input


function ContextMenu({items, boundsX, boundsY, boundsWidth, boundsHeight, level = 0, elementProps = null, ...props}) {
  const {
    baseClass, baseClassName, getElementClass,
    selectedItems = [], setSelectedItem = null, openSelectedItem = null, closeCurrentLevel = null, doRequestClose = null
  } = props;

  const isActiveLevel = selectedItems.length === level+1;
  const activeLevel = selectedItems.length - 1;
  let selectedItemIndex = selectedItems[level];

  if(selectedItemIndex === -1) {//-1 means select the first selectable item
    selectedItemIndex = items.findIndex(isItemSelectable);

    if(selectedItemIndex === -1) {
      selectedItemIndex = null;
    }
  }

  return <div
    {...elementProps}
    className={baseClass}
    onContextMenu={(e) => {e.preventDefault()}}
    onBlur={doRequestClose ? (e) => {
      doRequestClose()
    } : null}
    onKeyDown={e => {
      let activeItems = items;

      for(let i = 0; i < activeLevel; i++) {
        activeItems = activeItems[selectedItems[i]].items;
      }

      const selectableItemIndexes = activeItems.reduce((arr, item, index) => {
        if(isItemSelectable(item)) {
          arr.push(index);
        }

        return arr;
      }, []);

      //
      const selectedSelectableItemIndex = selectedItems[activeLevel] === null ?
        null
        :
        selectedItems[activeLevel] === -1 ?
          (selectableItemIndexes.length > 0 ? selectableItemIndexes[0] : null)
          :
          selectableItemIndexes.findIndex(value => (value === selectedItems[activeLevel]));

      const numSelectableItems = selectableItemIndexes.length;

      switch(e.which) {
        case 37://left
          if(activeLevel != 0) {//Close (if you're not level 0)
            closeCurrentLevel && closeCurrentLevel();
          }
          break;
        case 38://up
          let newIndex = selectedSelectableItemIndex === null ? numSelectableItems - 1 : (selectedSelectableItemIndex-1);

          if(newIndex < 0) {
            newIndex = numSelectableItems - 1;
          }

          setSelectedItem && setSelectedItem(selectableItemIndexes[newIndex], activeLevel);
          break;
        case 39://right
          const selectedItemHasChildren = selectedSelectableItemIndex !== null ?
            !activeItems[selectedSelectableItemIndex].disabled && activeItems[selectedSelectableItemIndex].items && activeItems[selectedSelectableItemIndex].items.length > 0
            :
            false;

          if(selectedItemHasChildren) {
            openSelectedItem && openSelectedItem(true);
          }
          break;
        case 40://down
          setSelectedItem && setSelectedItem(selectableItemIndexes[selectedSelectableItemIndex === null ? 0 : (selectedSelectableItemIndex+1) % numSelectableItems], activeLevel);
          break;
        case 27:
          doRequestClose && doRequestClose();
          break;
        case 9://TAB
          break;
        default:
          return;
      }

      e.preventDefault();
      e.stopPropagation();

    }}
  >
    <ul className={getElementClass('list')}>
      {items.map((item, index) => {
        if(item === SPACER) {
          return <li key={index} className={getElementClass(['list', 'item'], SPACER_MODIFIERS)}></li>
        }

        const hasChildren = item.items && item.items.length > 0;
        const isSelectedItem = selectedItemIndex === index;
        const showChildren = hasChildren && isSelectedItem && selectedItems.length > level+1;

        const modifiers = {
          hasChildren: hasChildren ? null : undefined,
          showChildren: showChildren ? null : undefined,
          isSelectedItem: isSelectedItem ? null : undefined,
          disabled: item.disabled? null : undefined
        }

        const button = <div
          className={getElementClass('action', modifiers)}
          onClick={item.action && !hasChildren && !item.disabled ? (e) => {
            item.action();
          } : null}
        >
          <span className={getElementClass(['action', 'icon'], modifiers)}>{item.icon}</span>
          <span className={getElementClass(['action', 'label'], modifiers)}>{item.label}</span>
        </div>;

        return <li
          className={getElementClass(['list', 'item'], modifiers)}
          key={index}
          onMouseEnter={(!item.disabled && setSelectedItem) ? () => {
            !isSelectedItem && setSelectedItem(index, level, hasChildren);
          } : null}
          onMouseOver={(!item.disabled && setSelectedItem) ? () => {
            !isSelectedItem && setSelectedItem(index, level, hasChildren);
          } : null}
          onMouseLeave={(!item.disabled && setSelectedItem) ? () => {
            setSelectedItem(null, level);
          } : null}
        >
          {hasChildren ? <SubContextMenu
            {...props}
            boundsX={boundsX}
            boundsY={boundsY}
            boundsWidth={boundsWidth}
            boundsHeight={boundsHeight}
            items={item.items}
            level={level+1}
            showPositionedElement={showChildren}
          >
            {button}
          </SubContextMenu> : button
          }
        </li>
      })}
    </ul>
  </div>
}




//TODO refactor
const SubContextMenu = compose(
  PositionedToChildComponent({
    usePortal: false,
    mapPositionedItemProps: ({x, y, setElement, portalElement,
      mId, contentWidth, contentHeight, positionX, positionY, positionWidth,
      positionHeight, element, setContentSize,
      ...rest
    }) => (rest)
  })
)(ContextMenu);


export default FocusOnMountComponent()(ContextMenu);


//Prop types
const itemPropType = PropTypes.shape({
  label: isReactRenderable.isRequired,
  icon: isReactRenderable,
  disabled: PropTypes.bool,
  action: PropTypes.func,
  items: PropTypes.array//could implement proper recursive checking, but doesn't seem essential: https://stackoverflow.com/questions/32063297/can-a-react-prop-type-be-defined-recursively
})

const spacerPropType = isValue(SPACER);

ContextMenu.propTypes = {
  ...propTypes,
  items: PropTypes.arrayOf(PropTypes.oneOfType([
    itemPropType,
    spacerPropType
  ]))
};


//Helpers
export function isItemSelectable(item) {
  return item !== SPACER && !item.disabled
}
