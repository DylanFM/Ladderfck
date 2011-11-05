importScripts 'clusterfck-0.1.js'

self.onmessage = (e) ->
  colours = e.data.colours
  threshold = e.data.threshold
  metric = switch e.data.metric
            when 'euc' then clusterfck.EUCLIDEAN_DISTANCE
            when 'man' then clusterfck.MANHATTAN_DISTANCE
            when 'max' then clusterfck.MAX_DISTANCE
            else clusterfck.MAX_DISTANCE
  linkage = switch e.data.linkage
              when 'avg' then clusterfck.AVERAGE_LINKAGE
              when 'sgl' then clusterfck.SINGLE_LINKAGE
              when 'com' then clusterfck.COMPLETE_LINKAGE

  clusters = clusterfck.hcluster colours, metric, linkage, threshold 
  self.postMessage clusters
