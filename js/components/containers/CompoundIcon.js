import React from 'react';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';


//Presentational
import CompoundIcon from '../presentational/CompoundIcon';


//the Component
export default compose(
  BEMComponent('compoundIcon', {})
)(CompoundIcon);
