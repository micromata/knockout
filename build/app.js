/*global Page*/
/*eslint no-unused-vars: 0*/

"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = function Page() {
  _classCallCheck(this, Page);

  this.body = ko.observable();

  this.links = window.links;
  this.cdn = window.cdn;
};
/* global ace */

"use strict";

ko.bindingHandlers.editor = {
  /* highlight: "langauge" */
  init: function init(element) {
    var editor = ace.edit(element);
    editor.setTheme("ace/theme/solarized_dark");
    editor.getSession().setMode("ace/mode/javascript");
  }
};
"use strict";

function loadTemplates() {
  var uri = "./build/templates.html";
  return Promise.resolve($.ajax(uri)).then(function (html) {
    if (typeof html !== "string") {
      console.error("Unable to get templates:", html);
    } else {
      // ES5-<template> shim/polyfill:
      // unless 'content' of document.createElement('template')
      //   # see pv_shim_template_tag re. broken-template tags
      //   html = html.replace(/<\/template>/g, '</script>')
      //     .replace(/<template/g, '<script type="text/x-template"')
      $("<div id='_templates'>").append(html).appendTo(document.body);
    }
  });
}

function onApplicationUpdate() {
  location.reload();
}

function checkForApplicationUpdate() {
  var ac = applicationCache;
  if (ac) {
    switch (ac.status) {
      case ac.UPDATEREADY:
        onApplicationUpdate();
        break;
      case ac.CHECKING:
      case ac.OBSOLETE:
      case ac.DOWNLOADING:
        return new Promise(function () {
          // This never resolves; it reloads the page when the
          // update is complete.
          window.$root.body("updating-appcache");
          window.applicationCache.addEventListener("updateready", onApplicationUpdate);
        });
    }
  }
  return Promise.resolve();
}

function applyBindings() {
  ko.punches.enableAll();
  window.$root = new Page();
  ko.applyBindings(window.$root);
}

function pageLoaded() {
  window.$root.body("intro");
}

function start() {
  loadTemplates().then(applyBindings).then(checkForApplicationUpdate).then(pageLoaded);
}

$(start);

// Enable livereload in development
if (window.location.hostname === "localhost") {
  $.getScript("http://localhost:35729/livereload.js");
}
"use strict";

window.links = [{ href: "https://github.com/knockout/knockout",
  title: "Github",
  icon: "fa-github" }, { href: "https://groups.google.com/forum/#!forum/knockoutjs",
  title: "Google Groups",
  icon: "fa-google" }, { href: "http://stackoverflow.com/tags/knockout.js/info",
  title: "StackOverflow",
  icon: "fa-stack-overflow" }];

