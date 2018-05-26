import React from 'react';

//this component is Pure

export default function Time({date, format, langCode, elementProps = null, getRef = null}) {
  let options = null;

  switch(format) {
    case 'long':
      options = {
        weekday: 'long',
        month: 'long'
      };
      break;
    case 'date':
      options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      };
      break;
    case 'shortDate':
      options = {
        year: '2-digit',
        month: 'short',
        day: '2-digit'
      };
      break;
    case 'datetime':
      options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      break;
    default:
      options = null;
  }

  return <time
      {...elementProps}
      ref={getRef}
      dateTime={date.toISOString()}
    >
      {date.toLocaleString(langCode, options || undefined)}
    </time>
}
