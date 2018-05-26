import React from 'react';
import PropTypes from 'prop-types';

import {formatDataSize} from '../../helpers/String';
import {isPositiveInteger} from '../../helpers/ExtendedPropTypes';


export default function DataSize({value, format, langCode, smallUnits = false}) {
  value = value || 0;//Prevent NaN from causing crash

  if(smallUnits) {
    const size = formatDataSize(value, format, true, langCode);

    return [size[0], <small key="units">{size[1]}</small>];
  }

  return formatDataSize(value, format, false, langCode);
}

DataSize.propTypes = {
  value: isPositiveInteger.isRequired,
  format: PropTypes.oneOf(['si', 'nonSI', 'legacy']).isRequired,
  langCode: PropTypes.string.isRequired,
  smallUnits: PropTypes.bool
};
