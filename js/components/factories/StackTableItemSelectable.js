import React from 'react';
import {compose} from 'recompose';

//HOCs
import WithStatesComponent from '../highOrderComponents/WithStatesComponent';
import IdComponent from '../highOrderComponents/IdComponent';

//Containers
import Text from '../containers/Text';

//Factories
import StackTableItem from './StackTableItem';


//Legacy
import CheckboxStyled from '../../widgets/forms/CheckboxStyled';


const Checkbox = IdComponent('selected-checkbox')(CheckboxStyled);

//The Component
export default function StackTableItemSelectable(columns, stackTableItem = null) {
  const Item = stackTableItem || StackTableItem(columns);

  const SelectableItem = ({isSelected, setIsSelected, isDisabled, elementProps = null, getRef = null, ...props}) => {
    const getElementClass = props.getElementClass;
    const item = props.item;
    const modifiers = {isSelected: isSelected ? null : undefined, disabled: isDisabled ? null : undefined};

    return <div {...elementProps} ref={getRef} className={getElementClass('selectableItem', modifiers)}>
      <div className={getElementClass('selectableItemOptionHolder', modifiers)}>
        <Checkbox
          checked={isSelected}
          indeterminate={false}
          baseClass={getElementClass('select', false)}
          modifiers={isDisabled ? {disabled: null} : null}
          disabled={isDisabled}
          onChange={(e) => {
            setIsSelected(!isSelected);
          }}
        />
      </div>
      <div className={getElementClass('selectableItemHolder', modifiers)}>
        <Item isSelected={isSelected} isDisabled={isDisabled} {...props} />
      </div>
    </div>
  }

  SelectableItem.displayName = 'StackTableItemSelectable';

  return SelectableItem;
}
