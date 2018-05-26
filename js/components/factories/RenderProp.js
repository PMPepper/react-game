import React from 'react';


export default function RenderProp(prop = 'children') {
  return (props) => {
    return props[prop];
  }
}
