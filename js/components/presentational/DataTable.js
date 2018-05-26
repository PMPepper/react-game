import React from 'react';
import PropTypes from 'prop-types';


//HOCs

//Containers
import InputCheckbox from '../containers/forms/InputCheckbox';

//Helpers
import {propTypes} from '../highOrderComponents/BEMComponent';
import {isPositiveNonZeroInteger, isReactComponent, isReactRenderable} from '../../helpers/ExtendedPropTypes';


const oddModifiers = {
  odd: null
};

export default function DataTable({children, baseClass, baseClassName, getElementClass, numColumns, useTBody = false, component = 'table', head = null, foot = null, className = null, elementProps = null, getRef = null}) {
  const oddGetElementClass = (className, modifiers) => {
    return getElementClass(className, modifiers ? {...modifiers, odd: null} : modifiers === false ? false : oddModifiers);
  }

  const mappedChildren = children.map((child, index) => {
    return React.cloneElement(child, {getElementClass: index%2 === 0 ? oddGetElementClass : getElementClass})
  });

  return <table {...elementProps} ref={getRef} className={baseClass+(className ? ` ${className}` : '')} role="grid" aria-readonly="true">
    {head && <thead className={getElementClass('thead')}>{head}</thead>}
    {useTBody ? <tbody className={getElementClass('tbody')}>{mappedChildren}</tbody> : mappedChildren}
    {foot && <tfoot className={getElementClass('tfoot')}>
      <tr className={getElementClass('tfoot-tr')}>
        <td className={getElementClass('tfoot-tr-td')} colSpan={numColumns}>{foot}</td>
      </tr></tfoot>}
  </table>
}

DataTable.propTypes = {
  ...propTypes,
  numColumns: isPositiveNonZeroInteger.isRequired,
  useTBody: PropTypes.bool,
  component: isReactComponent,
  head: isReactRenderable,
  foot: isReactRenderable
}

export function getColumnModifiers(columnIndex, columns, sortColumn, sortDesc, isExpanded, isSelected = false, isDisabled = false) {
  const column = columns[columnIndex];
  const modifiers = {...column.modifiers} || {};

  modifiers.name = column.name;

  if(column.sortType) {
    modifiers.hasSort = null;

    if(sortColumn === column.name) {
      modifiers.sort = sortDesc ? 'desc' : 'asc';
    }
  }

  if(isExpanded) {
    modifiers.isOpen = null;//TODO change modifier name?
  }

  if(isSelected) {
    modifiers.isSelected = null;
  }

  if(isDisabled) {
    modifiers.disabled = null;
  }

  return modifiers;
}




export function selectableColumn(selectAllOption = true) {

  const HeadCheckbox = (props) => {
    const items = Object.values(props.items);
    if(items.length < 2 || !props.selectAllItems || !props.deselectAllItems) {
      return null;//only needed if more than 1 row & handlers set
    }

    const isRowSelected = item => (item.selected)

    const allAreSelected = items.every(isRowSelected);
    const someAreSelected = !allAreSelected && items.some(isRowSelected);

    return <InputCheckbox
      id={props.id+'-header-selectedCheckbox'}
      checked={allAreSelected === true}
      indeterminate={someAreSelected}
      className={props.getElementClass('selectAll', false)}
      setValue={(value) => {
        if(value) {
          props.selectAllItems();
        } else {
          props.deselectAllItems();
        }
      }}
    />
  }

  //column definition for selectable table
  return {
    name: 'select',
    label: selectAllOption ? HeadCheckbox : null,
    format: (value, item, {isSelected, setIsSelected, isDisabled, getElementClass}) => {

      return <Checkbox
        checked={!!isSelected}
        baseClass={getElementClass('select', false)}
        modifiers={null}
        disabled={!!isDisabled}
        onChange={(e) => {
          setIsSelected(!isSelected);
        }}
      />
    },
    modifiers: {
      select: null
    }
  }
}

//transform columns to include select column
export function makeSelectableColumns(columns, selectAllOption = true) {
  const newColumns = [
    selectableColumn(selectAllOption),
    ...columns
  ];

  newColumns[1] = {
    ...newColumns[1],
    modifiers: {
      ...newColumns[1].modifiers,
      selectMerge: null
    }
  }

  return newColumns;
}
