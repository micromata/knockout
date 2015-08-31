
class SearchResult {
  constructor(template) {
    this.template = template
    this.link = `/a/${template.id}.html`
    this.title = template.getAttribute('data-title') || `“${template.id}”`
  }
}


class Search {
  constructor() {
    var searchRate = {
      timeout: 500,
      method: "notifyWhenChangesStop"
    }
    this.query = ko.observable().extend({rateLimit: searchRate})
    this.results = ko.computed(this.computeResults, this)
    this.query.subscribe(this.onQueryChange, this)
    this.progress = ko.observable()
  }

  computeResults() {
    var q = (this.query() || '').trim().toLowerCase()
    if (!q) { return [] }
    return $(`template`)
      .filter(function () {
        return $(this.content).text().toLowerCase().indexOf(q) !== -1
      })
      .map((i, template) => new SearchResult(template))
  }

  saveTemplate() {
    if ($root.body() !== 'search') {
      this.savedTemplate = $root.body()
      this.savedTitle = document.title
    }
  }

  restoreTemplate() {
    if (this.savedTitle && this.query() !== null) {
      $root.body(this.savedTemplate)
      document.title = this.savedTitle
    }
  }

  onQueryChange() {
    if (!(this.query() || '').trim()) {
      this.restoreTemplate()
      return
    }
    this.saveTemplate()
    $root.body("search")
    document.title = `Knockout.js – Search “${this.query()}”`
  }
}
