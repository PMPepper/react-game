import React from 'react';
import {getDisplayName} from 'recompose';

import {mergeElementProps} from '../../helpers/React';

export default function({
  tabIndex = 0
} = {}) {
  return (PresentationalComponent) => {
    return class FocusOnMountComponent extends React.Component{
      componentDidMount() {
        if(this.element) {
          this.element.focus();
        }
      }

      render() {
        const {elementProps, ...rest} = this.props;

        return <PresentationalComponent elementProps={mergeElementProps(elementProps, {
          tabIndex,
          ref: (element) => {
            this.element = element;
          }
        })} {...rest} />
      }

      displayName = `FocusOnMountComponent(${getDisplayName(PresentationalComponent)})`
    };
  }
}
