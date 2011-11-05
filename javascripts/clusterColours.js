(function() {
  importScripts('clusterfck-0.1.js');
  self.onmessage = function(e) {
    var clusters;
    clusters = clusterfck.hcluster(e.data, clusterfck.EUCLIDEAN_DISTANCE, clusterfck.AVERAGE_LINKAGE, 10);
    return self.postMessage(clusters);
  };
}).call(this);
