(function() {
  $(function() {
    var c, clustersToColours, ctx, img, newImage, results, sanitise, showColours;
    results = $('div');
    c = $('<canvas width="500" height="333"/>');
    c.insertBefore(results);
    ctx = c.get(0).getContext('2d');
    sanitise = function(data) {
      var clean, i, pix, _len;
      clean = {};
      for (i = 0, _len = data.length; i < _len; i++) {
        pix = data[i];
        clean[i + 1] = pix;
      }
      return clean;
    };
    newImage = function(url) {
      var i;
      i = new Image();
      i.onload = function() {
        var d, worker;
        ctx.drawImage(i, 0, 0);
        d = ctx.getImageData(100, 100, 30, 30);
        worker = new Worker('javascripts/dataToColours.js');
        worker.onmessage = function(e) {
          $(document).trigger('newColours.LF', [e.data]);
          return worker.terminate();
        };
        return worker.postMessage(sanitise(d.data));
      };
      return i.src = url;
    };
    img = $('img');
    newImage(img.attr('src'));
    clustersToColours = function(clusters) {
      return clusters.map(function(cl) {
        return cl.canonical;
      });
    };
    showColours = function(colours) {
      var sq;
      results.empty();
      sq = $('<span/>');
      return colours.forEach(function(rgb) {
        var b, g, r;
        r = rgb[0], g = rgb[1], b = rgb[2];
        return results.append(sq.clone().css('background-color', "rgb(" + r + "," + g + "," + b + ")"));
      });
    };
    $(document).on('newColours.LF', function(e, colours) {
      var worker;
      worker = new Worker('javascripts/clusterColours.js');
      worker.onmessage = function(e) {
        return $(document).trigger('newClusters.LF', [e.data]);
      };
      return worker.postMessage(colours);
    });
    return $(document).on('newClusters.LF', function(e, clusters) {
      var colours;
      colours = clustersToColours(clusters);
      return showColours(colours);
    });
  });
}).call(this);
