'use strict';

var assert = require('assert'),
    NaiveBayesClassifier = require('../dist/NaiveBayesClassifier');

describe('new NaiveBayesClassifier()', function () {
  it('should not raise Errors when initialised with valid options (falsey or with an object).', function () {
    var validOptionsCases = [ null, undefined, {} ];

    validOptionsCases.forEach(function (validOptions) {
      var classifier = new NaiveBayesClassifier(validOptions);
      assert.deepEqual(classifier.options, {});
    });
  });

  it('should raise a TypeError when initialised with invalid options (truthy and not object).', function () {
    var invalidOptions = [ true, 1, 'a', [], function(){} ];

    invalidOptions.forEach(function (invalidOption) {
      assert.throws(function () { new NaiveBayesClassifier(invalidOption); }, Error);
      assert.throws(function () { new NaiveBayesClassifier(invalidOption); }, TypeError); // check that it's a TypeError
    });
  });

  it('should use custom tokenization function, if one is provided in `options`.', function () {
    var splitOnChar = function (text) {
      return text.split('');
    };

    var classifier = new NaiveBayesClassifier({ tokenizer: splitOnChar });

    classifier.learn('abcd', 'happy');

    // check classifier's state is as expected
    assert.equal(classifier.totalNumberOfDocuments, 1);
    assert.equal(classifier.docFrequencyCount.happy, 1);
    assert.deepEqual(classifier.vocabulary, { a: 1, b: 1, c: 1, d: 1 });
    assert.equal(classifier.vocabularySize, 4);
    assert.equal(classifier.wordCount.happy, 4);
    assert.equal(classifier.wordFrequencyCount.happy.a, 1);
    assert.equal(classifier.wordFrequencyCount.happy.b, 1);
    assert.equal(classifier.wordFrequencyCount.happy.c, 1);
    assert.equal(classifier.wordFrequencyCount.happy.d, 1);
    assert.deepEqual(classifier.categories, { happy: 1 });
  });
});

describe('classifier initialisation and recreation', function () {
  it('should create a new (identical) classifier from an existing classifer object', function (done) {
    var firstClassifier = new NaiveBayesClassifier();
    firstClassifier.learn('Fun times were had by all', 'positive');
    firstClassifier.learn('sad dark rainy day in the cave', 'negative');

    var secondClassifier = NaiveBayesClassifier.withClassifier(firstClassifier);

    //check that the classifiers are the same
    assert.equal(JSON.stringify(firstClassifier), JSON.stringify(secondClassifier));

    //and that they return the same kind of results
    var testPhrase = 'sad rainy times on a great day';
    assert.deepEqual(firstClassifier.categorize(testPhrase), secondClassifier.categorize(testPhrase));

    done();
  });

  it('should raise a TypeError if the classifier provided is not of the correct type or has been corrupted', function() {
    //Test overall object
    var invalidObjectOptions = [ true, 1, 'a', [], function(){} ];

    invalidObjectOptions.forEach(function (invalidOption) {
      assert.throws(function () { NaiveBayesClassifier.withClassifier(invalidOption); }, Error);
      assert.throws(function () { NaiveBayesClassifier.withClassifier(invalidOption); }, TypeError);
    });

    //Test for corruption
    var propertiesToTest = ['vocabulary', 'categories', 'docFrequencyCount', 'wordFrequencyCount', 'wordCount'];

    propertiesToTest.forEach(function (property) {
      var classifer = new NaiveBayesClassifier();

      invalidObjectOptions.forEach(function (invalidOption) {
        classifer[property] = invalidOption;
        assert.throws(function () { NaiveBayesClassifier.withClassifier(classifer); }, Error);
        assert.throws(function () { NaiveBayesClassifier.withClassifier(classifer); }, TypeError);
      });
    });

    var invalidNumberOptions = [ -1, {}, true, 'a', [], function(){} ];
    invalidNumberOptions.forEach(function (invalidOption) {
      var classifer = new NaiveBayesClassifier();
      classifer.totalNumberOfDocuments = invalidOption;
      assert.throws(function () { NaiveBayesClassifier.withClassifier(classifer); }, Error);
      assert.throws(function () { NaiveBayesClassifier.withClassifier(classifer); }, TypeError);
    });
  });

  it('should raise an Error if the version of the current library is different to the existing classifier\'s version', function() {
    var invalidVersionOptions = [ '', 1, {}, true, 'a', [], function(){} ];

    invalidVersionOptions.forEach(function (invalidOption) {
      var classifer = new NaiveBayesClassifier();
      classifer.VERSION = invalidOption;
      assert.throws(function () { NaiveBayesClassifier.withClassifier(classifer); }, Error);
    });
  });
});

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
    classifier.learn('I dont really know what to make of this.', 'neutral');

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
    var chineseFrequencyCount = classifier.wordFrequencyCount.chinese;

    assert.equal(chineseFrequencyCount.chinese, 5);
    assert.equal(chineseFrequencyCount.beijing, 1);
    assert.equal(chineseFrequencyCount.shanghai, 1);
    assert.equal(chineseFrequencyCount.macao, 1);

    //make sure it learned the `japanese` category correctly
    var japaneseFrequencyCount = classifier.wordFrequencyCount.japanese;

    assert.equal(japaneseFrequencyCount.tokyo, 1);
    assert.equal(japaneseFrequencyCount.japan, 1);
    assert.equal(japaneseFrequencyCount.chinese, 1);

    //now test it to see that it correctly categorizes a new document
    assert.equal(classifier.categorize('Chinese Chinese Japan Tokyo').category, 'japanese');

    done();
  });
});
