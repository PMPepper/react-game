import React from 'react';
import PropTypes from 'prop-types';


//Helpers
import {getColumnModifiers} from './DataTable';
import {propTypes} from '../highOrderComponents/BEMComponent';


//The component
export default function DataTableHead(props) {
  const {baseClass, baseClassName, getElementClass, columns, sortColumn, sortDesc, setSortColumn, elementProps = null, getRef = null} = props;

  return <tr {...elementProps} ref={getRef} className={getElementClass(['thead', 'tr'])} role="row">
    {columns.map((column, index) => {
      if(column.omitProp && props[column.omitProp]) {
        return null;
      }
      
      const modifiers = getColumnModifiers(index, columns, sortColumn, sortDesc);
      const label = column.label instanceof Function ? <column.label {...props} /> : column.label;

      return <th className={getElementClass(['thead', 'tr', 'th'], modifiers)} key={column.name}>
        {column.sortType ? <button className={getElementClass(['thead', 'tr', 'th', 'btn'], modifiers)} role="button" type="button" onClick={() => {setSortColumn && setSortColumn(column.name)}}>
          {label}
        </button>
        :
        label}
      </th>
    })}
  </tr>
}

DataTableHead.propTypes = {
  ...propTypes,
  columns: PropTypes.array.isRequired,
  sortColumn: PropTypes.string,
  sortDesc: PropTypes.bool,
  setSortColumn: PropTypes.func
}
