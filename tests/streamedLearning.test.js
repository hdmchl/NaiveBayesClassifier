'use strict';

var assert = require('assert'),
	NaiveBayesClassifier = require('../dist/NaiveBayesClassifier'),
	fs = require('fs'),
	path = require('path');

describe('Streamed learning', function () {
	it('should correctly learn from a stream', function(done) {
		var classifier = new NaiveBayesClassifier();
		var encoding = 'utf8';

		// AFL
		// =============================================================================
		var	aflReadableStream = fs.createReadStream(path.join(__dirname, 'data/afl.txt')),
			aflLearnStream = classifier.createLearnStreamForCategory('afl');
		aflReadableStream.setEncoding(encoding);

		var aflBuffer = '';
		aflReadableStream.on('data', function(chunk) {
			var lastSpace = chunk.lastIndexOf(' ');
			aflLearnStream.write([aflBuffer,chunk.substr(0,lastSpace)].join(), encoding);
			aflBuffer = chunk.substr(lastSpace,chunk.length-1);
		});

		var aflStreamEnded = false, mlbStreamEnded = false;
		aflReadableStream.on('end', function() {
			aflStreamEnded = true;
			testResults();
		});

		// MLB
		// =============================================================================
		var	mlbReadableStream = fs.createReadStream(path.join(__dirname, 'data/mlb.txt')),
			mlbLearnStream = classifier.createLearnStreamForCategory('mlb');
		mlbReadableStream.setEncoding(encoding);

		var mlbBuffer = '';
		mlbReadableStream.on('data', function(chunk) {
			var lastSpace = chunk.lastIndexOf(' ');
			mlbLearnStream.write([mlbBuffer,chunk.substr(0,lastSpace)].join(), encoding);
			mlbBuffer = chunk.substr(lastSpace,chunk.length-1);
		});

		mlbReadableStream.on('end', function() {
			mlbStreamEnded = true;
			testResults();
		});

		// TEST CLASSIFIER CORRECTNESS
		// =============================================================================
		var testResults = function() {
			if (!aflStreamEnded || !mlbStreamEnded) { return; } //we're not done yet

			assert.equal(classifier.categorize('football').category, 'afl');
			assert.equal(classifier.categorize('carlton').category, 'afl');
			assert.equal(classifier.categorize('Melbourne Cricket Club').category, 'afl');

			assert.equal(classifier.categorize('baseball').category, 'mlb');
			assert.equal(classifier.categorize('yankees').category, 'mlb');
			assert.equal(classifier.categorize('world series').category, 'mlb');

			done();
		};
	});
});