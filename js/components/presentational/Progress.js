import React from 'react';
import PropTypes from 'prop-types';


//Containers
import FormattedText from '../containers/FormattedText';

//helpers
import {roundTo} from '../../helpers/Maths';
import {formatNumber} from '../../helpers/String';
import {propTypes} from '../highOrderComponents/BEMComponent';


//This component is Pure

export default function Progress({baseClass, baseClassName, getElementClass, langCode, value = 0, max = 100, colour = undefined, full = undefined, fallbackTextFormat = 'bar-fallback-format', elementProps = null, getRef = null}) {
  return <progress {...elementProps} ref={getRef} value={value} max={max} className={baseClass}>
    <div className={getElementClass('gauge')}>
      <span
        className={getElementClass('bar')}
        style={{width: roundTo((value / max) * 100, 2)+'%'}}
      >
        <FormattedText
          id={fallbackTextFormat}
          params={[
            ''+formatNumber((value / max) * 100, langCode, {maximumFractionDigits: 2}),
            '0',
            ''+value,
            ''+max,
            ''+(value/max)
          ]}
        />
      </span>
    </div>
  </progress>
}

Progress.propTypes = {
  ...propTypes,
  langCode: PropTypes.string.isRequired,
  value: PropTypes.number,
  max: PropTypes.number,
  fallbackTextFormat: PropTypes.string
};
