var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var rev = require('gulp-rev');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');

var config = {
    production: gutil.env.env == 'production'
};

gulp.task('default', ['server'])
gulp.task('build', ['version']);

gulp.task("application", function () {
    return gulp.src([
                     'src/math/math.js',
                     'src/math/random.js',
                     'src/gfx/color.js',
                     'src/gfx/texture.js',
                     'src/gfx/sprites.js',
                     'src/level/tile.js',
                     'src/level/map.js',
                     'src/level/level.js',
                     'src/level/base.js',
                     'src/entity/entity.js',
                     'src/entity/mob.js',
                     'src/entity/raider.js',
                     'src/entity/knight.js',
                     'src/entity/priest.js',
                     'src/input.js',
                     'src/game.js',
                     'src/main.js',
                     ])
        .pipe(gulpif(!config.production, sourcemaps.init()))
        .pipe(plumber())
        .pipe(babel({presets: ['es2015']}))
        .pipe(concat("application.js"))
        .pipe(gulpif(!config.production, sourcemaps.write(".")))
        .pipe(gulpif(config.production, uglify()))
        .pipe(gulp.dest("build"));
});

gulp.task('version', ['application'], function() {
  return gulp.src(["build/*.js"])
    .pipe(rev())
    .pipe(rev.manifest({
      path: 'rev-manifest.txt'
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  watch(['src/*.js', 'src/**/*.js', "index.html"], function() {
    gulp.start('version');
  });
});

gulp.task('server', ['version', 'watch'], function() {
  browserSync.init({
    open: true,
    server: {
        baseDir: "./"
    }
  });
  gulp.watch("build/rev-manifest.txt").on('change', browserSync.reload);
});