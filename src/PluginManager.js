/* eslint no-unused-vars: [2, {"vars": "local"}]*/

class PluginManager {
  constructor () {
    this.pluginRepos = ko.observableArray()
    this.sortedPluginRepos = this.pluginRepos
      .filter(this.filter.bind(this))
      .sortBy(this.sortBy.bind(this))
      .map(this.nameToInstance.bind(this))
    this.pluginMap = new Map()
    this.pluginSort = ko.observable()
    this.pluginsLoaded = ko.observable(false).extend({rateLimit: 15})
    this.needle = ko.observable().extend({rateLimit: 200})
  }

  register(plugins) {
    Object.keys(plugins).forEach(function (repo) {
      var about = plugins[repo]
      this.pluginRepos.push(repo)
      this.pluginMap.set(repo, about)
    }, this)
    this.pluginsLoaded(true)
  }

  filter(repo) {
    if (!this.pluginsLoaded()) { return false }
    var about = this.pluginMap.get(repo)
    var needle = (this.needle() || '').toLowerCase()
    if (!needle) { return true }
    if (repo.toLowerCase().indexOf(needle) >= 0) { return true }
    if (!about) { return false }
    return (about.description || '').toLowerCase().indexOf(needle) >= 0
  }

  sortBy(repo, descending) {
    this.pluginsLoaded() // Create dependency.
    var about = this.pluginMap.get(repo)
    if (about) {
      return descending(about.stargazers_count)
    } else {
      return descending(-1)
    }
  }

  nameToInstance(name) {
    return this.pluginMap.get(name)
  }
}
