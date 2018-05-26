import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';


export default class Portal extends React.PureComponent {
  componentDidMount() {
    if(this.props.isOpened && this.props.onOpen) {
      this.props.onOpen();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isOpened && !this.props.isOpened) {
      nextProps.onOpen && nextProps.onOpen();
    }
  }

  render() {
    const props = this.props;

    return props.isOpened ? ReactDOM.createPortal(
      props.children,
      document.body,//DEV make this in some way configurable? Not when YAGNI.
    ) : null;
  }
}

Portal.defaultProps = {
  isOpened: false
};

Portal.propTypes = {
  isOpened: PropTypes.bool,
  onOpen: PropTypes.func
};
