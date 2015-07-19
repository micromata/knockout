/*global setupEvents*/
/* eslint no-unused-vars: 0 */

function isLocal(anchor) {
  return (location.protocol === anchor.protocol &&
          location.host === anchor.host)
}

// Make sure in non-single-page-app mode that we link to the right relative
// link.
var anchorRoot = location.pathname.replace(/\/a\/.*\.html/, '')
function rewriteAnchorRoot(evt) {
  var anchor = evt.currentTarget
  var href = anchor.getAttribute('href')
  // Skip non-local urls.
  if (!isLocal(anchor)) { return true }
  // Already re-rooted
  if (anchor.pathname.indexOf(anchorRoot) === 0) { return true }
  anchor.pathname = `${anchorRoot}${anchor.pathname}`.replace('//', '/')
  return true
}


//
// For JS history see:
// https://github.com/devote/HTML5-History-API
//
function onAnchorClick(evt) {
  var anchor = this
  rewriteAnchorRoot(evt)
  if ($root.noSPA()) { return true }
  // Do not intercept clicks on things outside this page
  if (!isLocal(anchor)) { return true }

  // Do not intercept clicks on an element in an example.
  if ($(anchor).parents("live-example").length !== 0) {
    return true
  }

  try {
    var templateId = $root.pathToTemplate(anchor.pathname)
    // If the template isn't found, presume a hard link
    if (!document.getElementById(templateId)) { return true }
    history.pushState(null, null, anchor.href)
    $root.open(templateId)
    $root.search.query('')
  } catch(e) {
    console.log(`Error/${anchor.getAttribute('href')}`, e)
  }
  return false
}


function onPopState(/* evt */) {
  // Note https://github.com/devote/HTML5-History-API
  if ($root.noSPA()) { return }
  $root.open(location.pathname)
}


function setupEvents() {
  if (window.history.pushState) {
    $(document.body).on('click', "a", onAnchorClick)
    $(window).on('popstate', onPopState)
  } else {
    $(document.body).on('click', rewriteAnchorRoot)
  }
}
