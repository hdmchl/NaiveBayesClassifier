[![Build Status](https://img.shields.io/travis/hadimichael/NaiveBayesClassifier/master.svg?style=flat)](https://travis-ci.org/hadimichael/NaiveBayesClassifier) [![Join the chat at https://gitter.im/hadimichael/NaiveBayesClassifier](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/hadimichael/NaiveBayesClassifier?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

NaiveBayesClassifier is an implementation of a [Multinomial Naive-Bayes Classifier](http://en.wikipedia.org/wiki/Naive_Bayes_classifier#Multinomial_naive_Bayes) that uses [Laplace Smoothing](http://en.wikipedia.org/wiki/Additive_smoothing). It can take in a piece of text and tell you which category it most likely belongs to.

**I haven't really touched this in a few years... maybe I'll come back to it one day.**

~~# v0.3.0 IS COMING SOON
I'm working on the [next version of NaiveBayesClassifer](https://github.com/hadimichael/NaiveBayesClassifier/tree/v0.3.0). Here are some of the new features that you can expect:
- ✓ Reduced memory (heap) footprint by using Streams.
- ✓ Refactor to ES2015 and use "more appropriate" data-structures.
- Optional persistence, probably using REDIS.
- Asynchronous learning and classifying, using Promises.
- Categorisation speed improvements, using parallelisation via WebWorkers.
- Official node/iojs, Chrome OS and Firefox OS support. Other browsers or short-lived apps should use a web-service.~~

## What is this good for?

"In machine learning, naive Bayes classifiers are a family of simple probabilistic classifiers based on applying Bayes' theorem with strong (naive) independence assumptions between the features." - [Wikipedia: Naive Bayes classifier](http://en.wikipedia.org/wiki/Naive_Bayes_classifier).

You can use this implementation for categorizing any text content into any arbitrary set of categories. For example:

- is an email **spam**, or **not spam**?
- is a news article about **technology**, **politics**, or **sports**?
- is some piece of text **javascript** or **objective-c**?
- is a tweet expressing **positive** sentiment or **negative** sentiment?

Depending on your specific attributes and sample size, there may be other algorithms that are better suited: [Comparison of Classification Methods Based on the Type of Attributes and Sample Size](http://www4.ncsu.edu/~arezaei2/paper/JCIT4-184028_Camera%20Ready.pdf).

# Try it now

You can experiment, test and play with `NaiveBayesClassifier` in your browser at [http://jsbin.com/xixuga/1/edit?html,js,console](http://jsbin.com/xixuga/1/edit?html,js,console)

If you would like to try `NaiveBayesClassifier` as a web-service, you can use: [http://nbcaas.herokuapp.com/](http://nbcaas.herokuapp.com/)

# Installing `NaiveBayesClassifier`

`NaiveBayesClassifier` is shipped in UMD format, meaning that it is available as a CommonJS/AMD module or browser global. You can install it using [`npm`](https://www.npmjs.com/):

```bash
$ npm install naivebayesclassifier
```

OR using [`bower`](http://bower.io/):

```bash
$ bower install naivebayesclassifier
```

# Basic Usage

## `new NaiveBayesClassifier([options])`

Using the default tokenization function, which splits on spaces:
```js
var NaiveBayesClassifier = require('NaiveBayesClassifier'),
	classifier = new NaiveBayesClassifier();
```

Or with an optional custom tokenization function that you specify:
```js
var NaiveBayesClassifier = require('NaiveBayesClassifier');
var splitOnChar = function(text) { 
	return text.split('');
};
var classifier = new NaiveBayesClassifier({ tokenizer: splitOnChar });
```

## `.withClassifier(classifier)`

Recover an existing `classifier`, which you may have retrieved from a database or localstorage:

```js
var NaiveBayesClassifier = require('NaiveBayesClassifier'),
	classifier = NaiveBayesClassifier.withClassifier(existingClassifier);
```

## `.learn(text, category)`

Teach your classifier what `category` the `text` belongs to. The more you teach your classifier, the more reliable it becomes. It will use what it has learned to identify new documents that it hasn't seen before.

```js
classifier.learn('amazing, awesome movie!! Yeah!!', 'positive');
classifier.learn('terrible, shitty thing. Damn. Sucks!!', 'negative');
classifier.learn('I dont really know what to make of this.', 'neutral');
```

## `.categorize(text)`

```js
classifier.categorize('awesome, cool, amazing!! Yay.');
```

This will return the most likely `category` it thinks `text` belongs to and its `probability`. Its judgement is based on what you have taught it with `.learn(text, category)`.

```json
{ 
  "category": "positive",
  "probability": 0.7687012152002337,
  "categories":
   { 
     "positive": 0.7687012152002337,
     "negative": 0.15669449587155299,
     "neutral": 0.07460428892821332
   } 
}
```

## Complete API Documentation

If you would like to explore the full API, you can find auto-generated documentation at: [https://hadi.io/NaiveBayesClassifier](http://hadi.io/NaiveBayesClassifier/NaiveBayesClassifier.html).

# Acknowledgements

The theory and implementation used in this library is based on the [Stanford Natural Language Processing Coursera](https://www.coursera.org/course/nlp) class, by Professor Dan Jurafsky & Chris Manning.

# License

Copyright (C) 2015, Hadi Michael. All rights reserved.

Licensed under [BSD-3-Clause](LICENSE)
