import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock Performance API
if (!window.performance) {
  Object.defineProperty(window, "performance", {
    value: {},
    writable: true,
  });
}

const perf = window.performance as any;

if (!perf.clearMarks) {
  perf.clearMarks = () => {};
}

if (!perf.mark) {
  perf.mark = (markName: string) => ({
    name: markName,
    entryType: "mark",
    startTime: Date.now(),
    duration: 0,
    toJSON: () => ({}),
  });
}

if (!perf.measure) {
  perf.measure = (measureName: string) => ({
    name: measureName,
    entryType: "measure",
    startTime: Date.now(),
    duration: 0,
    toJSON: () => ({}),
  });
}

if (!perf.clearMeasures) {
  perf.clearMeasures = () => {};
}
