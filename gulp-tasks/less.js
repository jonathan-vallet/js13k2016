var config        = require('../gulp-config');
var gulp          = require('gulp');
var plumber       = require('gulp-plumber');
var less          = require('gulp-less');
var autoprefixer  = require('gulp-autoprefixer');
var notify        = require('gulp-notify');
var concat        = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var gulpif = require('gulp-if');
var util = require('gulp-util');
var browserSync = require('browser-sync');

module.exports = function() {
    return gulp.src(config.source.cssCompileFileList)
        .pipe(plumber({errorHandler: notify.onError({
            message: "<%= error.message %>",
            title: "Less Error"
        })}))
        .pipe(gulpif(!util.env.production, sourcemaps.init()))
        .pipe(less())
        // .pipe(concat(config.destination.cssFileName))
        .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie 9'] }))
        .pipe(gulpif(util.env.production, minifyCss()))
        .pipe(gulpif(!util.env.prodction, sourcemaps.write()))
        .pipe(gulp.dest(config.destination.assetsFolder + config.destination.cssFolderName))
        .pipe(browserSync.stream())
        .pipe(notify('Successfully compiled Less'))
};