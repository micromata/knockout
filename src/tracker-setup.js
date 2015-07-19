/* eslint no-underscore-dangle: 0, semi: 0 */
//
// Track:js setup
//
// This file is in the src/ directory, meaning it is included in app.js.
// However it is also explicitly included in libs.js so that error
// tracking gets started ASAP.
//
// The small duplication is a trade-off for the headache of putting a .js
// file outside the src/ directory.
if (location.hostname !== 'localhost') {
  window._trackJs = window._trackJs || {
    enabled: true,
    bindStack: true, //  watch for perf. penalty.
    token: 'bc952e7044e34a2e8423f777b8c824be'
  };
} else {
  window._trackJs = window._trackJs || {
    enabled: false
  };
}
