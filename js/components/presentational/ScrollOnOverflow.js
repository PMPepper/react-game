import React from 'react';

//this component is Pure

export default function ScrollOnOverflow({children, minWidth, maxWidth, minHeight, maxHeight, elementProps = null, getRef = null}) {
  const style = {
    overflowX: 'visible',
    overflowY: 'visible'
  };

  //width
  if(minWidth && minWidth > 0 && minWidth != 'none') {
    style.minWidth = minWidth+'px';
  }

  if(maxWidth && maxWidth > 0) {
    style.overflowX = 'auto';
    style.maxWidth = maxWidth+'px';
  }

  //height
  if(minHeight && minHeight > 0 && minHeight != 'none') {
    style.minHeight = minHeight+'px';
  }

  if(maxHeight && maxHeight > 0) {
    style.overflowY = 'auto';
    style.maxHeight = maxHeight+'px';
  }

  return <div {...elementProps} ref={getRef} className="scrollOnOverflow" style={style}>
    {children}
  </div>
}
