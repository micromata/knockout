//
// Gulp Tasks
// ----------
//

var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var _ = require('lodash')


Object.defineProperty(global, 'config', {
  get:  _.debounce(function config() {
    return fs.readFileSync('./config.yaml', { encoding: 'utf8' })
  }, 100)
})


function make_appcache() {
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


gulp.task('make:appcache', make_appcache)


gulp.task('make:libs.js', function () {
  gulp.src(config['libs.js'].src)
    .pipe(plugins.concat(config['libs.js'].filename))
    // .pipe(plugins.replace("# sourceMappingURL=jquery.min.map", ""))
    // .pipe(plugins.replace("# sourceMappingURL=knockout.validation.min.js.map", ""))
    .pipe(gulp.dest(config['libs.js'].dest))
})


gulp.task('make:app.js', function () {
  return gulp.src(config['app.js'].src)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.babel())
      .pipe(plugins.concat(config['app.js'].dest))
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(gulp.dest('dist'));
})


gulp.task('make:css', function () {
  var LessPluginAutoPrefix = require('less-plugin-autoprefix')
  var autoprefix = new LessPluginAutoPrefix()
  var options = {
    paths: ["less", "bower_components"],
    plugins: [autoprefix],
  }
  return gulp.src(config.less.src)
    .pipe(plugins.less(options).on('error', gutil.log))
    .on('error', function(err) {
      console.log(err.message.red)
      this.emit('end')
    })
    .pipe(gulp.dest(config.less.dest))
})


gulp.task("make:templates", function () {
  return gulp.src(config.templates.src)
    .pipe(plugins.header("<!--     ${file.history}    -->"))
    .pipe(plugins.concat(config.templates.filename))
    .pipe(gulp.dest(config.templates.dest))
})

gulp.task("make:opine", function () {

})


gulp.task('watch', function () {
  gulp.watch(config.templates.src, ['make:templates'])
  gulp.watch(['build/*.js', 'build/*.html'], ['make:appcache'])
  gulp.watch('less/**/*.less', ['make:css'])
})


gulp.task('default')
