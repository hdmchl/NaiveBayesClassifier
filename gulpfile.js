'use strict';

var pkg = require('./package.json'),
	gulp = require('gulp'),
	umd = require('gulp-umd'),
	minify = require('gulp-minify'),
	jshint = require('gulp-jshint'),
	mocha = require('gulp-mocha');

var path = {
	scripts: 'src/*.js',
	dist: 'dist/*.js',
	readme: 'README.md'
};

require('gulp-grunt')(gulp); // Require all grunt tasks, we need this because grunt-jsdoc is better than the gulp alternative

gulp.task('docs', function () {
	gulp.start('grunt-jsdoc');
});

gulp.task('build', function() {
	gulp.src(path.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(umd()) // Ship in 'regular module' UMD format: returnExports.js
		.pipe(minify())
		.pipe(gulp.dest('./dist/'));
});

gulp.task('test', function() {
	gulp.src(path.dist)
		.pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', function() {
	gulp.run('build', 'test', 'docs');
});

// Build and generate docs, every time we update the code
gulp.task('watch', function() {
  gulp.watch(path.scripts, ['default']);
  gulp.watch(path.readme, ['docs']);
});