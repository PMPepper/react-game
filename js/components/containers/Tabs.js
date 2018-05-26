import React from 'react';
import PropTypes from 'prop-types';
import {compose, mapProps} from 'recompose';


//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';


//Presentational
import Tabs from '../presentational/Tabs';



const modifiers = {};

export default compose(
  BEMComponent('tabs', modifiers, arg => (arg), (mappedProps, {fullWidthTabs, ...rest}) => {
    return {...rest, ...mappedProps};
  }),//, arg => (arg), ({fullWidthTabs, ...rest}) => {return rest}
  mapProps(({onRequestChangeSelected, ...rest}) => {
    return {
      ...rest,
      onRequestChangeSelected: (index, elem) => {
        onRequestChangeSelected(index);

        elem && elem.focus();
      }
    };
  })
)(Tabs);
