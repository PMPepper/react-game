import React from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux'

//HOCs
import MonitorSizeComponent from '../highOrderComponents/MonitorSizeComponent';

//presentational
import ResponsiveImage from '../presentational/ResponsiveImage';

export default compose(
  connect((state) => {
    return {
      pixelRatio: state.device.pixelRatio
    };
  }, {}),
  MonitorSizeComponent()
)(ResponsiveImage);
