/*global Page, Documentation, marked, Search*/
/*eslint no-unused-vars: 0*/


class Page {
  constructor() {
    // --- Main body template id ---
    this.body = ko.observable()
    this.title = ko.observable()
    this.body.subscribe(this.onBodyChange, this)

    // --- footer links/cdn ---
    this.links = window.links
    this.cdn = window.cdn

    // --- plugins ---
    this.pluginRepos = ko.observableArray()
    this.sortedPluginRepos = this.pluginRepos
      .filter(this.pluginFilter.bind(this))
      .sortBy(this.pluginSortBy.bind(this))
    this.pluginMap = new Map()
    this.pluginSort = ko.observable()
    this.pluginsLoaded = ko.observable(false).extend({rateLimit: 15})
    this.pluginNeedle = ko.observable().extend({rateLimit: 200})

    // --- documentation ---
    this.docCatMap = new Map()
    Documentation.all.forEach(function (doc) {
      var cat = Documentation.categoriesMap[doc.category]
      var docList = this.docCatMap.get(cat)
      if (!docList) {
        docList = []
        this.docCatMap.set(cat, docList)
      }
      docList.push(doc)
    }, this)

    // Sort the documentation items
    function sorter(a, b) {
      return a.title.localeCompare(b.title)
    }
    for (var list of this.docCatMap.values()) { list.sort(sorter) }

    // docCats: A sorted list of the documentation sections
    this.docCats = Object.keys(Documentation.categoriesMap)
      .sort()
      .map(function (v) { return Documentation.categoriesMap[v] })

    // --- searching ---
    this.search = new Search()

    // --- page loading status ---
    // applicationCache progress
    this.reloadProgress = ko.observable()

    // page loading error
    this.errorMessage = ko.observable()
  }

  open(pinpoint) {
    var pp = pinpoint.replace("#", "")
    this.body(pp)
    $(window).scrollTop(0)
  }

  onBodyChange(templateId) {
    var node = document.getElementById(templateId)
    this.title(node.getAttribute('data-title') || '')
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
