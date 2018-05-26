import React from 'react';

//This component is Pure

export default function FirstChild({children}) {
  const childrenArray = React.Children.toArray(children);
  return childrenArray[0] || null;
};
