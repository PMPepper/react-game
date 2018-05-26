import React from 'react';
import {renderComponent} from 'recompose';

import TransitionHeightToContents from '../presentational/TransitionHeightToContents';


export default renderComponent(TransitionHeightToContents);

//this component is Pure


/*
export default function TransitionHeightToContents({
  component: Component = 'div'
} = {}) {
  return (PresentationalComponent) => {
    class Clss extends React.Component {
      state = {
        currentContentHeight: 0
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
        const {children, disable, override, ...props} = this.props;

        const style = disable ?
          {height: 'auto', transition: 'none'}
          :
          {height: this.state.currentContentHeight+'px'}

        return <Component className="transitionHeightToContents" style={style}>
            <div ref={(elem) => {this._elem = elem;}}>
              <PresentationalComponent {...props}>{children}</PresentationalComponent>
            </div>
        </Component>
      }

      static displayName = `TransitionHeightToContents(${getDisplayName(PresentationalComponent)})`;
      static propTypes = {
        disable: PropTypes.bool,
        override: PropTypes.number
      };
      static defaultProps = {
        disable: false,
        override: null
      };
    }


    return Clss;
  }
}

const allActiveComponents = [];

function updateHeights() {
  allActiveComponents.forEach((component) => {
    const elem = component._elem;

    if(!elem) {
      return;
    }

    const contentHeight = component.props.override !== null ? component.props.override : elem.offsetHeight ;

    if(contentHeight != component.state.currentContentHeight) {
      component.setState({
        currentContentHeight: contentHeight
      });
    }
  });

  if(allActiveComponents.length > 0) {
    window.requestAnimationFrame(updateHeights);
  }
}
*/
