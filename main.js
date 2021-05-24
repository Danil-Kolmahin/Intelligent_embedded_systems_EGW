const { Task } = require('./SchedulingCore');
const { FIFO, RM, EDF } = require('./SchedulingAlgorithms');

const transformMatrixToTasks = (matrix) =>
  matrix.map((arr) => new Task(...arr));

const tasks = [
  [7, 4, 7],
  [5, 2, 5],
];

const myFIFO = new FIFO(transformMatrixToTasks(tasks));
const myRM = new RM(transformMatrixToTasks(tasks));
const myEDF = new EDF(transformMatrixToTasks(tasks));

for (let i = 0; i < 100; i++) {
  myFIFO.iterate();
  myRM.iterate();
  myEDF.iterate();
}

console.log('FIFO:');
console.log(myFIFO.toString());
console.log('\nRM:');
console.log(myRM.toString());
console.log('\nEDF:');
console.log(myEDF.toString());
