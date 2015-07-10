"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Example = (function () {
  function Example() {
    var state = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Example);

    var debounce = { timeout: 500, method: "notifyWhenChangesStop" };
    this.javascript = ko.observable(state.javascript).extend({ rateLimit: debounce });
    this.html = ko.observable(state.html).extend({ rateLimit: debounce });
    this.css = state.css || "";

    this.finalJavascript = ko.pureComputed(this.computeFinalJs, this);
  }

  _createClass(Example, [{
    key: "computeFinalJs",

    // Add ko.applyBindings as needed; return Error where appropriate.
    value: function computeFinalJs() {
      var js = this.javascript();
      if (!js) {
        return new Error("The script is empty.");
      }
      if (js.indexOf("ko.applyBindings(") === -1) {
        if (js.indexOf(" viewModel =") !== -1) {
          // We guess the viewModel name ...
          return js + "\n\n/* Automatically Added */\n          ko.applyBindings(viewModel);";
        } else {
          return new Error("ko.applyBindings(view) is not called");
        }
      }
      return js;
    }
  }]);

  return Example;
})();

Example.stateMap = new Map();

Example.get = function (name) {
  var state = Example.stateMap.get(name);
  if (!state) {
    state = new Example(name);
    Example.stateMap.set(name, state);
  }
  return state;
};

Example.set = function (name, state) {
  var example = Example.stateMap.get(name);
  if (example) {
    example.javascript(state.javascript);
    example.html(state.html);
    return;
  }
  Example.stateMap.set(name, new Example(state));
};
/*globals Example */
/* eslint no-unused-vars: 0, camelcase:0*/

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EXTERNAL_INCLUDES = ["http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.debug.js", "https://rawgit.com/mbest/knockout.punches/v0.5.1/knockout.punches.js"];

var LiveExampleComponent = (function () {
  function LiveExampleComponent(params) {
    _classCallCheck(this, LiveExampleComponent);

    this.example = params.id;
  }

  _createClass(LiveExampleComponent, [{
    key: "openCommonSettings",
    value: function openCommonSettings() {
      var exId = ko.unwrap(this.example);
      var ex = Example.get(exId);
      var dated = new Date().toLocaleString();
      var jsPrefix = "/**\n * Created from an example (" + exId + ") on the Knockout website\n * on " + new Date().toLocaleString() + "\n **/\n\n /* For convenience and consistency we've enabled the ko\n  * punches library for this example.\n  */\n ko.punches.enableAll()\n\n /** Example is as follows **/\n";
      return {
        html: ex.html(),
        js: jsPrefix + ex.finalJavascript(),
        title: "From Knockout example (" + exId + ")",
        description: "Created on " + dated
      };
    }
  }, {
    key: "openFiddle",
    value: function openFiddle(self, evt) {
      // See: http://doc.jsfiddle.net/api/post.html
      evt.preventDefault();
      evt.stopPropagation();
      var fields = ko.utils.extend({
        dtd: "HTML 5",
        wrap: "l",
        resources: EXTERNAL_INCLUDES.join(",")
      }, this.openCommonSettings());
      var form = $("<form action=\"http://jsfiddle.net/api/post/library/pure/\"\n      method=\"POST\" target=\"_blank\">\n      </form>");
      $.each(fields, function (k, v) {
        form.append($("<input type='hidden' name='" + k + "'>").val(v));
      });

      form.submit();
    }
  }, {
    key: "openPen",
    value: function openPen(self, evt) {
      // See: http://blog.codepen.io/documentation/api/prefill/
      evt.preventDefault();
      evt.stopPropagation();
      var opts = ko.utils.extend({
        js_external: EXTERNAL_INCLUDES.join(";")
      }, this.openCommonSettings());
      var dataStr = JSON.stringify(opts).replace(/"/g, "&quot;").replace(/'/g, "&apos;");

      $("<form action=\"http://codepen.io/pen/define\" method=\"POST\" target=\"_blank\">\n      <input type='hidden' name='data' value='" + dataStr + "'/>\n    </form>").submit();
    }
  }]);

  return LiveExampleComponent;
})();

ko.components.register("live-example", {
  viewModel: LiveExampleComponent,
  template: { element: "live-example" }
});
/*global Page, Documentation, marked*/
/*eslint no-unused-vars: 0*/

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = (function () {
  function Page() {
    _classCallCheck(this, Page);

    // Main body template id
    this.body = ko.observable();
    this.title = ko.observable();

    // footer links/cdn
    this.links = window.links;
    this.cdn = window.cdn;

    // plugins
    this.pluginRepos = ko.observableArray();
    this.sortedPluginRepos = this.pluginRepos.filter(this.pluginFilter.bind(this)).sortBy(this.pluginSortBy.bind(this));
    this.pluginMap = new Map();
    this.pluginSort = ko.observable();
    this.pluginsLoaded = ko.observable(false).extend({ rateLimit: 15 });
    this.pluginNeedle = ko.observable().extend({ rateLimit: 200 });

    // documentation
    this.docCatMap = new Map();
    Documentation.all.forEach(function (doc) {
      var docList = this.docCatMap.get(doc.category);
      if (!docList) {
        docList = [];
        this.docCatMap.set(doc.category, docList);
      }
      docList.push(doc);
    }, this);

    this.docCats = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.docCatMap.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var cat = _step.value;

        this.docCats.push(cat);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  _createClass(Page, [{
    key: "open",
    value: function open(pinpoint) {
      var pp = pinpoint.replace("#", "");
      var node = document.getElementById(pp);
      var mdNode, mdNodeId;
      this.title(node.getAttribute("data-title") || "");
      this.body(pp);
      $(window).scrollTop(0);
    }
  }, {
    key: "registerPlugins",
    value: function registerPlugins(plugins) {
      Object.keys(plugins).forEach(function (repo) {
        var about = plugins[repo];
        this.pluginRepos.push(repo);
        this.pluginMap.set(repo, about);
      }, this);
      this.pluginsLoaded(true);
    }
  }, {
    key: "pluginFilter",
    value: function pluginFilter(repo) {
      var about = this.pluginMap.get(repo);
      var needle = (this.pluginNeedle() || "").toLowerCase();
      if (!needle) {
        return true;
      }
      if (repo.toLowerCase().indexOf(needle) >= 0) {
        return true;
      }
      if (!about) {
        return false;
      }
      return (about.description || "").toLowerCase().indexOf(needle) >= 0;
    }
  }, {
    key: "pluginSortBy",
    value: function pluginSortBy(repo, descending) {
      this.pluginsLoaded(); // Create dependency.
      var about = this.pluginMap.get(repo);
      if (about) {
        return descending(about.stargazers_count);
      } else {
        return descending(-1);
      }
    }
  }]);

  return Page;
})();
/* global ace, Example */
/* eslint no-new-func: 0, no-underscore-dangle:0*/

// Save a copy for restoration/use
'use strict';

ko._applyBindings = ko.applyBindings;

var languageThemeMap = {
  html: 'solarized_dark',
  javascript: 'monokai'
};

var readonlyThemeMap = {
  html: 'solarized_light',
  javascript: 'tomorrow'
};

function setupEditor(element, language, exampleName) {
  var example = Example.get(ko.unwrap(exampleName));
  var editor = ace.edit(element);
  editor.$blockScrolling = Infinity; // hides error message
  var session = editor.getSession();
  editor.setTheme('ace/theme/' + languageThemeMap[language]);
  editor.setOptions({
    highlightActiveLine: true,
    useSoftTabs: true,
    tabSize: 2,
    minLines: 3,
    maxLines: 30,
    wrap: true
  });
  session.setMode('ace/mode/' + language);
  editor.on('change', function () {
    example[language](editor.getValue());
  });
  example[language].subscribe(function (v) {
    if (editor.getValue() !== v) {
      editor.setValue(v);
    }
  });
  editor.setValue(example[language]());
  editor.clearSelection();
  ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
    return editor.destroy();
  });
  return editor;
}

