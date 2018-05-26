import React from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import {getDisplayName} from 'recompose';


//Presentational
import RenderChildren from '../presentational/RenderChildren';

//Helpers
import {isReactComponent} from '../../helpers/ExtendedPropTypes';


//The component
export default function TransitionChildrenWithComponent() {
  return function (TransitionComponent) {
    function Transition({children, active, className = undefined, transitionGroupComponent = RenderChildren, appear = false, ...rest}) {
      return <TransitionGroup component={transitionGroupComponent} className={className} appear={appear}>{
        React.Children.map(children, (child) => {
          if(!React.isValidElement(child)) {
            return null;
          }

          return <TransitionComponent appear={true} {...rest} key={child.key}>{child}</TransitionComponent>
        })
      }</TransitionGroup>
    }

    Transition.displayName = `TransitionChildrenWith(${getDisplayName(TransitionComponent)})`;

    Transition.propTypes = {
      active: PropTypes.bool,
      className: PropTypes.string,
      transitionGroupComponent: isReactComponent
    };

    return Transition;
  }
}
