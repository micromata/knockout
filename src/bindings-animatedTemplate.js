//
// animated template binding
// ---
// Waits for CSS3 transitions to complete on change before moving to the next.
//
var animatedHideProps = {
  marginLeft: '100%',
  width: '100%',
  overflow: 'hidden'
}

var animatedShowProps = {
  marginLeft: 0
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
          .animate(animatedHideProps, {
            duration: 180,
            complete: function () {
              $element.css('margin-left', '-100%')
              $element.html($(templateNode).html())
              ko.applyBindingsToDescendants(bindingContext, element)
            }
          })
          .animate(animatedShowProps, { duration: 180 })
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
