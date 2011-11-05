(function() {
  $(function() {
    var c, clustersToColours, ctx, getSettings, img, newImage, results, sanitise, showColours;
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
        d = ctx.getImageData(40, 50, 10, 80);
        worker = new Worker('javascripts/dataToColours.js');
        worker.onmessage = function(e) {
          $(document).trigger('newColours.LF', [e.data]);
          return worker.terminate();
        };
        return worker.postMessage(sanitise(d.data));
      };
      return i.src = url;
    };
    getSettings = function() {
      return [$('#threshold').val(), $('#metric').val(), $('#linkage').val()];
    };
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
      var linkage, metric, threshold, worker, _ref;
      window.colourCache = colours;
      worker = new Worker('javascripts/clusterColours.js');
      worker.onmessage = function(e) {
        return $(document).trigger('newClusters.LF', [e.data]);
      };
      _ref = getSettings(), threshold = _ref[0], metric = _ref[1], linkage = _ref[2];
      return worker.postMessage({
        colours: colours,
        threshold: threshold,
        metric: metric,
        linkage: linkage
      });
    });
    $(document).on('newClusters.LF', function(e, clusters) {
      var colours;
      console.log(clusters);
      colours = clustersToColours(clusters);
      return showColours(colours);
    });
    $('input,select').on('change', function(e) {
      e.preventDefault();
      return $(document).trigger('newColours.LF', [colourCache]);
    });
    results = $('div');
    c = $('<canvas width="500" height="333"/>');
    c.insertBefore(results);
    ctx = c.get(0).getContext('2d');
    img = $('img');
    return newImage(img.attr('src'));
  });
}).call(this);
