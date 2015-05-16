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
});

describe('classifier using custom tokenizer', function () {
  it('should use custom tokenization function if one is provided in `options`.', function () {
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

// describe('classifier serializing/deserializing its state', function () {
//   it('serializes/deserializes its state as JSON correctly.', function (done) {
//       var classifier = classifier()

//       classifier.learn('Fun times were had by all', 'positive')
//       classifier.learn('sad dark rainy day in the cave', 'negative')

//       var jsonRepr = classifier.toJson()

//       // check serialized values
//       var state = JSON.parse(jsonRepr)

//       // ensure classifier's state values are all in the json representation
//       classifier.STATE_KEYS.forEach(function (k) {
//         assert.deepEqual(state[k], classifier[k])
//       })

//       var revivedClassifier = classifier.fromJson(jsonRepr)

//       // ensure the revived classifier's state is same as original state
//       classifier.STATE_KEYS.forEach(function (k) {
//         assert.deepEqual(revivedClassifier[k], classifier[k])
//       })

//       done()
//     })
// })

describe('classifier .learn() correctness', function () {
  //sentiment analysis test
  it('categorizes correctly for `positive` and `negative` categories', function (done) {

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
  it('categorizes correctly for `chinese` and `japanese` categories', function (done) {

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
