var path = require('path');
module.exports = {
	'babel-runtime': path.dirname(require.resolve('babel-runtime/package.json')),
	'lang': path.resolve(__dirname, '..', 'src/lang'),

};
