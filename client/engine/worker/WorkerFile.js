export const WorkerFile = 'path to this file which is set by transpiler'

function heavyCalculation(input) {
  return input * 2;
}

self.onmessage = (e) => {
  const message = e.data;

  const result = heavyCalculation(message);

  self.postMessage(result);
};

