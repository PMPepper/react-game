import React from 'react';
import {compose} from 'recompose';

//Presentational
import GenericConfirmation from '../presentational/GenericConfirmation';


//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';

export default compose(
  BEMComponent('genericConfirmation')
)(GenericConfirmation);
