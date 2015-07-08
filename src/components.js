/*globals Example */
/* eslint no-unused-vars: 0*/

class LiveExample {
  constructor(params) {
    this.example = params.id
  }
}

ko.components.register('live-example', {
    viewModel: LiveExample,
    template: {element: "live-example"}
})
