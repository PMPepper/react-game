import React from 'react';
import PropTypes from 'prop-types';

//containers
import FormattedText from '../containers/FormattedText';
import Text from '../containers/Text';

//msg is 'fallback' message if error code isn't 'known' in the language file
export default function ErrorMessage({code, msg = null}) {
  return <FormattedText id="error-format" params={{message: <Text id={`error-${code}`} />, code}} fallback={msg} />
}

ErrorMessage.propTypes = {
  code: PropTypes.string.isRequired,
  fallback: PropTypes.string
};
