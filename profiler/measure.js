/* 
 * @title: NaiveBayesClassifier-profiler
 * @author: Hadi Michael (http://hadi.io)
 * @license: BSD-3-Clause, see LICENSE file
*/

'use strict';

var util = require('util'),
	profiler = require('v8-profiler'),
	fs = require('fs'),
	jsonfile = require('jsonfile'),
	NaiveBayesClassifier = require('../dist/NaiveBayesClassifier');

var EXPORT_RESULTS = !!process.env.EXPORT;

// Configure directories
//==============================================================
var WORKING_FILE = __dirname + '/data/wiki/sportx10.txt';

var now = new Date(),
	month = (now.getMonth()+1) < 10 ? '0' + (now.getMonth()+1) : (now.getMonth()+1);

var SESSION_DIR = now.getFullYear() + month + ('00' + now.getDate()).slice(-2) + '-' + 
			('00' + now.getHours()).slice(-2)  + ('00' + now.getMinutes()).slice(-2)  + ('00' + now.getSeconds()).slice(-2),
	MEASUREMENTS_DIR = __dirname + '/measurements/' + SESSION_DIR + '/';

// Make sure that the folder we want to work in, exists
//==============================================================
var ensureExists = function (path, mask, cb) {
	if (typeof mask === 'function') { // allow the `mask` parameter to be optional
		cb = mask;
		mask = '0777';
	}

	fs.mkdir(path, mask, function(err) {
		if (err) {
			if (err.code === 'EEXIST') {
				cb(null); // ignore the error if the folder already exists
			} else {
				cb(err); // something else went wrong
			}
		} else {
			cb(null); // successfully created folder
		}
	});
};

// Save snapshot of heap at the current moment
//==============================================================
var saveHeapSnapshot = function(fileName) {
	if (!EXPORT_RESULTS) { return; }

	var snapshot = profiler.takeSnapshot('heap');

	ensureExists(MEASUREMENTS_DIR, '0744', function(err) {
		if (err) { throw err; }
		
		var buffer = '';

		snapshot.serialize(
			function iterator(data) {
				buffer += data;
			},function complete(){
				fs.writeFile(MEASUREMENTS_DIR + fileName, buffer, function (err) {
					if (err) { throw err; }

					console.log('Saved `' + fileName + '` in `' + SESSION_DIR + '`');
				});
			}
		);
	});
};

// Save CPU profile
//==============================================================
var saveCpuProfile = function(cpuProfile) {
	if (!EXPORT_RESULTS) { return; }

	// console.log(cpuProfile.title);

	ensureExists(MEASUREMENTS_DIR, '0744', function(err) {
		if (err) { throw err; }

		var fileName = (cpuProfile.title || 'profile') + '.cpuprofile';

		jsonfile.writeFile(MEASUREMENTS_DIR + fileName, cpuProfile, function (err) {
			if (err) { throw err; }

			console.log('Saved `' + fileName + '` in `' + SESSION_DIR + '`');
		});
	});
};

// This is where the magic happens!
//==============================================================
var classifierSanityCheck = function classifierSanityCheck(classifier) {
	//Classifier sanity check
	console.log('wordCount.sport: %d | vocabularySize: %d', classifier.wordCount.sport, classifier.vocabularySize);
};

// Learn from file system
//==============================================================
var learnFromFile = function fromFile() {
	var classifier = new NaiveBayesClassifier();

	console.log(util.inspect(process.memoryUsage()));
	saveHeapSnapshot('file_heap_start.heapsnapshot');

	fs.readFile(WORKING_FILE, 'utf8', function(err, data) {
		if (err) { throw err; }

		console.time('file_learn');
		profiler.startProfiling('file_cpu_profile');

		classifier.learn(data, 'sport');
		var cpuProfile = profiler.stopProfiling('file_cpu_profile');
		console.timeEnd('file_learn');

		data = null; //clear data which marks it for GC, to be fair on memory assessment

		saveHeapSnapshot('file_heap_end.heapsnapshot');
		console.log(util.inspect(process.memoryUsage()));

		saveCpuProfile(cpuProfile);

		classifierSanityCheck(classifier);
	});
};

// Learn from stream
//==============================================================
var learnFromStream = function learnFromStream() {
	var classifier = new NaiveBayesClassifier(),
		readableStream = fs.createReadStream(WORKING_FILE),
		learnStream = classifier.createLearnStreamForCategory('sport'),
		encoding = 'utf8';

	readableStream.setEncoding(encoding);

	console.log(util.inspect(process.memoryUsage()));
	saveHeapSnapshot('stream_heap_start.heapsnapshot');

	console.time('stream_learn');
	profiler.startProfiling('stream_cpu_profile');

	// At this stage, we can .pipe to the learnStream but
	//  because we're learning text, we don't want words
	//  to get cut half-way, so we use a .on('data') to buffer
	// We could do this in a stream.transform

	// readableStream.pipe(learnStream); //<-- this works, but not for our application

	var buffer = '';
	readableStream.on('data', function(chunk) {
		// console.log('got %d characters of string data', chunk.length);

		var lastSpace = chunk.lastIndexOf(' ');
		learnStream.write([buffer,chunk.substr(0,lastSpace)].join(), encoding);
		buffer = chunk.substr(lastSpace,chunk.length-1);
	});

	readableStream.on('end', function() {
		var cpuProfile = profiler.stopProfiling('stream_cpu_profile');
		console.timeEnd('stream_learn');

		saveHeapSnapshot('stream_heap_end.heapsnapshot');
		console.log(util.inspect(process.memoryUsage()));
		saveCpuProfile(cpuProfile);

		classifierSanityCheck(classifier);
	});
};

// Call benchmark functions, one at a time
//==============================================================
// learnFromStream();
learnFromFile();
