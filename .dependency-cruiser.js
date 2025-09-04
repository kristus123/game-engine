module.exports = {
  options: {
    doNotFollow: {
      path: "node_modules"
    },
    tsConfig: { fileName: "jsconfig.json" },
    combinedDependencies: true,
    includeOnly: '^dist',
    outputToGraphViz: {
      rankdir: "LR",          // left-to-right layout
      concentrate: false,     // do not merge edges
      edge: { arrowhead: "vee", color: "#0074D9" },
      node: { shape: "box", style: "filled", fillcolor: "#DDDDDD" }
    }
  },
  forbidden: []
};

