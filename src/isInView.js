

var inViewWatch = new Map()


// Per http://stackoverflow.com/a/7557433/19212
function isInView(el) {
  var rect = el.getBoundingClientRect()
  var winHeight = window.innerHeight || document.documentElement.clientHeight
  var winWidth = window.innerWidth || document.documentElement.clientWidth

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= winHeight &&
    rect.right <= winWidth)
}


function checkItemsInView() {
  for (var element of inViewWatch.keys()) {
    if (isInView(element)) {
      // Invoke the callback.
      inViewWatch.get(element)()
      inViewWatch.delete(element)
    }
  }
}


function whenInView(element, callback) {
  if (isInView(element)) {
    setTimeout(callback, 1)
  } else {
    inViewWatch.set(element, callback)
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      inViewWatch.delete(element)
    })
  }
}
