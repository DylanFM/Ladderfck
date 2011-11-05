(function() {
  self.onmessage = function(e) {
    var colours, i, pix, _ref;
    colours = [[]];
    _ref = e.data;
    for (i in _ref) {
      pix = _ref[i];
      if ((+i) % 4 === 0) {
        colours.push([]);
      } else {
        colours[colours.length - 1].push(pix);
      }
    }
    return self.postMessage(colours);
  };
}).call(this);
