import React from 'react';
import PropTypes from 'prop-types';
import {getDisplayName} from 'recompose';

const allOfComponent = [];

let isCapslockOn = false;

function addListeners() {
  document.addEventListener('keydown', updateCapsState);
  document.addEventListener('mousemove', updateCapsState);
}

function removeListeners() {
  document.removeEventListener('keydown', updateCapsState);
  document.removeEventListener('mousemove', updateCapsState);
}

function updateCapsState( event ) {
  var caps = event.getModifierState && event.getModifierState('CapsLock');

  if(caps !== isCapslockOn) {
    isCapslockOn = caps;

    allOfComponent.forEach((component) => {
      component.forceUpdate();
    });
  }
}


export default function IsCapslockOn() {
  return function (WrappedComponent) {
    const Component = class extends React.Component {
      componentWillMount() {
        if(allOfComponent.length == 0) {
          addListeners();
        }
        allOfComponent.push(this);
      }

      componentWillUnmount() {
        let index = allOfComponent.indexOf(this);

        if(index !== -1) {
          allOfComponent.splice(index, 1)
        }

        if(allOfComponent.length == 0) {
          removeListeners();
        }
      }

      render() {
        return <WrappedComponent {...this.props} isCapslockOn={isCapslockOn} />
      }

      static displayName = `IsCapslockOn(${getDisplayName(WrappedComponent)})`
    }

    return Component;
  }
}
