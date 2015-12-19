import React from 'react';
import ReactML from 'react-ml';

import ReactMLEditor from './ReactMLEditor';
import ReactMLPreview from './ReactMLPreview';
import ReactMLContextMenu from './ReactMLContextMenu';
import ReactMLSuggestMenu from './ReactMLSuggestMenu';

class ReactMLSplitEditor extends React.Component {
  static propTypes = {
    ContextMenu: React.PropTypes.any,
    SuggestMenu: React.PropTypes.any,
    components: React.PropTypes.object,
    flexDirection: React.PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),
    onChange: React.PropTypes.func,
  };

  static defaultProps = {
    ContextMenu: ReactMLContextMenu,
    SuggestMenu: ReactMLSuggestMenu,
    components: ReactML.presets.basic,
    onChange: () => void 0,
    flexDirection: 'row',
    suggest: () => void 0,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      source: '',
    };
  }

  onEditorChange(source) {
    const { onChange } = this.props;
    this.setState({ source });
    onChange(source);
  }

  render() {
    const { ContextMenu, SuggestMenu, components, flexDirection } = this.props;
    const { source } = this.state;
    return <div
      className='reactml-split-editor'
      style={{
        display: 'flex',
        flexDirection,
      }}
    >
      <div className='reactml-split-editor-editor'
        style={{
          flexBasis: '50%',
        }}
      >
        <ReactMLEditor
          ContextMenu={ContextMenu}
          SuggestMenu={SuggestMenu}
          onChange={(nextSource) => this.onEditorChange(nextSource)}
        />
      </div>
      <div className='reactml-split-editor-preview'
        style={{
          flexBasis: '50%',
        }}
      >
        <ReactMLPreview components={components} source={source} />
      </div>
    </div>;
  }
}

export default ReactMLSplitEditor;
