import React from 'react';
import Promise from 'bluebird';

Promise.config({
  cancellation: true,
});

const KEY_CODES = {
  HORIZONTAL_TAB: 9,
  ESCAPE: 27,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
};

const selectedSuggestionStyle = {
  backgroundColor: 'red',
};

class ReactMLSuggest extends React.Component {

  static propTypes = {
    onAcceptSuggest: React.PropTypes.func,
    onRejectSuggest: React.PropTypes.func,
    suggest: React.PropTypes.func,
  };

  static defaultProps = {
    onAcceptSuggest: () => void 0,
    onRejectSuggest: () => void 0,
    suggest: () => [],
  };

  constructor(...args) {
    super(...args);
    this.state = {
      currentInput: '',
      selectionIndex: 0,
      settled: false,
      suggestedTags: [],
      cancellableSuggestionPromise: Promise.resolve([]),
    };
  }

  componentDidMount() {
    const { input } = this.refs;
    input.focus();
  }

  componentWillUnmount() {
    const { cancellableSuggestionPromise } = this.state;
    cancellableSuggestionPromise.cancel();
  }

  acceptSuggestion(e) {
    if(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { onAcceptSuggest } = this.props;
    const { settled, selectionIndex, suggestedTags } = this.state;
    if(settled) {
      return void 0;
    }
    const suggestedTag = suggestedTags[selectionIndex];
    if(!suggestedTag) {
      return this.rejectSuggestion();
    }
    this.setState({ settled: true });
    const { suggestion } = suggestedTag;
    return onAcceptSuggest(suggestion);
  }

  rejectSuggestion(e) {
    if(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { onRejectSuggest } = this.props;
    const { settled } = this.state;
    if(settled) {
      return void 0;
    }
    this.setState({ settled: true });
    return onRejectSuggest();
  }

  moveSelectionTo(e, selectionIndex) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ selectionIndex });
  }

  onKeyDown(e) {
    const { keyCode } = e;
    const { selectionIndex: previousSelectionIndex, suggestedTags } = this.state;
    const lastPossibleSelectionIndex = suggestedTags.length - 1;
    if(keyCode === KEY_CODES.PAGE_UP || keyCode === KEY_CODES.HOME) {
      return this.moveSelectionTo(e, 0);
    }
    if(keyCode === KEY_CODES.PAGE_DOWN || keyCode === KEY_CODES.END) {
      return this.moveSelectionTo(e, lastPossibleSelectionIndex);
    }
    if(keyCode === KEY_CODES.UP_ARROW) {
      return this.moveSelectionTo(e, previousSelectionIndex === 0 ? 0 : previousSelectionIndex - 1);
    }
    if(keyCode === KEY_CODES.DOWN_ARROW) {
      return this.moveSelectionTo(
        e,
        previousSelectionIndex === lastPossibleSelectionIndex ? lastPossibleSelectionIndex : previousSelectionIndex + 1,
      );
    }
    if(keyCode === KEY_CODES.HORIZONTAL_TAB) {
      return this.acceptSuggestion(e);
    }
    if(keyCode === KEY_CODES.ESCAPE) {
      return this.rejectSuggestion(e);
    }
  }

  onInputChange(e) {
    const { value } = e.target;
    const { suggest } = this.props;
    const { cancellableSuggestionPromise } = this.state;
    const nextCancellableSuggestionPromise = suggest(value);
    this.setState({
      currentInput: value,
      cancellableSuggestionPromise: nextCancellableSuggestionPromise,
    });
    nextCancellableSuggestionPromise
    .then((suggestedTags) => {
      this.setState({ suggestedTags });
    })
    // we need to use finally here because there can be a chain of cancellations;
    // if this promise gets cancelled, we still need to cancel the previous ones
    .finally(() => {
      // only cancel upon settlement; no need to cancel earlier; this gives a chance to the previous request
      // to resolve while this one is still pending
      cancellableSuggestionPromise.cancel();
    });
  }

  render() {
    const { currentInput, selectionIndex, suggestedTags } = this.state;
    return <form
      className='reactml-suggest'
      onSubmit={(e) => this.acceptSuggestion(e)}
    >
      <input
        onChange={(e) => this.onInputChange(e)}
        onKeyDown={(e) => this.onKeyDown(e)}
        ref='input'
        type='text'
        value={currentInput}
      />
      <ul>
        {suggestedTags.map(({ label }, index) =>
          <li
            key={index}
            onClick={(e) => {
              this.setState({ selectionIndex: index });
              this.acceptSuggestion(e);
            }}
            style={index === selectionIndex ? selectedSuggestionStyle : {}}
          >
            {label}
          </li>
        )}
      </ul>
    </form>;
  }
}

export default ReactMLSuggest;
