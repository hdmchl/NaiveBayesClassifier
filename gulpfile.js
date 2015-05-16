'use strict';

var pkg = require('./package.json'),
	gulp = require('gulp'),
	umd = require('gulp-umd'),
	minify = require('gulp-minify'),
	jshint = require('gulp-jshint');

require('gulp-grunt')(gulp); //require all grunt tasks, we need this because grunt-jsdoc is better than the gulp alternative

gulp.task('docs', function () {
	gulp.start('grunt-jsdoc');
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