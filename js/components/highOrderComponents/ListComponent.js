import React from 'react';

const defaultOptions = {
  component: 'div',
  mapItemProps: itemProps => (itemProps),
  mapComponentProps: props => (props),
};

export default function List(listPropName, options = null) {
  options = {...defaultOptions, ...options};

  const Component = options.component;

  return (PresentationalComponent) => {
    return (props) => (
      <Component {...options.mapComponentProps(props)}>
        {props[listPropName].map((item) => {
          <WrappedComponent {...options.mapItemProps(item, props, index)}></WrappedComponent>
        })}
      </Component>
    )
  }
}
