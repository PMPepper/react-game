import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';


//Presentational
import FormattedNumber from '../presentational/FormattedNumber';

export default compose(connect(
  (state, props) => {
    return {
      langCode: props.langCode || state.localisation.langCode
    }
  }, {}
))
(FormattedNumber);
