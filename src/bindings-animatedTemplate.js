//
// animated template binding
// ---
// Waits for CSS3 transitions to complete on change before moving to the next.
//

ko.bindingHandlers.animatedTemplate = {
  init: function (element, valueAccessor, ign1, ign2, bindingContext) {
    var $element = $(element)
    var obs = valueAccessor()

    var onTemplateChange = function (templateId_) {
      var templateId = (templateId_ || '').replace('#', '')
      var templateNode = document.getElementById(templateId)
      if (!templateId) {
        $element.empty()
      } else if (!templateNode) {
        throw new Error(`Cannot find template by id: ${templateId}`)
      } else {
        $element.html($(templateNode).html())
        ko.applyBindingsToDescendants(bindingContext, element)
      }
    }

    var subs = obs.subscribe(onTemplateChange)
    onTemplateChange(ko.unwrap(obs))

    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      subs.dispose()
    })

    return { controlsDescendantBindings: true }
  }
}
