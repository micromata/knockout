/**
 API converts the `opine`-flavoured documentation here.

 Here is a sample:
*/
// /*---
//  purpose: knockout-wide settings
//  */
// var settings = { /*...*/ }

class API {
  constructor(spec) {
    this.type = spec.type
    this.name = spec.name
    this.source = spec.source
    this.line = spec.line
    this.purpose = spec.vars.purpose
    this.spec = spec.vars.params
    this.url = this.buildUrl(spec.source, spec.line)
  }

  buildUrl(source, line) {
    return `${API.urlRoot}${source}#L${line}`
  }
}

API.urlRoot = "https://github.com/knockout/knockout/blob/master/"


API.items = ko.observableArray()

API.add = function (token) {
  console.log("T", token)
  API.items.push(new API(token))
}
