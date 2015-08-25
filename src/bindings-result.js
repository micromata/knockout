/* eslint no-new-func: 0 */

// Save a copy for restoration/use
ko.originalApplyBindings = ko.applyBindings
ko.components.originalRegister = ko.components.register


ko.bindingHandlers.result = {
  init: function(element, va) {
    setTimeout(() => ko.bindingHandlers.result.setup(element, va), 124)
  },
  setup: function (element, va) {
    var $e = $(element)
    var example = ko.unwrap(va())
    var registeredComponents = new Set()

    function resetElement() {
      if (element.children[0]) {
        ko.cleanNode(element.children[0])
      }
      $e.empty().append(`<div class='example ${example.css}'>`)
    }
    resetElement()

    function onError(msg) {
      $(element)
        .html(`<div class='error'>Error: ${msg}</div>`)
    }

    function fakeRegister(name, settings) {
      ko.components.originalRegister(name, settings)
      registeredComponents.add(name)
    }

    function clearComponentRegister() {
      registeredComponents.forEach((v) => ko.components.unregister(v))
    }

    function refresh() {
      var script = example.finalJavascript()
      var html = example.html()

      if (script instanceof Error) {
        onError(script)
        return
      }

      if (!html) {
        onError("There's no HTML to bind to.")
        return
      }
      // Stub ko.applyBindings
      ko.applyBindings = function (e) {
        // We ignore the `node` argument in favour of the examples' node.
        ko.originalApplyBindings(e, element.children[0])
      }

      ko.components.register = fakeRegister

      try {
        resetElement()
        clearComponentRegister()
        $(element.children[0]).html(html)
        var fn = new Function('node', script)
        ko.ignoreDependencies(fn, null, [element.children[0]])
      } catch(e) {
        onError(e)
      }
    }

    ko.computed({
      disposeWhenNodeIsRemoved: element,
      read: refresh
    })

    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      clearComponentRegister()
    })

    return {controlsDescendantBindings: true}
  }
}
