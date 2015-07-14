/*global setupEvents*/
/* eslint no-unused-vars: 0 */

function isLocal(anchor) {
  return (location.protocol === anchor.protocol &&
          location.host === anchor.host)
}


//
// For JS history see:
// https://github.com/devote/HTML5-History-API
//
function onAnchorClick(evt) {
  var anchor = this
  // Do not intercept clicks on things outside this page
  if (!isLocal(anchor)) { return true }

  // Do not intercept clicks on an element in an example.
  if ($(anchor).parents("live-example").length !== 0) {
    return true
  }

  try {
    var pn = anchor.pathname
    var templateId = pn.replace("/a/", "").replace(".html", "")
    // If the template isn't found, presume a hard link
    if (!document.getElementById(templateId)) { return true }
    $root.open(templateId)
    history.pushState(null, null, anchor.href)
  } catch(e) {
    console.log(`Error/${anchor.getAttribute('href')}`, e)
  }
  return false
}


function onPopState(/* evt */) {
  // Note https://github.com/devote/HTML5-History-API
  $root.open(location.pathname)
}


function setupEvents() {
  if (window.history.pushState) {
    $(document.body).on('click', "a", onAnchorClick)
    $(window).on('popstate', onPopState)
  }
}
