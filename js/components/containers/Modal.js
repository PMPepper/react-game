import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';

//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';
import WithStateHandlersComponent from '../highOrderComponents/WithStateHandlersComponent';

//Presentational
import Modal from '../presentational/Modal';


//consts
const defaultTransitionTime = 0.3;

export default compose(
  WithStateHandlersComponent({
    isClosing: false,
    openingElement: null,
    rootElement: null,
    waitForElement: false,
    transition: 'hidden',
    active: false,
    usingKeyboard: false,
    stateChildren: null
  }, {
    setRootElement: ({waitForElement, onOpenedAndHaveElement}) => (rootElement) => {
      const state = {
        rootElement: rootElement ? (rootElement.node ? rootElement.node : rootElement) : null
      };

      if(waitForElement) {
        onOpenedAndHaveElement();
      }

      return state;
    },
    setStateChildren: () => (stateChildren) => ({stateChildren}),
    onOpenedAndHaveElement: ({setFocusOnDefaultItem, transition, onStartedShowing}, {onAfterOpen}) => () => {
      const state = {
        waitForElement: false
      };

      setFocusOnDefaultItem();

      onAfterOpen && onAfterOpen();//call handler if set

      //Begin open transition
      state.transition = 'showing';

      setTimeout(onStartedShowing, 0);

      return state;
    },
    onStartedShowing: ({transition, onFinishedShowing}, {transitionTime = defaultTransitionTime}) => () => {
      if(transition != 'showing') {
        return;
      }

      const state = {
        active: true
      };

      setTimeout(onFinishedShowing, transitionTime*1000);

      return state;
    },
    onFinishedShowing: ({transition}) => () => {
      if(transition != 'showing') {
        return;
      }

      return {
        transition: 'shown',
        active: false
      }
    },
    setFocusOnDefaultItem: ({rootElement}) => () => {
      //set focus on close button
      const defaultAction = rootElement.querySelector('.js-modalDefaultAction');

      if(defaultAction) {
        setTimeout(() => {
          defaultAction.focus();
        }, 0);
      } else {
        const closeBtn = rootElement.querySelector('.js-closeModalBtn');

        if(closeBtn) {
          setTimeout(() => {
            closeBtn.focus();
          }, 0);
        }
      }
    },
    onModalOpen: ({rootElement, onOpenedAndHaveElement}, {appElement}) => () => {
      const state = {};

      state.openingElement = document.activeElement;//should I keep a reference to an actual element, or get some sort of unique selector?

      //normalise appElement
      appElement = appElement ?
        (appElement instanceof Function ?
          appElement()
          :
          (typeof(appElement) === 'string' ) ?
            document.getElementById(appElement)
            :
            appElement
          )
        :
        null;

      state.appElement = appElement;

      if(appElement) {//if appElement suppied, set to aria-hidden
        appElement.setAttribute('aria-hidden', 'true');
      }

      if(rootElement) {
        onOpenedAndHaveElement();
      } else {
        state.waitForElement = true;
      }

      return state;
    },
    requestClose: (state, {isOpen, onRequestClose}) => (e) => {
      if(!isOpen) {//can only request close if you're currently open
        return;
      }

      onRequestClose && onRequestClose(e);
    },
    closeModal: ({transition, startHiding}) => (removeFromDOM) => {
      if(transition != 'shown' && transition != 'showing') {
        return;//prevent repeat calls
      }

      setTimeout(startHiding, 0);
    },
    startHiding: ({onStartedHiding}) => () => {
      setTimeout(onStartedHiding, 0);

      return {
        transition: 'hiding'
      };
    },
    onStartedHiding: ({transition, onFinishedHiding}, {transitionTime = defaultTransitionTime}) => () => {
      if(transition != 'hiding') {
        return;
      }

      setTimeout(onFinishedHiding, transitionTime*1000);

      return {active: true};
    },
    onFinishedHiding: ({transition, appElement, onHidden}, {children}) => () => {
      if(transition != 'hiding') {
        return;
      }

      if(appElement) {
        appElement.removeAttribute('aria-hidden');
      }

      setTimeout(onHidden, 0);

      return {
        transition: 'hidden',
        active: false,
        stateChildren: children,
        isClosing: false
      };
    },
    onHidden: ({openingElement, usingKeyboard}, {onClosed}) => () => {
      if(openingElement && usingKeyboard) {
          openingElement.focus();//only set focus if keyboard was used to open the modal
        }

        onClosed && onClosed();

        return {
          openingElement: null
        };
    },
    onContentClick: ({requestClose}) => (e) => {
      if(e.target.classList.contains('js-closeModalBtn')) {
        e.preventDefault();
        e.stopPropagation();

        requestClose(e);
      }
    }
  }, {
    withPropsOnChange: [
      ['children'],
      ({children, setStateChildren}) => {
        setStateChildren(React.Children.toArray(children));
      },
      ['isOpen'],
      ({isOpen, closeModal}, isMount) => {
        if(isMount) {
          return;
        }

        if(isOpen) {
          return {
            isClosing: false,
            usingKeyboard: usingKeyboard
          }
        } else {
          setTimeout(closeModal, 0);

          return {
            isClosing: true
          };
        }
      }
    ]
  }),
  BEMComponent('modal', {
    error: {
      type: PropTypes.bool,
      preset: false,
      default: false
    },
    warning: {
      type: PropTypes.bool,
      preset: false,
      default: false
    },
    info: {
      type: PropTypes.bool,
      preset: false,
      default: false
    },
    success: {
      type: PropTypes.bool,
      preset: false,
      default: false
    },
    thin: {
      type: PropTypes.bool,
      preset: false,
      default: false
    },
    wide: {
      type: PropTypes.bool,
      preset: false,
      default: false
    },
    active: {
      type: PropTypes.bool,
      preset: false,
      default: false
    },
    bg: {
      type: PropTypes.oneOf(['default', 'dark']),
      preset: 'default',
      default: 'default'
    },
    transition: {
      type: PropTypes.oneOf(['hidden', 'hiding', 'showing', 'shown'])
    }
  }),
)(Modal)


//Keep track of events
const body = document.body;
let usingKeyboard = false;

function lastInteraction(event) {
	if(event.type === 'keydown' && event.which === 18) {
		return;//ignore alt-tabbing out of the wondow
	}

	usingKeyboard = (event.type === 'keydown');
};

body.addEventListener('keydown', lastInteraction);
body.addEventListener('mousedown', lastInteraction);
