'use strict';

var assert = require('assert'),
	NaiveBayesClassifier = require('../dist/NaiveBayesClassifier');

var validTokenOptions = [ true, false, 0, 123, 123.45, 'my spaced string', 'stringNoSpace', '' ];
var invalidTokenOptions = [ function(){}, null, undefined, NaN, {}, {a:'b'}, [], ['a','b'], [1,2] ];
var validAmounts = [0, 1, 5, 20, 100, '0', '2', '50'];
var invalidAmounts = ['', 'a string', true, false, function(){}, undefined, null, NaN, {}, {a:1}, [], [1,2,3], ['', 'a']];

describe('DataStore sanitization and vocabulary add/size functions', function () {
	it('should add a valid token to its vocabulary', function(done) {
		var classifier = new NaiveBayesClassifier();

		assert.deepEqual(classifier.dataStore, {});
		assert.equal(classifier.dataStore.getVocabularySize(), 0);

		validTokenOptions.forEach(function(validOption) {
			classifier.dataStore.addTokenToVocabulary(validOption);
		});

		assert.equal(classifier.dataStore.getVocabularySize(), validTokenOptions.length);

		done();
	});

	it('should raise an Error when asked to add an invalid token to its vocabulary', function(done) {
		var classifier = new NaiveBayesClassifier();

		assert.deepEqual(classifier.dataStore, {});
		assert.equal(classifier.dataStore.getVocabularySize(), 0);

		invalidTokenOptions.forEach(function (invalidOption) {
			assert.throws(function() { classifier.dataStore.addTokenToVocabulary(invalidOption); }, TypeError);
		});

		assert.equal(classifier.dataStore.getVocabularySize(), 0);

		done();
	});
});

describe('DataStore document and document[category] counting', function() {
	it('should increment the number of documents for a category with a valid name by exactly one', function(done) {
		var classifier = new NaiveBayesClassifier();

		assert.deepEqual(classifier.dataStore, {});
		assert.equal(classifier.dataStore.getTotalNumberOfDocuments(), 0);

		validTokenOptions.forEach(function(validOption) {
			classifier.dataStore.incrementNumberOfDocsForCategory(validOption);
		});

		validTokenOptions.forEach(function(validOption) {
			assert.equal(classifier.dataStore.getNumberOfDocsForCategory(validOption), 1);
		});

		assert.equal(classifier.dataStore.getTotalNumberOfDocuments(), validTokenOptions.length);

		//and have all the categories captured in a set, probably should be its own unit test
		let categories = classifier.dataStore.getCategories();
		validTokenOptions.forEach(function(validOption) {
			assert.equal(categories.has(validOption.toString()), true);
		});

		done();
	});

	it('should raise an Error when passed a category with an invalid name', function(done) {
		var classifier = new NaiveBayesClassifier();

		assert.deepEqual(classifier.dataStore, {});
		assert.equal(classifier.dataStore.getTotalNumberOfDocuments(), 0);
		assert.deepEqual(classifier.dataStore.getCategories(), new Set());

		invalidTokenOptions.forEach(function(invalidOption) {
			assert.throws(function() { classifier.dataStore.incrementNumberOfDocsForCategory(invalidOption); }, TypeError);
		});

		invalidTokenOptions.forEach(function(invalidOption) {
			assert.throws(function() { classifier.dataStore.getNumberOfDocsForCategory(invalidOption); }, TypeError);
		});

		assert.equal(classifier.dataStore.getTotalNumberOfDocuments(), 0);
		assert.deepEqual(classifier.dataStore.getCategories(), new Set());

		done();
	});
});

describe('DataStore token counting', function() {
	it('should increment the number of tokens for a category with a valid name by specified amount', function(done) {
		var classifier = new NaiveBayesClassifier();

		assert.deepEqual(classifier.dataStore, {});

		var total = 0;

		validAmounts.forEach(function(amount) {
			total += parseInt(amount);
			validTokenOptions.forEach(function(validOption) {
				classifier.dataStore.incrementNumberOfTokensPerCategoryByAmount(validOption, amount);

				assert.equal(classifier.dataStore.getNumberOfTokensForCategory(validOption), total);
			});
		});

		done();
	});

	it('should raise a TypeError when passed a category with an invalid name', function(done) {
		var classifier = new NaiveBayesClassifier();

		assert.deepEqual(classifier.dataStore, {});

		var validAmount = validAmounts[1];

		invalidTokenOptions.forEach(function(invalidOption) {
			assert.throws(function() {classifier.dataStore.incrementNumberOfTokensPerCategoryByAmount(invalidOption, validAmount); }, TypeError);
			assert.throws(function() {classifier.dataStore.getNumberOfTokensForCategory(invalidOption); }, TypeError);
		});

		done();
	});

	it('should raise a TypeError when passed an invalid amount', function(done) {
		var classifier = new NaiveBayesClassifier();

		assert.deepEqual(classifier.dataStore, {});

		var validOption = validTokenOptions[0];
		var originalAmount = classifier.dataStore.getNumberOfTokensForCategory(validOption);

		invalidAmounts.forEach(function(invalidAmount) {
			assert.throws(function() { classifier.dataStore.incrementNumberOfTokensPerCategoryByAmount(validOption, invalidAmount); }, TypeError);

			assert.equal(classifier.dataStore.getNumberOfTokensForCategory(validOption), originalAmount);
		});

		done();

	});
});

describe('DataStore token frequency counting', function() {
	it('should increment the frequency of a token in a category with a valid name by specified amount', function(done) {
		var classifier = new NaiveBayesClassifier();

		assert.deepEqual(classifier.dataStore, {});

		var total = 0;

		validAmounts.forEach(function(amount) {
			total += parseInt(amount);
			validTokenOptions.forEach(function(validOption) {
				classifier.dataStore.incrementTokenFrequencyForCategoryByAmount(validOption, validOption, amount);

				assert.equal(classifier.dataStore.getTokenFrequencyForCategory(validOption, validOption), total);
			});
		});

		done();
	});

	it('should raise a TypeError when passed a category or token with an invalid name', function(done) {
		var classifier = new NaiveBayesClassifier();

		assert.deepEqual(classifier.dataStore, {});

		var validAmount = validAmounts[1];
		var validOption = validTokenOptions[0];

		invalidTokenOptions.forEach(function(invalidOption) {
			assert.throws(function() {classifier.dataStore.incrementTokenFrequencyForCategoryByAmount(validOption, invalidOption, validAmount); }, TypeError);
			assert.throws(function() {classifier.dataStore.getTokenFrequencyForCategory(validOption, invalidOption); }, TypeError);

			assert.throws(function() {classifier.dataStore.incrementTokenFrequencyForCategoryByAmount(invalidOption, validOption, validAmount); }, TypeError);
			assert.throws(function() {classifier.dataStore.getTokenFrequencyForCategory(invalidOption, validOption); }, TypeError);
		});

		done();
	});

	it('should raise a TypeError when passed an invalid amount', function(done) {
		var classifier = new NaiveBayesClassifier();

		assert.deepEqual(classifier.dataStore, {});

		var validOption = validTokenOptions[0];

		var originalAmount = classifier.dataStore.getNumberOfTokensForCategory(validOption, validOption);

		invalidAmounts.forEach(function(invalidAmount) {
			assert.throws(function() { classifier.dataStore.incrementTokenFrequencyForCategoryByAmount(validOption, validOption, invalidAmount); }, TypeError);

			assert.equal(classifier.dataStore.getTokenFrequencyForCategory(validOption, validOption), originalAmount);
		});

		done();
	});

});
