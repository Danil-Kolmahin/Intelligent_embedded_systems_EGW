const getTimeCalc = (tick = () => 0, { startN, stepN, finishN }) => {
  const O = [];
  for (let N = startN; N <= finishN; N += stepN) {
    let time = tick(N);
    O.push(time);
  }
  return O;
};

const correlation = () => {
  const A = 0.690507;
  const fi = 0.730429;
  const maxW = 3000;
  const n = 3;
  const W = [];
  for (let i = 1; i <= n; i++) W.push((maxW / n) * i);
  const N = 32;
  const arrayW = [];
  for (let t = 0; t < N; t++)
    arrayW.push(W.map((w) => A * Math.sin(w * t + fi)));
  const xT = [];
  for (let t = 0; t < N; t++)
    xT.push(arrayW[t].reduce((acc, cur) => acc + cur));
  const yT = [];
  for (let t = 0; t < N; t++)
    yT.push(arrayW[t].reduce((acc, cur) => acc + cur));
  const MX = xT.reduce((acc, cur) => acc + cur) / N;
  const MY = yT.reduce((acc, cur) => acc + cur) / N;
  (() => {
    const tick = (NN) => {
      const start = new Date();
      for (let t = 0; t < NN; t++)
        xT.map((_, Tau) =>
          xT.map((_, t) => (xT[t] - MX) * (yT[(t + Tau) % N] - MY))
        );
      const end = new Date();
      return end.getTime() - start.getTime();
    };
    return getTimeCalc(tick, {
      startN: 100,
      stepN: 100,
      finishN: 1000,
    });
  })();
};

const discreteFourierTransformation = (arrayX) => {
  if (arrayX.length % 2 !== 0) arrayX.pop();
  const N = arrayX.length;
  const result = [];

  arrayX.forEach((_, p) => {
    let realF = 0,
      imageF = 0;
    for (let k = 0; k < N; k++) {
      const arg = (-2 * Math.PI * ((p * k) % N)) / N;
      realF += arrayX[k] * Math.cos(arg);
      imageF += arrayX[k] * Math.sin(arg);
    }
    result[p] = Math.sqrt(realF ** 2 + imageF ** 2);
  });

  return result;
};

const perceptronModel = ({
  P = 1,
  func = (dot, wArray) => dot.reduce((res, x, i) => res + x * wArray[i], 0),
  dots = [[0, 0]],
  learningSpeed = 0.1,
  iterationsNumber = 100,
} = {}) => {
  const getDelta = (i) => P - func(dots[i], wArray);
  let wArray = new Array(dots[0].length).fill(0, 0, dots[0].length);
  for (let iteration = 0; iteration < iterationsNumber; iteration++) {
    // check if satisfied
    if (getDelta(0) < 0 && getDelta(1) > 0) {
      return {
        P,
        dots,
        learningSpeed,
        w1: P - getDelta(0),
        w2: P - getDelta(1),
        iteration,
      };
    }
    // getting deltas
    let delta = getDelta(iteration % dots.length);
    wArray = wArray.map(
      (w, i) => w + delta * dots[iteration % dots.length][i] * learningSpeed
    );
  }
  return 'iteration >= iterationsNumber';
};

const defaultArray = [
  295, 240, 147, 151, 164, 179, 201, 198, 210, 238, 348, 301, 245, 266, 299,
  288, 307, 305, 313, 322, 332, 348, 369, 433, 473, 478, 719, 898, 462, 821,
  612, 636, 699, 858, 605, 544, 545, 526, 554, 634, 650, 582, 582, 629, 599,
  616, 622, 632, 673, 674, 733, 758, 761, 697, 776, 715, 778, 743, 847, 776,
  799, 957, 808, 862, 832, 828, 914, 888, 946, 874, 883, 902, 1049, 974, 1017,
  943, 964, 969, 1057, 1088, 992, 1008, 1016, 1022, 1078, 1048, 1059, 1144,
  1157, 1092, 1101,
];

module.exports = {
  correlation,
  discreteFourierTransformation: () =>
    discreteFourierTransformation(defaultArray),
  perceptronModel: () =>
    perceptronModel({
      P: 5,
      dots: [
        [1, 8],
        [4, 1],
      ],
      learningSpeed: 0.01,
      iterationsNumber: 1000,
    }),
};
