/*globals Example */
/* eslint no-unused-vars: 0, camelcase:0*/

var EXTERNAL_INCLUDES = [
  "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.debug.js",
  "https://cdn.rawgit.com/mbest/knockout.punches/v0.5.1/knockout.punches.js"
]

class LiveExampleComponent {
  constructor(params) {
    this.example = params.id
  }

  openCommonSettings() {
    var exId = ko.unwrap(this.example)
    var ex = Example.get(exId)
    var dated = new Date().toLocaleString()
    var jsPrefix = `/**
 * Created from an example (${exId}) on the Knockout website
 * on ${new Date().toLocaleString()}
 **/

 /* For convenience and consistency we've enabled the ko
  * punches library for this example.
  */
 ko.punches.enableAll()

 /** Example is as follows **/
`
    return {
      html: ex.html(),
      js: jsPrefix + ex.finalJavascript(),
      title: `From Knockout example (${exId})`,
      description: `Created on ${dated}`
    }
  }

  openFiddle(self, evt) {
    // See: http://doc.jsfiddle.net/api/post.html
    evt.preventDefault()
    evt.stopPropagation()
    var fields = ko.utils.extend({
      dtd: "HTML 5",
      wrap: 'l',
      resources: EXTERNAL_INCLUDES.join(",")
    }, this.openCommonSettings())
    var form = $(`<form action="http://jsfiddle.net/api/post/library/pure/"
      method="POST" target="_blank">
      </form>`)
    $.each(fields, function(k, v) {
      form.append(
        $(`<input type='hidden' name='${k}'>`).val(v)
      )
    })

    form.submit()
  }

  openPen(self, evt) {
    // See: http://blog.codepen.io/documentation/api/prefill/
    evt.preventDefault()
    evt.stopPropagation()
    var opts = ko.utils.extend({
      js_external: EXTERNAL_INCLUDES.join(";")
    }, this.openCommonSettings())
    var dataStr = JSON.stringify(opts)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")

    $(`<form action="http://codepen.io/pen/define" method="POST" target="_blank">
      <input type='hidden' name='data' value='${dataStr}'/>
    </form>`).submit()
  }
}

ko.components.register('live-example', {
    viewModel: LiveExampleComponent,
    template: {element: "live-example"}
})
