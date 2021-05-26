'use strict';

const flags = [
  {
    name: 'changed',
    symbol: `-`,
    rank: 2,
  },
  {
    name: 'completed',
    symbol: `>`,
    rank: 1,
  },
  {
    name: 'overdue',
    symbol: `*`,
    rank: 0,
  },
  {
    name: 'added',
    symbol: `<`,
    rank: 3,
  },
  {
    name: 'default',
    symbol: ` `,
    rank: Infinity,
  },
];

const colorize = (colorId) => (str) =>
  `\x1b[${100 + (colorId % 7)}m\x1b[97m${str}\x1b[0m`;

class Task {
  constructor(tStart, tCalc, tDeadline, that = null) {
    Object.assign(this, { tStart, tCalc, tDeadline, that });
  }

  getInstance = (index, wasStart) => {
    const { tStart, tCalc, tDeadline } = this;
    const newTask = new Task(tStart, tCalc, tDeadline, this);
    newTask.counter = index;
    newTask.rest = tCalc;
    newTask.wasStart = wasStart;
    return newTask;
  };

  getProto = () => this.that;

  toString = () => JSON.stringify(this);
}

class SchedulingAlgorithm {
  workTime = 0;
  queue = [];
  history = [];
  counter = 0;
  isLogging = false;

  someArr = new Array(1000).fill(null).map(() => []); //
  counter1 = 0; //
  counter2 = 0; //

  getSomeArr = () => this.someArr; //

  constructor(tasksArr) {
    this.tasksArr = tasksArr;
  }

  check = (changedIndex) => {
    const { workTime, tasksArr, isLogging } = this;
    if (changedIndex !== null) {
      this.queue[changedIndex].rest--;
      this.history.push({
        when: workTime,
        task: this.queue[changedIndex].getProto(),
        flag: 'changed',
      });
    }
    this.queue = this.queue.filter((task) => {
      if (task.rest < 1) {
        this.someArr[workTime].push(workTime - task.wasStart); //
        this.counter2++; //
        this.history.push({
          when: workTime,
          task: task.getProto(),
          flag: 'completed',
        });
        isLogging &&
          console.log(
            `\x1b[34m WorkTime: ${workTime}. Task ${task.toString()} completed.\x1b[0m`
          );
        return false;
      }
      if (workTime + task.rest > task.wasStart + task.tDeadline) {
        this.history.push({
          when: workTime,
          task: task.getProto(),
          flag: 'overdue',
        });
        isLogging &&
          console.log(
            `\x1b[31m WorkTime: ${workTime}. Task ${task.toString()} deadline was overdue.\x1b[0m`
          );
        return false;
      }
      return true;
    });
    tasksArr.forEach((task, i, arr) => {
      if (workTime % task.tStart === 0) {
        const newTask = task.getInstance(this.counter, workTime);
        this.history.push({
          when: workTime,
          task: arr[i],
          flag: 'added',
        });
        this.counter++;
        this.queue.push(newTask);
      }
    });
  };

  distribute = () => {};

  iterate = () => {
    const { check, distribute, isLogging } = this;
    check(distribute());
    isLogging && console.log(this.queue.map((task) => task.toString()));
    this.workTime++;
    return this;
  };

  toString = () => {
    const { tasksArr, history, workTime } = this;
    let result = '';
    const historyArray = new Array(tasksArr.length).fill(null).map(() => []);
    history.forEach((event) => {
      const index = tasksArr.findIndex((task) => task === event.task);
      if (index !== -1) {
        const prevValue = historyArray[index][event.when];
        if (prevValue) {
          const prevRank = flags.find((flag) => flag.name === prevValue).rank;
          const curRank = flags.find((flag) => flag.name === event.flag).rank;
          historyArray[index][event.when] =
            prevRank < curRank ? prevValue : event.flag;
        } else historyArray[index][event.when] = event.flag;
      }
    });
    historyArray.forEach((task, taskNumber) => {
      result += 'Task ' + taskNumber + '\n';
      const taskColorized = colorize(taskNumber + 2);
      for (let i = 0; i < task.length; i++) {
        const foundFlag = flags.find((flag) => flag.name === task[i]);
        result += foundFlag ? taskColorized(foundFlag.symbol) : ' ';
      }
      result += '\n';
    });
    result += 'All tasks\n';
    for (let i = 0; i < workTime; i++) {
      let prevFlag = flags.find((flag) => flag.name === 'default');
      let prevSymbol = prevFlag.symbol;
      for (let j = 0; j < tasksArr.length; j++) {
        const newFlag = flags.find((flag) => flag.name === historyArray[j][i]);
        if (newFlag && newFlag.rank < prevFlag.rank) {
          prevFlag = newFlag;
          prevSymbol = colorize(j + 2)(newFlag.symbol);
        }
      }
      result += prevSymbol;
    }
    result += '\n';
    return (
      result +
      '"<" - added task to queue; "-" - used resource; ">" - completed task; "*" - missed deadline.'
    );
  };

  addTask = (taskIndex, work) => {
    const { iterate, tasksArr } = this;
    if (taskIndex < 0 || taskIndex > tasksArr.length - 1) return this;
    const ts = this.tasksArr[taskIndex].tStart;
    this.tasksArr[taskIndex].tStart = 1;
    iterate();
    this.tasksArr[taskIndex].tStart = ts;
    work();
    this.counter1++; //
    return this;
  };
}

module.exports = { SchedulingAlgorithm, Task };