//expected-doctype-but-got-end-tag
//expected-doctype-but-got-start-tag
//expected-doctype-but-got-chars

ko.bindingHandlers['edit-js'] = {
  /* highlight: "langauge" */
  init: function init(element, va) {
    setupEditor(element, 'javascript', va());
  }
};

ko.bindingHandlers['edit-html'] = {
  init: function init(element, va) {
    setupEditor(element, 'html', va());
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
      $e.empty().append('<div class=\'example ' + example.css + '\'>');
    }
    resetElement();

    function onError(msg) {
      $(element).html('<div class=\'error\'>Error: ' + msg + '</div>');
    }

    function refresh() {
      var script = example.finalJavascript();
      var html = example.html();

      if (script instanceof Error) {
        onError(script);
        return;
      }

      if (!html) {
        onError('There\'s no HTML to bind to.');
        return;
      }
      // Stub ko.applyBindings
      ko.applyBindings = function (e) {
        // We ignore the `node` argument in favour of the examples' node.
        ko._applyBindings(e, element.children[0]);
      };

      try {
        resetElement();
        $(element.children[0]).html(html);
        new Function('node', script)(element.children[0]);
      } catch (e) {
        onError(e);
      }
      ko.applyBindings = ko._applyBindings;
    }

    ko.computed({
      disposeWhenNodeIsRemoved: element,
      read: refresh
    });

    return { controlsDescendantBindings: true };
  }
};

var emap = {
  '&amp;': '&',
  '&lt;': '<'
};

function unescape(str) {
  return str.replace(/&amp;|&lt;/g, function (ent) {
    return emap[ent];
  });
}

ko.bindingHandlers.highlight = {
  init: function init(element, va) {
    var $e = $(element);
    var language = va();
    if (language !== 'html' && language !== 'javascript') {
      console.error('A language should be specified.', element);
      return;
    }
    var content = unescape($e.text());
    $e.empty();
    var editor = ace.edit(element);
    var session = editor.getSession();
    editor.setTheme('ace/theme/' + readonlyThemeMap[language]);
    editor.setOptions({
      highlightActiveLine: false,
      useSoftTabs: true,
      tabSize: 2,
      minLines: 3,
      wrap: true,
      maxLines: 25,
      readOnly: true
    });
    session.setMode('ace/mode/' + language);
    editor.setValue(content);
    editor.clearSelection();
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      return editor.destroy();
    });
  }
};
// debugger
// editor.session.setOptions({
// // $worker.call('changeOptions', [{
//   'expected-doctype-but-got-chars': false,
//   'expected-doctype-but-got-end-tag': false,
//   'expected-doctype-but-got-start-tag': false
// })
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Documentation = function Documentation(template, title, category, subcategory) {
  _classCallCheck(this, Documentation);

  this.template = template;
  this.title = title;
  this.category = category;
  this.subcategory = subcategory;
};

Documentation.fromNode = function (i, node) {
  return new Documentation(node.getAttribute('id'), node.getAttribute('data-title'), node.getAttribute('data-cat'), node.getAttribute('data-subcat'));
};

Documentation.initialize = function () {
  Documentation.all = $.makeArray($('[data-kind=documentation]').map(Documentation.fromNode));
};
/* global setupEvents, Example, Documentation */

"use strict";

function loadHtml(uri) {
  return Promise.resolve($.ajax(uri)).then(function (html) {
    if (typeof html !== "string") {
      console.error("Unable to get " + uri + ":", html);
    } else {
      // ES5-<template> shim/polyfill:
      // unless 'content' of document.createElement('template')
      //   # see pv_shim_template_tag re. broken-template tags
      //   html = html.replace(/<\/template>/g, '</script>')
      //     .replace(/<template/g, '<script type="text/x-template"')
      $("<div id='templates--" + uri + "'>").append(html).appendTo(document.body);
    }
  });
}

function loadTemplates() {
  return loadHtml("build/templates.html");
}

function loadMarkdown() {
  return loadHtml("build/markdown.html");
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

function getExamples() {
  return Promise.resolve($.ajax({
    url: "build/examples.json",
    dataType: "json"
  })).then(function (results) {
    return Object.keys(results).forEach(function (name) {
      var setting = results[name];
      Example.set(setting.id || name, setting);
    });
  });
}

function getPlugins() {
  return Promise.resolve($.ajax({
    url: "build/plugins.json",
    dataType: "json"
  })).then(function (results) {
    return $root.registerPlugins(results);
  });
}

function applyBindings() {
  ko.punches.enableAll();
  window.$root = new Page();
  ko.punches.enableAll();
  ko.applyBindings(window.$root);
}

function pageLoaded() {
  window.$root.open(location.hash || "#intro");
}

function start() {
  Promise.all([loadTemplates(), loadMarkdown()]).then(function () {
    return Documentation.initialize();
  }).then(applyBindings).then(getExamples).then(getPlugins).then(setupEvents).then(checkForApplicationUpdate).then(pageLoaded)["catch"](function (err) {
    return console.log("Loading:", err);
  });
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
  // Ignore clicks on things outside this page
  if (!isLocal(this)) {
    return true;
  }

  // Ignore clicks on an element in an example.
  if ($(evt.target).parents('live-example').length !== 0) {
    return true;
  }
  // Ignore clicks on links that may have e.g. data-bind=click: ...
  // (e.g. open jsFiddle)
  if (!evt.target.hash) {
    return true;
  }
  try {
    $root.open(evt.target.getAttribute('href'));
  } catch (e) {
    console.log('Error/' + evt.target.getAttribute('href'), e);
  }
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
  title: "Github — Repository",
  icon: "fa-github" }, { href: "https://github.com/knockout/knockout/issues/",
  title: "Github — Issues",
  icon: "fa-exclamation-circle" }, { href: "https://github.com/knockout/knockout/releases",
  title: "Releases",
  icon: "fa-certificate" }, { href: "https://groups.google.com/forum/#!forum/knockoutjs",
  title: "Google Groups",
  icon: "fa-google" }, { href: "http://stackoverflow.com/tags/knockout.js/info",
  title: "StackOverflow",
  icon: "fa-stack-overflow" }, { href: "https://gitter.im/knockout/knockout",
  title: "Gitter",
  icon: "fa-comments-o" }, { href: "legacy/",
  title: "Legacy website",
  icon: "fa fa-history" }];

