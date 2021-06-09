'use strict';

const cp = require('child_process');

process.on('message', (message) => {
  if (message.task === 'do')
    cp.execFile('node', ['./main.js'], (error, stdout) => {
      if (error) throw error;
      process.send({ result: 'ok', data: stdout });
    });
});
