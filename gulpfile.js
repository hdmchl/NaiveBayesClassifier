'use strict';

var pkg = require('./package.json'),
	gulp = require('gulp'),
	concat = require('gulp-concat'),
	umd = require('gulp-umd'),
	minify = require('gulp-minify'),
	jshint = require('gulp-jshint'),
	mocha = require('gulp-mocha'),
	ghPages = require('gulp-gh-pages');

var path = {
	scripts: 'src/*.js',
	dist: 'dist/*.js',
	test: 'test/NaiveBayesClassifier-test.js',
	readme: 'README.md',
	docs: './docs/NaiveBayesClassifier/' + pkg.version + '/**/*.*'
};

require('gulp-grunt')(gulp); // Require all grunt tasks, we need this because grunt-jsdoc is better than the gulp alternative

gulp.task('docs', function () {
	gulp.start('grunt-jsdoc');
});

gulp.task('build', function() {
	gulp.src(path.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(concat('NaiveBayesClassifier.js'))
		.pipe(umd()) // Ship in 'regular module' UMD format: returnExports.js
		.pipe(minify())
		.pipe(gulp.dest('./dist/'));
});

gulp.task('test', function() {
	gulp.start('build');
	gulp.src(path.test)
		.pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', function() {
	gulp.start('build', 'test', 'docs');
});

gulp.task('deploy', function() {
	return gulp.src(path.docs)
		.pipe(ghPages({
			force: true,
			cacheDir: '.deploy'
		}));
});

// Build, test and generate docs, every time we update the code
gulp.task('watch', function() {
  gulp.watch(path.scripts, ['default']);
  gulp.watch(path.readme, ['docs']);
  gulp.watch(path.test, ['test']);
});