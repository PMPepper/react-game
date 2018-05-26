import React from 'react';
import {compose, mapProps} from 'recompose';


//HOCs
import BEMComponent from '../highOrderComponents/BEMComponent';


//Presentational
import Accordion from '../presentational/Accordion';



const modifiers = {};

//after onRequestChangeSelected is called, set
//focusOnSelected

export default compose(
  BEMComponent('accordion', modifiers),
  mapProps(({onRequestChangeSelected, ...rest}) => {
    return {
      ...rest,
      onRequestChangeSelected: (index, elem) => {
        onRequestChangeSelected(index);

        elem && elem.focus();
      }
    };
  })
)(Accordion);
