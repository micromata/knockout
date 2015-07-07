"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Example = function Example() {
  _classCallCheck(this, Example);

  var debounce = { timeout: 500, method: "notifyWhenChangesStop" };
  this.javascript = ko.observable().extend({ rateLimit: debounce });
  this.html = ko.observable().extend({ rateLimit: debounce });
};

Example.stateMap = new Map();

Example.get = function (name) {
  var state = Example.stateMap.get(name);
  if (!state) {
    state = new Example(name);
    Example.stateMap.set(name, state);
  }
  return state;
};
/*global Page*/
/*eslint no-unused-vars: 0*/

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = (function () {
  function Page() {
    _classCallCheck(this, Page);

    this.body = ko.observable();

    this.links = window.links;
    this.cdn = window.cdn;
  }

  _createClass(Page, [{
    key: "open",
    value: function open(pinpoint) {
      this.body(pinpoint.replace("#", ""));
    }
  }]);

  return Page;
})();
/* global ace, Example */
/* eslint no-new-func: 0*/

'use strict';

var languageThemeMap = {
  html: 'solarized_dark',
  javascript: 'monokai'
};

function setupEditor(element, language, exampleName) {
  var example = Example.get(ko.unwrap(exampleName));
  var editor = ace.edit(element);
  var session = editor.getSession();
  editor.setTheme('ace/theme/' + languageThemeMap[language]);
  editor.setOptions({
    highlightActiveLine: true,
    useSoftTabs: true,
    tabSize: 2,
    minLines: 3,
    maxLines: 15
  });
  session.setMode('ace/mode/' + language);
  editor.on('change', function () {
    return example[language](editor.getValue());
  });
  return editor;
}

//expected-doctype-but-got-end-tag
//expected-doctype-but-got-start-tag
//expected-doctype-but-got-chars

ko.bindingHandlers['edit-js'] = {
  /* highlight: "langauge" */
  init: function init(element, va) {
    var editor = setupEditor(element, 'javascript', va());
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      return editor.destroy();
    });
  }
};

ko.bindingHandlers['edit-html'] = {
  init: function init(element, va) {
    var editor = setupEditor(element, 'html', va());
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      return editor.destroy();
    });
  }
};

ko.bindingHandlers.result = {
  init: function init(element, va) {
    var $e = $(element);
    var example = Example.get(ko.unwrap(va()));

    function resetElement() {
      if (element.children[0]) {
        ko.cleanNode(element.children[0]);
      }
      $e.empty().append('<div class=\'example\'>');
    }

    resetElement();

    function onError(msg) {
      $(element).html('<div class=\'error\'>Error: ' + msg + '</div>');
    }

    var subs = ko.computed(function () {
      var script = example.javascript();
      var html = example.html();

      if (!script) {
        onError('The script is empty.');
        return;
      }

      if (!html) {
        onError('There\'s no HTML to bind to.');
        return;
      }

      try {
        var view = new Function(script);
        if (!view) {
          onError('Return the viewmodel from the Javascript.');
          return;
        }
        resetElement();
        $(element.children[0]).html(example.html());
        ko.applyBindings(view, element.children[0]);
      } catch (e) {
        onError(e);
      }
    });

    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      return subs.dispose();
    });
    return { controlsDescendantBindings: true };
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
  ko.punches.enableAll();
  ko.applyBindings(window.$root);
}

function pageLoaded() {
  window.$root.body("intro");
}

function start() {
  loadTemplates().then(applyBindings).then(setupEvents).then(checkForApplicationUpdate).then(pageLoaded);
}

$(start);

// Enable livereload in development
if (window.location.hostname === "localhost") {
  $.getScript("http://localhost:35729/livereload.js");
}
/*global setupEvents*/
/* eslint no-unused-vars: 0 */

'use strict';

function isLocal(anchor) {
  return location.protocol === anchor.protocol && location.host === anchor.host;
}

