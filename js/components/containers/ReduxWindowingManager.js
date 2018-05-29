import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {compose} from 'recompose';


//Components
import ReduxWindow from './ReduxWindow';


//Reducers
import {focusWindow} from '../../reducers/ui/makeWindowingManager';

//Helpers
import {resolveObjPath} from '../../helpers/Object';


export default compose(
  connect((state, {reducerName}) => {
    return {
      state: resolveObjPath(state, reducerName)
    }
  }, (dispatch, {reducerName, ...ownProps}) => {
    return bindActionCreators({
      focusWindow: (windowName) => (focusWindow(reducerName, windowName))//curry action with reducer name
    }, dispatch);
  })
)(function ReduxWindowingManager({children, state, focusWindow, boundsX, boundsY, boundsWidth, boundsHeight}) {
  const childrenKeyMap = {};

  React.Children.forEach(children, (child) => {
    if(child) {
      childrenKeyMap[child.key] = child;
    }
  });

  return state.map(key => {
    const child = childrenKeyMap[key];

    return <ReduxWindow key={key} reducerName={key} focusWindow={() =>{focusWindow(key)}} boundsX={boundsX} boundsY={boundsY} boundsWidth={boundsWidth} boundsHeight={boundsHeight}>
      {child}
    </ReduxWindow>;
  });
});
