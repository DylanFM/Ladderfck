self.onmessage = (e) ->
  colours = []

  for i, pix of e.data
    colours.push([]) if ((+i)%4) is 1
    colours[colours.length-1].push pix

  self.postMessage colours
