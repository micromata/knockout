/* global setupEvents, Example, Documentation, API */
var appCacheUpdateCheckInterval = location.hostname === 'localhost' ? 2500 : (1000 * 60 * 15)

var nativeTemplating = 'content' in document.createElement('template')


function loadHtml(uri) {
  return Promise.resolve($.ajax(uri))
    .then(function (html) {
      if (typeof html !== "string") {
        console.error(`Unable to get ${uri}:`, html)
      } else {
        if (!nativeTemplating) {
          // Polyfill the <template> tag from the templates we load.
          // For a more involved polyfill, see e.g.
          //   http://jsfiddle.net/brianblakely/h3EmY/
          html = html.replace(/<\/?template/g, function(match) {
              if (match === "<template") {
                return "<script type='text/x-template'"
              } else {
                return "</script"
              }
            })
        }

        $(`<div id='templates--${uri}'>`)
          .append(html)
          .appendTo(document.body)
      }
    })
}

function loadTemplates() {
  return loadHtml('build/templates.html')
}

function loadMarkdown() {
  return loadHtml("build/markdown.html")
}


function reCheckApplicationCache() {
  var ac = window.applicationCache
  if (ac.status === ac.IDLE) { ac.update() }
  setTimeout(reCheckApplicationCache, appCacheUpdateCheckInterval)
}

function checkForApplicationUpdate() {
  var ac = window.applicationCache
  if (!ac) { return Promise.resolve() }
  ac.addEventListener('progress', function(evt) {
    if (evt.lengthComputable) {
      window.$root.reloadProgress(evt.loaded / evt.total)
    } else {
      window.$root.reloadProgress(false)
    }
  }, false)
  ac.addEventListener('updateready', function () {
    window.$root.cacheIsUpdated(true)
  })
  if (ac.status === ac.UPDATEREADY) {
    // Reload the page if we are still initializing and an update is ready.
    location.reload()
  }
  reCheckApplicationCache()
  return Promise.resolve()
}


function getExamples() {
  return Promise.resolve($.ajax({
    url: 'build/examples.json',
    dataType: 'json'
  })).then((results) =>
    Object.keys(results).forEach(function (name) {
      var setting = results[name]
      Example.set(setting.id || name, setting)
    })
  )
}

function getBooks() {
  return Promise.resolve($.ajax({
    url: 'build/books.json',
    dataType: 'json'
  }))
  .then((results) => $root.registerBooks(results))
}


function loadAPI() {
  return Promise.resolve($.ajax({
    url: 'build/api.json',
    dataType: 'json'
  })).then((results) =>
    results.api.forEach(function (apiFileList) {
      // We essentially have to flatten the api (FIXME)
      apiFileList.forEach(API.add)
    })
  )
}


function getPlugins() {
  return Promise.resolve($.ajax({
    url: 'build/plugins.json',
    dataType: 'json'
  })).then((results) => $root.registerPlugins(results))
}


function applyBindings() {
  ko.punches.enableAll()
  window.$root = new Page()
  ko.punches.enableAll()
  ko.applyBindings(window.$root)
}


function pageLoaded() {
  if (location.pathname.indexOf('.html') === -1) {
    window.$root.open("intro")
  }
}


function start() {
  Promise.all([loadTemplates(), loadMarkdown()])
    .then(Documentation.initialize)
    .then(applyBindings)
    .then(getExamples)
    .then(loadAPI)
    .then(getPlugins)
    .then(getBooks)
    .then(setupEvents)
    .then(checkForApplicationUpdate)
    .then(pageLoaded)
    .catch(function (err) {
      window.$root.body("error")
      window.$root.errorMessage(err.message || err)
      console.error(err)
    })
}

$(start)
