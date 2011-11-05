$ ->
  sanitise = (data) ->
    clean = {}
    clean[i+1] = pix for pix, i in data
    clean

  newImage = (url) ->
    i = new Image()
    i.onload = -> 
      ctx.drawImage i, 0, 0
      #d = ctx.getImageData(0, 0, 500, 333)
      d = ctx.getImageData(40, 50, 10, 80)
      # Send the data to the worker to convert to colours
      worker = new Worker 'javascripts/dataToColours.js'
      worker.onmessage = (e) ->
        $(document).trigger 'newColours.LF', [e.data]
        worker.terminate()
      worker.postMessage sanitise(d.data)
    i.src = url

  getSettings = ->
    [
      $('#threshold').val()
      $('#metric').val()
      $('#linkage').val()
    ]

  clustersToColours = (clusters) ->
    clusters.map (cl) -> cl.canonical

  showColours = (colours) ->
    results.empty()
    sq = $ '<span/>'
    colours.forEach (rgb) ->
      [r,g,b] = rgb
      results.append sq.clone().css('background-color', "rgb(#{r},#{g},#{b})")

  # On new colours
  $(document).on 'newColours.LF', (e, colours) ->
    # Eww but I'm doing this for the time being
    window.colourCache = colours
    # Feed it into clusterfck
    worker = new Worker 'javascripts/clusterColours.js'
    worker.onmessage = (e) ->
      $(document).trigger 'newClusters.LF', [e.data]
    [threshold, metric, linkage] = getSettings()
    worker.postMessage
      colours: colours
      threshold: threshold
      metric: metric
      linkage: linkage

  # On new clusters
  $(document).on 'newClusters.LF', (e, clusters) ->
    console.log clusters
    # Clusters to colours
    colours = clustersToColours clusters
    # Show the colours
    showColours colours

  $('form').on 'submit', (e) ->
    e.preventDefault()
    # Start workin
    $(document).trigger 'newColours.LF', [colourCache]



  # Getting things done...


  results = $ 'div'

  # Make a canvas
  c = $ '<canvas width="500" height="333"/>'
  # Add it to the DOM
  c.insertBefore results
  ctx = c.get(0).getContext '2d'
  
  # Get the image
  img = $ 'img'
  newImage img.attr('src')
