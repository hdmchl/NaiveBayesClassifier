(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["NaiveBayesClassifier"] = factory();
	else
		root["NaiveBayesClassifier"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * @title: NaiveBayesClassifier
	 * @author: Hadi Michael (http://hadi.io)
	 * @repository: https://github.com/hadimichael/NaiveBayesClassifier
	 * @license: BSD-3-Clause, see LICENSE file
	 */

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _NaiveBayesClassifier = __webpack_require__(2);

	var _NaiveBayesClassifier2 = _interopRequireDefault(_NaiveBayesClassifier);

	var _datastoreDataStore = __webpack_require__(6);

	var _datastoreDataStore2 = _interopRequireDefault(_datastoreDataStore);

	_NaiveBayesClassifier2['default'].VERSION = __webpack_require__(7).version;
	_NaiveBayesClassifier2['default'].DataStore = _datastoreDataStore2['default'];

	module.exports = _NaiveBayesClassifier2['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _learn = __webpack_require__(3);

	var _learn2 = _interopRequireDefault(_learn);

	var _categorize = __webpack_require__(4);

	var _categorize2 = _interopRequireDefault(_categorize);

	var _utilsDefaultTokenizer = __webpack_require__(5);

	var _utilsDefaultTokenizer2 = _interopRequireDefault(_utilsDefaultTokenizer);

	var NaiveBayesClassifier = (function () {
		function NaiveBayesClassifier() {
			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			_classCallCheck(this, NaiveBayesClassifier);

			this.learn = _learn2['default'];
			this.categorize = _categorize2['default'];

			this.VERSION = NaiveBayesClassifier.VERSION;

			// TODO: OPTIONS
			// =============================================================================
			this.tokenizer = options.tokenizer || _utilsDefaultTokenizer2['default'];
			this.dataStore = options.dataStore || new NaiveBayesClassifier.DataStore();
		}

		// UTILITY FUNCTIONS to help with calculations
		// =============================================================================

		_createClass(NaiveBayesClassifier, [{
			key: 'generateFrequencyMapForTokens',
			value: function generateFrequencyMapForTokens(tokens) {
				var frequencyMap = new Map();

				tokens.forEach(function updateFrequencyTableForToken(token) {
					if (!token) {
						return;
					} //skip empty tokens

					var value = (frequencyMap.get(token) || 0) + 1;
					frequencyMap.set(token, value);
				});

				return frequencyMap;
			}
		}, {
			key: 'tokenProbabilityInCategory',
			value: function tokenProbabilityInCategory(token, category) {
				//Recall => P(wi|Cj) = count(wi,cj) / SUM[(for w in v) count(w,cj)]

				//how many times this word has occurred in documents mapped to this category
				var tokenFrequencyCount = this.dataStore.getTokenFrequencyForCategory(token, category); //count(wi,cj)

				//what is the count of all words that have ever been mapped to this category
				var tokenCount = this.dataStore.getNumberOfTokensForCategory(category); //SUM[(for w in v) count(w,cj)

				//use laplace Add-1 Smoothing equation
				//=> ( P(wi|Cj) = count(wi,cj) + 1 ) / ( SUM[(for w in v) count(w,cj)] + |VocabSize| )
				return (tokenFrequencyCount + 1) / (tokenCount + this.dataStore.getVocabularySize());
			}
		}]);

		return NaiveBayesClassifier;
	})();

	exports['default'] = NaiveBayesClassifier;
	;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Train our naive-bayes classifier by telling it what `category` some `text` corresponds to.
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	exports['default'] = learn;

	function learn(text, category) {
		//TODO: do we want to add1DocForCategory on EVERY learn? What about streams...
		this.dataStore.add1DocForCategory(category); //update our count of how many documents mapped to this category

		var tokens = this.tokenizer(text); //break up the text into tokens
		var tokenFrequencyMap = this.generateFrequencyMapForTokens(tokens); //get a frequency count for each token in the text

		// Update our vocabulary and our word frequency counts for this category
		// =============================================================================
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = tokenFrequencyMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var _step$value = _slicedToArray(_step.value, 2);

				var token = _step$value[0];
				var frequency = _step$value[1];

				//update the frequency information for this token in this category
				// this will also add to the total count of tokens we have seen, that are mapped to this category
				// and it will ensure that the token is in our vocabulary
				this.dataStore.addAmountToTokenFrequencyForCategory(frequency, token, category);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	}

	;

	//TODO: enable streamed learning
	//NaiveBayesClassifier.prototype.createLearnStreamForCategory = function(category) {
	//	return stream ? new stream.Writable({
	//		decodeStrings: false,
	//		write: function write(chunk, encoding, next) {
	//			var text = chunk.toString('utf8');
	//
	//			this.learn(text, category);
	//
	//			next();
	//		}.bind(this)
	//	}) : null;
	//};
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Determine the category some `text` most likely belongs to.
	 * Use Laplace (add-1) smoothing to adjust for words that do not appear in our vocabulary (i.e. unknown words).
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	exports['default'] = categorize;

	function categorize(text) {
		var maxProbability = -Infinity,
		    totalProbabilities = 0,
		    cMAP = {},
		    //category of “maximum a posteriori” => most likely category
		categoryProbabilities = {}; //probabilities of all categories

		var tokens = this.tokenizer(text),
		    tokenFrequencyMap = this.generateFrequencyMapForTokens(tokens);

		var categories = this.dataStore.getCategories();

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = categories[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var category = _step.value;
				//for each category, find the probability of the text belonging to it
				// 1. Find overall probability of this category
				//=> P(Cj) = docCount(C=cj) / Ndoc
				// =============================================================================

				//Put of all documents we've ever looked at, how many were mapped to this category
				var categoryProbability = this.dataStore.getNumberOfDocsForCategory(category) / this.dataStore.getTotalNumberOfDocuments();

				//take the log to avoid underflow with large datasets - http://www.johndcook.com/blog/2012/07/26/avoiding-underflow-in-bayesian-computations/
				var logCategoryProbability = Math.log(categoryProbability); //start with P(Cj), we will add P(wi|Cj) incrementally below

				// 2. Find probability of each word in this category
				//=> P(wi|Cj) = count(wi,cj) / SUM[(for w in v) count(w,cj)]
				// =============================================================================

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = tokenFrequencyMap[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _step2$value = _slicedToArray(_step2.value, 2);

						var token = _step2$value[0];
						var frequency = _step2$value[1];

						//determine the log of the probability of this token belonging to the current category
						var tokenProbability = this.tokenProbabilityInCategory(token, category); //=> log( P(w|c) )

						//and add it to our running probability that the text belongs to the current category
						logCategoryProbability += Math.log(tokenProbability) * frequency;

						//console.log('token: %s | category: `%s` | probability: %d', token, category, tokenProbability);
					}

					// 3. Find the most likely category, thus far...
					// =============================================================================
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2['return']) {
							_iterator2['return']();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				categoryProbability = Math.exp(logCategoryProbability); //reverse the log and get an actual value
				totalProbabilities += categoryProbability; //calculate totals as we go, we'll use this to normalise later

				if (logCategoryProbability > maxProbability) {
					//find cMAP
					maxProbability = logCategoryProbability;
					cMAP = {
						category: category,
						probability: categoryProbability
					};
				}

				categoryProbabilities[category] = categoryProbability;
			} //.bind(this));

			//normalise (out of 1) the probabilities, so that they are easier to relate to
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		Object.keys(categoryProbabilities).forEach(function (category) {
			categoryProbabilities[category] /= totalProbabilities;
		});

		return {
			category: cMAP.category || 'unclassified',
			probability: (cMAP.probability /= totalProbabilities) || -Infinity,
			categories: categoryProbabilities
		};
	}

	;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports['default'] = defaultTokenizer;

	function defaultTokenizer(text) {
		//remove punctuation from text (anything that isn't a word char or a space), and enforce lowercase
		var rgxPunctuation = new RegExp(/[^\w\s]/g);
		var sanitized = text.replace(rgxPunctuation, ' ').toLowerCase();

		return sanitized.split(/\s+/);
	}

	;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var vocabulary = Symbol('vocabulary'),
	    categories = Symbol('categories'),
	    //use the word `categories` instead of `classes`, because `class` is a reserved keyword
	numberOfDocsPerCategory = Symbol('numberOfDocsPerCategory'),
	    totalNumberOfDocuments = Symbol('totalNumberOfDocuments'),
	    tokenFrequencyPerCategory = Symbol('tokenFrequencyPerCategory'),
	    numberOfTokensPerCategory = Symbol('numberOfTokensPerCategory');

	var getCategoryWithName = Symbol('getCategoryWithName');

	var DataStore = (function () {
		function DataStore() {
			_classCallCheck(this, DataStore);

			// ITERATORS
			// =============================================================================
			this[vocabulary] = new Set(); //Set, holding all tokens that have been learnt
			this[categories] = new Set(); //Set, holding all category names

			// PRIOR PROBABILITY: P(Cj) = docCount(C=cj) / Ndoc
			// =============================================================================
			this[numberOfDocsPerCategory] = {}; //docCount(class) => for each class, how many documents are mapped to it
			this[totalNumberOfDocuments] = 0; //Ndoc => total number of documents that we have learned from

			// LIKELIHOOD: P(wi|Cj) = count(wi,cj) / SUM[(for w in v)] count(w,cj)
			// =============================================================================
			this[tokenFrequencyPerCategory] = {}; //count(wi,cj) => for each class, how frequently did a given token appear.
			this[numberOfTokensPerCategory] = {}; //SUM[(for w in v)] count(w,cj) => for each class, how many unique tokens in total were mapped to it.

			// PRIVATE utility functions
			// =============================================================================
			this[getCategoryWithName] = function (categoryName) {
				if (!categoryName) {
					throw Error('category name cannot be `undefined`');
				}

				categoryName = categoryName.toString();

				if (!this[categories].has(categoryName)) {
					//add new category to our list
					this[categories].add(categoryName);

					//setup counters
					this[numberOfDocsPerCategory][categoryName] = 0;
					this[tokenFrequencyPerCategory][categoryName] = {};
					this[numberOfTokensPerCategory][categoryName] = 0;
				}

				return this[categories].has(categoryName) ? categoryName : undefined;
			};
		}

		// VOCABULARY
		// =============================================================================

		_createClass(DataStore, [{
			key: 'getVocabularySize',
			value: function getVocabularySize() {
				//used to calculate token probability
				return this[vocabulary].size;
			}

			// CATEGORIES
			// =============================================================================
		}, {
			key: 'getCategories',
			value: function getCategories() {
				//used for iterating
				return this[categories];
			}

			// DOCUMENTS
			// =============================================================================
		}, {
			key: 'add1DocForCategory',
			value: function add1DocForCategory(categoryName) {
				//used in learning
				this[totalNumberOfDocuments] += 1; //increment the total number of documents we have learned from
				return this[numberOfDocsPerCategory][this[getCategoryWithName](categoryName)] += 1;
			}
		}, {
			key: 'getNumberOfDocsForCategory',
			value: function getNumberOfDocsForCategory(categoryName) {
				//used to calculate category probability
				return this[numberOfDocsPerCategory][this[getCategoryWithName](categoryName)];
			}
		}, {
			key: 'getTotalNumberOfDocuments',
			value: function getTotalNumberOfDocuments() {
				//used to calculate category probability
				return this[totalNumberOfDocuments];
			}

			// TOKEN COUNT
			// =============================================================================
		}, {
			key: 'getNumberOfTokensForCategory',
			value: function getNumberOfTokensForCategory(categoryName) {
				//used to calculate token probability
				return this[numberOfTokensPerCategory][this[getCategoryWithName](categoryName)];
			}

			// TOKEN FREQUENCY
			// =============================================================================
		}, {
			key: 'getTokenFrequencyForCategory',
			value: function getTokenFrequencyForCategory(token, categoryName) {
				//used to calculate token probability
				token = token.toString();

				this[tokenFrequencyPerCategory][this[getCategoryWithName](categoryName)][token] = this[tokenFrequencyPerCategory][categoryName][token] || 0;
				return this[tokenFrequencyPerCategory][categoryName][token];
			}
		}, {
			key: 'addAmountToTokenFrequencyForCategory',
			value: function addAmountToTokenFrequencyForCategory(amount, token, categoryName) {
				//used in learning
				token = token.toString();

				this[vocabulary].add(token); //make sure token is captured in our vocabulary
				this.getTokenFrequencyForCategory(token, categoryName); //ensures sanitation and initialisation

				this[tokenFrequencyPerCategory][this[getCategoryWithName](categoryName)][token] += amount;
				this[numberOfTokensPerCategory][this[getCategoryWithName](categoryName)] += amount;
			}
		}]);

		return DataStore;
	})();

	exports['default'] = DataStore;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {
		"name": "naivebayesclassifier",
		"title": "NaiveBayesClassifier",
		"version": "0.3.0",
		"description": "NaiveBayesClassifier is a Multinomial Naive-Bayes Classifier that uses Laplace Smoothing.",
		"keywords": [
			"naive",
			"bayes",
			"classifier",
			"multinomial",
			"machine learning",
			"learn",
			"categorize",
			"classify"
		],
		"main": "dist/NaiveBayesClassifier.js",
		"scripts": {
			"test": "gulp test"
		},
		"author": {
			"name": "Hadi Michael",
			"url": "http://hadi.io"
		},
		"repository": {
			"type": "git",
			"url": "git://github.com/hadimichael/NaiveBayesClassifier.git"
		},
		"license": "BSD-3-Clause",
		"devDependencies": {
			"babel-core": "^5.8.21",
			"babel-loader": "^5.3.2",
			"grunt": "^0.4.5",
			"grunt-jsdoc": "^0.5.8",
			"gulp": "^3.8.11",
			"gulp-babel": "^5.2.0",
			"gulp-concat": "^2.6.0",
			"gulp-gh-pages": "^0.5.1",
			"gulp-grunt": "^0.5.2",
			"gulp-jshint": "^1.10.0",
			"gulp-minify": "0.0.5",
			"gulp-mocha": "^2.0.1",
			"gulp-umd": "^0.1.3",
			"json-loader": "^0.5.2",
			"mocha": "^2.2.5",
			"webpack": "^1.10.5",
			"webpack-stream": "^2.1.0"
		},
		"dependencies": {
			"leveldown": "^1.3.0",
			"levelup": "^1.2.1"
		}
	}

/***/ }
/******/ ])
});
;