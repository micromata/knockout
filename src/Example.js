

class Example {
  constructor(state = {}) {
    var debounce = { timeout: 500, method: "notifyWhenChangesStop" }
    this.javascript = ko.observable(state.javascript)
      .extend({rateLimit: debounce})
    this.html = ko.observable(state.html).extend({rateLimit: debounce})
    this.css = state.css || ''
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


Example.set = function (name, state) {
  var example = Example.stateMap.get(name)
  if (example) {
    example.javascript(state.javascript)
    example.html(state.html)
    return
  }
  Example.stateMap.set(name, new Example(state))
}
