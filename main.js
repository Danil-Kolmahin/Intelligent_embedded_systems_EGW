const { Task } = require('./SchedulingCore');
const { FIFO, RM, EDF } = require('./SchedulingAlgorithms');
const {
  correlation,
  discreteFourierTransformation,
  perceptronModel,
} = require('./calculatios');

const k = 2; // 10
const works = [correlation, discreteFourierTransformation, perceptronModel];

const transformMatrixToTasks = (matrix) =>
  matrix.map((arr) => new Task(...arr));

const m1 = 4;
const m2 = 2;

const erlang = (x, a = 0.1, b = 1) =>
  (Math.round((Math.random() - 0.5) * x) / k) * b + x;
const tasks = [
  [null, m1, m1 * k],
  [null, m2, m2 * k],
  [null, m2, m2 * k],
];
// const tasks = [
//   [7, 4, 7],
//   [5, 2, 5],
// ];

const myFIFO = new FIFO(transformMatrixToTasks(tasks));
const myRM = new RM(transformMatrixToTasks(tasks));
const myEDF = new EDF(transformMatrixToTasks(tasks));

let que = [];
for (let i = 0; i < 100; i++) {
  myFIFO.iterate().addTask(i % 3, works[i % 3]);
  myRM.iterate().addTask(i % 3, works[i % 3]);
  myEDF.iterate().addTask(i % 3, works[i % 3]);
  que.push(myEDF.queue.length);
}

const arrAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
console.log('The average size of the incoming queue: ' + arrAvg(que)); // 2.62
console.log(
  'The average waiting time in the queue: ' +
    arrAvg(
      myEDF.getSomeArr().map((arr) => (!isNaN(arrAvg(arr)) ? arrAvg(arr) : 0))
    )
);
console.log(
  'The number of overdue applications and its restoration to the total ' +
    'number of applications: ' +
    (myEDF.counter1 - myEDF.counter2) +
    ' / ' +
    myEDF.counter1
);

console.log('FIFO:');
console.log(myFIFO.toString());
console.log('\nRM:');
console.log(myRM.toString());
console.log('\nEDF:');
console.log(myEDF.toString());

// some test changes
