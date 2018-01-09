/**
 *
 * gulpfile v 2.0.0
 *
 */

const gulp = require('gulp');
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const watch = require('gulp-watch');
const rename = require('gulp-rename');
const babelify = require('babelify');
const browserify = require('browserify');
const v_buffer = require('vinyl-buffer');
const v_source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const environments = require('gulp-environments');
const polyfiller = require('gulp-polyfiller');
const concat = require('gulp-concat');
const sass = require('gulp-sass');

// set evironment variables
var development = environments.development; // default
var production = environments.production;

// gulp javascript task - bundle and minify es6 to es5
// creates a sourcemap for dev environment

gulp.task('js', function(){
	var bundler = browserify({
		entries: './src/app/js/utilities.js',
		debug: true
	});
	bundler.transform(babelify, {
		presets: "es2015"
	});

	bundler.bundle()
		.on("error", function(err){ console.error(err); })
		.pipe(v_source('utilities.js'))
		.pipe(v_buffer())
		.pipe(development(sourcemaps.init({ loadMaps: true })))
		.pipe(rename('utilities.min.js'))
		.pipe(production(polyfiller(['Promise'])))
		.pipe(production(concat('utilities.min.js')))
		.pipe(production(uglify()))
		.pipe(development(sourcemaps.write('./')))
		.pipe(gulp.dest('./src/public/js/'));
});

// gulp less task - compile LESS documents
// and minify for prod environment

gulp.task('less', function(){
	return gulp.src('./src/app/styles/style.less')
	.pipe(less().on('error', function(err){
		console.log(err);
	}))
	.pipe(production(cssmin().on('error', function(err){
		console.log(err);
	})))
	.pipe(rename('style.min.css'))
	.pipe(gulp.dest('./src/public/styles/'));
});

// gulp ie task - compile LESS documents for IE
// and minify for prod environment
gulp.task('ie', function(){
	return gulp.src('./src/app/styles/ie.less')
	.pipe(less().on('error', function(err){
		console.log(err);
	}))
	.pipe(production(cssmin().on('error', function(err){
		console.log(err);
	})))
	.pipe(rename('ie.min.css'))
	.pipe(gulp.dest('./src/public/styles/'));
});

// gulp task assets - copy assets to dist directory
gulp.task('assets', function(){
	return gulp.src('./src/app/assets/**/*', { base: './src/app/assets'})
	.pipe(gulp.dest('./src/public/assets/'));
});

// gulp watch task - run and watch all tasks
gulp.task('watch', function () {
	gulp.watch('./src/app/styles/**/**.less', ['less']);
	gulp.watch('./src/app/assets/**/*', ['assets']);
	gulp.watch('./src/app/styles/ie.less', ['ie']);
});

// run all tasks and initiate watch
gulp.task('default', ['less', 'ie', 'assets', 'watch']);
