import React from 'react';
import {connect} from 'react-redux';
import {compose, mapProps} from 'recompose';


//HOCs

//Containers

//Presentational

//helpers
import {resolveObjPath} from '../../helpers/Helpers';


//reducers
import {setPage, setSorting, selectItem, deselectItem, selectAllItems, deselectAllItems, expandItem, collapseItem} from '../../reducers/dataTable';


export default function ReduxDataTableComponent(tableName = null, reducerPath = null) {
  return compose(
    connect((state, ownProps) => {
      return {
        langCode: state.localisation.langCode,
        tableName: ownProps.tableName || tableName,
        ...resolveObjPath(state, ownProps.reducerPath || reducerPath)
      };
    }, {
      setPage,
      setSorting,
      selectItem,
      deselectItem,
      selectAllItems,
      deselectAllItems,
      expandItem,
      collapseItem
    }),
    mapProps(({tableName, setPage, setSorting, selectItem, deselectItem,
      selectAllItems, deselectAllItems, expandItem, collapseItem, sortColumn,
      sortDesc, page, ...rest
    }) => {
      return {
        ...rest,
        sortColumn,
        sortDesc,
        currentPage: page,
        setSortColumn: (newSortColumn) => {
          if(newSortColumn === sortColumn) {
            setSorting(tableName, newSortColumn, !sortDesc)
          } else {
            setSorting(tableName, newSortColumn, false);
          }
        },
        setCurrentPage: (newPage) => {
          setPage(tableName, newPage);
        },
        setIsExpanded: (key, isExpanded) => {
          if(!isExpanded) {
            collapseItem(tableName, key)
          } else {
            expandItem(tableName, key)
          }
        },
        setIsSelected: (key, isSelected) => {
          if(!!isSelected) {
            selectItem(tableName, key)
          } else {
            deselectItem(tableName, key)
          }
        },
        selectAllItems: () => {
          selectAllItems(tableName);
        },
        deselectAllItems: () => {
          deselectAllItems(tableName);
        }
      };
    })
  )
}
