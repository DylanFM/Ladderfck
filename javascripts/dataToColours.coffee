self.onmessage = (e) ->
  colours = [[]]

  for i, pix of e.data
    if (+i)%4 is 0
      colours.push([]) 
    else
      colours[colours.length-1].push pix

  self.postMessage colours
