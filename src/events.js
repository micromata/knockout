/*global setupEvents*/

//
// For JS history see:
// https://github.com/devote/HTML5-History-API
//
function onAnchorClick(evt) {
  history.pushState(null, null, this.href)
  console.log("New AnchorClick", evt.target)

  var pinpoint = evt.target.getAttribute('href').replace('#', '')

  $root.body(pinpoint)

  return false
}


function onPopState(/* evt */) {
  console.log("POP to:", location.href)
}


function setupEvents() {
  $(document.body)
    .on('click', "a", onAnchorClick)

  $(window)
    .on('popstate', onPopState)
}
