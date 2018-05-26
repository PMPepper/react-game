import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';

//Presentational
import TimePeriod from '../presentational/TimePeriod';


export default compose(
  connect((state, ownProps) => {
    return {
      strings: state.localisation.strings,
      langCode: state.localisation.langCode
    };
  }, {})
)(TimePeriod);
