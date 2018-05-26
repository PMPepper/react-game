import React from 'react';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';


//Presentational
import ConfirmModal from '../presentational/ConfirmModal';


export default compose(
  BEMComponent('confirmModal')
)(ConfirmModal);
