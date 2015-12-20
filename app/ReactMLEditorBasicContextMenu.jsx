import React from 'react';
import ReactML from 'react-ml';

const {
  ReactMLBold,
  ReactMLUnderline,
  ReactMLItalic,
} = ReactML;

const basicTransformers = [
  {
    label: <ReactMLBold>{'b'}</ReactMLBold>,
    transform: (selection) => `<b>${selection}</b>`,
  },
  {
    label: <ReactMLItalic>{'i'}</ReactMLItalic>,
    transform: (selection) => `<i>${selection}</i>`,
  },
  {
    label: <ReactMLUnderline>{'u'}</ReactMLUnderline>,
    transform: (selection) => `<u>${selection}</u>`,
  },
];

class ReactMLEditorBasicContextMenu extends React.Component {
  static propTypes = {
    caretCoordinates: React.PropTypes.shape({
      top: React.PropTypes.number,
      left: React.PropTypes.number,
    }),
    onTransformSelection: React.PropTypes.func,
    selection: React.PropTypes.string,
    transformers: React.PropTypes.arrayOf(React.PropTypes.shape({
      label: React.PropTypes.node,
      transform: React.PropTypes.func,
    })),
  };

  static defaultProps = {
    caretCoordinates: {
      top: 0,
      left: 0,
    },
    onTransformSelection: () => void 0,
    selection: '',
    transformers: basicTransformers,
  };

  transformSelection(e, transform) {
    if(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { selection, onTransformSelection } = this.props;
    onTransformSelection(transform(selection));
  }

  render() {
    const { caretCoordinates, transformers } = this.props;
    return <div
      className='reactml-context-menu reactml-basic-context-menu'
      style={{
        position: 'absolute',
        top: caretCoordinates.top,
        left: caretCoordinates.left,
        marginTop: '1.8em',
      }}
    >
      {transformers.map(({ label, transform }, key) =>
        <button
          key={key}
          onClick={(e) => this.transformSelection(e, transform)}
        >
          {label}
        </button>
      )}
    </div>;
  }
}

export default ReactMLEditorBasicContextMenu;
