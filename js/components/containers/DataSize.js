import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';

//Presentational
import DataSize from '../presentational/DataSize';


export default compose(
  connect(
    (state, ownProps) => {
      return {
        langCode: state.localisation.langCode,
        format: ownProps.format || state.ui.options.dataFormat
      }
    }, {}
  )
)(DataSize);
