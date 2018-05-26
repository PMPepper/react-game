import React from 'react';
import PropTypes from 'prop-types';


//Helpers
import {propTypes} from '../highOrderComponents/BEMComponent';
import {isPositiveNonZeroInteger, isReactRenderable} from '../../helpers/ExtendedPropTypes';


const oddModifiers = {
  odd: null
};

export default function StackTable({children, baseClass, baseClassName, getElementClass, numColumns, head = null, foot = null, isOrdered = false, elementProps = null, getRef = null, ...rest}) {
  //a list of DLs, with an optional 'selectHolder'
  //make this like dataTable, where it just accepts a set of children and renders them?

  const oddGetElementClass = (className, modifiers) => {
    return getElementClass(className, modifiers ? {...modifiers, odd: null} : modifiers === false ? false : oddModifiers);
  }

  const mappedChildren = children.map((child, index) => {
    return <li className={getElementClass(['list', 'item'])} key={child.key}>
      {React.cloneElement(child, {getElementClass: index%2 === 0 ? oddGetElementClass : getElementClass})}
    </li>
  });

  const ListComponent = isOrdered ? 'ol' : 'ul'

  return <div {...elementProps} ref={getRef} className={baseClass}>
    <ListComponent className={getElementClass('list')}>
      {mappedChildren}
    </ListComponent>
    {foot && <div className={getElementClass('foot')}>
      {foot}
    </div>}
  </div>
}

StackTable.propTypes = {
  ...propTypes,
  numColumns: isPositiveNonZeroInteger.isRequired,
  head: isReactRenderable,
  foot: isReactRenderable,
  isOrdered: PropTypes.bool
};

export {getColumnModifiers} from './DataTable';
