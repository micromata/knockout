
class Documentation {
  constructor(template, title, category, subcategory) {
    this.template = template
    this.title = title
    this.category = category
    this.subcategory = subcategory
  }
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
