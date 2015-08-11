//'use strict';
//
//var assert = require('assert'),
//    NaiveBayesClassifier = require('../dist/NaiveBayesClassifier');
//
//describe('new NaiveBayesClassifier()', function () {
//  it('should not raise Errors when initialised with valid options (falsey or with an object).', function () {
//    var validOptionsCases = [ null, undefined, {} ];
//
//    validOptionsCases.forEach(function (validOptions) {
//      var classifier = new NaiveBayesClassifier(validOptions);
//      assert.deepEqual(classifier.options, {});
//    });
//  });
//
//  it('should raise a TypeError when initialised with invalid options (truthy and not object).', function () {
//    var invalidOptions = [ true, 1, 'a', [], function(){} ];
//
//    invalidOptions.forEach(function (invalidOption) {
//      assert.throws(function () { new NaiveBayesClassifier(invalidOption); }, Error);
//      assert.throws(function () { new NaiveBayesClassifier(invalidOption); }, TypeError); // check that it's a TypeError
//    });
//  });
//
//  it('should use custom tokenization function, if one is provided in `options`.', function () {
//    var splitOnChar = function (text) {
//      return text.split('');
//    };
//
//    var classifier = new NaiveBayesClassifier({ tokenizer: splitOnChar });
//
//    classifier.learn('abcd', 'happy');
//
//    // check classifier's state is as expected
//    assert.equal(classifier.totalNumberOfDocuments, 1);
//    assert.equal(classifier.docFrequencyCount.happy, 1);
//    assert.deepEqual(classifier.vocabulary, { _a: 1, _b: 1, _c: 1, _d: 1 });
//    assert.equal(classifier.vocabularySize, 4);
//    assert.equal(classifier.wordCount.happy, 4);
//    assert.equal(classifier.wordFrequencyCount.happy._a, 1);
//    assert.equal(classifier.wordFrequencyCount.happy._b, 1);
//    assert.equal(classifier.wordFrequencyCount.happy._c, 1);
//    assert.equal(classifier.wordFrequencyCount.happy._d, 1);
//    assert.deepEqual(classifier.categories, { happy: 1 });
//  });
//});
//
//describe('classifier initialisation and recreation', function () {
//  it('should create a new (identical) classifier from an existing classifer object', function (done) {
//    var firstClassifier = new NaiveBayesClassifier();
//    firstClassifier.learn('Fun times were had by all', 'positive');
//    firstClassifier.learn('sad dark rainy day in the cave', 'negative');
//
//    var secondClassifier = NaiveBayesClassifier.withClassifier(firstClassifier);
//
//    //check that the classifiers are the same
//    assert.equal(JSON.stringify(firstClassifier), JSON.stringify(secondClassifier));
//
//    //and that they return the same kind of results
//    var testPhrase = 'sad rainy times on a great day';
//    assert.deepEqual(firstClassifier.categorize(testPhrase), secondClassifier.categorize(testPhrase));
//
//    done();
//  });
//
//  it('should raise a TypeError if the classifier provided is not of the correct type or has been corrupted', function() {
//    //Test overall object
//    var invalidObjectOptions = [ true, 1, 'a', [], function(){} ];
//
//    invalidObjectOptions.forEach(function (invalidOption) {
//      assert.throws(function () { NaiveBayesClassifier.withClassifier(invalidOption); }, Error);
//      assert.throws(function () { NaiveBayesClassifier.withClassifier(invalidOption); }, TypeError);
//    });
//
//    //Test for corruption
//    var propertiesToTest = ['vocabulary', 'categories', 'docFrequencyCount', 'wordFrequencyCount', 'wordCount'];
//
//    propertiesToTest.forEach(function (property) {
//      var classifer = new NaiveBayesClassifier();
//
//      invalidObjectOptions.forEach(function (invalidOption) {
//        classifer[property] = invalidOption;
//        assert.throws(function () { NaiveBayesClassifier.withClassifier(classifer); }, Error);
//        assert.throws(function () { NaiveBayesClassifier.withClassifier(classifer); }, TypeError);
//      });
//    });
//
//    var invalidNumberOptions = [ -1, {}, true, 'a', [], function(){} ];
//    invalidNumberOptions.forEach(function (invalidOption) {
//      var classifer = new NaiveBayesClassifier();
//      classifer.totalNumberOfDocuments = invalidOption;
//      assert.throws(function () { NaiveBayesClassifier.withClassifier(classifer); }, Error);
//      assert.throws(function () { NaiveBayesClassifier.withClassifier(classifer); }, TypeError);
//    });
//  });
//
//  it('should raise an Error if the version of the current library is different to the existing classifier\'s version', function() {
//    var invalidVersionOptions = [ '', 1, {}, true, 'a', [], function(){} ];
//
//    invalidVersionOptions.forEach(function (invalidOption) {
//      var classifer = new NaiveBayesClassifier();
//      classifer.VERSION = invalidOption;
//      assert.throws(function () { NaiveBayesClassifier.withClassifier(classifer); }, Error);
//    });
//  });
//});
