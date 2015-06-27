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
	NaiveBayesClassifier = require('../dist/NaiveBayesClassifier'),
	classifier = new NaiveBayesClassifier();

// Configure directories
//==============================================================
var WORKING_FILE = __dirname + '/data/wiki/sport.txt';

var now = new Date(),
	month = (now.getMonth()+1) < 10 ? '0' + (now.getMonth()+1) : (now.getMonth()+1);

var SESSION_DIR = now.getFullYear() + month + now.getDate() + '-' + now.getHours()  + now.getMinutes()  + now.getSeconds(),
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
	// console.log(cpuProfile);

	ensureExists(MEASUREMENTS_DIR, '0744', function(err) {
		if (err) { throw err; }

		var fileName = 'profile.cpuprofile';

		jsonfile.writeFile(MEASUREMENTS_DIR + fileName, cpuProfile, function (err) {
			if (err) { throw err; }

			console.log('Saved `' + fileName + '` in `' + SESSION_DIR + '`');
		});
	});
};

// This is where the magic happens! Load text and profile classifier
//==============================================================
fs.readFile(WORKING_FILE, 'UTF8', function(err, data) {
	if (err) { throw err; }

	/* LEARN */
	console.log(util.inspect(process.memoryUsage()));
	saveHeapSnapshot('heap_start.heapsnapshot');

	console.time('learn');
	profiler.startProfiling('cpu_profile');

	classifier.learn(data, 'sport');
	
	var cpuProfile = profiler.stopProfiling('cpu_profile');
	console.timeEnd('learn');

	saveHeapSnapshot('heap_end.heapsnapshot');
	console.log(util.inspect(process.memoryUsage()));

	saveCpuProfile(cpuProfile);
	/* /LEARN */

	/* CATEGORIZE: placeholder */
	// console.time('categorize');

	// var category = classifier.categorize('Western Bulldogs hold off late charge by St Kilda');

	// console.timeEnd('categorize');

	// console.log(category);
	/* /CATEGORIZE */
});