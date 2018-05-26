import React from 'react';
import PropTypes from 'prop-types';
import {getDisplayName} from 'recompose';

//Helpers
import {isReactComponent} from '../../helpers/ExtendedPropTypes';

//this component is Pure

export default class TransitionHeightToContents extends React.Component {
  state = {
    currentContentHeight: null
  };

  componentWillMount() {
    allActiveComponents.push(this);

    if(allActiveComponents.length == 1) {
      updateHeights();
    }
  }

  componentWillUnmount () {
    const index = allActiveComponents.indexOf(this);

    if(index != -1) {
      allActiveComponents.splice(index, 1);
    }
  }

  render() {
    const {children, disable, debug, override, component: Component, className, style: _style, elementProps = null, getRef = null} = this.props;

    const style = {
      ..._style,
      ...(disable ?
        {height: 'auto', transition: 'none'}
        :
        {height: this.state.currentContentHeight === null ? 'auto' : this.state.currentContentHeight+'px'})
      }

    if(this.props.debug) {
      console.log('render: ', style.height, style);
    }

    //TODO component might not be html, should check and apply generic params differently if it isn't
    return <Component {...elementProps} ref={getRef} className={'transitionHeightToContents'+(className ? ' '+className : '')} style={style}>
        <div ref={(elem) => {
          this._elem = elem;
          elem && updateHeight(this);
        }}>
          {children}
        </div>
    </Component>
  }

  static propTypes = {
    component: isReactComponent,
    componentProps: PropTypes.object,
    disable: PropTypes.bool,
    override: PropTypes.number
  };
  static defaultProps = {
    component: 'div',
    disable: false,
    override: null
  };
}

const allActiveComponents = [];

function updateHeights() {
  allActiveComponents.forEach((component) => {
    updateHeight(component);
  });

  if(allActiveComponents.length > 0) {
    window.requestAnimationFrame(updateHeights);
  }
}

function updateHeight(component) {
  const elem = component._elem;
  const isDebug = !!component.props.debug;

  if(!elem) {
    return;
  }

  const contentHeight = component.props.override !== null ? component.props.override : elem.offsetHeight ;

  isDebug && console.log('updateHeights(): ', contentHeight, elem.offsetHeight, component.props.override);

  if(contentHeight != component.state.currentContentHeight) {
    component.setState({
      currentContentHeight: contentHeight
    });
  }
}
