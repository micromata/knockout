//
// animated template binding
// ---
// Waits for CSS3 transitions to complete on change before moving to the next.
//

function getTemplateAnimations(origin) {
  return {
    hide: {
      x: '100%',
      rotateY: '90deg',
      overflow: 'hidden',
      duration: 180,
      easing: 'snap'
    },
    start: {
      x: '-100%',
      rotateY: '-90deg',
    },
    show: {
      x: 0,
      rotateY: '0deg',
      duration: 180,
      easing: 'snap'
    }
  }
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
        var anims = getTemplateAnimations($root.pageChangeOrigin)

        $element.stop()
          .transition(anims.hide, function () {
              $element.css(anims.start)
                .html($(templateNode).html())
              ko.applyBindingsToDescendants(bindingContext, element)
            }
          )
          .transition(anims.show)
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
