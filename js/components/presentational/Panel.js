import React from 'react';
import PropTypes from 'prop-types';

//Containers
import Text from '../containers/Text';


//Helpers
import {propTypes} from '../highOrderComponents/BEMComponent';
import {isReactComponent, isReactRenderable, isPositiveNumber} from '../../helpers/ExtendedPropTypes';
import {mergeElementProps} from '../../helpers/React';


//This component is Pure
export default function Panel({
  baseClass, baseClassName, getElementClass,
  children, title = null, headOptions = null,
  component: Component = 'article', titleComponent: TitleComponent = 'h3', minHeight = null,
  elementProps = null
}) {
  //TODO component might not be html, should check and apply generic params differently if it isn't
  return <Component
    {...mergeElementProps(elementProps, {
      style: minHeight === null ? null : {minHeight: `${minHeight}px`},
      className: baseClass+(elementProps && elementProps.className ? ' '+elementProps.className : '')
    })}
  >
    <div className={getElementClass('head')}>
      {title && <TitleComponent className={getElementClass('title')}>{title}</TitleComponent>}
      {headOptions && <span className={getElementClass(['head', 'options'])}>{headOptions}</span>}
    </div>
    <div className={getElementClass('body')}>
      {children}
    </div>
    {/*Buttons?*/}
  </Component>
}


Panel.propTypes = {
  ...propTypes,
  elementProps: PropTypes.object,
  title: isReactRenderable,
  headerOptions: isReactRenderable,
  component: isReactComponent,
  titleComponent: isReactComponent,
  minHeight: isPositiveNumber
};
