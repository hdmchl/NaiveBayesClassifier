'use strict';

var assert = require('assert'),
	NaiveBayesClassifier = require('../dist/NaiveBayesClassifier');

describe('classifier correctness', function () {
	//sentiment analysis test
	it('should categorizes correctly for `positive` and `negative` categories', function (done) {

		var classifier = new NaiveBayesClassifier();

		//teach it positive phrases
		classifier.learn('amazing, awesome movie!! Yeah!!', 'positive');
		classifier.learn('Sweet, this is incredibly, amazing, perfect, great!!', 'positive');

		//teach it a negative phrase
		classifier.learn('terrible, shitty thing. Damn. Sucks!!', 'negative');

		//teach it a neutral phrase
		classifier.learn('I don\'t really know what to make of this constructor', 'neutral');

		//now test it to see that it correctly categorizes a new document
		assert.equal(classifier.categorize('awesome, cool, amazing!! Yay.').category, 'positive');

		done();
	});

	//topic analysis test
	it('should categorizes correctly for `chinese` and `japanese` categories', function (done) {

		var classifier = new NaiveBayesClassifier();

		//teach it how to identify the `chinese` category
		classifier.learn('Chinese Beijing Chinese', 'chinese');
		classifier.learn('Chinese Chinese Shanghai', 'chinese');
		classifier.learn('Chinese Macao', 'chinese');

		//teach it how to identify the `japanese` category
		classifier.learn('Tokyo Japan Chinese', 'japanese');

		//make sure it learned the `chinese` category correctly
		assert.equal(classifier.dataStore.getTokenFrequencyForCategory('chinese', 'chinese'), 5);
		assert.equal(classifier.dataStore.getTokenFrequencyForCategory('beijing', 'chinese'), 1);
		assert.equal(classifier.dataStore.getTokenFrequencyForCategory('shanghai', 'chinese'), 1);
		assert.equal(classifier.dataStore.getTokenFrequencyForCategory('macao', 'chinese'), 1);

		//make sure it learned the `japanese` category correctly
		assert.equal( classifier.dataStore.getTokenFrequencyForCategory('tokyo', 'japanese'), 1);
		assert.equal( classifier.dataStore.getTokenFrequencyForCategory('japan', 'japanese'), 1);
		assert.equal( classifier.dataStore.getTokenFrequencyForCategory('chinese', 'japanese'), 1);

		//now test it to see that it correctly categorizes a new document
		var classification = classifier.categorize('Chinese Chinese Chinese Japan Tokyo');
		assert.equal(classification.category, 'chinese');
		assert(Math.round(classification.probability*10000)/10000 === 0.6898, 'probability of chinese category (' + classification.probability + ') should be approximately 0.6898');

		done();
	});
});