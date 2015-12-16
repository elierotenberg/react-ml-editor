import Promise from 'bluebird';
import request from 'superagent';
import jsonp from 'superagent-jsonp';

const WIKIPEDIA_API_BASE_URL = 'https://en.wikipedia.org/w/api.php';

function escape(unsafe) {
  return unsafe
   .replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#039;')
  ;
}

Promise.config({
  cancellation: true,
});

function suggest(subject) {
  return new Promise((resolve, reject) => {
    const params = {
      action: 'query',
      format: 'json',
      list: 'search',
      srsearch: subject,
    };
    const req = request.get(WIKIPEDIA_API_BASE_URL);
    req.use(jsonp);
    req.query(params);
    req.set('Api-User-Agent', 'ReactMLEditor-Demo/0.1');
    req.accept('json');
    req.end((err, res) => {
      if(err) {
        return reject(err);
      }
      const { body } = res;
      const { query } = body;
      const { search } = query;
      return resolve(search.map(({ title }) => ({
        suggestion: `<Wikipedia>${escape(title)}</Wikipedia>`,
        label: title,
      })));
    });
  });
}

export default suggest;
