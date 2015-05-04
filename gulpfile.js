'use strict';

var pkg = require('./package.json'),
	gulp = require('gulp'),
	umd = require('gulp-umd'),
	minify = require('gulp-minify'),
	jshint = require('gulp-jshint'),
	documentation = require('gulp-documentation');

var scriptFiles = './src/*.js';

gulp.task('docs', function () {
	gulp.src(scriptFiles)
		.pipe(documentation({ format: 'md' }))
		.pipe(gulp.dest('docs/md-documentation'));

	gulp.src(scriptFiles)
		.pipe(documentation({ format: 'html' }))
		.pipe(gulp.dest('docs/html-documentation'));

	gulp.src(scriptFiles)
		.pipe(documentation({ format: 'json' }))
		.pipe(gulp.dest('docs/json-documentation'));
});

gulp.task('build', function() {
	gulp.src(scriptFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(umd()) //Ship in 'regular module' UMD format: returnExports.js
		.pipe(minify())
		.pipe(gulp.dest('./dist/'));
});

gulp.task('default', function() {
	gulp.run('build', 'docs');
});