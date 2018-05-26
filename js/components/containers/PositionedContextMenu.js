import React from 'react';
import {compose} from 'recompose';


//HOCs
import PositionedItemComponent from '../highOrderComponents/PositionedItemComponent';

//Containers
import ContextMenu from './ContextMenu';

//pass along bounds props
export const mapProps = ({x, y, setElement, portalElement,
  mId, contentWidth, contentHeight, positionX, positionY, positionWidth,
  positionHeight, element, setContentSize,
  ...rest
}) => (rest);

export default compose(PositionedItemComponent({
  mapProps
}))(ContextMenu);
