/* eslint-disable  react/jsx-key */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactML from 'react-ml';
import ReactMLSplitEditor from '../ReactMLSplitEditor';

import WikipediaSuggestMenu from './WikipediaSuggestMenu';
import ReactMLWikipedia from './ReactMLWikipedia';

const components = Object.assign({}, ReactML.presets.basic, {
  'Wikipedia': (attribs, children) =>
    <ReactMLWikipedia>{children.map(({ type, data }) => {
      if(type === 'text') {
        return data;
      }
      return '';
    }).join('')}</ReactMLWikipedia>
  ,
});

ReactDOM.render(<ReactMLSplitEditor
  SuggestMenu={WikipediaSuggestMenu}
  components={components}
/>, document.getElementById('app'));
