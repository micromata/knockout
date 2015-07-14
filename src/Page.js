/*global Page, Documentation, marked, Search, PluginManager */
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
    this.plugins = new PluginManager()

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
    this.cacheIsUpdated = ko.observable(false)

    // page loading error
    this.errorMessage = ko.observable()
  }

  pathToTemplate(path) {
    return path.split('/').pop().replace('.html', '')
  }

  open(pinpoint) {
    this.body(this.pathToTemplate(pinpoint))
    $(window).scrollTop(0)
    document.title = `Knockout.js – ${$(this).text()}`
  }

  onBodyChange(templateId) {
    var node = document.getElementById(templateId)
    this.title(node.getAttribute('data-title') || '')
  }

  registerPlugins(plugins) {
    this.plugins.register(plugins)
  }
}
