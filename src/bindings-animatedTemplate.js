//
// animated template binding
// ---
// Waits for CSS3 transitions to complete on change before moving to the next.
//
var animatedHideProps = {
  x: '100%',
  width: '100%',
  overflow: 'hidden',
  duration: 180,
  easing: 'snap'
}

var animatedShowProps = {
  x: 0,
  duration: 180,
  easing: 'snap'
}


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
        $element.stop()
          .transition(animatedHideProps, function () {
              $element.css('x', '-100%')
              $element.html($(templateNode).html())
              ko.applyBindingsToDescendants(bindingContext, element)
            }
          )
          .transition(animatedShowProps)
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
