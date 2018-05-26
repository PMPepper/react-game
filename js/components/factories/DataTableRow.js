import React from 'react';

import {getColumnModifiers} from '../presentational/DataTable';

export default function DataTableRow(columns) {
  const Row = ({baseClass, baseClassName, getElementClass, item, sortColumn, sortDesc, isExpanded, isSelected, isDisabled, elementProps = null, getRef = null, ...props}) => {
    return <tr {...elementProps} ref={getRef} className={getElementClass(['tbody', 'tr'])} role="row">
      {columns.map((column, index) => {
        if(column.omitProp && props[column.omitProp]) {
          return null;
        }

        const modifiers = getColumnModifiers(index, columns, sortColumn, sortDesc, isExpanded, isSelected, isDisabled);

        return <td
          className={getElementClass(['tbody', 'tr', 'td'], modifiers)}
          role="gridcell"
          key={column.name}
        >
          {column.format ? column.format(item[column.name], item, {getElementClass, isExpanded, isSelected, isDisabled, ...props}) : item[column.name]}
        </td>
      })}
    </tr>
  }

  Row.displayName = 'DataTableRow';

  return Row;
}
