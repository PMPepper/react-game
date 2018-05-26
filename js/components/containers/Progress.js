import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';


//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';


//Presentational
import Progress from '../presentational/Progress';


export default compose(
  connect((state) => {
    return {
      langCode: state.localisation.langCode
    }
  }, {}),
  BEMComponent('progress', {
    full: {
      type: PropTypes.bool,
      preset: false,
      default: false
    }
  })
)(
  Progress
)
