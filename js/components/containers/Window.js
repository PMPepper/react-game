import React from 'react';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';
import PositionedItemComponent, {minWithinBounds} from '../highOrderComponents/PositionedItemComponent';

//Containers

//Presentational
import Panel from '../presentational/Panel';



export default compose(
  BEMComponent('panel'),
  PositionedItemComponent({
    usePortal: false,
    xPosRule: minWithinBounds(30, 30),
    yPosRule: minWithinBounds(-30, 30)
  })
)(
  Panel
);
