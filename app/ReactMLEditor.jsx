import React from 'react';

import ReactMLEditorBasicContextMenu from './ReactMLEditorBasicContextMenu';
import ReactMLEditorBasicHelpMenu from './ReactMLEditorBasicHelpMenu';
import ReactMLEditorBasicSuggestMenu from './ReactMLEditorBasicSuggestMenu';
import getCaretCoordinates from 'textarea-caret-position';

class ReactMLEditor extends React.Component {
  static displayName = 'ReactMLEditor';

  static propTypes = {
    ContextMenu: React.PropTypes.any,
    HelpMenu: React.PropTypes.any,
    SuggestMenu: React.PropTypes.any,
    onChange: React.PropTypes.func,
  };

  static defaultProps = {
    ContextMenu: ReactMLEditorBasicContextMenu,
    HelpMenu: ReactMLEditorBasicHelpMenu,
    SuggestMenu: ReactMLEditorBasicSuggestMenu,
    onChange: () => void 0,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      value: '',
      suggesting: false,
      selectionStart: void 0,
      selectionEnd: void 0,
    };
    this.selectionTimeout = null;
  }

  componentWillUnmount() {
    if(this.selectionTimeout !== null) {
      clearTimeout(this.selectionTimeout);
    }
  }

  setSelectionRange(selectionStart, selectionEnd) {
    const { selectionArea } = this.refs;
    this.setState({
      selectionEnd,
      selectionStart,
    });
    selectionArea.setSelectionRange(selectionStart, selectionEnd);
  }

  focusAtSelection(selectionStart, selectionEnd) {
    const { selectionArea } = this.refs;
    if(this.selectionTimeout !== null) {
      clearTimeout(this.selectionTimeout);
    }
    selectionArea.focus();
    this.selectionTimeout = setTimeout(() => this.setSelectionRange(selectionStart, selectionEnd), 0);
  }

  setValue(value) {
    const { onChange } = this.props;
    this.setState({ value });
    onChange(value);
  }

  getCurrentSelection() {
    const {
      selectionEnd,
      selectionStart,
      value,
    } = this.state;
    if(selectionEnd === void 0 || selectionStart === void 0) {
      return void 0;
    }
    return value.slice(selectionStart, selectionEnd);
  }

  onKeyPress(e) {
    const { key } = e;
    this.setState({ suggesting: key === '@' });
  }

  onKeyDown() {
    this.setState({ suggesting: false });
  }

  onChange(e) {
    const { target } = e;
    const { value } = target;
    this.setValue(value);
  }

  onSelect(e) {
    const { target } = e;
    const { selectionEnd, selectionStart } = target;
    this.setSelectionRange(selectionStart, selectionEnd);
  }

  onTransformSelection(transformedSelection) {
    const {
      selectionEnd,
      selectionStart,
      value,
    } = this.state;
    const beforeSelection = value.slice(0, selectionStart);
    const afterSelection = value.slice(selectionEnd, value.length);
    this.setValue(beforeSelection + transformedSelection + afterSelection);
    this.focusAtSelection(selectionStart, selectionStart + transformedSelection.length);
  }

  onTransformSuggestion(transformedSuggestion) {
    const {
      selectionEnd,
      selectionStart,
      value,
    } = this.state;
    const beforeSelection = value.slice(0, selectionStart);
    const afterSelection = value.slice(selectionEnd + 1, value.length);
    this.setState({
      suggesting: false,
    });
    this.setValue(beforeSelection + transformedSuggestion + afterSelection);
    this.focusAtSelection(
      selectionStart + transformedSuggestion.length,
      selectionStart + transformedSuggestion.length,
    );
  }

  render() {
    const { selectionArea } = this.refs;
    const caretCoordinates = selectionArea ? getCaretCoordinates(selectionArea, selectionArea.selectionEnd) : {
      top: 0,
      left: 0,
    };
    const {
      ContextMenu,
      HelpMenu,
      SuggestMenu,
    } = this.props;

    const {
      selectionEnd,
      selectionStart,
      suggesting,
      value,
    } = this.state;

    const selection = this.getCurrentSelection();
    const selecting = selection !== void 0 && selection.length > 0;

    const contextMenu = <ContextMenu
      caretCoordinates={caretCoordinates}
      onTransformSelection={(transformedSelection) => this.onTransformSelection(transformedSelection)}
      selection={selection}
     />;

    const suggestMenu = <SuggestMenu
      caretCoordinates={caretCoordinates}
      onTransformSuggestion={(transformedSuggestion) => this.onTransformSuggestion(transformedSuggestion)}
    />;

    return <div
      className='reactml-editor'
      style={{
        position: 'relative',
      }}
    >
      <textarea
        onChange={(e) => this.onChange(e)}
        onKeyDown={(e) => this.onKeyDown(e)}
        onKeyPress={(e) => this.onKeyPress(e)}
        onResize={() => this.onResize()}
        onSelect={(e) => this.onSelect(e)}
        ref='selectionArea'
        selectionEnd={selectionEnd}
        selectionStart={selectionStart}
        style={{
          height: '100%',
          width: '100%',
          resize: 'none',
          overflow: 'auto',
        }}
        value={value}
      />
      { selecting ? contextMenu : null }
      { suggesting && !selecting ? suggestMenu : null }
      <HelpMenu />
    </div>;
  }
}

export default ReactMLEditor;
