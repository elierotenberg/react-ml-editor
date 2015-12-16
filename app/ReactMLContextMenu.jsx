import React from 'react';

class ReactMLContextMenu extends React.Component {
  static propTypes = {
    onTransformSelection: React.PropTypes.func,
    selection: React.PropTypes.string,
  };

  static defaultProps = {
    onTransformSelection: () => void 0,
    selection: '',
  };

  render() {
    return null;
  }
}

export default ReactMLContextMenu;