window.cdn = [{ name: "Microsoft CDN",
  version: "3.3.0",
  min: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.js",
  debug: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.debug.js"
}, { name: "CloudFlare CDN",
  version: "3.3.0",
  min: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-debug.js",
  debug: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js"
}];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4YW1wbGUuanMiLCJMaXZlRXhhbXBsZUNvbXBvbmVudC5qcyIsIlBhZ2UuanMiLCJiaW5kaW5ncy5qcyIsImRvY3MuanMiLCJlbnRyeS5qcyIsImV2ZW50cy5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQUVNLE9BQU87QUFDQSxXQURQLE9BQU8sR0FDYTtRQUFaLEtBQUssZ0NBQUcsRUFBRTs7MEJBRGxCLE9BQU87O0FBRVQsUUFBSSxRQUFRLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxDQUFBO0FBQ2hFLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQzlDLE1BQU0sQ0FBQyxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQ2xDLE1BQU0sQ0FBQyxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUE7O0FBRTFCLFFBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFBO0dBQ2xFOztlQVZHLE9BQU87Ozs7V0FhRywwQkFBRztBQUNmLFVBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtBQUMxQixVQUFJLENBQUMsRUFBRSxFQUFFO0FBQUUsZUFBTyxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO09BQUU7QUFDckQsVUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDMUMsWUFBSSxFQUFF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QUE7Q0FDOUI7Ozs7QUMvQ0QsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUNiLEVBQUUsSUFBSSxFQUFFLHNDQUFzQztBQUM1QyxPQUFLLEVBQUUscUJBQXFCO0FBQzVCLE1BQUksRUFBRSxXQUFXLEVBQUMsRUFDcEIsRUFBRSxJQUFJLEVBQUUsOENBQThDO0FBQ3BELE9BQUssRUFBRSxpQkFBaUI7QUFDeEIsTUFBSSxFQUFFLHVCQUF1QixFQUFDLEVBQ2hDLEVBQUUsSUFBSSxFQUFFLCtDQUErQztBQUNyRCxPQUFLLEVBQUUsVUFBVTtBQUNqQixNQUFJLEVBQUUsZ0JBQWdCLEVBQUMsRUFDekIsRUFBRSxJQUFJLEVBQUUsb0RBQW9EO0FBQzFELE9BQUssRUFBRSxlQUFlO0FBQ3RCLE1BQUksRUFBRSxXQUFXLEVBQUMsRUFDcEIsRUFBRSxJQUFJLEVBQUUsZ0RBQWdEO0FBQ3RELE9BQUssRUFBRSxlQUFlO0FBQ3RCLE1BQUksRUFBRSxtQkFBbUIsRUFBQyxFQUM1QixFQUFFLElBQUksRUFBRSxxQ0FBcUM7QUFDM0MsT0FBSyxFQUFFLFFBQVE7QUFDZixNQUFJLEVBQUUsZUFBZSxFQUFDLEVBQ3hCLEVBQUUsSUFBSSxFQUFFLFNBQVM7QUFDZixPQUFLLEVBQUUsZ0JBQWdCO0FBQ3ZCLE1BQUksRUFBRSxlQUFlLEVBQUMsQ0FDekIsQ0FBQTs7QUFHRCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQ1gsRUFBRSxJQUFJLEVBQUUsZUFBZTtBQUNyQixTQUFPLEVBQUUsT0FBTztBQUNoQixLQUFHLEVBQUUsMkRBQTJEO0FBQ2hFLE9BQUssRUFBRSxpRUFBaUU7Q0FDekUsRUFDRCxFQUFFLElBQUksRUFBRSxnQkFBZ0I7QUFDdEIsU0FBTyxFQUFFLE9BQU87QUFDaEIsS0FBRyxFQUFFLHlFQUF5RTtBQUM5RSxPQUFLLEVBQUUsdUVBQXVFO0NBQy9FLENBQ0YsQ0FBQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuY2xhc3MgRXhhbXBsZSB7XG4gIGNvbnN0cnVjdG9yKHN0YXRlID0ge30pIHtcbiAgICB2YXIgZGVib3VuY2UgPSB7IHRpbWVvdXQ6IDUwMCwgbWV0aG9kOiBcIm5vdGlmeVdoZW5DaGFuZ2VzU3RvcFwiIH1cbiAgICB0aGlzLmphdmFzY3JpcHQgPSBrby5vYnNlcnZhYmxlKHN0YXRlLmphdmFzY3JpcHQpXG4gICAgICAuZXh0ZW5kKHtyYXRlTGltaXQ6IGRlYm91bmNlfSlcbiAgICB0aGlzLmh0bWwgPSBrby5vYnNlcnZhYmxlKHN0YXRlLmh0bWwpXG4gICAgICAuZXh0ZW5kKHtyYXRlTGltaXQ6IGRlYm91bmNlfSlcbiAgICB0aGlzLmNzcyA9IHN0YXRlLmNzcyB8fCAnJ1xuXG4gICAgdGhpcy5maW5hbEphdmFzY3JpcHQgPSBrby5wdXJlQ29tcHV0ZWQodGhpcy5jb21wdXRlRmluYWxKcywgdGhpcylcbiAgfVxuXG4gIC8vIEFkZCBrby5hcHBseUJpbmRpbmdzIGFzIG5lZWRlZDsgcmV0dXJuIEVycm9yIHdoZXJlIGFwcHJvcHJpYXRlLlxuICBjb21wdXRlRmluYWxKcygpIHtcbiAgICB2YXIganMgPSB0aGlzLmphdmFzY3JpcHQoKVxuICAgIGlmICghanMpIHsgcmV0dXJuIG5ldyBFcnJvcihcIlRoZSBzY3JpcHQgaXMgZW1wdHkuXCIpIH1cbiAgICBpZiAoanMuaW5kZXhPZigna28uYXBwbHlCaW5kaW5ncygnKSA9PT0gLTEpIHtcbiAgICAgIGlmIChqcy5pbmRleE9mKCcgdmlld01vZGVsID0nKSAhPT0gLTEpIHtcbiAgICAgICAgLy8gV2UgZ3Vlc3MgdGhlIHZpZXdNb2RlbCBuYW1lIC4uLlxuICAgICAgICByZXR1cm4gYCR7anN9XFxuXFxuLyogQXV0b21hdGljYWxseSBBZGRlZCAqL1xuICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3Modmlld01vZGVsKTtgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKFwia28uYXBwbHlCaW5kaW5ncyh2aWV3KSBpcyBub3QgY2FsbGVkXCIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBqc1xuICB9XG59XG5cbkV4YW1wbGUuc3RhdGVNYXAgPSBuZXcgTWFwKClcblxuRXhhbXBsZS5nZXQgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgc3RhdGUgPSBFeGFtcGxlLnN0YXRlTWFwLmdldChuYW1lKVxuICBpZiAoIXN0YXRlKSB7XG4gICAgc3RhdGUgPSBuZXcgRXhhbXBsZShuYW1lKVxuICAgIEV4YW1wbGUuc3RhdGVNYXAuc2V0KG5hbWUsIHN0YXRlKVxuICB9XG4gIHJldHVybiBzdGF0ZVxufVxuXG5cbkV4YW1wbGUuc2V0ID0gZnVuY3Rpb24gKG5hbWUsIHN0YXRlKSB7XG4gIHZhciBleGFtcGxlID0gRXhhbXBsZS5zdGF0ZU1hcC5nZXQobmFtZSlcbiAgaWYgKGV4YW1wbGUpIHtcbiAgICBleGFtcGxlLmphdmFzY3JpcHQoc3RhdGUuamF2YXNjcmlwdClcbiAgICBleGFtcGxlLmh0bWwoc3RhdGUuaHRtbClcbiAgICByZXR1cm5cbiAgfVxuICBFeGFtcGxlLnN0YXRlTWFwLnNldChuYW1lLCBuZXcgRXhhbXBsZShzdGF0ZSkpXG59XG4iLCIvKmdsb2JhbHMgRXhhbXBsZSAqL1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwLCBjYW1lbGNhc2U6MCovXG5cbnZhciBFWFRFUk5BTF9JTkNMVURFUyA9IFtcbiAgXCJodHRwOi8vYWpheC5hc3BuZXRjZG4uY29tL2FqYXgva25vY2tvdXQva25vY2tvdXQtMy4zLjAuZGVidWcuanNcIixcbiAgXCJodHRwczovL3Jhd2dpdC5jb20vbWJlc3Qva25vY2tvdXQucHVuY2hlcy92MC41LjEva25vY2tvdXQucHVuY2hlcy5qc1wiXG5dXG5cbmNsYXNzIExpdmVFeGFtcGxlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgdGhpcy5leGFtcGxlID0gcGFyYW1zLmlkXG4gIH1cblxuICBvcGVuQ29tbW9uU2V0dGluZ3MoKSB7XG4gICAgdmFyIGV4SWQgPSBrby51bndyYXAodGhpcy5leGFtcGxlKVxuICAgIHZhciBleCA9IEV4YW1wbGUuZ2V0KGV4SWQpXG4gICAgdmFyIGRhdGVkID0gbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpXG4gICAgdmFyIGpzUHJlZml4ID0gYC8qKlxuICogQ3JlYXRlZCBmcm9tIGFuIGV4YW1wbGUgKCR7ZXhJZH0pIG9uIHRoZSBLbm9ja291dCB3ZWJzaXRlXG4gKiBvbiAke25ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKX1cbiAqKi9cblxuIC8qIEZvciBjb252ZW5pZW5jZSBhbmQgY29uc2lzdGVuY3kgd2UndmUgZW5hYmxlZCB0aGUga29cbiAgKiBwdW5jaGVzIGxpYnJhcnkgZm9yIHRoaXMgZXhhbXBsZS5cbiAgKi9cbiBrby5wdW5jaGVzLmVuYWJsZUFsbCgpXG5cbiAvKiogRXhhbXBsZSBpcyBhcyBmb2xsb3dzICoqL1xuYFxuICAgIHJldHVybiB7XG4gICAgICBodG1sOiBleC5odG1sKCksXG4gICAgICBqczoganNQcmVmaXggKyBleC5maW5hbEphdmFzY3JpcHQoKSxcbiAgICAgIHRpdGxlOiBgRnJvbSBLbm9ja291dCBleGFtcGxlICgke2V4SWR9KWAsXG4gICAgICBkZXNjcmlwdGlvbjogYENyZWF0ZWQgb24gJHtkYXRlZH1gXG4gICAgfVxuICB9XG5cbiAgb3BlbkZpZGRsZShzZWxmLCBldnQpIHtcbiAgICAvLyBTZWU6IGh0dHA6Ly9kb2MuanNmaWRkbGUubmV0L2FwaS9wb3N0Lmh0bWxcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZhciBmaWVsZHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAgZHRkOiBcIkhUTUwgNVwiLFxuICAgICAgd3JhcDogJ2wnLFxuICAgICAgcmVzb3VyY2VzOiBFWFRFUk5BTF9JTkNMVURFUy5qb2luKFwiLFwiKVxuICAgIH0sIHRoaXMub3BlbkNvbW1vblNldHRpbmdzKCkpXG4gICAgdmFyIGZvcm0gPSAkKGA8Zm9ybSBhY3Rpb249XCJodHRwOi8vanNmaWRkbGUubmV0L2FwaS9wb3N0L2xpYnJhcnkvcHVyZS9cIlxuICAgICAgbWV0aG9kPVwiUE9TVFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgPC9mb3JtPmApXG4gICAgJC5lYWNoKGZpZWxkcywgZnVuY3Rpb24oaywgdikge1xuICAgICAgZm9ybS5hcHBlbmQoXG4gICAgICAgICQoYDxpbnB1dCB0eXBlPSdoaWRkZW4nIG5hbWU9JyR7a30nPmApLnZhbCh2KVxuICAgICAgKVxuICAgIH0pXG5cbiAgICBmb3JtLnN1Ym1pdCgpXG4gIH1cblxuICBvcGVuUGVuKHNlbGYsIGV2dCkge1xuICAgIC8vIFNlZTogaHR0cDovL2Jsb2cuY29kZXBlbi5pby9kb2N1bWVudGF0aW9uL2FwaS9wcmVmaWxsL1xuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdmFyIG9wdHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAganNfZXh0ZXJuYWw6IEVYVEVSTkFMX0lOQ0xVREVTLmpvaW4oXCI7XCIpXG4gICAgfSwgdGhpcy5vcGVuQ29tbW9uU2V0dGluZ3MoKSlcbiAgICB2YXIgZGF0YVN0ciA9IEpTT04uc3RyaW5naWZ5KG9wdHMpXG4gICAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAgIC5yZXBsYWNlKC8nL2csIFwiJmFwb3M7XCIpXG5cbiAgICAkKGA8Zm9ybSBhY3Rpb249XCJodHRwOi8vY29kZXBlbi5pby9wZW4vZGVmaW5lXCIgbWV0aG9kPVwiUE9TVFwiIHRhcmdldD1cIl9ibGFua1wiPlxuICAgICAgPGlucHV0IHR5cGU9J2hpZGRlbicgbmFtZT0nZGF0YScgdmFsdWU9JyR7ZGF0YVN0cn0nLz5cbiAgICA8L2Zvcm0+YCkuc3VibWl0KClcbiAgfVxufVxuXG5rby5jb21wb25lbnRzLnJlZ2lzdGVyKCdsaXZlLWV4YW1wbGUnLCB7XG4gICAgdmlld01vZGVsOiBMaXZlRXhhbXBsZUNvbXBvbmVudCxcbiAgICB0ZW1wbGF0ZToge2VsZW1lbnQ6IFwibGl2ZS1leGFtcGxlXCJ9XG59KVxuIiwiLypnbG9iYWwgUGFnZSwgRG9jdW1lbnRhdGlvbiwgbWFya2VkKi9cbi8qZXNsaW50IG5vLXVudXNlZC12YXJzOiAwKi9cblxuXG5jbGFzcyBQYWdlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLy8gTWFpbiBib2R5IHRlbXBsYXRlIGlkXG4gICAgdGhpcy5ib2R5ID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy50aXRsZSA9IGtvLm9ic2VydmFibGUoKVxuXG4gICAgLy8gZm9vdGVyIGxpbmtzL2NkblxuICAgIHRoaXMubGlua3MgPSB3aW5kb3cubGlua3NcbiAgICB0aGlzLmNkbiA9IHdpbmRvdy5jZG5cblxuICAgIC8vIHBsdWdpbnNcbiAgICB0aGlzLnBsdWdpblJlcG9zID0ga28ub2JzZXJ2YWJsZUFycmF5KClcbiAgICB0aGlzLnNvcnRlZFBsdWdpblJlcG9zID0gdGhpcy5wbHVnaW5SZXBvc1xuICAgICAgLmZpbHRlcih0aGlzLnBsdWdpbkZpbHRlci5iaW5kKHRoaXMpKVxuICAgICAgLnNvcnRCeSh0aGlzLnBsdWdpblNvcnRCeS5iaW5kKHRoaXMpKVxuICAgIHRoaXMucGx1Z2luTWFwID0gbmV3IE1hcCgpXG4gICAgdGhpcy5wbHVnaW5Tb3J0ID0ga28ub2JzZXJ2YWJsZSgpXG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSkuZXh0ZW5kKHtyYXRlTGltaXQ6IDE1fSlcbiAgICB0aGlzLnBsdWdpbk5lZWRsZSA9IGtvLm9ic2VydmFibGUoKS5leHRlbmQoe3JhdGVMaW1pdDogMjAwfSlcblxuICAgIC8vIGRvY3VtZW50YXRpb25cbiAgICB0aGlzLmRvY0NhdE1hcCA9IG5ldyBNYXAoKVxuICAgIERvY3VtZW50YXRpb24uYWxsLmZvckVhY2goZnVuY3Rpb24gKGRvYykge1xuICAgICAgdmFyIGRvY0xpc3QgPSB0aGlzLmRvY0NhdE1hcC5nZXQoZG9jLmNhdGVnb3J5KVxuICAgICAgaWYgKCFkb2NMaXN0KSB7XG4gICAgICAgIGRvY0xpc3QgPSBbXVxuICAgICAgICB0aGlzLmRvY0NhdE1hcC5zZXQoZG9jLmNhdGVnb3J5LCBkb2NMaXN0KVxuICAgICAgfVxuICAgICAgZG9jTGlzdC5wdXNoKGRvYylcbiAgICB9LCB0aGlzKVxuXG4gICAgdGhpcy5kb2NDYXRzID0gW11cbiAgICBmb3IgKHZhciBjYXQgb2YgdGhpcy5kb2NDYXRNYXAua2V5cygpKSB7XG4gICAgICB0aGlzLmRvY0NhdHMucHVzaChjYXQpXG4gICAgfVxuICB9XG5cbiAgb3BlbihwaW5wb2ludCkge1xuICAgIHZhciBwcCA9IHBpbnBvaW50LnJlcGxhY2UoXCIjXCIsIFwiXCIpXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcClcbiAgICB2YXIgbWROb2RlLCBtZE5vZGVJZFxuICAgIHRoaXMudGl0bGUobm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSB8fCAnJylcbiAgICB0aGlzLmJvZHkocHApXG4gICAgJCh3aW5kb3cpLnNjcm9sbFRvcCgwKVxuICB9XG5cbiAgcmVnaXN0ZXJQbHVnaW5zKHBsdWdpbnMpIHtcbiAgICBPYmplY3Qua2V5cyhwbHVnaW5zKS5mb3JFYWNoKGZ1bmN0aW9uIChyZXBvKSB7XG4gICAgICB2YXIgYWJvdXQgPSBwbHVnaW5zW3JlcG9dXG4gICAgICB0aGlzLnBsdWdpblJlcG9zLnB1c2gocmVwbylcbiAgICAgIHRoaXMucGx1Z2luTWFwLnNldChyZXBvLCBhYm91dClcbiAgICB9LCB0aGlzKVxuICAgIHRoaXMucGx1Z2luc0xvYWRlZCh0cnVlKVxuICB9XG5cbiAgcGx1Z2luRmlsdGVyKHJlcG8pIHtcbiAgICB2YXIgYWJvdXQgPSB0aGlzLnBsdWdpbk1hcC5nZXQocmVwbylcbiAgICB2YXIgbmVlZGxlID0gKHRoaXMucGx1Z2luTmVlZGxlKCkgfHwgJycpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoIW5lZWRsZSkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKHJlcG8udG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZSkgPj0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKCFhYm91dCkgeyByZXR1cm4gZmFsc2UgfVxuICAgIHJldHVybiAoYWJvdXQuZGVzY3JpcHRpb24gfHwgJycpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDBcbiAgfVxuXG4gIHBsdWdpblNvcnRCeShyZXBvLCBkZXNjZW5kaW5nKSB7XG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkKCkgLy8gQ3JlYXRlIGRlcGVuZGVuY3kuXG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgaWYgKGFib3V0KSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZyhhYm91dC5zdGFyZ2F6ZXJzX2NvdW50KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZygtMSlcbiAgICB9XG4gIH1cbn1cbiIsIi8qIGdsb2JhbCBhY2UsIEV4YW1wbGUgKi9cbi8qIGVzbGludCBuby1uZXctZnVuYzogMCwgbm8tdW5kZXJzY29yZS1kYW5nbGU6MCovXG5cbi8vIFNhdmUgYSBjb3B5IGZvciByZXN0b3JhdGlvbi91c2VcbmtvLl9hcHBseUJpbmRpbmdzID0ga28uYXBwbHlCaW5kaW5nc1xuXG52YXIgbGFuZ3VhZ2VUaGVtZU1hcCA9IHtcbiAgaHRtbDogJ3NvbGFyaXplZF9kYXJrJyxcbiAgamF2YXNjcmlwdDogJ21vbm9rYWknXG59XG5cbnZhciByZWFkb25seVRoZW1lTWFwID0ge1xuICBodG1sOiBcInNvbGFyaXplZF9saWdodFwiLFxuICBqYXZhc2NyaXB0OiBcInRvbW9ycm93XCJcbn1cblxuZnVuY3Rpb24gc2V0dXBFZGl0b3IoZWxlbWVudCwgbGFuZ3VhZ2UsIGV4YW1wbGVOYW1lKSB7XG4gIHZhciBleGFtcGxlID0gRXhhbXBsZS5nZXQoa28udW53cmFwKGV4YW1wbGVOYW1lKSlcbiAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnQpXG4gIGVkaXRvci4kYmxvY2tTY3JvbGxpbmcgPSBJbmZpbml0eSAvLyBoaWRlcyBlcnJvciBtZXNzYWdlXG4gIHZhciBzZXNzaW9uID0gZWRpdG9yLmdldFNlc3Npb24oKVxuICBlZGl0b3Iuc2V0VGhlbWUoYGFjZS90aGVtZS8ke2xhbmd1YWdlVGhlbWVNYXBbbGFuZ3VhZ2VdfWApXG4gIGVkaXRvci5zZXRPcHRpb25zKHtcbiAgICBoaWdobGlnaHRBY3RpdmVMaW5lOiB0cnVlLFxuICAgIHVzZVNvZnRUYWJzOiB0cnVlLFxuICAgIHRhYlNpemU6IDIsXG4gICAgbWluTGluZXM6IDMsXG4gICAgbWF4TGluZXM6IDMwLFxuICAgIHdyYXA6IHRydWVcbiAgfSlcbiAgc2Vzc2lvbi5zZXRNb2RlKGBhY2UvbW9kZS8ke2xhbmd1YWdlfWApXG4gIGVkaXRvci5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkgeyBleGFtcGxlW2xhbmd1YWdlXShlZGl0b3IuZ2V0VmFsdWUoKSkgfSlcbiAgZXhhbXBsZVtsYW5ndWFnZV0uc3Vic2NyaWJlKGZ1bmN0aW9uICh2KSB7XG4gICAgaWYgKGVkaXRvci5nZXRWYWx1ZSgpICE9PSB2KSB7XG4gICAgICBlZGl0b3Iuc2V0VmFsdWUodilcbiAgICB9XG4gIH0pXG4gIGVkaXRvci5zZXRWYWx1ZShleGFtcGxlW2xhbmd1YWdlXSgpKVxuICBlZGl0b3IuY2xlYXJTZWxlY3Rpb24oKVxuICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsICgpID0+IGVkaXRvci5kZXN0cm95KCkpXG4gIHJldHVybiBlZGl0b3Jcbn1cblxuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtZW5kLXRhZ1xuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3Qtc3RhcnQtdGFnXG4vL2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1jaGFyc1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VkaXQtanMnXSA9IHtcbiAgLyogaGlnaGxpZ2h0OiBcImxhbmdhdWdlXCIgKi9cbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgc2V0dXBFZGl0b3IoZWxlbWVudCwgJ2phdmFzY3JpcHQnLCB2YSgpKVxuICB9XG59XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZWRpdC1odG1sJ10gPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHNldHVwRWRpdG9yKGVsZW1lbnQsICdodG1sJywgdmEoKSlcbiAgICAvLyBkZWJ1Z2dlclxuICAgIC8vIGVkaXRvci5zZXNzaW9uLnNldE9wdGlvbnMoe1xuICAgIC8vIC8vICR3b3JrZXIuY2FsbCgnY2hhbmdlT3B0aW9ucycsIFt7XG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWNoYXJzJzogZmFsc2UsXG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWcnOiBmYWxzZSxcbiAgICAvLyAgICdleHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3Qtc3RhcnQtdGFnJzogZmFsc2VcbiAgICAvLyB9KVxuICB9XG59XG5cblxua28uYmluZGluZ0hhbmRsZXJzLnJlc3VsdCA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgdmFyICRlID0gJChlbGVtZW50KVxuICAgIHZhciBleGFtcGxlID0gRXhhbXBsZS5nZXQoa28udW53cmFwKHZhKCkpKVxuXG4gICAgZnVuY3Rpb24gcmVzZXRFbGVtZW50KCkge1xuICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW5bMF0pIHtcbiAgICAgICAga28uY2xlYW5Ob2RlKGVsZW1lbnQuY2hpbGRyZW5bMF0pXG4gICAgICB9XG4gICAgICAkZS5lbXB0eSgpLmFwcGVuZChgPGRpdiBjbGFzcz0nZXhhbXBsZSAke2V4YW1wbGUuY3NzfSc+YClcbiAgICB9XG4gICAgcmVzZXRFbGVtZW50KClcblxuICAgIGZ1bmN0aW9uIG9uRXJyb3IobXNnKSB7XG4gICAgICAkKGVsZW1lbnQpXG4gICAgICAgIC5odG1sKGA8ZGl2IGNsYXNzPSdlcnJvcic+RXJyb3I6ICR7bXNnfTwvZGl2PmApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICAgIHZhciBzY3JpcHQgPSBleGFtcGxlLmZpbmFsSmF2YXNjcmlwdCgpXG4gICAgICB2YXIgaHRtbCA9IGV4YW1wbGUuaHRtbCgpXG5cbiAgICAgIGlmIChzY3JpcHQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBvbkVycm9yKHNjcmlwdClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICghaHRtbCkge1xuICAgICAgICBvbkVycm9yKFwiVGhlcmUncyBubyBIVE1MIHRvIGJpbmQgdG8uXCIpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gU3R1YiBrby5hcHBseUJpbmRpbmdzXG4gICAgICBrby5hcHBseUJpbmRpbmdzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gV2UgaWdub3JlIHRoZSBgbm9kZWAgYXJndW1lbnQgaW4gZmF2b3VyIG9mIHRoZSBleGFtcGxlcycgbm9kZS5cbiAgICAgICAga28uX2FwcGx5QmluZGluZ3MoZSwgZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzZXRFbGVtZW50KClcbiAgICAgICAgJChlbGVtZW50LmNoaWxkcmVuWzBdKS5odG1sKGh0bWwpXG4gICAgICAgIG5ldyBGdW5jdGlvbignbm9kZScsIHNjcmlwdCkoZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBvbkVycm9yKGUpXG4gICAgICB9XG4gICAgICBrby5hcHBseUJpbmRpbmdzID0ga28uX2FwcGx5QmluZGluZ3NcbiAgICB9XG5cbiAgICBrby5jb21wdXRlZCh7XG4gICAgICBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQsXG4gICAgICByZWFkOiByZWZyZXNoXG4gICAgfSlcblxuICAgIHJldHVybiB7Y29udHJvbHNEZXNjZW5kYW50QmluZGluZ3M6IHRydWV9XG4gIH1cbn1cblxudmFyIGVtYXAgPSB7XG4gICcmYW1wOyc6ICcmJyxcbiAgJyZsdDsnOiAnPCdcbn1cblxuZnVuY3Rpb24gdW5lc2NhcGUoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShcbiAgICAvJmFtcDt8Jmx0Oy9nLFxuICAgIGZ1bmN0aW9uIChlbnQpIHsgcmV0dXJuIGVtYXBbZW50XX1cbiAgKVxufVxuXG5cbmtvLmJpbmRpbmdIYW5kbGVycy5oaWdobGlnaHQgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciAkZSA9ICQoZWxlbWVudClcbiAgICB2YXIgbGFuZ3VhZ2UgPSB2YSgpXG4gICAgaWYgKGxhbmd1YWdlICE9PSAnaHRtbCcgJiYgbGFuZ3VhZ2UgIT09ICdqYXZhc2NyaXB0Jykge1xuICAgICAgY29uc29sZS5lcnJvcihcIkEgbGFuZ3VhZ2Ugc2hvdWxkIGJlIHNwZWNpZmllZC5cIiwgZWxlbWVudClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgY29udGVudCA9IHVuZXNjYXBlKCRlLnRleHQoKSlcbiAgICAkZS5lbXB0eSgpXG4gICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnQpXG4gICAgdmFyIHNlc3Npb24gPSBlZGl0b3IuZ2V0U2Vzc2lvbigpXG4gICAgZWRpdG9yLnNldFRoZW1lKGBhY2UvdGhlbWUvJHtyZWFkb25seVRoZW1lTWFwW2xhbmd1YWdlXX1gKVxuICAgIGVkaXRvci5zZXRPcHRpb25zKHtcbiAgICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmU6IGZhbHNlLFxuICAgICAgdXNlU29mdFRhYnM6IHRydWUsXG4gICAgICB0YWJTaXplOiAyLFxuICAgICAgbWluTGluZXM6IDMsXG4gICAgICB3cmFwOiB0cnVlLFxuICAgICAgbWF4TGluZXM6IDI1LFxuICAgICAgcmVhZE9ubHk6IHRydWVcbiAgICB9KVxuICAgIHNlc3Npb24uc2V0TW9kZShgYWNlL21vZGUvJHtsYW5ndWFnZX1gKVxuICAgIGVkaXRvci5zZXRWYWx1ZShjb250ZW50KVxuICAgIGVkaXRvci5jbGVhclNlbGVjdGlvbigpXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICB9XG59XG4iLCJcbmNsYXNzIERvY3VtZW50YXRpb24ge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgdGl0bGUsIGNhdGVnb3J5LCBzdWJjYXRlZ29yeSkge1xuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVxuICAgIHRoaXMudGl0bGUgPSB0aXRsZVxuICAgIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeVxuICAgIHRoaXMuc3ViY2F0ZWdvcnkgPSBzdWJjYXRlZ29yeVxuICB9XG59XG5cbkRvY3VtZW50YXRpb24uZnJvbU5vZGUgPSBmdW5jdGlvbiAoaSwgbm9kZSkge1xuICByZXR1cm4gbmV3IERvY3VtZW50YXRpb24oXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1jYXQnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWJjYXQnKVxuICApXG59XG5cbkRvY3VtZW50YXRpb24uaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgRG9jdW1lbnRhdGlvbi5hbGwgPSAkLm1ha2VBcnJheShcbiAgICAkKFwiW2RhdGEta2luZD1kb2N1bWVudGF0aW9uXVwiKS5tYXAoRG9jdW1lbnRhdGlvbi5mcm9tTm9kZSlcbiAgKVxufVxuIiwiLyogZ2xvYmFsIHNldHVwRXZlbnRzLCBFeGFtcGxlLCBEb2N1bWVudGF0aW9uICovXG5cbmZ1bmN0aW9uIGxvYWRIdG1sKHVyaSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh1cmkpKVxuICAgIC50aGVuKGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICBpZiAodHlwZW9mIGh0bWwgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgVW5hYmxlIHRvIGdldCAke3VyaX06YCwgaHRtbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEVTNS08dGVtcGxhdGU+IHNoaW0vcG9seWZpbGw6XG4gICAgICAgIC8vIHVubGVzcyAnY29udGVudCcgb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKVxuICAgICAgICAvLyAgICMgc2VlIHB2X3NoaW1fdGVtcGxhdGVfdGFnIHJlLiBicm9rZW4tdGVtcGxhdGUgdGFnc1xuICAgICAgICAvLyAgIGh0bWwgPSBodG1sLnJlcGxhY2UoLzxcXC90ZW1wbGF0ZT4vZywgJzwvc2NyaXB0PicpXG4gICAgICAgIC8vICAgICAucmVwbGFjZSgvPHRlbXBsYXRlL2csICc8c2NyaXB0IHR5cGU9XCJ0ZXh0L3gtdGVtcGxhdGVcIicpXG4gICAgICAgICQoYDxkaXYgaWQ9J3RlbXBsYXRlcy0tJHt1cml9Jz5gKVxuICAgICAgICAgIC5hcHBlbmQoaHRtbClcbiAgICAgICAgICAuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSlcbiAgICAgIH1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBsb2FkVGVtcGxhdGVzKCkge1xuICByZXR1cm4gbG9hZEh0bWwoJ2J1aWxkL3RlbXBsYXRlcy5odG1sJylcbn1cblxuZnVuY3Rpb24gbG9hZE1hcmtkb3duKCkge1xuICByZXR1cm4gbG9hZEh0bWwoXCJidWlsZC9tYXJrZG93bi5odG1sXCIpXG59XG5cbmZ1bmN0aW9uIG9uQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIGxvY2F0aW9uLnJlbG9hZCgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIHZhciBhYyA9IGFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKGFjKSB7XG4gICAgc3dpdGNoIChhYy5zdGF0dXMpIHtcbiAgICAgIGNhc2UgYWMuVVBEQVRFUkVBRFk6XG4gICAgICAgIG9uQXBwbGljYXRpb25VcGRhdGUoKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBhYy5DSEVDS0lORzpcbiAgICAgIGNhc2UgYWMuT0JTT0xFVEU6XG4gICAgICBjYXNlIGFjLkRPV05MT0FESU5HOlxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIFRoaXMgbmV2ZXIgcmVzb2x2ZXM7IGl0IHJlbG9hZHMgdGhlIHBhZ2Ugd2hlbiB0aGVcbiAgICAgICAgICAvLyB1cGRhdGUgaXMgY29tcGxldGUuXG4gICAgICAgICAgd2luZG93LiRyb290LmJvZHkoXCJ1cGRhdGluZy1hcHBjYWNoZVwiKVxuICAgICAgICAgIHdpbmRvdy5hcHBsaWNhdGlvbkNhY2hlLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZXJlYWR5Jywgb25BcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAgICAgfSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG59XG5cblxuZnVuY3Rpb24gZ2V0RXhhbXBsZXMoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9leGFtcGxlcy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PlxuICAgIE9iamVjdC5rZXlzKHJlc3VsdHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBzZXR0aW5nID0gcmVzdWx0c1tuYW1lXVxuICAgICAgRXhhbXBsZS5zZXQoc2V0dGluZy5pZCB8fCBuYW1lLCBzZXR0aW5nKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBnZXRQbHVnaW5zKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvcGx1Z2lucy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlclBsdWdpbnMocmVzdWx0cykpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcbiAga28uYXBwbHlCaW5kaW5ncyh3aW5kb3cuJHJvb3QpXG59XG5cblxuZnVuY3Rpb24gcGFnZUxvYWRlZCgpIHtcbiAgd2luZG93LiRyb290Lm9wZW4obG9jYXRpb24uaGFzaCB8fCBcIiNpbnRyb1wiKVxufVxuXG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBQcm9taXNlLmFsbChbbG9hZFRlbXBsYXRlcygpLCBsb2FkTWFya2Rvd24oKV0pXG4gICAgLnRoZW4oKCkgPT4gRG9jdW1lbnRhdGlvbi5pbml0aWFsaXplKCkpXG4gICAgLnRoZW4oYXBwbHlCaW5kaW5ncylcbiAgICAudGhlbihnZXRFeGFtcGxlcylcbiAgICAudGhlbihnZXRQbHVnaW5zKVxuICAgIC50aGVuKHNldHVwRXZlbnRzKVxuICAgIC50aGVuKGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUpXG4gICAgLnRoZW4ocGFnZUxvYWRlZClcbiAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5sb2coXCJMb2FkaW5nOlwiLCBlcnIpKVxufVxuXG5cbiQoc3RhcnQpXG5cbi8vIEVuYWJsZSBsaXZlcmVsb2FkIGluIGRldmVsb3BtZW50XG5pZiAod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnbG9jYWxob3N0Jykge1xuICAkLmdldFNjcmlwdChcImh0dHA6Ly9sb2NhbGhvc3Q6MzU3MjkvbGl2ZXJlbG9hZC5qc1wiKVxufVxuIiwiLypnbG9iYWwgc2V0dXBFdmVudHMqL1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwICovXG5cbmZ1bmN0aW9uIGlzTG9jYWwoYW5jaG9yKSB7XG4gIHJldHVybiAobG9jYXRpb24ucHJvdG9jb2wgPT09IGFuY2hvci5wcm90b2NvbCAmJlxuICAgICAgICAgIGxvY2F0aW9uLmhvc3QgPT09IGFuY2hvci5ob3N0KVxufVxuXG5cblxuLy9cbi8vIEZvciBKUyBoaXN0b3J5IHNlZTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZvdGUvSFRNTDUtSGlzdG9yeS1BUElcbi8vXG5mdW5jdGlvbiBvbkFuY2hvckNsaWNrKGV2dCkge1xuICAvLyBJZ25vcmUgY2xpY2tzIG9uIHRoaW5ncyBvdXRzaWRlIHRoaXMgcGFnZVxuICBpZiAoIWlzTG9jYWwodGhpcykpIHsgcmV0dXJuIHRydWUgfVxuXG4gIC8vIElnbm9yZSBjbGlja3Mgb24gYW4gZWxlbWVudCBpbiBhbiBleGFtcGxlLlxuICBpZiAoJChldnQudGFyZ2V0KS5wYXJlbnRzKFwibGl2ZS1leGFtcGxlXCIpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgLy8gSWdub3JlIGNsaWNrcyBvbiBsaW5rcyB0aGF0IG1heSBoYXZlIGUuZy4gZGF0YS1iaW5kPWNsaWNrOiAuLi5cbiAgLy8gKGUuZy4gb3BlbiBqc0ZpZGRsZSlcbiAgaWYgKCFldnQudGFyZ2V0Lmhhc2gpIHsgcmV0dXJuIHRydWUgfVxuICB0cnkge1xuICAgICRyb290Lm9wZW4oZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSlcbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coYEVycm9yLyR7ZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gLCBlKVxuICB9XG4gIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIHRoaXMuaHJlZilcbiAgZG9jdW1lbnQudGl0bGUgPSBgS25vY2tvdXQuanMg4oCTICR7JCh0aGlzKS50ZXh0KCl9YFxuICByZXR1cm4gZmFsc2Vcbn1cblxuXG5mdW5jdGlvbiBvblBvcFN0YXRlKC8qIGV2dCAqLykge1xuICAvLyBDb25zaWRlciBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4gICRyb290Lm9wZW4obG9jYXRpb24uaGFzaClcbn1cblxuXG5mdW5jdGlvbiBzZXR1cEV2ZW50cygpIHtcbiAgJChkb2N1bWVudC5ib2R5KVxuICAgIC5vbignY2xpY2snLCBcImFcIiwgb25BbmNob3JDbGljaylcblxuICAkKHdpbmRvdylcbiAgICAub24oJ3BvcHN0YXRlJywgb25Qb3BTdGF0ZSlcbn1cbiIsIlxud2luZG93LmxpbmtzID0gW1xuICB7IGhyZWY6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0XCIsXG4gICAgdGl0bGU6IFwiR2l0aHViIOKAlCBSZXBvc2l0b3J5XCIsXG4gICAgaWNvbjogXCJmYS1naXRodWJcIn0sXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvaXNzdWVzL1wiLFxuICAgIHRpdGxlOiBcIkdpdGh1YiDigJQgSXNzdWVzXCIsXG4gICAgaWNvbjogXCJmYS1leGNsYW1hdGlvbi1jaXJjbGVcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9yZWxlYXNlcycsXG4gICAgdGl0bGU6IFwiUmVsZWFzZXNcIixcbiAgICBpY29uOiBcImZhLWNlcnRpZmljYXRlXCJ9LFxuICB7IGhyZWY6IFwiaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9mb3J1bS8jIWZvcnVtL2tub2Nrb3V0anNcIixcbiAgICB0aXRsZTogXCJHb29nbGUgR3JvdXBzXCIsXG4gICAgaWNvbjogXCJmYS1nb29nbGVcIn0sXG4gIHsgaHJlZjogXCJodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdGFncy9rbm9ja291dC5qcy9pbmZvXCIsXG4gICAgdGl0bGU6IFwiU3RhY2tPdmVyZmxvd1wiLFxuICAgIGljb246IFwiZmEtc3RhY2stb3ZlcmZsb3dcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0dGVyLmltL2tub2Nrb3V0L2tub2Nrb3V0JyxcbiAgICB0aXRsZTogXCJHaXR0ZXJcIixcbiAgICBpY29uOiBcImZhLWNvbW1lbnRzLW9cIn0sXG4gIHsgaHJlZjogJ2xlZ2FjeS8nLFxuICAgIHRpdGxlOiBcIkxlZ2FjeSB3ZWJzaXRlXCIsXG4gICAgaWNvbjogXCJmYSBmYS1oaXN0b3J5XCJ9XG5dXG5cblxud2luZG93LmNkbiA9IFtcbiAgeyBuYW1lOiBcIk1pY3Jvc29mdCBDRE5cIixcbiAgICB2ZXJzaW9uOiBcIjMuMy4wXCIsXG4gICAgbWluOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5qc1wiLFxuICAgIGRlYnVnOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiXG4gIH0sXG4gIHsgbmFtZTogXCJDbG91ZEZsYXJlIENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtZGVidWcuanNcIixcbiAgICBkZWJ1ZzogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1taW4uanNcIlxuICB9XG5dXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=