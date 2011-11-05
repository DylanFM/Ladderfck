$ ->
  # Make a canvas
  c = $ '<canvas width="500" height="333"></canvas>'
  # Add it to the DOM
  $('body').append c
  ctx = c.get(0).getContext '2d'

  sanitise = (data) ->
    clean = {}
    clean[i+1] = pix for pix, i in data
    clean

  newImage = (url) ->
    i = new Image()
    i.onload = -> 
      ctx.drawImage i, 0, 0
      d = ctx.getImageData(0, 0, 500, 333)
      # Send the data to the worker to convert to colours
      worker = new Worker 'javascripts/dataToColours.js'
      worker.onmessage = (e) ->
        colours = e.data
        worker.terminate()
      worker.postMessage sanitise(d.data)
    i.src = url

  # Get the image
  img = $ 'img'
  newImage img.attr('src')

  # Feed it into clusterfck
  # Show the results
