import React from 'react';
import {compose} from 'recompose';


//HOCs
import WithStateHandlersComponent from '../highOrderComponents/WithStateHandlersComponent';
import CameraControlsComponent from '../highOrderComponents/CameraControlsComponent';
import CameraEasingComponent from '../highOrderComponents/CameraEasingComponent';

//Presentational
import SystemRenderer from '../presentational/SystemRenderer';

//Helpers
import {mergeElementProps} from '../../helpers/React';

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
      setMouseDownPos: () => (e) => ({mouseDownX: e.clientX, mouseDownY: e.clientY, isClickPrevented: false, isClickStarted: true}),
      setMouseMovePos: ({mouseDownX, mouseDownY, isClickPrevented}) => (e) => {
        if(isClickPrevented) {
          return;
        }

        const dx = mouseDownX - e.clientX;
        const dy = mouseDownY - e.clientY;

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
    },
    {
      mapProps: ({setMouseDownPos, setMouseMovePos, clearMousePos, elementProps, ...props}) => {
        return {
          ...props,
          elementProps: mergeElementProps(
            elementProps,
            {
              onMouseDown: setMouseDownPos,
              onMouseMove: setMouseMovePos,
              onMouseUp: clearMousePos
            }
          )
        };
      }
    }
  ),
  CameraControlsComponent(),
  CameraEasingComponent()
)(
  SystemRenderer
);
