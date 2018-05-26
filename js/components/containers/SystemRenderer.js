import React from 'react';
import {compose} from 'recompose';


//HOCs
import WithStateHandlersComponent from '../highOrderComponents/WithStateHandlersComponent';
import CameraControlsComponent from '../highOrderComponents/CameraControlsComponent';
import CameraEasingComponent from '../highOrderComponents/CameraEasingComponent';

//Presentational
import SystemRenderer from '../presentational/SystemRenderer';

const CLICK_LIMIT = 2;
const CLICK_LIMIT_2 = CLICK_LIMIT * CLICK_LIMIT;

export default compose(
  WithStateHandlersComponent(
    {
      element: null,
      mouseDownX: null,
      mouseDownY: null,
      isClickStarted: false,
      isClickPrevented: false
    },
    {
      setElement: (state, {setElement}) => (element) => {
        setElement && setElement(element);

        return {
          element
        };
      },
      setMouseDownPos: () => (mouseDownX, mouseDownY) => ({mouseDownX, mouseDownY, isClickPrevented: false, isClickStarted: true}),
      setMouseMovePos: ({mouseDownX, mouseDownY, isClickPrevented}) => (x, y) => {
        if(isClickPrevented) {
          return;
        }

        const dx = mouseDownX - x;
        const dy = mouseDownY - y;

        if((dx * dx) + (dy * dy) > CLICK_LIMIT_2) {
          return {isClickPrevented: true};
        }
      },
      clearMousePos: () => () => ({
        mouseDownX: null,
        mouseDownY: null,
        isClickPrevented: false,
        isClickStarted: false
      })
    }
  ),
  CameraControlsComponent(),
  CameraEasingComponent()
)(
  SystemRenderer
);
