

var inViewWatch = new Map()


// SEe also http://stackoverflow.com/a/7557433/19212
function isAlmostInView(el) {
  var rect = el.getBoundingClientRect()
  var winHeight = window.innerHeight || document.documentElement.clientHeight

  // Items are almost in view when we've scrolled down to 200px above their
  // presence on the page i.e. just before the user gets to them.
  return rect.top < winHeight + 200
}


function checkItemsInView() {
  for (var element of inViewWatch.keys()) {
    if (isAlmostInView(element)) {
      // Invoke the callback.
      inViewWatch.get(element)()
      inViewWatch.delete(element)
    }
  }
}


// Schedule the callback for when the element comes into view.
// This is in some ways a poor man's requestIdleCallback
// https://developers.google.com/web/updates/2015/08/27/using-requestidlecallback
function whenAlmostInView(element, callback) {
  if (isAlmostInView(element)) {
    setTimeout(callback, 1)
  } else {
    inViewWatch.set(element, callback)
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      inViewWatch.delete(element)
    })
  }
}
