import React from 'react';
import ReactML from 'react-ml';

import ReactMLEditor from './ReactMLEditor';
import ReactMLPreview from './ReactMLPreview';

class ReactMLSplitEditor extends React.Component {
  static propTypes = {
    components: React.PropTypes.object,
    flexDirection: React.PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),
    onChange: React.PropTypes.func,
    suggest: React.PropTypes.func,
  };

  static defaultProps = {
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
    const { components, flexDirection, suggest } = this.props;
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
        <ReactMLEditor onChange={(nextSource) => this.onEditorChange(nextSource)} suggest={suggest} />
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
