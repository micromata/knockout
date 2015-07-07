
function loadTemplates() {
  var uri = "./build/templates.html"
  return Promise.resolve($.ajax(uri))
    .then(function (html) {
      if (typeof html !== "string") {
        console.error("Unable to get templates:", html)
      } else {
        // ES5-<template> shim/polyfill:
        // unless 'content' of document.createElement('template')
        //   # see pv_shim_template_tag re. broken-template tags
        //   html = html.replace(/<\/template>/g, '</script>')
        //     .replace(/<template/g, '<script type="text/x-template"')
        $("<div id='_templates'>")
          .append(html)
          .appendTo(document.body)
      }
    })
}

function onApplicationUpdate() {
  location.reload()
}

function checkForApplicationUpdate() {
  var ac = applicationCache
  if (ac) {
    switch (ac.status) {
      case ac.UPDATEREADY:
        onApplicationUpdate()
        break
      case ac.CHECKING:
      case ac.OBSOLETE:
      case ac.DOWNLOADING:
        return new Promise(function () {
          // This never resolves; it reloads the page when the
          // update is complete.
          window.$root.body("updating-appcache")
          window.applicationCache.addEventListener('updateready', onApplicationUpdate)
        })
    }
  }
  return Promise.resolve()
}


function applyBindings() {
  ko.punches.enableAll()
  window.$root = new Page()
  ko.applyBindings(window.$root)
}

function pageLoaded() {
  window.$root.body("intro")
}


function start() {
  loadTemplates()
    .then(applyBindings)
    .then(setupEvents)
    .then(checkForApplicationUpdate)
    .then(pageLoaded)
}


$(start)

// Enable livereload in development
if (window.location.hostname === 'localhost') {
  $.getScript("http://localhost:35729/livereload.js")
}
