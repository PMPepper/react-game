import React from 'react';
import PropTypes from 'prop-types';


import Text from '../containers/Text';


//Helpers
import {propTypes} from '../highOrderComponents/BEMComponent';
import {isReactComponent, isReactRenderable, isPositiveNumber} from '../../helpers/ExtendedPropTypes';


//This component is Pure

//TODO what modifiers are there?

export default function Panel({baseClass, baseClassName, getElementClass, children, title, component: Component = 'article', titleComponent: TitleComponent = 'h3', className = null, stretchContents = null, fullHeight = null, minHeight = null, elementProps = null, getRef = null}) {
  //TODO component might not be html, should check and apply generic params differently if it isn't
  return <Component {...elementProps} ref={getRef} className={baseClass+(className ? ' '+className : '')} style={minHeight === null ? null : {minHeight: `${minHeight}px`}}>
    {title && <TitleComponent className={getElementClass('title')}>{title}</TitleComponent>}
    <div className={getElementClass('body')}>
      {children}
    </div>
  </Component>
}


Panel.propTypes = {
  ...propTypes,
  title: isReactRenderable,
  component: isReactComponent,
  titleComponent: isReactComponent,
  className: PropTypes.string,
  minHeight: isPositiveNumber
};
