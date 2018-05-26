import React from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import {compose, getDisplayName} from 'recompose';

//HOCs
import WithStateHandlersComponent from './WithStateHandlersComponent';

//Presentational
import RenderChildren from '../presentational/RenderChildren';

//Helpers
import {isObjEmpty, cloneObjectWithoutKeys} from '../../helpers/Helpers';


export default function TransitionBetweenComponent() {
  return function (TransitionComponent) {
    function Transition({children, active, selectedSection, onSectionHidden, nextSection, setNextSection, activeSection, setActiveSection, aTransitionStarted, aTransitionFinished, transitionsInProgress, setIsTransitioning = null, ...transitionProps}) {
      return <TransitionGroup component={RenderChildren}>{
        React.Children.map(children, (child) => {
          if(!child || !React.isValidElement(child)) {
            return null;
          }

          const section = child.key;
          const isSectionVisible = nextSection === undefined && activeSection == section;

          return isSectionVisible && <TransitionComponent
            {...transitionProps}
            /*onEntering={() => {
              //aTransitionStarted(child.key)
            }}*/
            onExited={() => {
              //Need delay to allow transition completion before starting to show the next section
              //setTimeout(() => {

                setTimeout(() => {
                  onSectionHidden(child.key)
                }, 0);

                //aTransitionFinished(child.key);
              //}, 0);
            }}
          >
            {child.props.passthrough ? child.props.children : child}
          </TransitionComponent>
        })
      }</TransitionGroup>
    }

    Transition.displayName = `TransitionBetween(${getDisplayName(TransitionComponent)})`;

    Transition.propTypes = {
      setIsTransitioning: PropTypes.func
      //TODO other prop types
    };

    return compose(
      WithStateHandlersComponent(
        {
          activeSection: undefined,
          nextSection: undefined,
          transitionsInProgress: {}
        },
        {
          setNextSection: (state, props) => (nextSection) => {
            //console.log('setNextSection: ', state, props, nextSection)
            return {nextSection}
          },
          setActiveSection: (state, props) => (activeSection) => {
            //console.log('setActiveSection: ', state, props, activeSection)
            return {activeSection}
          },
          onSectionHidden: ({nextSection, activeSection, ...state}, props) => (section) => {
            //console.log('onSectionHidden: ', state, props)
            if(nextSection !== undefined && activeSection == section) {
              return {activeSection: nextSection, nextSection: undefined};
            }
          },
          aTransitionStarted: ({transitionsInProgress}, {setIsTransitioning}) => (key) => {
            const newKeys = {
              ...transitionsInProgress,
              [key]: true
            }

            if(setIsTransitioning && isObjEmpty(transitionsInProgress)) {
              setIsTransitioning(true);
            }

            return newKeys;
          },
          aTransitionFinished: ({transitionsInProgress}, {setIsTransitioning}) => (key) => {
            const newKeys = cloneObjectWithoutKeys(transitionsInProgress, key);

            if(setIsTransitioning && isObjEmpty(newKeys)) {
              setIsTransitioning(false);
            }

            return newKeys;
          }
        },
        {
          withPropsOnChange: [
            ['selectedSection'],
            ({children, selectedSection, nextSection, setNextSection, activeSection, setActiveSection}) => {
              children = React.Children.toArray(children);

              //if nextSection not found, and there is a default, then use that
              if(selectedSection && !children.some((child) => {
                  return child && child.key == selectedSection;
                }) && children.some((child) => {
                  return child && child.key == DEFAULT
                })) {
                selectedSection = DEFAULT;
              }

              if(nextSection) {//if mid transition
                if(nextSection !== selectedSection) {
                  setNextSection(selectedSection)
                }
              } else {
                if(selectedSection != activeSection) {
                  if(!activeSection) {//nothing currently set
                    setActiveSection(selectedSection);
                  } else {
                    setNextSection(selectedSection)
                  }
                }
              }
            }
          ]
        }
      )
    )(Transition);
  }
};


export const DEFAULT = '_default_';
