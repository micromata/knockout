
class SearchResult {
  constructor(template) {
    this.template = template
    this.link = `#${template.id}`
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
  }

  computeResults() {
    var q = this.query()
    if (!q) { return null }
    return $(`template`)
      .filter(function () {
        return $(this.content).text().indexOf(q) !== -1
      })
      .map((i, template) => new SearchResult(template))
  }
}
