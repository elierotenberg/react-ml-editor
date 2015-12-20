/* eslint-disable react/jsx-key */
import React from 'react';
import ReactML from 'react-ml';

const {
  ReactMLBold,
  ReactMLItalic,
  ReactMLUnderline,
  ReactMLStrikethrough,
  ReactMLLink,
  ReactMLImage,
} = ReactML;

const helpers = [
  [
    '<b>Bold text</b>',
    <ReactMLBold>{'Bold text'}</ReactMLBold>,
  ],
  [
    '<i>Italic text</i>',
    <ReactMLItalic>{'Italic text'}</ReactMLItalic>,
  ],
  [
    '<u>Underline text</u>',
    <ReactMLUnderline>{'Underline text'}</ReactMLUnderline>,
  ],
  [
    '<s>Strikethrough text</s>',
    <ReactMLStrikethrough>{'Strikethrough text'}</ReactMLStrikethrough>,
  ],
  [
    '<image url="https://news.ycombinator.com/y18.gif" label="Image" />',
    <ReactMLImage label={'Image'} url={'https://news.ycombinator.com/y18.gif'} />,
  ],
  [
    '<link url="https://github.com/elierotenberg/react-ml">Link</link>',
    <ReactMLLink url={'https://github.com/elierotenberg/react-ml'}>{'Link'}</ReactMLLink>,
  ],
];

class ReactMLEditorBasicContextMenu extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      toggled: false,
    };
  }

  toggle() {
    const { toggled } = this.state;
    this.setState({
      toggled: !toggled,
    });
  }

  render() {
    const { toggled } = this.state;
    const toggleButton = <div
      onClick={(e) => this.toggle(e)}
      style={{
        textAlign: 'right',
        cursor: 'pointer',
      }}
    >
      { toggled ? 'Hide' : 'Show' }
      {' help'}
    </div>;
    const untoggledMenu = <div
      className='reactml-help-menu-untoggled'
    >
      {toggleButton}
    </div>;

    const toggledMenu = <div
      className='reactml-help-menu-toggled'
    >
      <div
        style={{
          padding: '1em',
          border: '1px solid #333',
        }}
      >
        <h2>{'Available tags:'}</h2>
        <ul
          style={{
            padding: 0,
            margin: 0,
          }}
        >
          {helpers.map(([label, example], key) =>
            <li
              key={key}
              style={{
                listStyleType: 'none',
              }}
            >
              <dl>
                <dt
                  style={{
                    display: 'inline-block',
                    fontFamily: 'monospace',
                    width: '15em',
                    wordWrap: 'break-word',
                  }}
                >
                  {label}
                </dt>
                <dd
                  style={{
                    display: 'inline-block',
                  }}
                >
                  {example}
                </dd>
              </dl>
            </li>
          )}
        </ul>
      </div>
      {toggleButton}
    </div>;

    return <div
      className='reactml-help-menu'
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: '1em',
      }}
    >
      { toggled ? toggledMenu : untoggledMenu }
    </div>;
  }
}

export default ReactMLEditorBasicContextMenu;
