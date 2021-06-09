'use strict';

const os = require('os');
const cp = require('child_process');

const cpuCount = os.cpus().length;

const workers = [];
for (let i = 0; i < cpuCount; i++) workers.push(cp.fork('./child.js'));

workers.forEach((worker) => {
  worker.send({ task: 'do' });
  worker.on('message', (message) => console.log(message.data));
});

setTimeout(() => process.exit(1), 5000);
