/*global Page*/
/*eslint no-unused-vars: 0*/

class Page {
  constructor() {
    this.body = ko.observable()

    this.links = window.links
    this.cdn = window.cdn
  }
}
