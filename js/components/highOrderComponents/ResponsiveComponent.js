import React from 'react';
import {compose, getDisplayName, withPropsOnChange, mapProps as mapPropsHOC} from 'recompose';

import MonitorSizeComponent from './MonitorSizeComponent';

function defaultSizeCheckFunc(props) {
  return props.sizeCheckFunc(props);
}

const sizeProps = ['outerWidth', 'outerHeight', 'innerWidth', 'innerHeight'];

export default function ResponsiveComponent(AlternativePresentationalComponent, sizeCheckFunc = defaultSizeCheckFunc, mapProps = null) {
  return (PresentationalComponent) => {
    const Component = ({useAlternativeComponent, ...props}) => {
      if(useAlternativeComponent) {
        return <AlternativePresentationalComponent {...mapProps ? mapProps(props) : props} />
      }

      return <PresentationalComponent {...mapProps ? mapProps(props) : props} />
    }

    Component.displayName = `ResponsiveComponent(${getDisplayName(PresentationalComponent)})`;

    return compose(
      MonitorSizeComponent(),
      withPropsOnChange(
        sizeProps,
        (props) => {
          return {
            useAlternativeComponent: sizeCheckFunc(props)
          }
        }
      ),
      mapPropsHOC(function({outerWidth, outerHeight, innerWidth, innerHeight, ...rest}) {return rest})
    )(
      Component
    );
  }
}
