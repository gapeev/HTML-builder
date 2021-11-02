const { createReadStream } = require('fs');
const { resolve: resolvePath } = require('path');

const filename = 'text.txt';
createReadStream(resolvePath(__dirname, filename), 'utf8').pipe(process.stdout);
