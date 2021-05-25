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
];

const myFIFO = new FIFO(transformMatrixToTasks(tasks));
const myRM = new RM(transformMatrixToTasks(tasks));
const myEDF = new EDF(transformMatrixToTasks(tasks));

const erlArr = tasks.map(() => erlang(0));
for (let i = 0; i < 100; i++) {
  const ifArr = erlArr.map((erl, j) => {
    if (erl < i) {
      erlArr[j] = erlang(i);
      return j;
    }
    return null;
  });
  const index = ifArr.findIndex((val) => val !== null);
  myFIFO.iterate().addTask(index !== -1 ? index : Infinity, works[index]);
  myRM.iterate().addTask(index !== -1 ? index : Infinity, works[index]);
  myEDF.iterate().addTask(index !== -1 ? index : Infinity, works[index]);
}

console.log('FIFO:');
console.log(myFIFO.toString());
console.log('\nRM:');
console.log(myRM.toString());
console.log('\nEDF:');
console.log(myEDF.toString());
