import React from 'react';
import PropTypes from 'prop-types';

//Helpers
import {formatDuration} from '../../helpers/String';

//this component is Pure
export default class TimePeriod extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.isLangLoaded && !!this.props.localisation;
  }

  render() {
    return formatDuration(this.props.val, this.props.localisation, this.props.langCode);
  }
}

TimePeriod.propTypes = {
  val: PropTypes.number,
  strings: PropTypes.object.isRequired,
  langCode: PropTypes.string.isRequired,
  isLangLoaded: PropTypes.bool
};
