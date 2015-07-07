//
// Gulp Tasks
// ----------
//
/*eslint no-undef: 0*/

var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var _ = require('lodash')
var fs = require('fs')
var yaml = require('js-yaml')
var request = require('request')


Object.defineProperty(global, 'config', {
  get: _.throttle(function config() {
    return yaml.safeLoad(
      fs.readFileSync('./config.yaml', { encoding: 'utf8' })
    )
  }, 100)
})


function makeAppcache() {
  var isotime = new Date().toISOString()
  var manifest = config.appcache.manifest.replace("$ISOTIME", isotime)
  fs.writeFileSync(config.appcache.target, manifest)
  console.log("\n\t🎁  \tAppcache rebuilt. \n ")
}


gulp.task('karma', function (done) {
  var karmaServer = require('karma').server
  karmaServer.start(config.karma, done)
})


gulp.task('eslint', function () {
  return gulp.src('**/*.js')
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())

})


gulp.task('make:appcache', _.throttle(makeAppcache, 100))


gulp.task('make:libs', function () {
  gulp.src(config['libs.js'].src)
    .pipe(plugins.concat(config['libs.js'].filename))
    // .pipe(plugins.replace("# sourceMappingURL=jquery.min.map", ""))
    // .pipe(plugins.replace("# sourceMappingURL=knockout.validation.min.js.map", ""))
    .pipe(gulp.dest(config['libs.js'].dest))
})


gulp.task('make:app', function () {
  return gulp.src(config['app.js'].src)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.babel(config['app.js']['babel-config']))
      .on('error', function (err) {
        plugins.util.log(err.message)
        console.log("---", err.stack)
        this.emit('end')
      })
      .pipe(plugins.concat(config['app.js'].name))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(config['app.js'].dest))
})


gulp.task('make:css', function () {
  var LessPluginAutoPrefix = require('less-plugin-autoprefix')
  var autoprefix = new LessPluginAutoPrefix()
  var options = {
    paths: ["less", "bower_components"],
    plugins: [autoprefix]
  }
  return gulp.src(config.less.src)
    .pipe(plugins.less(options).on('error', plugins.util.log))
    .on('error', function(err) {
      plugins.util.log(err.message.red)
      this.emit('end')
    })
    .pipe(gulp.dest(config.less.dest))
})


gulp.task("make:templates", function () {
  return gulp.src(config.templates.src)
    // file.history is ~ ["/full/path/to/templates/file.html"]
    // file.cwd is ~ "/full/path/to"
    .pipe(plugins.header("<!--     ${file.history[0].substr(file.cwd.length)}    -->\n"))
    .pipe(plugins.concat(config.templates.filename))
    .pipe(gulp.dest(config.templates.dest))
})

gulp.task("make:examples", function () {
  gulp.src(config.examples.src)
    .pipe(plugins.yaml(config.examples.settings))
    .pipe(plugins.jsoncombine(config.examples.filename, function (data) {
      return new Buffer(JSON.stringify(data))
    }))
    .pipe(gulp.dest(config.examples.dest))
})


function updatePlugins(done) {
  var items = {}
  var repos = config.plugins.list
  try {
    // We track the current to decide if we need to get an update.
    items = JSON.parse(fs.readFileSync(config.plugins.dest))
  } catch (e) {
    items = {}
  }

  function writePlugins() {
    fs.writeFileSync(
      config.plugins.dest, JSON.stringify(items), {encoding: 'utf8'}
    )
    if (done) { done() }
  }

  function getNextRepo() {
    var repo = repos.shift()
    if (!repo) {
      writePlugins()
      return
    }
    function onError(err) {
      console.error("Error (update:plugins) " + repo + ": ", err)
    }
    var token = process.env.GITHUB_PUB_ACCESS_KEY
    request
      .get({
        // Use a public repo access token to get more here, e.g. with
        // ?
        url: "https://api.github.com/repos/" + repo +
          (token ? "?access_token=" + token : ""),
        headers: {
          'User-Agent': 'Knockout-Dev-Docs-Gulpfile',
          'If-None-Match': items[repo] ? items[repo].etag : ''
        }
      }, function (err, response, body) {
        if (err) {
          onError(err)
          return
        }
        if (response.statusCode === 200) {
          plugins.util.log("update:plugins  🌎  " + repo)
          items[repo] = JSON.parse(body)
          items[repo].etag = response.headers.etag
        } else if (response.statusCode === 304) {
          plugins.util.log("update:plugins  ✅ (from cache) " + repo)
        } else {
          onError("😡 Bad response: " + body)
        }
        getNextRepo()
      })
      .on('error', onError)
  }
  // Easy parallelism.
  getNextRepo()
}


gulp.task("update:plugins", updatePlugins)


gulp.task("make:opine", function () {

})


var REMAKE_TASKS = [
  'make:templates', 'make:css', 'make:app', 'make:libs', 'make:examples'
]

gulp.task('watch', REMAKE_TASKS, function () {
  updatePlugins()
  gulp.watch(config.templates.src, ['make:templates'])
  gulp.watch(['build/*'], ['make:appcache'])
  gulp.watch('less/**/*.less', ['make:css'])
  gulp.watch(config['app.js'].src, ['make:app'])
  gulp.watch(config.examples.src, ['make:examples'])
  gulp.watch('config.yaml', REMAKE_TASKS)
})


gulp.task('reload', function () {
  gulp.src('ko.appcache')
    .pipe(plugins.connect.reload())
})


gulp.task('server', ['watch'], function () {
  plugins.connect.server({
    livereload: true,
    port: 8900,
    root: './'
  })
  gulp.watch('ko.appcache', ['reload'])
})



gulp.on('err', function(e) {
  console.log("Gulp Error:", e, e.err.stack)
})
