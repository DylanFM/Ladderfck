importScripts 'clusterfck-0.1.js'

self.onmessage = (e) ->
  clusters = clusterfck.hcluster e.data, clusterfck.EUCLIDEAN_DISTANCE, clusterfck.AVERAGE_LINKAGE, 10
  self.postMessage clusters
