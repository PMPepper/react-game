import React from 'react'
import PropTypes from 'prop-types';

//Helpers
import {formatNumber} from '../../helpers/String';
import {isInteger} from '../../helpers/ExtendedPropTypes';

export default function FormattedNumber({value, langCode, decimalPlaces = 0, options = null}) {
  return formatNumber(value, decimalPlaces, langCode, options);
}

FormattedNumber.propTypes = {
  value: PropTypes.number.isRequired,
  langCode: PropTypes.string.isRequired,
  decimalPlaces: isInteger,
  options: PropTypes.object
}
