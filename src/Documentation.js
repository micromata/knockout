
class Documentation {
  constructor(template, title, category, subcategory) {
    this.template = template
    this.title = title
    this.category = category
    this.subcategory = subcategory
  }
}

Documentation.categoriesMap = {
  1: "Getting started",
  2: "Observables",
  3: "Bindings and Components",
  4: "Bindings included",
  5: "Further information"
}

Documentation.fromNode = function (i, node) {
  return new Documentation(
    node.getAttribute('id'),
    node.getAttribute('data-title'),
    node.getAttribute('data-cat'),
    node.getAttribute('data-subcat')
  )
}

Documentation.initialize = function () {
  Documentation.all = $.makeArray(
    $("[data-kind=documentation]").map(Documentation.fromNode)
  )
}
