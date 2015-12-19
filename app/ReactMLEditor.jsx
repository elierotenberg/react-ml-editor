import getCaretCoordinates from 'textarea-caret-position';
import React from 'react';

import ReactMLContextMenu from './ReactMLContextMenu';
import ReactMLSuggestMenu from './ReactMLSuggestMenu';

function explode(str, a, b) {
  if(a > b) {
    return explode(str, b, a);
  }
  return [
    str.slice(0, a),
    str.slice(a, b),
    str.slice(b, str.length),
  ];
}

class ReactMLEditor extends React.Component {
  static displayName = 'ReactMLEditor';

  static propTypes = {
    ContextMenu: React.PropTypes.any,
    SuggestMenu: React.PropTypes.any,
    onChange: React.PropTypes.func,
  };

  static defaultProps = {
    ContextMenu: ReactMLContextMenu,
    SuggestMenu: ReactMLSuggestMenu,
    onChange: () => void 0,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      content: '',
      suggesting: false,
      beforeSuggest: void 0,
      afterSuggest: void 0,
      selectionStart: void 0,
      selectionEnd: void 0,
      caretCoordinates: {
        top: void 0,
        left: void 0,
      },
    };
  }

  getCurrentSelection() {
    const { selectionStart, selectionEnd, content } = this.state;
    if(selectionStart === void 0 || selectionEnd === void 0) {
      return null;
    }
    const [, currentSelection] = explode(content, selectionStart, selectionEnd);
    return currentSelection;
  }

  onTransformSelection(transformedSelection) {
    const { textarea } = this.refs;
    const { selectionStart, selectionEnd, content } = this.state;
    const [beforeCaret, , afterCaret] = explode(content, selectionStart, selectionEnd);
    const nextContent = beforeCaret + transformedSelection + afterCaret;
    this.setState({
      content: nextContent,
      selectionEnd: selectionStart + nextContent.length,
    });
    textarea.setSelectionRange(selectionStart, selectionEnd + nextContent.length);
  }

  onTextAreaChange(e) {
    const { onChange } = this.props;
    const content = e.target.value;
    this.setState({ content });
    this.updateCaretPosition();
    onChange(content);
  }

  onTextAreaSelect() {
    const { textarea } = this.refs;
    const { selectionStart, selectionEnd } = textarea;
    this.setState({
      selectionStart,
      selectionEnd,
    });
  }

  onKeyPress(e) {
    this.updateCaretPosition();
    const { key } = e;
    if(key === '@') {
      const { textarea } = this.refs;
      const { value } = e.target;
      const { selectionEnd } = textarea;
      const beforeSuggest = value.substr(0, selectionEnd);
      const afterSuggest = value.substr(selectionEnd);
      this.setState({
        suggesting: true,
        beforeSuggest,
        afterSuggest,
      });
    }
    else {
      this.setState({
        suggesting: false,
        beforeSuggest: void 0,
        afterSuggest: void 0,
      });
    }
  }

  onKeyDown() {
    this.updateCaretPosition();
    this.setState({
      suggesting: false,
      beforeSuggest: void 0,
      afterSuggest: void 0,
    });
  }

  updateCaretPosition() {
    const { textarea } = this.refs;
    const caretCoordinates = getCaretCoordinates(textarea, textarea.selectionEnd);
    this.setState({ caretCoordinates });
  }

  setCaretPosition(position) {
    const { textarea } = this.refs;
    textarea.setSelectionRange(position, position);
    textarea.focus();
  }

  onAcceptSuggest(suggestion) {
    const { onChange } = this.props;
    const { beforeSuggest, afterSuggest } = this.state;
    const beforeCaret = beforeSuggest + suggestion;
    const content = beforeCaret + afterSuggest;
    this.setState({
      content,
      suggesting: false,
      beforeSuggest: void 0,
      afterSuggest: void 0,
    }, () => {
      this.setCaretPosition(beforeCaret.length);
      onChange(content);
    });
  }

  onRejectSuggest() {
    const { beforeSuggest } = this.state;
    this.setState({
      suggesting: false,
      beforeSuggest: void 0,
      afterSuggest: void 0,
    }, () => this.setCaretPosition(beforeSuggest.length + 1));
  }

  render() {
    const { SuggestMenu, ContextMenu } = this.props;
    const { content, suggesting, caretCoordinates } = this.state;
    const selection = this.getCurrentSelection();
    const selecting = typeof selection === 'string' && selection.length > 0;
    const suggestMenu = <SuggestMenu
      caretCoordinates={caretCoordinates}
      onAcceptSuggest={(suggestion) => this.onAcceptSuggest(suggestion)}
      onRejectSuggest={() => this.onRejectSuggest()}
    />;
    const contextMenu = <ContextMenu
      caretCoordinates={caretCoordinates}
      onTransformSelection={(transformedSelection) => this.onTransformSelection(transformedSelection)}
      selection={selection}
     />;
    return <div className='reactml-editor'>
      <textarea
        onChange={(e) => this.onTextAreaChange(e)}
        onKeyDown={(e) => this.onKeyDown(e)}
        onKeyPress={(e) => this.onKeyPress(e)}
        onResize={() => this.updateCaretPosition()}
        onSelect={(e) => this.onTextAreaSelect(e)}
        ref='textarea'
        style={{
          height: '100%',
          width: '100%',
          resize: 'none',
          overflow: 'auto',
        }}
        value={content}
      />
      { selecting ? contextMenu : null }
      { suggesting && !selecting ? suggestMenu : null }
    </div>;
  }
}

export default ReactMLEditor;
