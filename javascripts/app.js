(function() {
  $(function() {
    var c, ctx, img, newImage, sanitise;
    c = $('<canvas width="500" height="333"></canvas>');
    $('body').append(c);
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
        d = ctx.getImageData(0, 0, 500, 333);
        worker = new Worker('javascripts/dataToColours.js');
        worker.onmessage = function(e) {
          var colours;
          colours = e.data;
          return worker.terminate();
        };
        return worker.postMessage(sanitise(d.data));
      };
      return i.src = url;
    };
    img = $('img');
    return newImage(img.attr('src'));
  });
}).call(this);
