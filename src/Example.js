

class Example {
  constructor() {
    var debounce = { timeout: 500, method: "notifyWhenChangesStop" }
    this.javascript = ko.observable().extend({rateLimit: debounce})
    this.html = ko.observable().extend({rateLimit: debounce})
  }
}

Example.stateMap = new Map()

Example.get = function (name) {
  var state = Example.stateMap.get(name)
  if (!state) {
    state = new Example(name)
    Example.stateMap.set(name, state)
  }
  return state
}