window.cdn = [{ name: "Microsoft",
  version: "3.3.0",
  min: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.js",
  debug: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.debug.js"
}, { name: "CloudFlare",
  version: "3.3.0",
  min: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-debug.js",
  debug: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js"
}];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBhZ2UuanMiLCJiaW5kaW5ncy5qcyIsImVudHJ5LmpzIiwic2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQUdNLElBQUksR0FDRyxTQURQLElBQUksR0FDTTt3QkFEVixJQUFJOztBQUVOLE1BQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFBOztBQUUzQixNQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUE7QUFDekIsTUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFBO0NBQ3RCOzs7OztBQ1BILEVBQUUsQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHOztBQUUxQixNQUFJLEVBQUUsY0FBVSxPQUFPLEVBQUU7QUFDdkIsUUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM5QixVQUFNLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLENBQUE7QUFDM0MsVUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0dBQ25EO0NBQ0YsQ0FBQTs7O0FDUkQsU0FBUyxhQUFhLEdBQUc7QUFDdkIsTUFBSSxHQUFHLEdBQUcsd0JBQXdCLENBQUE7QUFDbEMsU0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FDaEMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFO0FBQ3BCLFFBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQzVCLGFBQU8sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDaEQsTUFBTTs7Ozs7O0FBTUwsT0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FDWixRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQzNCO0dBQ0YsQ0FBQyxDQUFBO0NBQ0w7O0FBRUQsU0FBUyxtQkFBbUIsR0FBRztBQUM3QixVQUFRLENBQUMsTUFBTSxFQUFFLENBQUE7Q0FDbEI7O0FBRUQsU0FBUyx5QkFBeUIsR0FBRztBQUNuQyxNQUFJLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQTtBQUN6QixNQUFJLEVBQUUsRUFBRTtBQUNOLFlBQVEsRUFBRSxDQUFDLE1BQU07QUFDZixXQUFLLEVBQUUsQ0FBQyxXQUFXO0FBQ2pCLDJCQUFtQixFQUFFLENBQUE7QUFDckIsY0FBSztBQUFBLEFBQ1AsV0FBSyxFQUFFLENBQUMsUUFBUSxDQUFDO0FBQ2pCLFdBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQztBQUNqQixXQUFLLEVBQUUsQ0FBQyxXQUFXO0FBQ2pCLGVBQU8sSUFBSSxPQUFPLENBQUMsWUFBWTs7O0FBRzdCLGdCQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3RDLGdCQUFNLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLG1CQUFtQixDQUFDLENBQUE7U0FDN0UsQ0FBQyxDQUFBO0FBQUEsS0FDTDtHQUNGO0FBQ0QsU0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7Q0FDekI7O0FBR0QsU0FBUyxhQUFhLEdBQUc7QUFDdkIsSUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUN0QixRQUFNLENBQUMsS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7QUFDekIsSUFBRSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7Q0FDL0I7O0FBRUQsU0FBUyxVQUFVLEdBQUc7QUFDcEIsUUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7Q0FDM0I7O0FBR0QsU0FBUyxLQUFLLEdBQUc7QUFDZixlQUFhLEVBQUUsQ0FDWixJQUFJLENBQUMsYUFBYSxDQUFDLENBQ25CLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7Q0FDcEI7O0FBR0QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFBOzs7QUFHUixJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLFdBQVcsRUFBRTtBQUM1QyxHQUFDLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUE7Q0FDcEQ7OztBQ3JFRCxNQUFNLENBQUMsS0FBSyxHQUFHLENBQ2IsRUFBRSxJQUFJLEVBQUUsc0NBQXNDO0FBQzVDLE9BQUssRUFBRSxRQUFRO0FBQ2YsTUFBSSxFQUFFLFdBQVcsRUFBQyxFQUNwQixFQUFFLElBQUksRUFBRSxvREFBb0Q7QUFDMUQsT0FBSyxFQUFFLGVBQWU7QUFDdEIsTUFBSSxFQUFFLFdBQVcsRUFBQyxFQUNwQixFQUFFLElBQUksRUFBRSxnREFBZ0Q7QUFDdEQsT0FBSyxFQUFFLGVBQWU7QUFDdEIsTUFBSSxFQUFFLG1CQUFtQixFQUFDLENBQzdCLENBQUE7O0FBR0QsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUNYLEVBQUUsSUFBSSxFQUFFLFdBQVc7QUFDakIsU0FBTyxFQUFFLE9BQU87QUFDaEIsS0FBRyxFQUFFLDJEQUEyRDtBQUNoRSxPQUFLLEVBQUUsaUVBQWlFO0NBQ3pFLEVBQ0QsRUFBRSxJQUFJLEVBQUUsWUFBWTtBQUNsQixTQUFPLEVBQUUsT0FBTztBQUNoQixLQUFHLEVBQUUseUVBQXlFO0FBQzlFLE9BQUssRUFBRSx1RUFBdUU7Q0FDL0UsQ0FDRixDQUFBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qZ2xvYmFsIFBhZ2UqL1xuLyplc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAqL1xuXG5jbGFzcyBQYWdlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ib2R5ID0ga28ub2JzZXJ2YWJsZSgpXG5cbiAgICB0aGlzLmxpbmtzID0gd2luZG93LmxpbmtzXG4gICAgdGhpcy5jZG4gPSB3aW5kb3cuY2RuXG4gIH1cbn1cbiIsIi8qIGdsb2JhbCBhY2UgKi9cblxua28uYmluZGluZ0hhbmRsZXJzLmVkaXRvciA9IHtcbiAgLyogaGlnaGxpZ2h0OiBcImxhbmdhdWdlXCIgKi9cbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudClcbiAgICBlZGl0b3Iuc2V0VGhlbWUoXCJhY2UvdGhlbWUvc29sYXJpemVkX2RhcmtcIilcbiAgICBlZGl0b3IuZ2V0U2Vzc2lvbigpLnNldE1vZGUoXCJhY2UvbW9kZS9qYXZhc2NyaXB0XCIpXG4gIH1cbn1cbiIsIlxuZnVuY3Rpb24gbG9hZFRlbXBsYXRlcygpIHtcbiAgdmFyIHVyaSA9IFwiLi9idWlsZC90ZW1wbGF0ZXMuaHRtbFwiXG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHVyaSkpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgIGlmICh0eXBlb2YgaHRtbCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIGdldCB0ZW1wbGF0ZXM6XCIsIGh0bWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBFUzUtPHRlbXBsYXRlPiBzaGltL3BvbHlmaWxsOlxuICAgICAgICAvLyB1bmxlc3MgJ2NvbnRlbnQnIG9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJylcbiAgICAgICAgLy8gICAjIHNlZSBwdl9zaGltX3RlbXBsYXRlX3RhZyByZS4gYnJva2VuLXRlbXBsYXRlIHRhZ3NcbiAgICAgICAgLy8gICBodG1sID0gaHRtbC5yZXBsYWNlKC88XFwvdGVtcGxhdGU+L2csICc8L3NjcmlwdD4nKVxuICAgICAgICAvLyAgICAgLnJlcGxhY2UoLzx0ZW1wbGF0ZS9nLCAnPHNjcmlwdCB0eXBlPVwidGV4dC94LXRlbXBsYXRlXCInKVxuICAgICAgICAkKFwiPGRpdiBpZD0nX3RlbXBsYXRlcyc+XCIpXG4gICAgICAgICAgLmFwcGVuZChodG1sKVxuICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KVxuICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIG9uQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIGxvY2F0aW9uLnJlbG9hZCgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIHZhciBhYyA9IGFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKGFjKSB7XG4gICAgc3dpdGNoIChhYy5zdGF0dXMpIHtcbiAgICAgIGNhc2UgYWMuVVBEQVRFUkVBRFk6XG4gICAgICAgIG9uQXBwbGljYXRpb25VcGRhdGUoKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBhYy5DSEVDS0lORzpcbiAgICAgIGNhc2UgYWMuT0JTT0xFVEU6XG4gICAgICBjYXNlIGFjLkRPV05MT0FESU5HOlxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIFRoaXMgbmV2ZXIgcmVzb2x2ZXM7IGl0IHJlbG9hZHMgdGhlIHBhZ2Ugd2hlbiB0aGVcbiAgICAgICAgICAvLyB1cGRhdGUgaXMgY29tcGxldGUuXG4gICAgICAgICAgd2luZG93LiRyb290LmJvZHkoXCJ1cGRhdGluZy1hcHBjYWNoZVwiKVxuICAgICAgICAgIHdpbmRvdy5hcHBsaWNhdGlvbkNhY2hlLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZXJlYWR5Jywgb25BcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAgICAgfSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLmFwcGx5QmluZGluZ3Mod2luZG93LiRyb290KVxufVxuXG5mdW5jdGlvbiBwYWdlTG9hZGVkKCkge1xuICB3aW5kb3cuJHJvb3QuYm9keShcImludHJvXCIpXG59XG5cblxuZnVuY3Rpb24gc3RhcnQoKSB7XG4gIGxvYWRUZW1wbGF0ZXMoKVxuICAgIC50aGVuKGFwcGx5QmluZGluZ3MpXG4gICAgLnRoZW4oY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAudGhlbihwYWdlTG9hZGVkKVxufVxuXG5cbiQoc3RhcnQpXG5cbi8vIEVuYWJsZSBsaXZlcmVsb2FkIGluIGRldmVsb3BtZW50XG5pZiAod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnbG9jYWxob3N0Jykge1xuICAkLmdldFNjcmlwdChcImh0dHA6Ly9sb2NhbGhvc3Q6MzU3MjkvbGl2ZXJlbG9hZC5qc1wiKVxufVxuIiwiXG53aW5kb3cubGlua3MgPSBbXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXRcIixcbiAgICB0aXRsZTogXCJHaXRodWJcIixcbiAgICBpY29uOiBcImZhLWdpdGh1YlwifSxcbiAgeyBocmVmOiBcImh0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vZm9ydW0vIyFmb3J1bS9rbm9ja291dGpzXCIsXG4gICAgdGl0bGU6IFwiR29vZ2xlIEdyb3Vwc1wiLFxuICAgIGljb246IFwiZmEtZ29vZ2xlXCJ9LFxuICB7IGhyZWY6IFwiaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3RhZ3Mva25vY2tvdXQuanMvaW5mb1wiLFxuICAgIHRpdGxlOiBcIlN0YWNrT3ZlcmZsb3dcIixcbiAgICBpY29uOiBcImZhLXN0YWNrLW92ZXJmbG93XCJ9XG5dXG5cblxud2luZG93LmNkbiA9IFtcbiAgeyBuYW1lOiBcIk1pY3Jvc29mdFwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmpzXCIsXG4gICAgZGVidWc6IFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmRlYnVnLmpzXCJcbiAgfSxcbiAgeyBuYW1lOiBcIkNsb3VkRmxhcmVcIixcbiAgICB2ZXJzaW9uOiBcIjMuMy4wXCIsXG4gICAgbWluOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2tub2Nrb3V0LzMuMy4wL2tub2Nrb3V0LWRlYnVnLmpzXCIsXG4gICAgZGVidWc6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtbWluLmpzXCJcbiAgfVxuXVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9