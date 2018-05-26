import React from 'react';
import PropTypes from 'prop-types';
import {getDisplayName} from 'recompose';


//Helpers
import {cloneObjectWithoutKeys} from '../../helpers/Helpers';


export default function SortedComponent({sortedProp = 'children', sortProp = 'sort', defaultSort = null} = {}) {
  const omitKeys = [sortedProp, sortProp];

  return (PresentationalComponent) => {
    const Component = (props) => {
      let children = sortedProp === 'children' ? React.Children.toArray(props[sortedProp]) : props[sortedProp];

      if(props[sortProp]) {
        children = children.slice();
        children.sort(props[sortProp]);
      }

      return <PresentationalComponent {...cloneObjectWithoutKeys(props, omitKeys)}>{children}</PresentationalComponent>
    };

    Component.displayName = `SortedComponent(${getDisplayName(PresentationalComponent)})`;

    Component.propTypes = {
      [sortedProp]: PropTypes.array,
      [sortProp]: PropTypes.func
    };

    Component.defaultProps = {
      [sortedProp]: [],
      [sortProp]: defaultSort
    };

    return Component;
  }
}
