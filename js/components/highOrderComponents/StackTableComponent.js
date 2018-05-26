import React from 'react';
import {compose} from 'recompose';


//HOCs
import BEMComponent from './BEMComponent';
//import FilteredComponent from './FilteredComponent';
import SortedComponent from './SortedComponent';
import PaginatedComponent from './PaginatedComponent';
import WithStateHandlersComponent from './WithStateHandlersComponent';

//Containers

//Presentational
import StackTable from '../presentational/StackTable';
import Pagination from '../presentational/Pagination';

//helpers
import {cloneObjectWithoutKeys} from '../../helpers/Helpers';
import {makeSortFunc} from './DataTableComponent';


//Consts


export default function StackTableComponent(columns, {
  itemsProp = 'items',
} = {}) {
  return (PresentationalComponent) => {
    const omitChildKeys = [itemsProp];

    const Component = compose(
      BEMComponent('stackTable'),
      WithStateHandlersComponent(
        null,
        null,
        {
          withPropsOnChange: [
            ['sortColumn', 'sortDesc'],
            makeSortFunc(columns)
          ],
          mapProps: ({currentPage, setCurrentPage, perPage, sortDesc, sortColumn, setIsSelected, setIsExpanded, getContextMenuItems, ...props}) => {
            const items = props[itemsProp];
            const itemKeys = Object.keys(items);
            const propsWithoutItem = cloneObjectWithoutKeys(props, omitChildKeys);

            return {
              ...props,
              currentPage,
              foot: <Pagination currentPage={currentPage} onRequestPagination={setCurrentPage} totalResults={itemKeys.length} perPage={perPage} />,
              numColumns: columns.length,
              children: itemKeys.map((key) => {//Will work with array or object hash
                const item = items[key];

                return <PresentationalComponent
                  {...propsWithoutItem}
                  items={items}
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
              })
            };
          }
        }
      ),
      //FilteredComponent(),
      SortedComponent(),
      PaginatedComponent()
    )(StackTable);

    Component.displayName = `StackTable(${PresentationalComponent})`

    return Component;
  }
}
