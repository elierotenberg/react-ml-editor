import React from 'react';
import url from 'url';

const WIKIPEDIA_WIKI_BASE_URL = 'https://en.wikipedia.org/wiki/';

class ReactMLWikipedia extends React.Component {
  static propTypes = {
    children: React.PropTypes.string,
  };

  render() {
    const { children } = this.props;
    const title = children;
    if(typeof title !== 'string') {
      return null;
    }
    return <a
      className='reactml-wikipedia'
      href={url.resolve(WIKIPEDIA_WIKI_BASE_URL, title)}
    >
      {title}
    </a>;
  }
}

export default ReactMLWikipedia;
