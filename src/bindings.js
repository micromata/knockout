
ko.bindingHandlers.highlight = {
  /* highlight: "langauge" */
  init: function (element, va) {
    element.className = (element.className || '') + " language-" + va()
    window.Prism.highlightElement(element)
  }
}
