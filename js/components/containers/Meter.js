import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';

import {COLOURS} from '../../Consts';

//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';

//Presentational
import Meter from '../presentational/Meter';

export default compose(
  BEMComponent('meter', {
    full: {
      type: PropTypes.bool,
      preset: false,
      default: false
    },
    colour: {
      type: PropTypes.oneOf(COLOURS),
      default: COLOURS[0]
    }
  })
)(
  Meter
)
