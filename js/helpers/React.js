import React from 'react'
import ReactDOMServer from 'react-dom/server';
import {objectsHaveSameProps, cloneObjectWithoutKeys} from './Object';
import {combineFunctions} from './Helpers';

export function isDOMComponent(component) {
  if(typeof(component) == 'string') {
    return component.charAt(0).toLowerCase() === component.charAt(0);
  }

  return component.hasOwnProperty('type') && typeof(component.type) == 'string';
}

//const reactChildProps = ['props', 'ref', 'type', 'children'];
const reactChildProps = (key, value) => {
  switch(typeof(value)) {
    case 'function':
      return `<func: ${value.name}>`;
    case 'object':
      if(value && !(value instanceof Array) && ('$$typeof' in value)) {
        //do something special here
        return{
          $$typeof: value.$$typeof,
          key: value.key,
          props: cloneObjectWithoutKeys(value.props, ['key']),
          ref: value.ref,
          type: value.type
        };
      }
  }

  return value;
}

export function isChildrenDifferent(child1, child2) {
  //deepCompare might actually be faster than this - would need to benchmark
  //console.log(JSON.stringify(React.Children.toArray(child1), reactChildProps), JSON.stringify(React.Children.toArray(child2), reactChildProps))
  return JSON.stringify(React.Children.toArray(child1), reactChildProps) !== JSON.stringify(React.Children.toArray(child2), reactChildProps);
}

//Does not check children
export function havePropsChanged(props1, props2, includeChildren = false) {
  return !objectsHaveSameProps(props1, props2) || !Object.keys(props1).every(includeChildren ? (key) => {
    return key === 'key' || key === 'children' || props1[key] === props2[key];
  } : (key) => {
    return (key === 'key' || key === 'children' && !isChildrenDifferent(props1.children, props2.children)) || props1[key] === props2[key];
  });
}


export function hasAnyRenderableChildren(children) {
  return React.Children.toArray(children).some(React.isValidElement);
}

export function elementToString(element, context = null) {
  return React.isValidElement(element) ? (htmlDecode(ReactDOMServer.renderToString(context ? React.cloneElement(element, context) : element))) : element;
}

function htmlDecode(input)
{
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

export function mergeElementProps(props1 = {}, props2 = {}) {
  const mergedProps = {...props1};

  for(let i = 0, keys = Object.keys(props2); i < keys.length; i++) {
    let key = keys[i];
    let value = props2[key];

    if(mergedProps.hasOwnProperty(key) && ((mergedProps[key] instanceof Function) && (value instanceof Function))) {
      mergedProps[key] = combineFunctions(mergedProps[key], value);
    } else {
      mergedProps[key] = value;
    }
  }

  return mergedProps;
}
