import React from 'react';
import {compose} from 'recompose';

//HOCs
import WithStatesComponent from '../highOrderComponents/WithStatesComponent';

//Containers
import Text from '../containers/Text';


//Factories
import StackTableItem from './StackTableItem';


//presentational
import {SingleVerticalSlideTransition} from '../presentational/Transitions';


//Helpers
import {DefaultExpandedContent} from './DataTableRowExpandable';


//The Component
export default function StackTableItemExpandable(columns, getExpandContent = DefaultExpandedContent, stackTableItem = null) {
  const Item = stackTableItem || StackTableItem(columns);

  const ExpandableItem = ({isExpanded, setIsExpanded, elementProps = null, getRef = null, ...props}) => {
    const getElementClass = props.getElementClass;
    const modifiers = isExpanded ? {isOpen: null} : null;

    return [
      <Item elementProps={elementProps} getRef={getRef} {...props} key="item" />,
      <SingleVerticalSlideTransition className={getElementClass('slideReveal')} key="slide">{
        isExpanded && <div className={getElementClass(['slideReveal', 'holder'])}>
          <div className={getElementClass(['slideReveal', 'inner'])}>{getExpandContent(props)}</div>
        </div>}
      </SingleVerticalSlideTransition>,
      <button type="button" className={getElementClass('toggleSlideReveal', modifiers)} key="expand" onClick={() => {setIsExpanded(!isExpanded)}}>
        <span className="u-offscreen"><Text id="dataTable-expand-label" /></span>
      </button>
    ]
  }

  ExpandableItem.displayName = 'StackTableItemExpandable';

  return ExpandableItem;
}
