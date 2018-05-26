import React from 'react';
import PropTypes from 'prop-types';

//Containers
import FormattedText from '../containers/FormattedText';


//Helpers
import {propTypes} from '../highOrderComponents/BEMComponent';
import {roundTo} from '../../helpers/Maths';
import {formatNumber} from '../../helpers/String';


export default function Meter({value, max, langCode, baseClass, baseClassName, getElementClass, min = 0, fallbackTextFormat = 'bar-fallback-format', full = undefined, colour = undefined, elementProps = null, getRef = null}) {
  return <meter {...elementProps} ref={getRef} value={value} min={min} max={max} className={baseClass}>
    <div className={getElementClass('gauge')}>
      <span
        className={getElementClass('bar')}
        style={{width: roundTo((value / max) * 100, 2)+'%'}}
      >
        <FormattedText
          id={fallbackTextFormat}
          params={[
            ''+formatNumber((value / max) * 100, langCode, {maximumFractionDigits: 2}),
            ''+min,
            ''+value,
            ''+max,
            ''+(value/max)
          ]}
        />
      </span>
    </div>
  </meter>
};

Meter.propTypes = {
  ...propTypes,
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  langCode: PropTypes.string.isRequired,
  min: PropTypes.number,
  fallbackTextFormat: PropTypes.string
}
