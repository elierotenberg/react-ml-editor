import React from 'react';

import wikipediaSuggest from './wikipediaSuggest';
import ReactMLSuggestMenu from '../ReactMLSuggestMenu';

function WikipediaSuggestMenu(props) {
  return React.cloneElement(<ReactMLSuggestMenu {...props} />, {
    suggest: wikipediaSuggest,
  });
}

export default WikipediaSuggestMenu;
