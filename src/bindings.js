/* global ace */

ko.bindingHandlers.editor = {
  /* highlight: "langauge" */
  init: function (element) {
    var editor = ace.edit(element)
    editor.setTheme("ace/theme/solarized_dark")
    editor.getSession().setMode("ace/mode/javascript")
  }
}
