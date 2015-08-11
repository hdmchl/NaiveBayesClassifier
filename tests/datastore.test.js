'use strict';

var assert = require('assert'),
	NaiveBayesClassifier = require('../dist/NaiveBayesClassifier');

describe('datastore self-initialisation', function () {
	it('should occur for vocabulary', function (done) {
		var classifier = new NaiveBayesClassifier();

		// VOCABULARY
		// =============================================================================
		classifier.dataStore.addAmountToTokenFrequencyForCategory(1, 'myRandomToken', 'myCategory');
		assert.equal( classifier.dataStore.getVocabularySize(), 1);

		classifier.dataStore.addAmountToTokenFrequencyForCategory(1, '123', 'myCategory');
		classifier.dataStore.addAmountToTokenFrequencyForCategory(2, '', 'myCategory');
		assert.equal( classifier.dataStore.getVocabularySize(), 3);

		//classifier.dataStore._addTokenToVocabulary(undefined);

		done();
	});

	//it('should raise a TypeError when passed invalid options', function () {
	//	var invalidOptions = [ undefined, null ];
	//
	//	invalidOptions.forEach(function (invalidOption) {
	//		assert.throws(function () { new NaiveBayesClassifier(invalidOption); }, Error);
	//		assert.throws(function () { new NaiveBayesClassifier(invalidOption); }, TypeError); // check that it's a TypeError
	//	});
	//});


	it('should occur for categories', function (done) {
		var classifier = new NaiveBayesClassifier();

		// CATEGORIES
		// =============================================================================
		assert.equal( classifier.dataStore.getCategories().size, 0);

		classifier.dataStore.add1DocForCategory('myCategoryName');
		assert.equal( classifier.dataStore.getCategories().size, 1);
		assert.equal( classifier.dataStore.getNumberOfDocsForCategory('myCategoryName'), 1);


		done();
	});
});