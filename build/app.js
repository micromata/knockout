"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Documentation = function Documentation(template, title, category, subcategory) {
  _classCallCheck(this, Documentation);

  this.template = template;
  this.title = title;
  this.category = category;
  this.subcategory = subcategory;
};

Documentation.categoriesMap = {
  1: "Getting started",
  2: "Observables",
  3: "About Bindings",
  4: "Bindings included",
  5: "Further information"
};

Documentation.fromNode = function (i, node) {
  return new Documentation(node.getAttribute("id"), node.getAttribute("data-title"), node.getAttribute("data-cat"), node.getAttribute("data-subcat"));
};

Documentation.initialize = function () {
  Documentation.all = $.makeArray($("[data-kind=documentation]").map(Documentation.fromNode));
};
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

var EXTERNAL_INCLUDES = ["http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.debug.js", "https://cdn.rawgit.com/mbest/knockout.punches/v0.5.1/knockout.punches.js"];

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

    // --- Main body template id ---
    this.body = ko.observable();
    this.title = ko.observable();

    // --- footer links/cdn ---
    this.links = window.links;
    this.cdn = window.cdn;

    // --- plugins ---
    this.pluginRepos = ko.observableArray();
    this.sortedPluginRepos = this.pluginRepos.filter(this.pluginFilter.bind(this)).sortBy(this.pluginSortBy.bind(this));
    this.pluginMap = new Map();
    this.pluginSort = ko.observable();
    this.pluginsLoaded = ko.observable(false).extend({ rateLimit: 15 });
    this.pluginNeedle = ko.observable().extend({ rateLimit: 200 });

    // --- documentation ---
    this.docCatMap = new Map();
    Documentation.all.forEach(function (doc) {
      var cat = Documentation.categoriesMap[doc.category];
      var docList = this.docCatMap.get(cat);
      if (!docList) {
        docList = [];
        this.docCatMap.set(cat, docList);
      }
      docList.push(doc);
    }, this);

    // Sort the documentation items
    function sorter(a, b) {
      return a.title < b.title ? -1 : a.title === b.title ? 0 : 1;
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.docCatMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var list = _step.value;
        list.sort(sorter);
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

    // docCats: A sorted list of the documentation sections
    this.docCats = Object.keys(Documentation.categoriesMap).sort().map(function (v) {
      return Documentation.categoriesMap[v];
    });

    // --- searching ---
    this.search = new Search();
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
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SearchResult = function SearchResult(template) {
  _classCallCheck(this, SearchResult);

  this.template = template;
  this.link = "#" + template.id;
  this.title = template.getAttribute("data-title") || "“" + template.id + "”";
};

var Search = (function () {
  function Search() {
    _classCallCheck(this, Search);

    var searchRate = {
      timeout: 500,
      method: "notifyWhenChangesStop"
    };
    this.query = ko.observable().extend({ rateLimit: searchRate });
    this.results = ko.computed(this.computeResults, this);
  }

  _createClass(Search, [{
    key: "computeResults",
    value: function computeResults() {
      var q = this.query();
      if (!q) {
        return null;
      }
      return $("template").filter(function () {
        return $(this.content).text().indexOf(q) !== -1;
      }).map(function (i, template) {
        return new SearchResult(template);
      });
    }
  }]);

  return Search;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiU2VhcmNoLmpzIiwiYmluZGluZ3MuanMiLCJlbnRyeS5qcyIsImV2ZW50cy5qcyIsInNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFDTSxhQUFhLEdBQ04sU0FEUCxhQUFhLENBQ0wsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFO3dCQURoRCxhQUFhOztBQUVmLE1BQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLE1BQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLE1BQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLE1BQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO0NBQy9COztBQUdILGFBQWEsQ0FBQyxhQUFhLEdBQUc7QUFDNUIsR0FBQyxFQUFFLGlCQUFpQjtBQUNwQixHQUFDLEVBQUUsYUFBYTtBQUNoQixHQUFDLEVBQUUsZ0JBQWdCO0FBQ25CLEdBQUMsRUFBRSxtQkFBbUI7QUFDdEIsR0FBQyxFQUFFLHFCQUFxQjtDQUN6QixDQUFBOztBQUVELGFBQWEsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFO0FBQzFDLFNBQU8sSUFBSSxhQUFhLENBQ3RCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQ3ZCLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQ2pDLENBQUE7Q0FDRixDQUFBOztBQUVELGFBQWEsQ0FBQyxVQUFVLEdBQUcsWUFBWTtBQUNyQyxlQUFhLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQzdCLENBQUMsQ0FBQywyQkFBMkIsQ0FB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QUFJLEVBQUUsV0FBVyxFQUFDLEVBQ3BCLEVBQUUsSUFBSSxFQUFFLGdEQUFnRDtBQUN0RCxPQUFLLEVBQUUsZUFBZTtBQUN0QixNQUFJLEVBQUUsbUJBQW1CLEVBQUMsRUFDNUIsRUFBRSxJQUFJLEVBQUUscUNBQXFDO0FBQzNDLE9BQUssRUFBRSxRQUFRO0FBQ2YsTUFBSSxFQUFFLGVBQWUsRUFBQyxFQUN4QixFQUFFLElBQUksRUFBRSxTQUFTO0FBQ2YsT0FBSyxFQUFFLGdCQUFnQjtBQUN2QixNQUFJLEVBQUUsZUFBZSxFQUFDLENBQ3pCLENBQUE7O0FBR0QsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUNYLEVBQUUsSUFBSSxFQUFFLGVBQWU7QUFDckIsU0FBTyxFQUFFLE9BQU87QUFDaEIsS0FBRyxFQUFFLDJEQUEyRDtBQUNoRSxPQUFLLEVBQUUsaUVBQWlFO0NBQ3pFLEVBQ0QsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLFNBQU8sRUFBRSxPQUFPO0FBQ2hCLEtBQUcsRUFBRSx5RUFBeUU7QUFDOUUsT0FBSyxFQUFFLHVFQUF1RTtDQUMvRSxDQUNGLENBQUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBEb2N1bWVudGF0aW9uIHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIHRpdGxlLCBjYXRlZ29yeSwgc3ViY2F0ZWdvcnkpIHtcbiAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGVcbiAgICB0aGlzLnRpdGxlID0gdGl0bGVcbiAgICB0aGlzLmNhdGVnb3J5ID0gY2F0ZWdvcnlcbiAgICB0aGlzLnN1YmNhdGVnb3J5ID0gc3ViY2F0ZWdvcnlcbiAgfVxufVxuXG5Eb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXAgPSB7XG4gIDE6IFwiR2V0dGluZyBzdGFydGVkXCIsXG4gIDI6IFwiT2JzZXJ2YWJsZXNcIixcbiAgMzogXCJBYm91dCBCaW5kaW5nc1wiLFxuICA0OiBcIkJpbmRpbmdzIGluY2x1ZGVkXCIsXG4gIDU6IFwiRnVydGhlciBpbmZvcm1hdGlvblwiXG59XG5cbkRvY3VtZW50YXRpb24uZnJvbU5vZGUgPSBmdW5jdGlvbiAoaSwgbm9kZSkge1xuICByZXR1cm4gbmV3IERvY3VtZW50YXRpb24oXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1jYXQnKSxcbiAgICBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1zdWJjYXQnKVxuICApXG59XG5cbkRvY3VtZW50YXRpb24uaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgRG9jdW1lbnRhdGlvbi5hbGwgPSAkLm1ha2VBcnJheShcbiAgICAkKFwiW2RhdGEta2luZD1kb2N1bWVudGF0aW9uXVwiKS5tYXAoRG9jdW1lbnRhdGlvbi5mcm9tTm9kZSlcbiAgKVxufVxuIiwiXG5cbmNsYXNzIEV4YW1wbGUge1xuICBjb25zdHJ1Y3RvcihzdGF0ZSA9IHt9KSB7XG4gICAgdmFyIGRlYm91bmNlID0geyB0aW1lb3V0OiA1MDAsIG1ldGhvZDogXCJub3RpZnlXaGVuQ2hhbmdlc1N0b3BcIiB9XG4gICAgdGhpcy5qYXZhc2NyaXB0ID0ga28ub2JzZXJ2YWJsZShzdGF0ZS5qYXZhc2NyaXB0KVxuICAgICAgLmV4dGVuZCh7cmF0ZUxpbWl0OiBkZWJvdW5jZX0pXG4gICAgdGhpcy5odG1sID0ga28ub2JzZXJ2YWJsZShzdGF0ZS5odG1sKVxuICAgICAgLmV4dGVuZCh7cmF0ZUxpbWl0OiBkZWJvdW5jZX0pXG4gICAgdGhpcy5jc3MgPSBzdGF0ZS5jc3MgfHwgJydcblxuICAgIHRoaXMuZmluYWxKYXZhc2NyaXB0ID0ga28ucHVyZUNvbXB1dGVkKHRoaXMuY29tcHV0ZUZpbmFsSnMsIHRoaXMpXG4gIH1cblxuICAvLyBBZGQga28uYXBwbHlCaW5kaW5ncyBhcyBuZWVkZWQ7IHJldHVybiBFcnJvciB3aGVyZSBhcHByb3ByaWF0ZS5cbiAgY29tcHV0ZUZpbmFsSnMoKSB7XG4gICAgdmFyIGpzID0gdGhpcy5qYXZhc2NyaXB0KClcbiAgICBpZiAoIWpzKSB7IHJldHVybiBuZXcgRXJyb3IoXCJUaGUgc2NyaXB0IGlzIGVtcHR5LlwiKSB9XG4gICAgaWYgKGpzLmluZGV4T2YoJ2tvLmFwcGx5QmluZGluZ3MoJykgPT09IC0xKSB7XG4gICAgICBpZiAoanMuaW5kZXhPZignIHZpZXdNb2RlbCA9JykgIT09IC0xKSB7XG4gICAgICAgIC8vIFdlIGd1ZXNzIHRoZSB2aWV3TW9kZWwgbmFtZSAuLi5cbiAgICAgICAgcmV0dXJuIGAke2pzfVxcblxcbi8qIEF1dG9tYXRpY2FsbHkgQWRkZWQgKi9cbiAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKHZpZXdNb2RlbCk7YFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihcImtvLmFwcGx5QmluZGluZ3ModmlldykgaXMgbm90IGNhbGxlZFwiKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ganNcbiAgfVxufVxuXG5FeGFtcGxlLnN0YXRlTWFwID0gbmV3IE1hcCgpXG5cbkV4YW1wbGUuZ2V0ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIHN0YXRlID0gRXhhbXBsZS5zdGF0ZU1hcC5nZXQobmFtZSlcbiAgaWYgKCFzdGF0ZSkge1xuICAgIHN0YXRlID0gbmV3IEV4YW1wbGUobmFtZSlcbiAgICBFeGFtcGxlLnN0YXRlTWFwLnNldChuYW1lLCBzdGF0ZSlcbiAgfVxuICByZXR1cm4gc3RhdGVcbn1cblxuXG5FeGFtcGxlLnNldCA9IGZ1bmN0aW9uIChuYW1lLCBzdGF0ZSkge1xuICB2YXIgZXhhbXBsZSA9IEV4YW1wbGUuc3RhdGVNYXAuZ2V0KG5hbWUpXG4gIGlmIChleGFtcGxlKSB7XG4gICAgZXhhbXBsZS5qYXZhc2NyaXB0KHN0YXRlLmphdmFzY3JpcHQpXG4gICAgZXhhbXBsZS5odG1sKHN0YXRlLmh0bWwpXG4gICAgcmV0dXJuXG4gIH1cbiAgRXhhbXBsZS5zdGF0ZU1hcC5zZXQobmFtZSwgbmV3IEV4YW1wbGUoc3RhdGUpKVxufVxuIiwiLypnbG9iYWxzIEV4YW1wbGUgKi9cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogMCwgY2FtZWxjYXNlOjAqL1xuXG52YXIgRVhURVJOQUxfSU5DTFVERVMgPSBbXG4gIFwiaHR0cDovL2FqYXguYXNwbmV0Y2RuLmNvbS9hamF4L2tub2Nrb3V0L2tub2Nrb3V0LTMuMy4wLmRlYnVnLmpzXCIsXG4gIFwiaHR0cHM6Ly9jZG4ucmF3Z2l0LmNvbS9tYmVzdC9rbm9ja291dC5wdW5jaGVzL3YwLjUuMS9rbm9ja291dC5wdW5jaGVzLmpzXCJcbl1cblxuY2xhc3MgTGl2ZUV4YW1wbGVDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcbiAgICB0aGlzLmV4YW1wbGUgPSBwYXJhbXMuaWRcbiAgfVxuXG4gIG9wZW5Db21tb25TZXR0aW5ncygpIHtcbiAgICB2YXIgZXhJZCA9IGtvLnVud3JhcCh0aGlzLmV4YW1wbGUpXG4gICAgdmFyIGV4ID0gRXhhbXBsZS5nZXQoZXhJZClcbiAgICB2YXIgZGF0ZWQgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlU3RyaW5nKClcbiAgICB2YXIganNQcmVmaXggPSBgLyoqXG4gKiBDcmVhdGVkIGZyb20gYW4gZXhhbXBsZSAoJHtleElkfSkgb24gdGhlIEtub2Nrb3V0IHdlYnNpdGVcbiAqIG9uICR7bmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpfVxuICoqL1xuXG4gLyogRm9yIGNvbnZlbmllbmNlIGFuZCBjb25zaXN0ZW5jeSB3ZSd2ZSBlbmFibGVkIHRoZSBrb1xuICAqIHB1bmNoZXMgbGlicmFyeSBmb3IgdGhpcyBleGFtcGxlLlxuICAqL1xuIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcblxuIC8qKiBFeGFtcGxlIGlzIGFzIGZvbGxvd3MgKiovXG5gXG4gICAgcmV0dXJuIHtcbiAgICAgIGh0bWw6IGV4Lmh0bWwoKSxcbiAgICAgIGpzOiBqc1ByZWZpeCArIGV4LmZpbmFsSmF2YXNjcmlwdCgpLFxuICAgICAgdGl0bGU6IGBGcm9tIEtub2Nrb3V0IGV4YW1wbGUgKCR7ZXhJZH0pYCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgQ3JlYXRlZCBvbiAke2RhdGVkfWBcbiAgICB9XG4gIH1cblxuICBvcGVuRmlkZGxlKHNlbGYsIGV2dCkge1xuICAgIC8vIFNlZTogaHR0cDovL2RvYy5qc2ZpZGRsZS5uZXQvYXBpL3Bvc3QuaHRtbFxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdmFyIGZpZWxkcyA9IGtvLnV0aWxzLmV4dGVuZCh7XG4gICAgICBkdGQ6IFwiSFRNTCA1XCIsXG4gICAgICB3cmFwOiAnbCcsXG4gICAgICByZXNvdXJjZXM6IEVYVEVSTkFMX0lOQ0xVREVTLmpvaW4oXCIsXCIpXG4gICAgfSwgdGhpcy5vcGVuQ29tbW9uU2V0dGluZ3MoKSlcbiAgICB2YXIgZm9ybSA9ICQoYDxmb3JtIGFjdGlvbj1cImh0dHA6Ly9qc2ZpZGRsZS5uZXQvYXBpL3Bvc3QvbGlicmFyeS9wdXJlL1wiXG4gICAgICBtZXRob2Q9XCJQT1NUXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICA8L2Zvcm0+YClcbiAgICAkLmVhY2goZmllbGRzLCBmdW5jdGlvbihrLCB2KSB7XG4gICAgICBmb3JtLmFwcGVuZChcbiAgICAgICAgJChgPGlucHV0IHR5cGU9J2hpZGRlbicgbmFtZT0nJHtrfSc+YCkudmFsKHYpXG4gICAgICApXG4gICAgfSlcblxuICAgIGZvcm0uc3VibWl0KClcbiAgfVxuXG4gIG9wZW5QZW4oc2VsZiwgZXZ0KSB7XG4gICAgLy8gU2VlOiBodHRwOi8vYmxvZy5jb2RlcGVuLmlvL2RvY3VtZW50YXRpb24vYXBpL3ByZWZpbGwvXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KClcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB2YXIgb3B0cyA9IGtvLnV0aWxzLmV4dGVuZCh7XG4gICAgICBqc19leHRlcm5hbDogRVhURVJOQUxfSU5DTFVERVMuam9pbihcIjtcIilcbiAgICB9LCB0aGlzLm9wZW5Db21tb25TZXR0aW5ncygpKVxuICAgIHZhciBkYXRhU3RyID0gSlNPTi5zdHJpbmdpZnkob3B0cylcbiAgICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKVxuICAgICAgLnJlcGxhY2UoLycvZywgXCImYXBvcztcIilcblxuICAgICQoYDxmb3JtIGFjdGlvbj1cImh0dHA6Ly9jb2RlcGVuLmlvL3Blbi9kZWZpbmVcIiBtZXRob2Q9XCJQT1NUXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICA8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPSdkYXRhJyB2YWx1ZT0nJHtkYXRhU3RyfScvPlxuICAgIDwvZm9ybT5gKS5zdWJtaXQoKVxuICB9XG59XG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2xpdmUtZXhhbXBsZScsIHtcbiAgICB2aWV3TW9kZWw6IExpdmVFeGFtcGxlQ29tcG9uZW50LFxuICAgIHRlbXBsYXRlOiB7ZWxlbWVudDogXCJsaXZlLWV4YW1wbGVcIn1cbn0pXG4iLCIvKmdsb2JhbCBQYWdlLCBEb2N1bWVudGF0aW9uLCBtYXJrZWQqL1xuLyplc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAqL1xuXG5cbmNsYXNzIFBhZ2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyAtLS0gTWFpbiBib2R5IHRlbXBsYXRlIGlkIC0tLVxuICAgIHRoaXMuYm9keSA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMudGl0bGUgPSBrby5vYnNlcnZhYmxlKClcblxuICAgIC8vIC0tLSBmb290ZXIgbGlua3MvY2RuIC0tLVxuICAgIHRoaXMubGlua3MgPSB3aW5kb3cubGlua3NcbiAgICB0aGlzLmNkbiA9IHdpbmRvdy5jZG5cblxuICAgIC8vIC0tLSBwbHVnaW5zIC0tLVxuICAgIHRoaXMucGx1Z2luUmVwb3MgPSBrby5vYnNlcnZhYmxlQXJyYXkoKVxuICAgIHRoaXMuc29ydGVkUGx1Z2luUmVwb3MgPSB0aGlzLnBsdWdpblJlcG9zXG4gICAgICAuZmlsdGVyKHRoaXMucGx1Z2luRmlsdGVyLmJpbmQodGhpcykpXG4gICAgICAuc29ydEJ5KHRoaXMucGx1Z2luU29ydEJ5LmJpbmQodGhpcykpXG4gICAgdGhpcy5wbHVnaW5NYXAgPSBuZXcgTWFwKClcbiAgICB0aGlzLnBsdWdpblNvcnQgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKS5leHRlbmQoe3JhdGVMaW1pdDogMTV9KVxuICAgIHRoaXMucGx1Z2luTmVlZGxlID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiAyMDB9KVxuXG4gICAgLy8gLS0tIGRvY3VtZW50YXRpb24gLS0tXG4gICAgdGhpcy5kb2NDYXRNYXAgPSBuZXcgTWFwKClcbiAgICBEb2N1bWVudGF0aW9uLmFsbC5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcbiAgICAgIHZhciBjYXQgPSBEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXBbZG9jLmNhdGVnb3J5XVxuICAgICAgdmFyIGRvY0xpc3QgPSB0aGlzLmRvY0NhdE1hcC5nZXQoY2F0KVxuICAgICAgaWYgKCFkb2NMaXN0KSB7XG4gICAgICAgIGRvY0xpc3QgPSBbXVxuICAgICAgICB0aGlzLmRvY0NhdE1hcC5zZXQoY2F0LCBkb2NMaXN0KVxuICAgICAgfVxuICAgICAgZG9jTGlzdC5wdXNoKGRvYylcbiAgICB9LCB0aGlzKVxuXG4gICAgLy8gU29ydCB0aGUgZG9jdW1lbnRhdGlvbiBpdGVtc1xuICAgIGZ1bmN0aW9uIHNvcnRlcihhLCBiKSB7XG4gICAgICByZXR1cm4gYS50aXRsZSA8IGIudGl0bGUgPyAtMSA6IGEudGl0bGUgPT09IGIudGl0bGUgPyAwIDogMVxuICAgIH1cbiAgICBmb3IgKHZhciBsaXN0IG9mIHRoaXMuZG9jQ2F0TWFwLnZhbHVlcygpKSB7IGxpc3Quc29ydChzb3J0ZXIpIH1cblxuICAgIC8vIGRvY0NhdHM6IEEgc29ydGVkIGxpc3Qgb2YgdGhlIGRvY3VtZW50YXRpb24gc2VjdGlvbnNcbiAgICB0aGlzLmRvY0NhdHMgPSBPYmplY3Qua2V5cyhEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXApXG4gICAgICAuc29ydCgpXG4gICAgICAubWFwKGZ1bmN0aW9uICh2KSB7IHJldHVybiBEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXBbdl0gfSlcblxuICAgIC8vIC0tLSBzZWFyY2hpbmcgLS0tXG4gICAgdGhpcy5zZWFyY2ggPSBuZXcgU2VhcmNoKClcbiAgfVxuXG4gIG9wZW4ocGlucG9pbnQpIHtcbiAgICB2YXIgcHAgPSBwaW5wb2ludC5yZXBsYWNlKFwiI1wiLCBcIlwiKVxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHApXG4gICAgdmFyIG1kTm9kZSwgbWROb2RlSWRcbiAgICB0aGlzLnRpdGxlKG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgJycpXG4gICAgdGhpcy5ib2R5KHBwKVxuICAgICQod2luZG93KS5zY3JvbGxUb3AoMClcbiAgfVxuXG4gIHJlZ2lzdGVyUGx1Z2lucyhwbHVnaW5zKSB7XG4gICAgT2JqZWN0LmtleXMocGx1Z2lucykuZm9yRWFjaChmdW5jdGlvbiAocmVwbykge1xuICAgICAgdmFyIGFib3V0ID0gcGx1Z2luc1tyZXBvXVxuICAgICAgdGhpcy5wbHVnaW5SZXBvcy5wdXNoKHJlcG8pXG4gICAgICB0aGlzLnBsdWdpbk1hcC5zZXQocmVwbywgYWJvdXQpXG4gICAgfSwgdGhpcylcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQodHJ1ZSlcbiAgfVxuXG4gIHBsdWdpbkZpbHRlcihyZXBvKSB7XG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgdmFyIG5lZWRsZSA9ICh0aGlzLnBsdWdpbk5lZWRsZSgpIHx8ICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCFuZWVkbGUpIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmIChyZXBvLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDApIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmICghYWJvdXQpIHsgcmV0dXJuIGZhbHNlIH1cbiAgICByZXR1cm4gKGFib3V0LmRlc2NyaXB0aW9uIHx8ICcnKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YobmVlZGxlKSA+PSAwXG4gIH1cblxuICBwbHVnaW5Tb3J0QnkocmVwbywgZGVzY2VuZGluZykge1xuICAgIHRoaXMucGx1Z2luc0xvYWRlZCgpIC8vIENyZWF0ZSBkZXBlbmRlbmN5LlxuICAgIHZhciBhYm91dCA9IHRoaXMucGx1Z2luTWFwLmdldChyZXBvKVxuICAgIGlmIChhYm91dCkge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoYWJvdXQuc3RhcmdhemVyc19jb3VudClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRlc2NlbmRpbmcoLTEpXG4gICAgfVxuICB9XG59XG4iLCJcbmNsYXNzIFNlYXJjaFJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlKSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy5saW5rID0gYCMke3RlbXBsYXRlLmlkfWBcbiAgICB0aGlzLnRpdGxlID0gdGVtcGxhdGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgYOKAnCR7dGVtcGxhdGUuaWR94oCdYFxuICB9XG59XG5cblxuY2xhc3MgU2VhcmNoIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdmFyIHNlYXJjaFJhdGUgPSB7XG4gICAgICB0aW1lb3V0OiA1MDAsXG4gICAgICBtZXRob2Q6IFwibm90aWZ5V2hlbkNoYW5nZXNTdG9wXCJcbiAgICB9XG4gICAgdGhpcy5xdWVyeSA9IGtvLm9ic2VydmFibGUoKS5leHRlbmQoe3JhdGVMaW1pdDogc2VhcmNoUmF0ZX0pXG4gICAgdGhpcy5yZXN1bHRzID0ga28uY29tcHV0ZWQodGhpcy5jb21wdXRlUmVzdWx0cywgdGhpcylcbiAgfVxuXG4gIGNvbXB1dGVSZXN1bHRzKCkge1xuICAgIHZhciBxID0gdGhpcy5xdWVyeSgpXG4gICAgaWYgKCFxKSB7IHJldHVybiBudWxsIH1cbiAgICByZXR1cm4gJChgdGVtcGxhdGVgKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMuY29udGVudCkudGV4dCgpLmluZGV4T2YocSkgIT09IC0xXG4gICAgICB9KVxuICAgICAgLm1hcCgoaSwgdGVtcGxhdGUpID0+IG5ldyBTZWFyY2hSZXN1bHQodGVtcGxhdGUpKVxuICB9XG59XG4iLCIvKiBnbG9iYWwgYWNlLCBFeGFtcGxlICovXG4vKiBlc2xpbnQgbm8tbmV3LWZ1bmM6IDAsIG5vLXVuZGVyc2NvcmUtZGFuZ2xlOjAqL1xuXG4vLyBTYXZlIGEgY29weSBmb3IgcmVzdG9yYXRpb24vdXNlXG5rby5fYXBwbHlCaW5kaW5ncyA9IGtvLmFwcGx5QmluZGluZ3NcblxudmFyIGxhbmd1YWdlVGhlbWVNYXAgPSB7XG4gIGh0bWw6ICdzb2xhcml6ZWRfZGFyaycsXG4gIGphdmFzY3JpcHQ6ICdtb25va2FpJ1xufVxuXG52YXIgcmVhZG9ubHlUaGVtZU1hcCA9IHtcbiAgaHRtbDogXCJzb2xhcml6ZWRfbGlnaHRcIixcbiAgamF2YXNjcmlwdDogXCJ0b21vcnJvd1wiXG59XG5cbmZ1bmN0aW9uIHNldHVwRWRpdG9yKGVsZW1lbnQsIGxhbmd1YWdlLCBleGFtcGxlTmFtZSkge1xuICB2YXIgZXhhbXBsZSA9IEV4YW1wbGUuZ2V0KGtvLnVud3JhcChleGFtcGxlTmFtZSkpXG4gIHZhciBlZGl0b3IgPSBhY2UuZWRpdChlbGVtZW50KVxuICBlZGl0b3IuJGJsb2NrU2Nyb2xsaW5nID0gSW5maW5pdHkgLy8gaGlkZXMgZXJyb3IgbWVzc2FnZVxuICB2YXIgc2Vzc2lvbiA9IGVkaXRvci5nZXRTZXNzaW9uKClcbiAgZWRpdG9yLnNldFRoZW1lKGBhY2UvdGhlbWUvJHtsYW5ndWFnZVRoZW1lTWFwW2xhbmd1YWdlXX1gKVxuICBlZGl0b3Iuc2V0T3B0aW9ucyh7XG4gICAgaGlnaGxpZ2h0QWN0aXZlTGluZTogdHJ1ZSxcbiAgICB1c2VTb2Z0VGFiczogdHJ1ZSxcbiAgICB0YWJTaXplOiAyLFxuICAgIG1pbkxpbmVzOiAzLFxuICAgIG1heExpbmVzOiAzMCxcbiAgICB3cmFwOiB0cnVlXG4gIH0pXG4gIHNlc3Npb24uc2V0TW9kZShgYWNlL21vZGUvJHtsYW5ndWFnZX1gKVxuICBlZGl0b3Iub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHsgZXhhbXBsZVtsYW5ndWFnZV0oZWRpdG9yLmdldFZhbHVlKCkpIH0pXG4gIGV4YW1wbGVbbGFuZ3VhZ2VdLnN1YnNjcmliZShmdW5jdGlvbiAodikge1xuICAgIGlmIChlZGl0b3IuZ2V0VmFsdWUoKSAhPT0gdikge1xuICAgICAgZWRpdG9yLnNldFZhbHVlKHYpXG4gICAgfVxuICB9KVxuICBlZGl0b3Iuc2V0VmFsdWUoZXhhbXBsZVtsYW5ndWFnZV0oKSlcbiAgZWRpdG9yLmNsZWFyU2VsZWN0aW9uKClcbiAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICByZXR1cm4gZWRpdG9yXG59XG5cbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWdcbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZ1xuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtY2hhcnNcblxua28uYmluZGluZ0hhbmRsZXJzWydlZGl0LWpzJ10gPSB7XG4gIC8qIGhpZ2hsaWdodDogXCJsYW5nYXVnZVwiICovXG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHNldHVwRWRpdG9yKGVsZW1lbnQsICdqYXZhc2NyaXB0JywgdmEoKSlcbiAgfVxufVxuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VkaXQtaHRtbCddID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICBzZXR1cEVkaXRvcihlbGVtZW50LCAnaHRtbCcsIHZhKCkpXG4gICAgLy8gZGVidWdnZXJcbiAgICAvLyBlZGl0b3Iuc2Vzc2lvbi5zZXRPcHRpb25zKHtcbiAgICAvLyAvLyAkd29ya2VyLmNhbGwoJ2NoYW5nZU9wdGlvbnMnLCBbe1xuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1jaGFycyc6IGZhbHNlLFxuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1lbmQtdGFnJzogZmFsc2UsXG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZyc6IGZhbHNlXG4gICAgLy8gfSlcbiAgfVxufVxuXG5cbmtvLmJpbmRpbmdIYW5kbGVycy5yZXN1bHQgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciAkZSA9ICQoZWxlbWVudClcbiAgICB2YXIgZXhhbXBsZSA9IEV4YW1wbGUuZ2V0KGtvLnVud3JhcCh2YSgpKSlcblxuICAgIGZ1bmN0aW9uIHJlc2V0RWxlbWVudCgpIHtcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuWzBdKSB7XG4gICAgICAgIGtvLmNsZWFuTm9kZShlbGVtZW50LmNoaWxkcmVuWzBdKVxuICAgICAgfVxuICAgICAgJGUuZW1wdHkoKS5hcHBlbmQoYDxkaXYgY2xhc3M9J2V4YW1wbGUgJHtleGFtcGxlLmNzc30nPmApXG4gICAgfVxuICAgIHJlc2V0RWxlbWVudCgpXG5cbiAgICBmdW5jdGlvbiBvbkVycm9yKG1zZykge1xuICAgICAgJChlbGVtZW50KVxuICAgICAgICAuaHRtbChgPGRpdiBjbGFzcz0nZXJyb3InPkVycm9yOiAke21zZ308L2Rpdj5gKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgICB2YXIgc2NyaXB0ID0gZXhhbXBsZS5maW5hbEphdmFzY3JpcHQoKVxuICAgICAgdmFyIGh0bWwgPSBleGFtcGxlLmh0bWwoKVxuXG4gICAgICBpZiAoc2NyaXB0IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgb25FcnJvcihzY3JpcHQpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoIWh0bWwpIHtcbiAgICAgICAgb25FcnJvcihcIlRoZXJlJ3Mgbm8gSFRNTCB0byBiaW5kIHRvLlwiKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIC8vIFN0dWIga28uYXBwbHlCaW5kaW5nc1xuICAgICAga28uYXBwbHlCaW5kaW5ncyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIC8vIFdlIGlnbm9yZSB0aGUgYG5vZGVgIGFyZ3VtZW50IGluIGZhdm91ciBvZiB0aGUgZXhhbXBsZXMnIG5vZGUuXG4gICAgICAgIGtvLl9hcHBseUJpbmRpbmdzKGUsIGVsZW1lbnQuY2hpbGRyZW5bMF0pXG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc2V0RWxlbWVudCgpXG4gICAgICAgICQoZWxlbWVudC5jaGlsZHJlblswXSkuaHRtbChodG1sKVxuICAgICAgICBuZXcgRnVuY3Rpb24oJ25vZGUnLCBzY3JpcHQpKGVsZW1lbnQuY2hpbGRyZW5bMF0pXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgb25FcnJvcihlKVxuICAgICAgfVxuICAgICAga28uYXBwbHlCaW5kaW5ncyA9IGtvLl9hcHBseUJpbmRpbmdzXG4gICAgfVxuXG4gICAga28uY29tcHV0ZWQoe1xuICAgICAgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50LFxuICAgICAgcmVhZDogcmVmcmVzaFxuICAgIH0pXG5cbiAgICByZXR1cm4ge2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiB0cnVlfVxuICB9XG59XG5cbnZhciBlbWFwID0ge1xuICAnJmFtcDsnOiAnJicsXG4gICcmbHQ7JzogJzwnXG59XG5cbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoXG4gICAgLyZhbXA7fCZsdDsvZyxcbiAgICBmdW5jdGlvbiAoZW50KSB7IHJldHVybiBlbWFwW2VudF19XG4gIClcbn1cblxuXG5rby5iaW5kaW5nSGFuZGxlcnMuaGlnaGxpZ2h0ID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICB2YXIgJGUgPSAkKGVsZW1lbnQpXG4gICAgdmFyIGxhbmd1YWdlID0gdmEoKVxuICAgIGlmIChsYW5ndWFnZSAhPT0gJ2h0bWwnICYmIGxhbmd1YWdlICE9PSAnamF2YXNjcmlwdCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJBIGxhbmd1YWdlIHNob3VsZCBiZSBzcGVjaWZpZWQuXCIsIGVsZW1lbnQpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdmFyIGNvbnRlbnQgPSB1bmVzY2FwZSgkZS50ZXh0KCkpXG4gICAgJGUuZW1wdHkoKVxuICAgIHZhciBlZGl0b3IgPSBhY2UuZWRpdChlbGVtZW50KVxuICAgIHZhciBzZXNzaW9uID0gZWRpdG9yLmdldFNlc3Npb24oKVxuICAgIGVkaXRvci5zZXRUaGVtZShgYWNlL3RoZW1lLyR7cmVhZG9ubHlUaGVtZU1hcFtsYW5ndWFnZV19YClcbiAgICBlZGl0b3Iuc2V0T3B0aW9ucyh7XG4gICAgICBoaWdobGlnaHRBY3RpdmVMaW5lOiBmYWxzZSxcbiAgICAgIHVzZVNvZnRUYWJzOiB0cnVlLFxuICAgICAgdGFiU2l6ZTogMixcbiAgICAgIG1pbkxpbmVzOiAzLFxuICAgICAgd3JhcDogdHJ1ZSxcbiAgICAgIG1heExpbmVzOiAyNSxcbiAgICAgIHJlYWRPbmx5OiB0cnVlXG4gICAgfSlcbiAgICBzZXNzaW9uLnNldE1vZGUoYGFjZS9tb2RlLyR7bGFuZ3VhZ2V9YClcbiAgICBlZGl0b3Iuc2V0VmFsdWUoY29udGVudClcbiAgICBlZGl0b3IuY2xlYXJTZWxlY3Rpb24oKVxuICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgKCkgPT4gZWRpdG9yLmRlc3Ryb3koKSlcbiAgfVxufVxuIiwiLyogZ2xvYmFsIHNldHVwRXZlbnRzLCBFeGFtcGxlLCBEb2N1bWVudGF0aW9uICovXG5cbmZ1bmN0aW9uIGxvYWRIdG1sKHVyaSkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh1cmkpKVxuICAgIC50aGVuKGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICBpZiAodHlwZW9mIGh0bWwgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgVW5hYmxlIHRvIGdldCAke3VyaX06YCwgaHRtbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEVTNS08dGVtcGxhdGU+IHNoaW0vcG9seWZpbGw6XG4gICAgICAgIC8vIHVubGVzcyAnY29udGVudCcgb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKVxuICAgICAgICAvLyAgICMgc2VlIHB2X3NoaW1fdGVtcGxhdGVfdGFnIHJlLiBicm9rZW4tdGVtcGxhdGUgdGFnc1xuICAgICAgICAvLyAgIGh0bWwgPSBodG1sLnJlcGxhY2UoLzxcXC90ZW1wbGF0ZT4vZywgJzwvc2NyaXB0PicpXG4gICAgICAgIC8vICAgICAucmVwbGFjZSgvPHRlbXBsYXRlL2csICc8c2NyaXB0IHR5cGU9XCJ0ZXh0L3gtdGVtcGxhdGVcIicpXG4gICAgICAgICQoYDxkaXYgaWQ9J3RlbXBsYXRlcy0tJHt1cml9Jz5gKVxuICAgICAgICAgIC5hcHBlbmQoaHRtbClcbiAgICAgICAgICAuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSlcbiAgICAgIH1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBsb2FkVGVtcGxhdGVzKCkge1xuICByZXR1cm4gbG9hZEh0bWwoJ2J1aWxkL3RlbXBsYXRlcy5odG1sJylcbn1cblxuZnVuY3Rpb24gbG9hZE1hcmtkb3duKCkge1xuICByZXR1cm4gbG9hZEh0bWwoXCJidWlsZC9tYXJrZG93bi5odG1sXCIpXG59XG5cbmZ1bmN0aW9uIG9uQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIGxvY2F0aW9uLnJlbG9hZCgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUoKSB7XG4gIHZhciBhYyA9IGFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKGFjKSB7XG4gICAgc3dpdGNoIChhYy5zdGF0dXMpIHtcbiAgICAgIGNhc2UgYWMuVVBEQVRFUkVBRFk6XG4gICAgICAgIG9uQXBwbGljYXRpb25VcGRhdGUoKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBhYy5DSEVDS0lORzpcbiAgICAgIGNhc2UgYWMuT0JTT0xFVEU6XG4gICAgICBjYXNlIGFjLkRPV05MT0FESU5HOlxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIFRoaXMgbmV2ZXIgcmVzb2x2ZXM7IGl0IHJlbG9hZHMgdGhlIHBhZ2Ugd2hlbiB0aGVcbiAgICAgICAgICAvLyB1cGRhdGUgaXMgY29tcGxldGUuXG4gICAgICAgICAgd2luZG93LiRyb290LmJvZHkoXCJ1cGRhdGluZy1hcHBjYWNoZVwiKVxuICAgICAgICAgIHdpbmRvdy5hcHBsaWNhdGlvbkNhY2hlLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZXJlYWR5Jywgb25BcHBsaWNhdGlvblVwZGF0ZSlcbiAgICAgICAgfSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG59XG5cblxuZnVuY3Rpb24gZ2V0RXhhbXBsZXMoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9leGFtcGxlcy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PlxuICAgIE9iamVjdC5rZXlzKHJlc3VsdHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBzZXR0aW5nID0gcmVzdWx0c1tuYW1lXVxuICAgICAgRXhhbXBsZS5zZXQoc2V0dGluZy5pZCB8fCBuYW1lLCBzZXR0aW5nKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBnZXRQbHVnaW5zKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvcGx1Z2lucy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlclBsdWdpbnMocmVzdWx0cykpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAga28ucHVuY2hlcy5lbmFibGVBbGwoKVxuICB3aW5kb3cuJHJvb3QgPSBuZXcgUGFnZSgpXG4gIGtvLnB1bmNoZXMuZW5hYmxlQWxsKClcbiAga28uYXBwbHlCaW5kaW5ncyh3aW5kb3cuJHJvb3QpXG59XG5cblxuZnVuY3Rpb24gcGFnZUxvYWRlZCgpIHtcbiAgd2luZG93LiRyb290Lm9wZW4obG9jYXRpb24uaGFzaCB8fCBcIiNpbnRyb1wiKVxufVxuXG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBQcm9taXNlLmFsbChbbG9hZFRlbXBsYXRlcygpLCBsb2FkTWFya2Rvd24oKV0pXG4gICAgLnRoZW4oKCkgPT4gRG9jdW1lbnRhdGlvbi5pbml0aWFsaXplKCkpXG4gICAgLnRoZW4oYXBwbHlCaW5kaW5ncylcbiAgICAudGhlbihnZXRFeGFtcGxlcylcbiAgICAudGhlbihnZXRQbHVnaW5zKVxuICAgIC50aGVuKHNldHVwRXZlbnRzKVxuICAgIC50aGVuKGNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUpXG4gICAgLnRoZW4ocGFnZUxvYWRlZClcbiAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5sb2coXCJMb2FkaW5nOlwiLCBlcnIpKVxufVxuXG5cbiQoc3RhcnQpXG5cbi8vIEVuYWJsZSBsaXZlcmVsb2FkIGluIGRldmVsb3BtZW50XG5pZiAod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSAnbG9jYWxob3N0Jykge1xuICAkLmdldFNjcmlwdChcImh0dHA6Ly9sb2NhbGhvc3Q6MzU3MjkvbGl2ZXJlbG9hZC5qc1wiKVxufVxuIiwiLypnbG9iYWwgc2V0dXBFdmVudHMqL1xuLyogZXNsaW50IG5vLXVudXNlZC12YXJzOiAwICovXG5cbmZ1bmN0aW9uIGlzTG9jYWwoYW5jaG9yKSB7XG4gIHJldHVybiAobG9jYXRpb24ucHJvdG9jb2wgPT09IGFuY2hvci5wcm90b2NvbCAmJlxuICAgICAgICAgIGxvY2F0aW9uLmhvc3QgPT09IGFuY2hvci5ob3N0KVxufVxuXG5cblxuLy9cbi8vIEZvciBKUyBoaXN0b3J5IHNlZTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZvdGUvSFRNTDUtSGlzdG9yeS1BUElcbi8vXG5mdW5jdGlvbiBvbkFuY2hvckNsaWNrKGV2dCkge1xuICAvLyBJZ25vcmUgY2xpY2tzIG9uIHRoaW5ncyBvdXRzaWRlIHRoaXMgcGFnZVxuICBpZiAoIWlzTG9jYWwodGhpcykpIHsgcmV0dXJuIHRydWUgfVxuXG4gIC8vIElnbm9yZSBjbGlja3Mgb24gYW4gZWxlbWVudCBpbiBhbiBleGFtcGxlLlxuICBpZiAoJChldnQudGFyZ2V0KS5wYXJlbnRzKFwibGl2ZS1leGFtcGxlXCIpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgLy8gSWdub3JlIGNsaWNrcyBvbiBsaW5rcyB0aGF0IG1heSBoYXZlIGUuZy4gZGF0YS1iaW5kPWNsaWNrOiAuLi5cbiAgLy8gKGUuZy4gb3BlbiBqc0ZpZGRsZSlcbiAgaWYgKCFldnQudGFyZ2V0Lmhhc2gpIHsgcmV0dXJuIHRydWUgfVxuICB0cnkge1xuICAgICRyb290Lm9wZW4oZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSlcbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5sb2coYEVycm9yLyR7ZXZ0LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gLCBlKVxuICB9XG4gIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIHRoaXMuaHJlZilcbiAgZG9jdW1lbnQudGl0bGUgPSBgS25vY2tvdXQuanMg4oCTICR7JCh0aGlzKS50ZXh0KCl9YFxuICByZXR1cm4gZmFsc2Vcbn1cblxuXG5mdW5jdGlvbiBvblBvcFN0YXRlKC8qIGV2dCAqLykge1xuICAvLyBDb25zaWRlciBodHRwczovL2dpdGh1Yi5jb20vZGV2b3RlL0hUTUw1LUhpc3RvcnktQVBJXG4gICRyb290Lm9wZW4obG9jYXRpb24uaGFzaClcbn1cblxuXG5mdW5jdGlvbiBzZXR1cEV2ZW50cygpIHtcbiAgJChkb2N1bWVudC5ib2R5KVxuICAgIC5vbignY2xpY2snLCBcImFcIiwgb25BbmNob3JDbGljaylcblxuICAkKHdpbmRvdylcbiAgICAub24oJ3BvcHN0YXRlJywgb25Qb3BTdGF0ZSlcbn1cbiIsIlxud2luZG93LmxpbmtzID0gW1xuICB7IGhyZWY6IFwiaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0XCIsXG4gICAgdGl0bGU6IFwiR2l0aHViIOKAlCBSZXBvc2l0b3J5XCIsXG4gICAgaWNvbjogXCJmYS1naXRodWJcIn0sXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvaXNzdWVzL1wiLFxuICAgIHRpdGxlOiBcIkdpdGh1YiDigJQgSXNzdWVzXCIsXG4gICAgaWNvbjogXCJmYS1leGNsYW1hdGlvbi1jaXJjbGVcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9yZWxlYXNlcycsXG4gICAgdGl0bGU6IFwiUmVsZWFzZXNcIixcbiAgICBpY29uOiBcImZhLWNlcnRpZmljYXRlXCJ9LFxuICB7IGhyZWY6IFwiaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9mb3J1bS8jIWZvcnVtL2tub2Nrb3V0anNcIixcbiAgICB0aXRsZTogXCJHb29nbGUgR3JvdXBzXCIsXG4gICAgaWNvbjogXCJmYS1nb29nbGVcIn0sXG4gIHsgaHJlZjogXCJodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vdGFncy9rbm9ja291dC5qcy9pbmZvXCIsXG4gICAgdGl0bGU6IFwiU3RhY2tPdmVyZmxvd1wiLFxuICAgIGljb246IFwiZmEtc3RhY2stb3ZlcmZsb3dcIn0sXG4gIHsgaHJlZjogJ2h0dHBzOi8vZ2l0dGVyLmltL2tub2Nrb3V0L2tub2Nrb3V0JyxcbiAgICB0aXRsZTogXCJHaXR0ZXJcIixcbiAgICBpY29uOiBcImZhLWNvbW1lbnRzLW9cIn0sXG4gIHsgaHJlZjogJ2xlZ2FjeS8nLFxuICAgIHRpdGxlOiBcIkxlZ2FjeSB3ZWJzaXRlXCIsXG4gICAgaWNvbjogXCJmYSBmYS1oaXN0b3J5XCJ9XG5dXG5cblxud2luZG93LmNkbiA9IFtcbiAgeyBuYW1lOiBcIk1pY3Jvc29mdCBDRE5cIixcbiAgICB2ZXJzaW9uOiBcIjMuMy4wXCIsXG4gICAgbWluOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5qc1wiLFxuICAgIGRlYnVnOiBcImh0dHA6Ly9hamF4LmFzcG5ldGNkbi5jb20vYWpheC9rbm9ja291dC9rbm9ja291dC0zLjMuMC5kZWJ1Zy5qc1wiXG4gIH0sXG4gIHsgbmFtZTogXCJDbG91ZEZsYXJlIENETlwiLFxuICAgIHZlcnNpb246IFwiMy4zLjBcIixcbiAgICBtaW46IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtZGVidWcuanNcIixcbiAgICBkZWJ1ZzogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1taW4uanNcIlxuICB9XG5dXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=