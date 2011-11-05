(function() {
  $(function() {
    var c, clustersToColours, ctx, dimensions, doc, getSample, getSettings, img, isLoading, newImage, results, sanitise, settings, showColours;
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
    getSettings = function() {
      return [$('#threshold').val(), $('#metric').val(), $('#linkage').val()];
    };
    isLoading = function(msg) {
      return $('div').empty().text(msg).prepend('<img src="images/loading.gif" width="16" height="16"/>');
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
    clustersToColours = function(clusters) {
      return clusters.map(function(cl) {
        return cl.canonical;
      });
    };
    showColours = function(colours) {
      var sq;
      results.empty();
      sq = $('<span/>');
      colours.forEach(function(rgb) {
        var b, g, r;
        r = rgb[0], g = rgb[1], b = rgb[2];
        return results.append(sq.clone().css('background-color', "rgb(" + r + "," + g + "," + b + ")"));
      });
      return results.prepend("<p>" + colours.length + " colour" + (colours.length === 1 ? '' : 's') + " returned</p>");
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
      worker.postMessage(sanitise(d.data));
      return isLoading('Converting the image data to RGB colours');
    });
    doc.on('newColours.LF', function(e, colours) {
      var linkage, metric, threshold, worker, _ref;
      window.colourCache = colours;
      worker = new Worker('javascripts/clusterColours.js');
      worker.onmessage = function(e) {
        doc.trigger('newClusters.LF', [e.data]);
        return worker.terminate();
      };
      _ref = getSettings(), threshold = _ref[0], metric = _ref[1], linkage = _ref[2];
      worker.postMessage({
        colours: colours,
        threshold: threshold,
        metric: metric,
        linkage: linkage
      });
      return isLoading('Clustering the colours');
    });
    doc.on('newClusters.LF', function(e, clusters) {
      var colours;
      isLoading('Showing the clustered colours');
      colours = clustersToColours(clusters);
      return showColours(colours);
    });
    results = $('div');
    c = $('canvas');
    ctx = c.get(0).getContext('2d');
    img = $('img');
    newImage(img.attr('src'));
    isLoading("Getting the image sample's data");
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
