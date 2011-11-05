(function() {
  importScripts('clusterfck-0.1.js');
  self.onmessage = function(e) {
    var clusters, colours, linkage, metric, threshold;
    colours = e.data.colours;
    threshold = e.data.threshold;
    metric = (function() {
      switch (e.data.metric) {
        case 'euc':
          return clusterfck.EUCLIDEAN_DISTANCE;
        case 'man':
          return clusterfck.MANHATTAN_DISTANCE;
        case 'max':
          return clusterfck.MAX_DISTANCE;
        default:
          return clusterfck.MAX_DISTANCE;
      }
    })();
    linkage = (function() {
      switch (e.data.linkage) {
        case 'avg':
          return clusterfck.AVERAGE_LINKAGE;
        case 'sgl':
          return clusterfck.SINGLE_LINKAGE;
        case 'com':
          return clusterfck.COMPLETE_LINKAGE;
      }
    })();
    clusters = clusterfck.hcluster(colours, metric, linkage, threshold);
    return self.postMessage(clusters);
  };
}).call(this);
