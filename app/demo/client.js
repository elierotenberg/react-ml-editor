/* eslint-disable  react/jsx-key */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactML from 'react-ml';
import ReactMLSplitEditor from '../ReactMLSplitEditor';

import suggest from './suggest';
import ReactMLWikipedia from './ReactMLWikipedia';

ReactDOM.render(<ReactMLSplitEditor components={Object.assign({}, ReactML.presets.basic, {
  'Wikipedia': (attribs, children) =>
    <ReactMLWikipedia>{children.map(({ type, data }) => {
      if(type === 'text') {
        return data;
      }
      return '';
    }).join('')}</ReactMLWikipedia>
  ,
})} suggest={suggest} />, document.getElementById('app'));
