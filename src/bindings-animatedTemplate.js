//
// animated template binding
// ---
// Waits for CSS3 transitions to complete on change before moving to the next.
//

var animationEvent = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd'

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
        var html = $(templateNode).html()
        $element.html(`<div class='main-animated'>${html}</div>`)

        // See: http://stackoverflow.com/questions/9255279
        $element.one(animationEvent, function () {
          // Fake a scroll event so our `isAlmostInView`
          $(window).trigger("scroll")
        })

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
