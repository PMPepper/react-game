import React from 'react';
import {compose} from 'recompose';

//HOCs
import WithStatesComponent from '../highOrderComponents/WithStatesComponent';

//Containers
import Text from '../containers/Text';

//Factories
import DataTableRow from './DataTableRow';


//presentational
import {SingleVerticalSlideTransition} from '../presentational/Transitions';


//Helpers
//-expanded content
export const DefaultExpandedContent = (props) => {
  const content = props.item.expandedContent;

  if(content instanceof Function) {
    return content(props);
  }

  return content;
}


//The Component
export default function DataTableRowExpandable(columns, getExpandContent = DefaultExpandedContent, row = null, elementProps = null, getRef = null, ...props) {
  const Row = row || DataTableRow(columns);

  const ExpandableRow = ({isExpanded, ...props}) => {
    const getElementClass = props.getElementClass;
    const modifiers = isExpanded ? {isOpen: null} : null;

    const numColumns = getNumColumns(columns, props)

    return <tbody {...elementProps} ref={getRef} className={getElementClass('tbody', modifiers)}>
      <Row isExpanded={isExpanded} {...props} />
      {getExpandContent && <tr className={getElementClass(['tbody', 'tr'], {...modifiers, expand: null})}>
        <td colSpan={columns.length}>
          <SingleVerticalSlideTransition componentClassName={getElementClass('slideReveal')}>{
            isExpanded && <div className={getElementClass(['slideReveal', 'holder'])}>
              <div className={getElementClass(['slideReveal', 'inner'])}>{getExpandContent(props)}</div>
            </div>}
          </SingleVerticalSlideTransition>
        </td>
      </tr>}
    </tbody>
  }

  ExpandableRow.displayName = 'DataTableRowExpandable';

  return ExpandableRow
};

function getNumColumns(columns, props) {
  return columns.reduce((count, column) => {
    if(column.omitProp && props[column.omitProp]) {
        count++;
    }

    return count;
  }, 0);
}

//Component for table row to control expanded/collapsed status
export function ExpandToggle({isExpanded, setIsExpanded, getElementClass}) {
  const modifiers = isExpanded ? {isOpen: null} : null;

  return <button className={getElementClass(['expand', 'toggle'], modifiers)} type="button" onClick={() => {setIsExpanded(!isExpanded)}}>
    <span className="u-offscreen"><Text id="dataTable-expand-label" /></span>
  </button>
}

//Function for use in column format parameter, to render an Expand toggle component
export function expandToggle(value, item, props) {
  return ExpandToggle(props);
}

//column definition for an expand/collapse toggle
export const expandColumn = {
  name: 'actions',
  label: null,
  format: expandToggle
}

export function makeExpandableColumns(columns) {
  return [
    ...columns,
    expandColumn
  ];
}
