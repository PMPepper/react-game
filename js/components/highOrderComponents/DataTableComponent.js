import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';


//HOCs
import BEMComponent from './BEMComponent';
import WithStateHandlersComponent from './WithStateHandlersComponent';

//Containers

//Presentational
import DataTable from '../presentational/DataTable';
import DataTableHead from '../presentational/DataTableHead';
import Pagination from '../presentational/Pagination';

//helpers
import {ALPHABETICAL, NUMERIC, DATE, sortAlphabeticalOnObjPath, sortNumericOnObjPath, sortDateOnObjPath} from '../../helpers/SortingHelpers';
import {cloneObjectWithoutKeys} from '../../helpers/Helpers';


//Requires 'landCode' parameter
export default function DataTableComponent(columns, {
  itemsProp = 'items',
  useTBody = true,
  dataTableColumnsTransform = null
} = {}) {
  return (PresentationalComponent) => {
    const omitChildKeys = [itemsProp];
    const dataTableColumns = dataTableColumnsTransform ? dataTableColumnsTransform(columns) : columns;

    return compose(
      BEMComponent('dataTable', {
        noTopMargin: {
          type: PropTypes.bool,
          default: false,
          preset: false
        }
      }),
      WithStateHandlersComponent(
        null,
        null,
        {
          withPropsOnChange: [
            ['sortColumn', 'sortDesc'],//when sortColumn or sortDesc change, create new sort method
            makeSortFunc(columns)
          ],
          mapProps: ({currentPage, setCurrentPage, perPage, sortDesc, sortColumn, setSortColumn, setIsSelected, setIsExpanded, getContextMenuItems, sort, ...props}) => {
            const items = props[itemsProp];
            const itemVals = (items instanceof Array) ? items.slice() : Object.values(items);
            const propsWithoutItem = cloneObjectWithoutKeys(props, omitChildKeys);

            if(sort) {
              itemVals.sort(sort);
            }

            const children = itemVals
              .slice((currentPage-1) * perPage, currentPage * perPage)
              .map((item) => {
                return <PresentationalComponent
                  {...propsWithoutItem}
                  sortColumn={sortColumn}
                  sortDesc={sortDesc}
                  item={item.data}
                  key={item.key}
                  isSelected={item.selected}
                  setIsSelected={isSelected => {
                    setIsSelected && setIsSelected(item.key, isSelected);
                  }}
                  setIsExpanded={isExpanded => {
                    setIsExpanded && setIsExpanded(item.key, isExpanded);
                  }}
                  isExpanded={item.expanded}
                  isDisabled={item.disabled}
                  contextMenuItems={getContextMenuItems && getContextMenuItems(item.key, item.data)}
                />
            });

            return {
              ...props,
              currentPage,
              perPage,
              numPages: Math.ceil(children.length / perPage),
              head: <DataTableHead {...propsWithoutItem} sortDesc={sortDesc} sortColumn={sortColumn} columns={dataTableColumns} items={items} setSortColumn={setSortColumn} />,
              foot: <Pagination currentPage={currentPage} onRequestPagination={setCurrentPage} totalResults={itemVals.length} perPage={perPage} />,
              useTBody: useTBody,
              numColumns: dataTableColumns.length,

              children: children
            };
          }
        }
      ),
    )(DataTable);
  }
}


export function makeSortFunc(columns) {
  return function sortFunc(props) {
    let {sortColumn, sortDesc, langCode} = props;

    if(!sortColumn) {
      const defaultSortColumn = columns.find(column => (!!column.sort)) || columns[0]
      sortColumn = defaultSortColumn ? defaultSortColumn.name : null;
    }

    const column = columns.find((column) => {return column.name === sortColumn});
    const sortType = column && column.sortType;

    if(!column || !sortType) {
      return {sort: null}
    }

    const path = `data.${column.sortPropPath || column.name}`;

    switch(sortType) {
      case ALPHABETICAL:
        return {sort: sortAlphabeticalOnObjPath(path, langCode, sortDesc)};
      case NUMERIC:
        return {sort: sortNumericOnObjPath(path, sortDesc)};
      case DATE:
        return {sort: sortDateOnObjPath(path, sortDesc)};
      default:
        if(sortType instanceof Function) {
          return {sort: sortType(sortDesc, props)};
        }
    }
  }
}
