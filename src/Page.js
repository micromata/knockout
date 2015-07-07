/*global Page*/
/*eslint no-unused-vars: 0*/

class Page {
  constructor() {
    this.body = ko.observable()

    this.links = window.links
    this.cdn = window.cdn

    this.pluginRepos = ko.observableArray()
    this.sortedPluginRepos = this.pluginRepos
      .filter(this.pluginFilter.bind(this))
      .sortBy(this.pluginSortBy.bind(this))
    this.pluginMap = new Map()
    this.pluginSort = ko.observable()
    this.pluginsLoaded = ko.observable(false).extend({rateLimit: 15})
    this.pluginNeedle = ko.observable().extend({rateLimit: 200})
  }

  open(pinpoint) {
    this.body(pinpoint.replace("#", ""))
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
