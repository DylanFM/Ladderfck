$ ->
  doc = $ document

  sanitise = (data) ->
    clean = {}
    clean[i+1] = pix for pix, i in data
    clean

  getSample = ->
    [
      $('#x').val()
      $('#y').val()
      $('#width').val()
      $('#height').val()
    ]

  getSettings = ->
    [
      $('#threshold').val()
      $('#metric').val()
      $('#linkage').val()
    ]

  isLoading = (msg) ->
    $('div').empty().text(msg).prepend '<img src="images/loading.gif" width="16" height="16"/>'

  newImage = (url) ->
    ctx.clearRect 0, 0, 500, 333
    i = new Image()
    i.onload = -> 
      ctx.drawImage @, 0, 0
      doc.trigger 'newImage.LF', [@]
    i.src = url

  clustersToColours = (clusters) ->
    clusters.map (cl) -> cl.canonical

  showColours = (colours) ->
    results.empty()
    sq = $ '<span/>'
    colours.forEach (rgb) ->
      [r,g,b] = rgb
      results.append sq.clone().css('background-color', "rgb(#{r},#{g},#{b})")
    results.prepend "<p>#{colours.length} colour#{if colours.length is 1 then '' else 's'} returned</p>"

  # On image load
  doc.on 'newImage.LF', (e, i) ->
    [x, y, width, height] = getSample() 
    d = ctx.getImageData(x, y, width, height)
    # Show sample area
    ctx.strokeRect x, y, width, height
    # Send the data to the worker to convert to colours
    worker = new Worker 'javascripts/dataToColours.js'
    worker.onmessage = (e) ->
      doc.trigger 'newColours.LF', [e.data]
      worker.terminate()
    worker.postMessage sanitise(d.data)
    isLoading 'Converting the image data to RGB colours'

  # On new colours
  doc.on 'newColours.LF', (e, colours) ->
    # Eww, I know, but I'm doing this for the time being
    window.colourCache = colours
    # Feed it into clusterfck
    worker = new Worker 'javascripts/clusterColours.js'
    worker.onmessage = (e) ->
      doc.trigger 'newClusters.LF', [e.data]
      worker.terminate()
    [threshold, metric, linkage] = getSettings()
    worker.postMessage
      colours: colours
      threshold: threshold
      metric: metric
      linkage: linkage
    isLoading 'Clustering the colours'

  # On new clusters
  doc.on 'newClusters.LF', (e, clusters) ->
    isLoading 'Showing the clustered colours'
    # Clusters to colours
    colours = clustersToColours clusters
    # Show the colours
    showColours colours



  # Getting things done...

  results = $ 'div'

  c = $ 'canvas'
  ctx = c.get(0).getContext '2d'
  
  img = $ 'img'
  newImage img.attr('src')

  isLoading "Getting the image sample's data"

  dimensions = $ '#sample'
  settings = $ '#settings'

  dimensions.on 'change', 'input', -> newImage img.attr('src')
  settings.on 'change', 'input,select', -> doc.trigger 'newColours.LF', [colourCache]
