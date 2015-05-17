module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		jsdoc : {
			dist : {
				src: ['src/*.js', 'README.md', 'package.json'],
				options: {
					destination: 'docs',
					template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
					configure: 'jsdoc.conf.json'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-jsdoc');
};
