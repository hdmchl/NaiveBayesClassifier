'use strict';

var pkg = require('./package.json'),
	gulp = require('gulp'),
	webpack = require('webpack-stream'),
	minify = require('gulp-minify'),
	mocha = require('gulp-mocha'),
	ghPages = require('gulp-gh-pages');

var paths = {
	entry: 'src/index.js',
	scripts: 'src/**/*.js',
	tests: 'tests/**/*.js',
	readme: 'README.md',
	docs: './docs/NaiveBayesClassifier/' + pkg.version + '/**/*.*'
};

gulp.task('build', function() {
	return gulp.src(paths.entry)
		.pipe(webpack( require('./webpack.config.js') ))
		.pipe(minify())
		.pipe(gulp.dest('dist'));
});

gulp.task('test', ['build'], function() {
	return gulp.src(paths.tests)
		.pipe(mocha({reporter: 'nyan'}));
});

gulp.task('docs', function () {

});

gulp.task('default', function() {
	gulp.start('build', 'test', 'docs');
});

//gulp.task('deploy', function() {
//	gulp.start('default');
//	return gulp.src(path.docs)
//		.pipe(ghPages({
//			force: true,
//			cacheDir: '.deploy'
//		}));
//});

// Build and test, everytime we update the code
gulp.task('watch', function() {
	gulp.start('build');
	gulp.watch([paths.scripts, paths.tests], ['test'])
		.on('error', function (error) {
			console.error(error);
		});
});