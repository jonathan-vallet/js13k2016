var config        = require('../gulp-config');
var gulp          = require('gulp');
var plumber       = require('gulp-plumber');
var notify        = require('gulp-notify');

var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');

module.exports = function() {
  return gulp.src(config.source.fontIconFileList)
      .pipe(plumber({errorHandler: notify.onError({
          message: "<%= error.message %>",
          title: "Views Error"
      })}))
      .pipe(iconfontCss({
        fontName: config.destination.fontIconFontName,
        path: 'less',
        targetPath: config.destination.fontIconLessFile,
        fontPath: '../fonts/'
      }))
      .pipe(iconfont({
        fontName: config.destination.fontIconFontName,
        formats: ['ttf', 'eot', 'woff', 'woff2']
      }))
      .pipe(gulp.dest(config.destination.fontIconFontFolderFile))
      .pipe(notify({message: 'Successfully compiled SVG font icon', onLast: true}))
      .on('error', function() {
        this.emit("error", new Error("SVG font icon compilation Error"));
      });
};
