import React from 'react';
import PropTypes from 'prop-types';
import {getDisplayName} from 'recompose';


//Helpers
import {cloneObjectWithoutKeys} from '../../helpers/Helpers';


export default function FilteredComponent({filteredProp = 'children', filterProp = 'filter', defaultFilter = null} = {}) {
  const omitKeys = [filteredProp, filterProp];

  return (PresentationalComponent) => {
    const Component = (props) => {
      let children = filteredProp === 'children' ? React.Children.toArray(props[filteredProp]) : props[filteredProp];

      if(props[filterProp]) {
        children = children.filter(props[filterProp]);
      }

      return <PresentationalComponent {...cloneObjectWithoutKeys(props, omitKeys)}>{children}</PresentationalComponent>
    };

    Component.displayName = `FilteredComponent(${getDisplayName(PresentationalComponent)})`;

    Component.propTypes = {
      [filteredProp]: PropTypes.array,
      [filterProp]: PropTypes.func
    };

    Component.defaultProps = {
      [filteredProp]: [],
      [filterProp]: defaultFilter
    };

    return Component;
  }
}
