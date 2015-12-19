import React from 'react';

class ReactMLContextMenu extends React.Component {
  static propTypes = {
    caretCoordinates: React.PropTypes.shape({
      top: React.PropTypes.number,
      left: React.PropTypes.number,
    }),
    onTransformSelection: React.PropTypes.func,
    selection: React.PropTypes.string,
  };

  static defaultProps = {
    caretCoordinates: {
      top: 0,
      left: 0,
    },
    onTransformSelection: () => void 0,
    selection: '',
  };

  render() {
    return null;
  }
}

export default ReactMLContextMenu;
