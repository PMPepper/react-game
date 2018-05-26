import React from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import {getDisplayName} from 'recompose';

import {hasAnyRenderableChildren} from '../../helpers/ReactHelpers';

import RenderChildren from '../presentational/RenderChildren';

export default function SingleTransitionComponent() {
  return function (TransitionComponent) {
    function Transition({children, ...transitionProps}) {
      return <TransitionGroup component={RenderChildren}>
        {hasAnyRenderableChildren(children) > 0 && <TransitionComponent {...transitionProps}>{children}</TransitionComponent>}
      </TransitionGroup>
    }

    Transition.displayName = `SingleTransition(${getDisplayName(TransitionComponent)})`;

    return Transition;
  }
}
