import React from 'react';
import ReactML from 'react-ml';

function attempt(fn) {
  try {
    return { value: fn(), err: null };
  }
  catch(err) {
    return { value: null, err };
  }
}

class ReactMLEditorPreview extends React.Component {
  static propTypes = {
    components: React.PropTypes.object,
    source: React.PropTypes.string,
  };

  static defaultProps = {
    components: ReactML.presets.basic,
    source: '',
  };

  render() {
    const { source, components } = this.props;
    const { value, err } = attempt(() => ReactML.compile(source, components));
    return <div
      className='react-ml-preview'
      style={{
        padding: '10px',
      }}
    >
      {(() => {
        if(err) {
          return <div className='react-ml-preview-error'>
            {err.toString()}
          </div>;
        }
        return <div className='reactml-preview-value'>
          {value}
        </div>;
      })()}
    </div>;
  }
}

export default ReactMLEditorPreview;
