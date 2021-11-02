const readline = require('readline');
const { createWriteStream } = require('fs');
const { resolve: resolvePath } = require('path');
const { EOL } = require('os');

const rl = readline.createInterface(process.stdin, process.stdout);
const filename = 'text.txt';
const writeStream = createWriteStream(resolvePath(__dirname, filename), {
  flags: 'a',
});

rl.setPrompt('> ');

rl.on('line', (line) => {
  if (line === 'exit') {
    return rl.close();
  }
  writeStream.write(`${line}${EOL}`);
  rl.prompt();
});

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});

console.log('Welcome! Enter the text:');
rl.prompt();
