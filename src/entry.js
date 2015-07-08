/* global setupEvents, Example, Documentation */

function loadHtml(uri) {
  return Promise.resolve($.ajax(uri))
    .then(function (html) {
      if (typeof html !== "string") {
        console.error(`Unable to get ${uri}:`, html)
      } else {
        // ES5-<template> shim/polyfill:
        // unless 'content' of document.createElement('template')
        //   # see pv_shim_template_tag re. broken-template tags
        //   html = html.replace(/<\/template>/g, '</script>')
        //     .replace(/<template/g, '<script type="text/x-template"')
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
  window.$root.open(location.hash || "#intro")
}


function start() {
  Promise.all([loadTemplates(), loadMarkdown()])
    .then(() => Documentation.initialize())
    .then(applyBindings)
    .then(getExamples)
    .then(getPlugins)
    .then(setupEvents)
    .then(checkForApplicationUpdate)
    .then(pageLoaded)
    .catch((err) => console.log("Loading:", err))
}


$(start)

// Enable livereload in development
if (window.location.hostname === 'localhost') {
  $.getScript("http://localhost:35729/livereload.js")
}
