import React from 'react';

import {getColumnModifiers} from '../presentational/StackTable';

const dtClass = ['item', 'dt']
const ddClass = ['item', 'dd']
const btnClass = ['item', 'dt', 'btn'];

export default function StackTableItem(columns) {
  const Item = ({baseClass, baseClassName, getElementClass, item, sortColumn, sortDesc, setSortColumn, isExpanded, setIsExpanded, isSelected, setIsSelected, isDisabled, elementProps = null, getRef = null, ...props}) => {
    return <dl {...elementProps} ref={getRef} className={getElementClass('item', isDisabled ? {disabled: null} : undefined)} role="row">
      {columns.map((column, index) => {
        if(column.omitProp && props[column.omitProp]) {
          return null;
        }
        
        const numItems = Object.keys(props.items).length;
        const modifiers = getColumnModifiers(index, columns, numItems > 1 && sortColumn, sortDesc, isExpanded, isSelected, isDisabled);
        const label = column.label instanceof Function ? <column.label {...props} /> : column.label;

        return [
          <dt className={getElementClass(dtClass, modifiers)} key={`${column.name}-dt`}>
            {numItems > 1 && column.sortType ? <button className={getElementClass(btnClass, modifiers)} role="button" type="button" onClick={() => {setSortColumn && setSortColumn(column.name)}}>
              {label}
            </button>
            :
            label}
          </dt>,
          <dd className={getElementClass(ddClass, modifiers)} key={`${column.name}-dd`}>
            {column.format ? column.format(item[column.name], item, {getElementClass, isExpanded, setIsExpanded, setIsSelected, ...props}) : item[column.name]}
          </dd>
        ]
      })}
    </dl>
  }

  Item.displayName = 'StackTableItem';

  return Item;
}
