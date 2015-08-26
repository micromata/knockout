//
// Simple throttle.
//

function throttle(fn, interval) {
  var isWaiting = false

  var wrap = function throttled() {
    if (isWaiting) { return }
    isWaiting = true
    setTimeout(function () {
      isWaiting = false
      fn()
    }, interval)
  }

  return wrap
}
