(function() {
  $(function() {
    var c, clustersToColours, ctx, dimensions, doc, getSample, getSettings, img, newImage, results, sanitise, settings, showColours;
    doc = $(document);
    sanitise = function(data) {
      var clean, i, pix, _len;
      clean = {};
      for (i = 0, _len = data.length; i < _len; i++) {
        pix = data[i];
        clean[i + 1] = pix;
      }
      return clean;
    };
    getSample = function() {
      return [$('#x').val(), $('#y').val(), $('#width').val(), $('#height').val()];
    };
    newImage = function(url) {
      var i;
      ctx.clearRect(0, 0, 500, 333);
      i = new Image();
      i.onload = function() {
        ctx.drawImage(this, 0, 0);
        return doc.trigger('newImage.LF', [this]);
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
    doc.on('newImage.LF', function(e, i) {
      var d, height, width, worker, x, y, _ref;
      _ref = getSample(), x = _ref[0], y = _ref[1], width = _ref[2], height = _ref[3];
      d = ctx.getImageData(x, y, width, height);
      ctx.strokeRect(x, y, width, height);
      worker = new Worker('javascripts/dataToColours.js');
      worker.onmessage = function(e) {
        doc.trigger('newColours.LF', [e.data]);
        return worker.terminate();
      };
      return worker.postMessage(sanitise(d.data));
    });
    doc.on('newColours.LF', function(e, colours) {
      var linkage, metric, threshold, worker, _ref;
      window.colourCache = colours;
      worker = new Worker('javascripts/clusterColours.js');
      worker.onmessage = function(e) {
        return doc.trigger('newClusters.LF', [e.data]);
      };
      _ref = getSettings(), threshold = _ref[0], metric = _ref[1], linkage = _ref[2];
      return worker.postMessage({
        colours: colours,
        threshold: threshold,
        metric: metric,
        linkage: linkage
      });
    });
    doc.on('newClusters.LF', function(e, clusters) {
      var colours;
      colours = clustersToColours(clusters);
      return showColours(colours);
    });
    results = $('div');
    c = $('canvas');
    ctx = c.get(0).getContext('2d');
    img = $('img');
    newImage(img.attr('src'));
    dimensions = $('#sample');
    settings = $('#settings');
    dimensions.on('change', 'input', function() {
      return newImage(img.attr('src'));
    });
    return settings.on('change', 'input,select', function() {
      return doc.trigger('newColours.LF', [colourCache]);
    });
  });
}).call(this);