//
// For JS history see:
// https://github.com/devote/HTML5-History-API
//
function onAnchorClick(evt) {
  if (!isLocal(this)) {
    return true;
  }
  $root.open(evt.target.getAttribute('href'));
  history.pushState(null, null, this.href);
  document.title = 'Knockout.js – ' + $(this).text();
  return false;
}

function onPopState() {
  // Consider https://github.com/devote/HTML5-History-API
  $root.open(location.hash);
}

function setupEvents() {
  $(document.body).on('click', 'a', onAnchorClick);

  $(window).on('popstate', onPopState);
}
/* evt */
"use strict";

window.links = [{ href: "https://github.com/knockout/knockout",
  title: "Github",
  icon: "fa-github" }, { href: "https://github.com/knockout/knockout/releases",
  title: "Releases",
  icon: "fa-certificate" }, { href: "https://groups.google.com/forum/#!forum/knockoutjs",
  title: "Google Groups",
  icon: "fa-google" }, { href: "http://stackoverflow.com/tags/knockout.js/info",
  title: "StackOverflow",
  icon: "fa-stack-overflow" }, { href: "https://gitter.im/knockout/knockout",
  title: "Gitter",
  icon: "fa-comments-o" }];

window.cdn = [{ name: "Microsoft",
  version: "3.3.0",
  min: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.js",
  debug: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.debug.js"
}, { name: "CloudFlare",
  version: "3.3.0",
  min: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-debug.js",
  debug: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js"
}];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4YW1wbGUuanMiLCJQYWdlLmpzIiwiYmluZGluZ3MuanMiLCJlbnRyeS5qcyIsImV2ZW50cy5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFFTSxPQUFPLEdBQ0EsU0FEUCxPQUFPLEdBQ0c7d0JBRFYsT0FBTzs7QUFFVCxNQUFJLFFBQVEsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLHVCQUF1QixFQUFFLENBQUE7QUFDaEUsTUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUE7QUFDL0QsTUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUE7Q0FDMUQ7O0FBR0gsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUU1QixPQUFPLENBQUMsR0FBRyxHQUFHLFVBQVUsSUFBSSxFQUFFO0FBQzVCLE1BQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3RDLE1BQUksQ0FBQyxLQUFLLEVBQUU7QUFDVixTQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDekIsV0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO0dBQ2xDO0FBQ0QsU0FBTyxLQUFLLENBQUE7Q0FDYixDQUFBOzs7Ozs7Ozs7O0lDaEJLLElBQUk7QUFDRyxXQURQLElBQUksR0FDTTswQkFEVixJQUFJOztBQUVOLFFBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFBOztBQUUzQixRQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxL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QVE7QUFDZixNQUFJLEVBQUUsZUFBZSxFQUFDLENBQ3pCLENBQUE7O0FBR0QsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUNYLEVBQUUsSUFBSSxFQUFFLFdBQVc7QUFDakIsU0FBTyxFQUFFLE9BQU87QUFDaEIsS0FBRyxFQUFFLDJEQUEyRDtBQUNoRSxPQUFLLEVBQUUsaUVBQWlFO0NBQ3pFLEVBQ0QsRUFBRSxJQUFJLEVBQUUsWUFBWTtBQUNsQixTQUFPLEVBQUUsT0FBTztBQUNoQixLQUFHLEVBQUUseUVBQXlFO0FBQzlFLE9BQUssRUFBRSx1RUFBdUU7Q0FDL0UsQ0FDRixDQUFBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5jbGFzcyBFeGFtcGxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdmFyIGRlYm91bmNlID0geyB0aW1lb3V0OiA1MDAsIG1ldGhvZDogXCJub3RpZnlXaGVuQ2hhbmdlc1N0b3BcIiB9XG4gICAgdGhpcy5qYXZhc2NyaXB0ID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiBkZWJvdW5jZX0pXG4gICAgdGhpcy5odG1sID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiBkZWJvdW5jZX0pXG4gIH1cbn1cblxuRXhhbXBsZS5zdGF0ZU1hcCA9IG5ldyBNYXAoKVxuXG5FeGFtcGxlLmdldCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBzdGF0ZSA9IEV4YW1wbGUuc3RhdGVNYXAuZ2V0KG5hbWUpXG4gIGlmICghc3RhdGUpIHtcbiAgICBzdGF0ZSA9IG5ldyBFeGFtcGxlKG5hbWUpXG4gICAgRXhhbXBsZS5zdGF0ZU1hcC5zZXQobmFtZSwgc3RhdGUpXG4gIH1cbiAgcmV0dXJuIHN0YXRlXG59XG4iLCIvKmdsb2JhbCBQYWdlKi9cbi8qZXNsaW50IG5vLXVudXNlZC12YXJzOiAwKi9cblxuY2xhc3MgUGFnZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYm9keSA9IGtvLm9ic2VydmFibGUoKVxuXG4gICAgdGhpcy5saW5rcyA9IHdpbmRvdy5saW5rc1xuICAgIHRoaXMuY2RuID0gd2luZG93LmNkblxuICB9XG5cbiAgb3BlbihwaW5wb2ludCkge1xuICAgIHRoaXMuYm9keShwaW5wb2ludC5yZXBsYWNlKFwiI1wiLCBcIlwiKSlcbiAgfVxufVxuIiwiLyogZ2xvYmFsIGFjZSwgRXhhbXBsZSAqL1xuLyogZXNsaW50IG5vLW5ldy1mdW5jOiAwKi9cblxudmFyIGxhbmd1YWdlVGhlbWVNYXAgPSB7XG4gIGh0bWw6ICdzb2xhcml6ZWRfZGFyaycsXG4gIGphdmFzY3JpcHQ6ICdtb25va2FpJ1xufVxuXG5mdW5jdGlvbiBzZXR1cEVkaXRvcihlbGVtZW50LCBsYW5ndWFnZSwgZXhhbXBsZU5hbWUpIHtcbiAgdmFyIGV4YW1wbGUgPSBFeGFtcGxlLmdldChrby51bndyYXAoZXhhbXBsZU5hbWUpKVxuICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudClcbiAgdmFyIHNlc3Npb24gPSBlZGl0b3IuZ2V0U2Vzc2lvbigpXG4gIGVkaXRvci5zZXRUaGVtZShgYWNlL3RoZW1lLyR7bGFuZ3VhZ2VUaGVtZU1hcFtsYW5ndWFnZV19YClcbiAgZWRpdG9yLnNldE9wdGlvbnMoe1xuICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmU6IHRydWUsXG4gICAgdXNlU29mdFRhYnM6IHRydWUsXG4gICAgdGFiU2l6ZTogMixcbiAgICBtaW5MaW5lczogMyxcbiAgICBtYXhMaW5lczogMTVcbiAgfSlcbiAgc2Vzc2lvbi5zZXRNb2RlKGBhY2UvbW9kZS8ke2xhbmd1YWdlfWApXG4gIGVkaXRvci5vbignY2hhbmdlJywgKCkgPT4gZXhhbXBsZVtsYW5ndWFnZV0oZWRpdG9yLmdldFZhbHVlKCkpKVxuICByZXR1cm4gZWRpdG9yXG59XG5cbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWdcbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZ1xuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtY2hhcnNcblxua28uYmluZGluZ0hhbmRsZXJzWydlZGl0LWpzJ10gPSB7XG4gIC8qIGhpZ2hsaWdodDogXCJsYW5nYXVnZVwiICovXG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciBlZGl0b3IgPSBzZXR1cEVkaXRvcihlbGVtZW50LCAnamF2YXNjcmlwdCcsIHZhKCkpXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICB9XG59XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZWRpdC1odG1sJ10gPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciBlZGl0b3IgPSBzZXR1cEVkaXRvcihlbGVtZW50LCAnaHRtbCcsIHZhKCkpXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICB9XG59XG5cbmtvLmJpbmRpbmdIYW5kbGVycy5yZXN1bHQgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciAkZSA9ICQoZWxlbWVudClcbiAgICB2YXIgZXhhbXBsZSA9IEV4YW1wbGUuZ2V0KGtvLnVud3JhcCh2YSgpKSlcblxuICAgIGZ1bmN0aW9uIHJlc2V0RWxlbWVudCgpIHtcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuWzBdKSB7XG4gICAgICAgIGtvLmNsZWFuTm9kZShlbGVtZW50LmNoaWxkcmVuWzBdKVxuICAgICAgfVxuICAgICAgJGUuZW1wdHkoKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdleGFtcGxlJz5cIilcbiAgICB9XG5cbiAgICByZXNldEVsZW1lbnQoKVxuXG4gICAgZnVuY3Rpb24gb25FcnJvcihtc2cpIHtcbiAgICAgICQoZWxlbWVudClcbiAgICAgICAgLmh0bWwoYDxkaXYgY2xhc3M9J2Vycm9yJz5FcnJvcjogJHttc2d9PC9kaXY+YClcbiAgICB9XG5cbiAgICB2YXIgc3VicyA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzY3JpcHQgPSBleGFtcGxlLmphdmFzY3JpcHQoKVxuICAgICAgdmFyIGh0bWwgPSBleGFtcGxlLmh0bWwoKVxuXG4gICAgICBpZiAoIXNjcmlwdCkge1xuICAgICAgICBvbkVycm9yKFwiVGhlIHNjcmlwdCBpcyBlbXB0eS5cIilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICghaHRtbCkge1xuICAgICAgICBvbkVycm9yKFwiVGhlcmUncyBubyBIVE1MIHRvIGJpbmQgdG8uXCIpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgdmlldyA9IG5ldyBGdW5jdGlvbihzY3JpcHQpXG4gICAgICAgIGlmICghdmlldykge1xuICAgICAgICAgIG9uRXJyb3IoXCJSZXR1cm4gdGhlIHZpZXdtb2RlbCBmcm9tIHRoZSBKYXZhc2NyaXB0LlwiKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHJlc2V0RWxlbWVudCgpXG4gICAgICAgICQoZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgICAgICAuaHRtbChleGFtcGxlLmh0bWwoKSlcbiAgICAgICAga28uYXBwbHlCaW5kaW5ncyh2aWV3LCBlbGVtZW50LmNoaWxkcmVuWzBdKVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIG9uRXJyb3IoZSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBzdWJzLmRpc3Bvc2UoKSlcbiAgICByZXR1cm4ge2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiB0cnVlfVxuICB9XG59XG4iLCJcbmZ1bmN0aW9uIGxvYWRUZW1wbGF0ZXMoKSB7XG4gIHZhciB1cmkgPSBcIi4vYnVpbGQvdGVtcGxhdGVzLmh0bWxcIlxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh1cmkpKVxuICAgIC50aGVuKGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICBpZiAodHlwZW9mIGh0bWwgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlVuYWJsZSB0byBnZXQgdGVtcGxhdGVzOlwiLCBodG1sKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRVM1LTx0ZW1wbGF0ZT4gc2hpbS9wb2x5ZmlsbDpcbiAgICAgICAgLy8gdW5sZXNzICdjb250ZW50JyBvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpXG4gICAgICAgIC8vICAgIyBzZWUgcHZfc2hpbV90ZW1wbGF0ZV90YWcgcmUuIGJyb2tlbi10ZW1wbGF0ZSB0YWdzXG4gICAgICAgIC8vICAgaHRtbCA9IGh0bWwucmVwbGFjZSgvPFxcL3RlbXBsYXRlPi9nLCAnPC9zY3JpcHQ+JylcbiAgICAgICAgLy8gICAgIC5yZXBsYWNlKC88dGVtcGxhdGUvZywgJzxzY3JpcHQgdHlwZT1cInRleHQveC10ZW1wbGF0ZVwiJylcbiAgICAgICAgJChcIjxkaXYgaWQ9J190ZW1wbGF0ZXMnPlwiKVxuICAgICAgICAgIC5hcHBlbmQoaHRtbClcbiAgICAgICAgICAuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSlcbiAgICAgIH1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBvbkFwcGxpY2F0aW9uVXBkYXRlKCkge1xuICBsb2NhdGlvbi5yZWxvYWQoKVxufVxuXG5mdW5jdGlvbiBjaGVja0ZvckFwcGxpY2F0aW9uVXBkYXRlKCkge1xuICB2YXIgYWMgPSBhcHBsaWNhdGlvbkNhY2hlXG4gIGlmIChhYykge1xuICAgIHN3aXRjaCAoYWMuc3RhdHVzKSB7XG4gICAgICBjYXNlIGFjLlVQREFURVJFQURZOlxuICAgICAgICBvbkFwcGxpY2F0aW9uVXBkYXRlKClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgYWMuQ0hFQ0tJTkc6XG4gICAgICBjYXNlIGFjLk9CU09MRVRFOlxuICAgICAgY2FzZSBhYy5ET1dOTE9BRElORzpcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBUaGlzIG5ldmVyIHJlc29sdmVzOyBpdCByZWxvYWRzIHRoZSBwYWdlIHdoZW4gdGhlXG4gICAgICAgICAgLy8gdXBkYXRlIGlzIGNvbXBsZXRlLlxuICAgICAgICAgIHdpbmRvdy4kcm9vdC5ib2R5KFwidXBkYXRpbmctYXBwY2FjaGVcIilcbiAgICAgICAgICB3aW5kb3cuYXBwbGljYXRpb25DYWNoZS5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGVyZWFkeScsIG9uQXBwbGljYXRpb25VcGRhdGUpXG4gICAgICAgIH0pXG4gICAgfVxuICB9XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxufVxuXG5cbmZ1bmN0aW9uIGFwcGx5QmluZGluZ3MoKSB7XG4gIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcbiAgd2luZG93LiRyb290ID0gbmV3IFBhZ2UoKVxuICBrby5wdW5jaGVzLmVuYWJsZUFsbCgpXG4gIGtvLmFwcGx5QmluZGluZ3Mod2luZG93LiRyb290KVxufVxuXG5mdW5jdGlvbiBwYWdlTG9hZGVkKCkge1xuICB3aW5kb3cuJHJvb3QuYm9keShcImludHJvXCIpXG59XG5cblxuZnVuY3Rpb24gc3RhcnQoKSB7XG4gIGxvYWRUZW1wbGF0ZXMoKVxuICAgIC50aGVuKGFwcGx5QmluZGluZ3MpXG4gICAgLnRoZW4oc2V0dXBFdmVudHMpXG4gICAgLnRoZW4oY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAudGhlbihwYWdlTG9hZGVkKVxufVxuXG5cbiQoc3RhcnQpXG5cbi8vIEVuYWJsZSBsaXZlcmVsb2FkIGluIGRldmVsb3BtZW50XG5pZiAod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnbG9jYWxob3N0Jykge1xuICAkLmdldFNjcmlwdChcImh0dHA6Ly9sb2NhbGhvc3Q6MzU3MjkvbGl2ZXJlbG9hZC5qc1wiKVxufVxuIiwiLypnbG9iYWwgc2V0dXBFdmVudHMqL1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwICovXG5cbmZ1bmN0aW9uIGlzTG9jYWwoYW5jaG9yKSB7XG4gIHJldHVybiAobG9jYXRpb24ucHJvdG9jb2wgPT09IGFuY2hvci5wcm90b2NvbCAmJlxuICAgICAgICAgIGxvY2F0aW9uLmhvc3QgPT09IGFuY2hvci5ob3N0KVxufVxuXG5cblxuLy9cbi8vIEZvciBKUyBoaXN0b3J5IHNlZTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZvdGUvSFRNTDUtSGlzdG9yeS1BUElcbi8vXG5mdW5jdGlvbiBvbkFuY2hvckNsaWNrKGV2dCkge1xuICBpZiAoIWlzTG9jYWwodGhpcykpIHsgcmV0dXJuIHRydWUgfVxuICAkcm9vdC5vcGVuKGV2dC50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJykpXG4gIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIHRoaXMuaHJlZilcbiAgZG9jdW1lbnQudGl0bGUgPSBgS25vY2tvdXQuanMg4oCTICR7JCh0aGlzKS50ZXh0KCl9YFxuICByZXR1cm4gZmFsc2Vcbn1cblxuXG5mdW5jdGlvbiBvblBvcFN0YXRlKC8qIGV2dCAqLykge1xuICAvLyBDb25zaWRlciBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4gICRyb290Lm9wZW4obG9jYXRpb24uaGFzaClcbn1cblxuXG5mdW5jdGlvbiBzZXR1cEV2ZW50cygpIHtcbiAgJChkb2N1bWVudC5ib2R5KVxuICAgIC5vbignY2xpY2snLCBcImFcIiwgb25BbmNob3JDbGljaylcblxuICAkKHdpbmRvdylcbiAgICAub24oJ3BvcHN0YXRlJywgb25Qb3BTdGF0ZSlcbn1cbiIsIlxud2luZG93LmxpbmtzID0gW1xuICB7IGhyZWY6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0XCIsXG4gICAgdGl0bGU6IFwiR2l0aHViXCIsXG4gICAgaWNvbjogXCJmYS1naXRodWJcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9yZWxlYXNlcycsXG4gICAgdGl0bGU6IFwiUmVsZWFzZXNcIixcbiAgICBpY29uOiBcImZhLWNlcnRpZmljYXRlXCJ9LFxuICB7IGhyZWY6IFwiaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9mb3J1bS8jIWZvcnVtL2tub2Nrb3V0anNcIixcbiAgICB0aXRsZTogXCJHb29nbGUgR3JvdXBzXCIsXG4gICAgaWNvbjogXCJmYS1nb29nbGVcIn0sXG4gIHsgaHJlZjogXCJodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdGFncy9rbm9ja291dC5qcy9pbmZvXCIsXG4gICAgdGl0bGU6IFwiU3RhY2tPdmVyZmxvd1wiLFxuICAgIGljb246IFwiZmEtc3RhY2stb3ZlcmZsb3dcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0dGVyLmltL2tub2Nrb3V0L2tub2Nrb3V0JyxcbiAgICB0aXRsZTogXCJHaXR0ZXJcIixcbiAgICBpY29uOiBcImZhLWNvbW1lbnRzLW9cIn1cbl1cblxuXG53aW5kb3cuY2RuID0gW1xuICB7IG5hbWU6IFwiTWljcm9zb2Z0XCIsXG4gICAgdmVyc2lvbjogXCIzLjMuMFwiLFxuICAgIG1pbjogXCJodHRwOi8vYWpheC5hc3BuZXRjZG4uY29tL2FqYXgva25vY2tvdXQva25vY2tvdXQtMy4zLjAuanNcIixcbiAgICBkZWJ1ZzogXCJodHRwOi8vYWpheC5hc3BuZXRjZG4uY29tL2FqYXgva25vY2tvdXQva25vY2tvdXQtMy4zLjAuZGVidWcuanNcIlxuICB9LFxuICB7IG5hbWU6IFwiQ2xvdWRGbGFyZVwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtZGVidWcuanNcIixcbiAgICBkZWJ1ZzogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1taW4uanNcIlxuICB9XG5dXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=