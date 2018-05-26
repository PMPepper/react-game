
import React from 'react';
import * as PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

import {makeModifierClass} from '../../helpers/BEMHelpers';
import {ucFirst} from '../../helpers/String';


function addOneClass(node, c) {
  node.classList.add(c);
}

function removeOneClass(node, c) {
  node.classList.remove(c);
}

const propTypes = {
  ...Transition.propTypes,


  /**
   * A `<Transition>` callback fired immediately after the 'enter' or 'appear' class is
   * applied.
   *
   * @type Function(node: HtmlElement, isAppearing: bool)
   */
  onEnter: PropTypes.func,

  /**
   * A `<Transition>` callback fired immediately after the 'enter-active' or
   * 'appear-active' class is applied.
   *
   * @type Function(node: HtmlElement, isAppearing: bool)
   */
  onEntering: PropTypes.func,

  /**
   * A `<Transition>` callback fired immediately after the 'enter' or
   * 'appear' classes are **removed** from the DOM node.
   *
   * @type Function(node: HtmlElement, isAppearing: bool)
   */
  onEntered: PropTypes.func,


  /**
   * A `<Transition>` callback fired immediately after the 'exit' class is
   * applied.
   *
   * @type Function(node: HtmlElement)
   */
  onExit: PropTypes.func,

  /**
   * A `<Transition>` callback fired immediately after the 'exit-active' is applied.
   *
   * @type Function(node: HtmlElement
   */
  onExiting: PropTypes.func,

  /**
   * A `<Transition>` callback fired immediately after the 'exit' classes
   * are **removed** from the DOM node.
   *
   * @type Function(node: HtmlElement)
   */
  onExited: PropTypes.func,
};

delete propTypes.timeout;

//-HOC defaults
const defaultTransitionTimings = {
  enter: 0.3,
  exit: 0.3
};

/**
 * A `Transition` component using CSS transitions and animations.
 *
 * `CSSTransition` applies a pair of class names during the `appear`, `enter`,
 * and `exit` stages of the transition. The first class is applied and then a
 * second "active" class in order to activate the css animation.
 *
 * When the `in` prop is toggled to `true` the Component will get
 * the `example_state_showing` CSS class and the `example_active` CSS class
 * added in the next tick.
 *
 */

export default function CSSTransition(transitionName, transitionTimings = defaultTransitionTimings) {
  //Calculated constants
  const timeout = {enter: (transitionTimings.enter * 1000), exit: (transitionTimings.exit * 1000)}

  const showingClassName = makeModifierClass(transitionName, 'state', 'showing');
  const shownClassName = makeModifierClass(transitionName, 'state', 'shown');
  const hidingClassName = makeModifierClass(transitionName, 'state', 'hiding');
  const hiddenClassName = makeModifierClass(transitionName, 'state', 'hidden');
  const activeClassName = makeModifierClass(transitionName, 'active', null);

  return class CSSTransition extends React.Component {
    //_elem = null;

    _onElement = (elem) => {
      if(!elem) {
        return;
      }

      //if(this.props.appear) {
        //TODO deal with appearing

      //} else if(this._elem === null) {
        addOneClass(elem, shownClassName);
      //}
    }

    onEnter = (node, appearing) => {
      this.removeClasses(node);
      addOneClass(node, showingClassName);

      if (this.props.onEnter) {
        this.props.onEnter(node)
      }
    }

    onEntering = (node, appearing) => {
      this.reflowAndSetActive(node, activeClassName)//active

      if (this.props.onEntering) {
        this.props.onEntering(node)
      }
    }

    onEntered = (node, appearing) => {
      this.removeClasses(node);
      addOneClass(node, shownClassName);

      if (this.props.onEntered) {
        this.props.onEntered(node)
      }
    }

    onExit = (node) => {
      this.removeClasses(node);
      addOneClass(node, hidingClassName)

      if (this.props.onExit) {
        this.props.onExit(node)
      }
    }

    onExiting = (node) => {
      this.reflowAndSetActive(node)

      if (this.props.onExiting) {
        this.props.onExiting(node)
      }
    }

    onExited = (node) => {
      this.removeClasses(node);
      addOneClass(node, hiddenClassName);

      if (this.props.onExited) {
        this.props.onExited(node)
      }
    }

    removeClasses(node) {
      removeOneClass(node, showingClassName);
      removeOneClass(node, shownClassName);
      removeOneClass(node, hidingClassName);
      removeOneClass(node, hiddenClassName);
      removeOneClass(node, activeClassName);
    }

    reflowAndSetActive(node) {
      // This is to force a repaint,
      // which is necessary in order to transition styles when adding a class name.
      /* eslint-disable no-unused-expressions */
      node.scrollTop;
      /* eslint-enable no-unused-expressions */
      addOneClass(node, activeClassName);
    }

    render() {
      const {children, className, classNames, componentClassName, componentProps, component: Component = 'div', ...props} = this.props;

      return (
        <Transition
          {...props}
          onEnter={this.onEnter}
          onEntered={this.onEntered}
          onEntering={this.onEntering}
          onExit={this.onExit}
          onExiting={this.onExiting}
          onExited={this.onExited}
          timeout={timeout}
        ><Component ref={this._onElement} className={transitionName+(componentClassName ? ' '+componentClassName : '')} {...componentProps}>{children}</Component></Transition>
      );
    }

    static propTypes = propTypes;

    static displayName = `${ucFirst(transitionName)}Transition`;

    static defaultProps = {
      appear: false
    };
  }
}
