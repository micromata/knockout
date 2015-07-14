---
title: Plugins
---
<h1>
  Plugins
  <input type='search' placeholder='Search' data-bind='textInput: plugins.needle' />
</h1>

<table class='pure-table pure-table-horizontal pure-table-striped'>
  <thead>
    <tr>
      <th>Repository</th>
      <th>About</th>
    </tr>
  </thead>
  <tbody data-bind='foreach: plugins.sortedPluginRepos'>
    <tr>
      <td class='plugin-repo'>
        <a href='{{ html_url }}'>{{ name }}</a>
      </td>
      <td>
        {{# template: "plugins-td" /}}
      </td>
    </tr>
  </tbody>
</table>
