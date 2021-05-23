'use strict';

class Task {
  constructor(tStart, tCalc, tDeadline) {
    Object.assign(this, { tStart, tCalc, tDeadline });
  }

  toString = () => JSON.stringify(this);
}

class SchedulingAlgorithm {
  constructor(tasksArr) {
    this.tasksArr = tasksArr;
  }

  workTime = 0;
  queue = [];
  inWork;

  increment = () => {
    this.workTime++;
    const { workTime, tasksArr } = this;
    tasksArr.forEach((task) => {
      if (workTime % task.tStart === 0) {
        const newTask = task;
        newTask.wasStart = workTime;
        newTask.rest = task.tCalc;
        this.queue.push(newTask);
      }
    });
    this.queue = this.queue.filter((task) => {
      if (workTime + task.rest > task.wasStart + task.tDeadline) {
        const start = '\x1b[31m';
        const end = '\x1b[0m';
        console.log(
          `${start}Task ${task.toString()} deadline was overdue. (queue)${end}`
        );
        return false;
      }
      return true;
    });
  };

  distribute = () => {};

  iterate = () => {
    const { increment, distribute } = this;
    distribute();
    increment();
  };
}

class FIFO extends SchedulingAlgorithm {
  distribute = () => {
    if (this.inWork && this.inWork.rest === 0) this.inWork = null;
    if (!this.inWork && this.queue.length !== 0)
      this.inWork = this.queue.shift();
    if (this.inWork) this.inWork.rest--;
  };
}

const task1 = new Task(5, 3, 5);
const task2 = new Task(5, 1, 5);

const myFIFO = new FIFO([task1, task2]);

for (let i = 0; i < 20; i++) {
  myFIFO.iterate();
  console.log(
    myFIFO.queue.map((task) => task.toString()),
    myFIFO.inWork ? myFIFO.inWork.toString() : 'null'
  );
}
