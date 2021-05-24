const { SchedulingAlgorithm } = require('./SchedulingCore');

class FIFO extends SchedulingAlgorithm {
  distribute = () => {
    const { queue } = this;
    if (queue.length !== 0) return 0;
    return null;
  };
}

class RM extends SchedulingAlgorithm {
  distribute = () => {
    const { queue } = this;
    if (queue.length !== 0) {
      const sortedQueue = queue.sort((a, b) => a.tStart - b.tStart);
      return queue.findIndex((task) => task === sortedQueue[0]);
    }
    return null;
  };
}

class EDF extends SchedulingAlgorithm {
  distribute = () => {
    const { queue, workTime } = this;
    if (queue.length !== 0) {
      const sortedQueue = queue.sort((a, b) => {
        const dif = (n) => n.wasStart + n.tDeadline - workTime - n.rest;
        return dif(a) - dif(b);
      });
      return queue.findIndex((task) => task === sortedQueue[0]);
    }
    return null;
  };
}

module.exports = { FIFO, RM, EDF };
