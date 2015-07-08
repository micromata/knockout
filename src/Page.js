/*global Page, Documentation, marked*/
/*eslint no-unused-vars: 0*/

var markedOptions = {
  highlight: function (code, lang) {
    if (lang) {
      return `<div data-bind='highlight: "${lang.toLowerCase()}"'>${code}</div>`
    }
    return code
  }
}

class Page {
  constructor() {
    // Main body template id
    this.body = ko.observable()

    // footer links/cdn
    this.links = window.links
    this.cdn = window.cdn

    // plugins
    this.pluginRepos = ko.observableArray()
    this.sortedPluginRepos = this.pluginRepos
      .filter(this.pluginFilter.bind(this))
      .sortBy(this.pluginSortBy.bind(this))
    this.pluginMap = new Map()
    this.pluginSort = ko.observable()
    this.pluginsLoaded = ko.observable(false).extend({rateLimit: 15})
    this.pluginNeedle = ko.observable().extend({rateLimit: 200})

    // documentation
    this.documentation = Documentation.links
  }

  open(pinpoint) {
    var pp = pinpoint.replace("#", "")
    var node = document.getElementById(pp)
    var mdNode, mdNodeId
    if (node.getAttribute('data-markdown') !== null) {
      mdNodeId = `${pp}--md`
      mdNode = document.getElementById(mdNodeId)
      if (!mdNode) {
        var htmlStr = marked(node.innerHTML, markedOptions)
        $(`<template id='${mdNodeId}'>${htmlStr}</template>`)
          .appendTo(document.body)
      }
      this.body(mdNodeId)
    } else {
      this.body(pp)
    }
  }

  registerPlugins(plugins) {
    Object.keys(plugins).forEach(function (repo) {
      var about = plugins[repo]
      this.pluginRepos.push(repo)
      this.pluginMap.set(repo, about)
    }, this)
    this.pluginsLoaded(true)
  }

  pluginFilter(repo) {
    var about = this.pluginMap.get(repo)
    var needle = (this.pluginNeedle() || '').toLowerCase()
    if (!needle) { return true }
    if (repo.toLowerCase().indexOf(needle) >= 0) { return true }
    if (!about) { return false }
    return (about.description || '').toLowerCase().indexOf(needle) >= 0
  }

  pluginSortBy(repo, descending) {
    this.pluginsLoaded() // Create dependency.
    var about = this.pluginMap.get(repo)
    if (about) {
      return descending(about.stargazers_count)
    } else {
      return descending(-1)
    }
  }
}
