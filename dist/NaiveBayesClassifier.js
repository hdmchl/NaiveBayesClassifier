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

	_NaiveBayesClassifier2['default'].VERSION = __webpack_require__(8).version;
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

			this.tokenizer = options.tokenizer || _utilsDefaultTokenizer2['default'];
			this.dataStore = options.dataStore || new NaiveBayesClassifier.DataStore();
		}

		_createClass(NaiveBayesClassifier, [{
			key: 'frequencyTable',
			value: function frequencyTable(tokens) {
				var frequencyTable = {};

				tokens.forEach(function updateFrequencyTableForToken(token) {
					//we need to ensure our tokens are unique, to avoid clashing with existing object properties (e.g. 'constructor')
					token = '_' + token;

					if (!frequencyTable[token]) {
						frequencyTable[token] = 1;
					} else {
						frequencyTable[token] += 1;
					}
				});

				return frequencyTable;
			}
		}, {
			key: 'tokenProbability',
			value: function tokenProbability(token, category) {
				// Recall => P(wi|Cj) = count(wi,cj) / SUM[(for w in v) count(w,cj)]
				// =============================================================================

				//how many times this word has occurred in documents mapped to this category
				var tokenFrequencyCount = this.dataStore.getTokenFrequencyCount(category, token) || 0; //count(wi,cj)

				//what is the count of all words that have ever been mapped to this category
				var tokenCount = this.dataStore.getTokenCount(category); //SUM[(for w in v) count(w,cj)

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
	 *
	 * @param  {String} text - Some text that should be learnt
	 * @param  {String} category - The category to which the text provided belongs to
	 * @return {Object} NaiveBayesClassifier
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports['default'] = learn;

	function learn(text, category) {
		category = this.dataStore.getOrCreateCategory(category); //get or create a category

		this.dataStore.incrementDocFrequencyCount(category); //update our count of how many documents mapped to this category
		console.log(this.dataStore.getDocFrequencyCount(category));
		this.dataStore.incrementTotalNumberOfDocuments(); //update the total number of documents we have learned from

		var tokens = this.tokenizer(text); //break up the text into tokens
		var tokenFrequencyTable = this.frequencyTable(tokens); //get a frequency count for each token in the text
		// Update our vocabulary and our word frequency counts for this category
		// =============================================================================
		Object.keys(tokenFrequencyTable).forEach((function learnToken(token) {
			//for each token in our tokenFrequencyTable
			if (token === '_') {
				return;
			} //skip empty tokens

			this.dataStore.addWordToVocabulary(token); //add this word to our vocabulary if not already existing

			var frequencyOfTokenInText = tokenFrequencyTable[token]; //look it up once, for speed

			//update the frequency information for this word in this category
			this.dataStore.incrementTokenFrequencyCount(category, token, frequencyOfTokenInText);
			//if (!this.getTokenFrequencyCount(category, token)) {
			//	; //set it for the first time
			//} else {
			//	this.wordFrequencyCount[category][token] += frequencyOfTokenInText; //add to what's already there in the count
			//}

			this.dataStore.incrementTokenCount(category, frequencyOfTokenInText); //add to the count of all words we have seen mapped to this category
		}).bind(this));

		return this;
	}

	;

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
	 *
	 * @param  {String} text - Raw text that needs to be tokenized and categorised.
	 * @return {String} category - Category of “maximum a posteriori” (i.e. most likely category), or 'unclassified'
	 * @return {Number} probability - The probablity for the category specified
	 * @return {Object} categories - Hashmap of probabilities for each category 
	 */

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports['default'] = categorize;

	function categorize(text) {
		var _this = this;

		var maxProbability = -Infinity,
		    totalProbabilities = 0,
		    cMAP = {},
		    //category of “maximum a posteriori” => most likely category
		categoryProbabilities = {}; //probabilities of all categories

		var tokens = this.tokenizer(text),
		    tokenFrequencyTable = this.frequencyTable(tokens);

		var categories = this.dataStore.getCategories();

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			var _loop = function () {
				var category = _step.value;

				//Object
				//.keys(this.categories)
				//.forEach(function(category) { //for each category, find the probability of the text belonging to it
				if (categories[category]) {
					return {
						v: undefined
					};
				} //ignore categories that have been switched off

				// 1. Find overall probability of this category
				//=> P(Cj) = docCount(C=cj) / Ndoc
				// =============================================================================

				//Put of all documents we've ever looked at, how many were mapped to this category
				categoryProbability = _this.dataStore.getDocFrequencyCount(category) / _this.dataStore.getTotalNumberOfDocuments();

				console.log('============', category, _this.dataStore.getDocFrequencyCount(category), _this.dataStore.getTotalNumberOfDocuments(), categoryProbability);
				//take the log to avoid underflow with large datasets - http://www.johndcook.com/blog/2012/07/26/avoiding-underflow-in-bayesian-computations/
				logCategoryProbability = Math.log(categoryProbability);
				//start with P(Cj), we will add P(wi|Cj) incrementally below

				// 2. Find probability of each word in this category
				//=> P(wi|Cj) = count(wi,cj) / SUM[(for w in v) count(w,cj)]
				// =============================================================================

				Object.keys(tokenFrequencyTable).forEach((function (token) {
					//for each token in our token frequency table

					//determine the log of the probability of this token belonging to the current category
					//=> log( P(w|c) )
					var tokenProbability = this.tokenProbability(token, category);
					//and add it to our running probability that the text belongs to the current category
					logCategoryProbability += Math.log(tokenProbability) * tokenFrequencyTable[token];

					console.log('token: %s | category: `%s` | probability: %d', token, category, tokenProbability);
				}).bind(_this));

				// 3. Find the most likely category, thus far...
				// =============================================================================

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
			};

			for (var _iterator = categories[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var categoryProbability;
				var logCategoryProbability;

				var _ret = _loop();

				if (typeof _ret === 'object') return _ret.v;
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _AbstractDataStore2 = __webpack_require__(7);

	var _AbstractDataStore3 = _interopRequireDefault(_AbstractDataStore2);

	var vocabulary = Symbol('vocabulary'),
	    categories = Symbol('categories'),
	    docFrequencyCount = Symbol('docFrequencyCount'),
	    totalNumberOfDocuments = Symbol('totalNumberOfDocuments'),
	    tokenFrequencyCount = Symbol('tokenFrequencyCount'),
	    tokenCount = Symbol('tokenCount');

	var DataStore = (function (_AbstractDataStore) {
		_inherits(DataStore, _AbstractDataStore);

		function DataStore() {
			_classCallCheck(this, DataStore);

			_get(Object.getPrototypeOf(DataStore.prototype), 'constructor', this).call(this);

			// VOCABULARY
			// =============================================================================
			this[vocabulary] = new Set(); //Set holding all words that have been learnt

			// CATEGORIES
			// =============================================================================
			this[categories] = new Set(); //Set holding all category names

			// PRIOR PROBABILITY: P(Cj) = docCount(C=cj) / Ndoc
			// =============================================================================

			/**
	   * Document frequency table for each of our categories.
	   * For each category, how many documents were mapped to it.
	   */
			this[docFrequencyCount] = {}; //docCount(class) => how many documents exist for `class`

			/**
	   * A counter that holds the total number of documents we have learnt from.
	   */
			this[totalNumberOfDocuments] = 0; //Ndoc => number of documents we have learned from

			// LIKELIHOOD: P(wi|Cj) = count(wi,cj) / SUM[(for w in v)] count(w,cj)
			// =============================================================================

			/**
	   * Word frequency table for each of our categories.
	   * For each category, how frequently did a given word appear.
	   */
			this[tokenFrequencyCount] = {}; //count(wi,cj)

			/**
	   * Word count table for each of our categories
	   * For each category, how many words in total were mapped to it.
	   */
			this[tokenCount] = {}; //SUM[(for w in v)] count(w,cj) => sum of the times each word exists in a category
		}

		//"vocabulary": { //Set
		//	"chinese": true,
		//	"beijing": true,
		//	"shanghai": true,
		//	"macao": true,
		//	"tokyo": true,
		//	"japan": true
		//},
		//"vocabularySize": 6, //Not needed... we can call Set.size()
		//"categories": { //Set
		//	"chinese": true,
		//	"japanese": true
		//},
		//"docFrequencyCount": { //POJO
		//	"chinese": 3,
		//	"japanese": 1
		//},
		//"totalNumberOfDocuments": 4, //POJO
		//"tokenFrequencyCount": { //POJO
		//	"chinese": {
		//		"chinese": 5,
		//		"beijing": 1,
		//		"shanghai": 1,
		//		"macao": 1
		//	},
		//	"japanese": {
		//		"tokyo": 1,
		//		"japan": 1,
		//		"chinese": 1
		//	}
		//},
		//"tokenCount": { //POJO
		//	"chinese": 8,
		//	"japanese": 3
		//}

		_createClass(DataStore, [{
			key: 'addWordToVocabulary',
			value: function addWordToVocabulary(word) {
				this[vocabulary].add(word);
			}
		}, {
			key: 'getVocabularySize',
			value: function getVocabularySize() {
				return this[vocabulary].size;
			}
		}, {
			key: 'getCategories',
			value: function getCategories() {
				return this[categories];
			}
		}, {
			key: 'getOrCreateCategory',
			value: function getOrCreateCategory(categoryName) {
				if (!this[categories].has(categoryName)) {
					//setup counters
					this[docFrequencyCount][categoryName] = 0;
					this[tokenFrequencyCount][categoryName] = {};
					this[tokenCount][categoryName] = 0;

					//add new category to our list
					this[categories].add(categoryName);
				}

				return this[categories].has(categoryName) ? categoryName : undefined;
			}
		}, {
			key: 'getDocFrequencyCount',
			value: function getDocFrequencyCount(categoryName) {
				return this[docFrequencyCount][categoryName];
			}
		}, {
			key: 'incrementDocFrequencyCount',
			value: function incrementDocFrequencyCount(categoryName) {
				this[docFrequencyCount][categoryName] = this[docFrequencyCount][categoryName] || 0;
				return this[docFrequencyCount][categoryName] += 1;
			}
		}, {
			key: 'getTokenFrequencyCount',
			value: function getTokenFrequencyCount(categoryName, token) {
				return this[tokenFrequencyCount][categoryName] ? this[tokenFrequencyCount][categoryName][token] : undefined;
			}
		}, {
			key: 'incrementTokenFrequencyCount',
			value: function incrementTokenFrequencyCount(categoryName, token, amount) {
				if (this[tokenFrequencyCount][categoryName]) {
					this[tokenFrequencyCount][categoryName][token] = this[tokenFrequencyCount][categoryName][token] || 0;
					this[tokenFrequencyCount][categoryName][token] += amount;
				}
			}
		}, {
			key: 'getTokenCount',
			value: function getTokenCount(categoryName) {
				return this[tokenCount][categoryName];
			}
		}, {
			key: 'incrementTokenCount',
			value: function incrementTokenCount(categoryName, amount) {
				this[tokenCount][categoryName] = this[tokenCount][categoryName] || 0;
				this[tokenCount][categoryName] += amount;
			}
		}, {
			key: 'getTotalNumberOfDocuments',
			value: function getTotalNumberOfDocuments() {
				return this[totalNumberOfDocuments];
			}
		}, {
			key: 'incrementTotalNumberOfDocuments',
			value: function incrementTotalNumberOfDocuments() {
				return this[totalNumberOfDocuments] += 1;
			}
		}]);

		return DataStore;
	})(_AbstractDataStore3['default']);

	exports['default'] = DataStore;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var AbstractDataStore = function AbstractDataStore() {
		_classCallCheck(this, AbstractDataStore);

		if (this.constructor.name === 'AbstractDataStore') {
			throw new TypeError('Cannot construct `AbstractDataStore` instance directly');
		}

		if (!this.addWordToVocabulary) {
			throw new Error('DataStore must override `addWordToVocabulary` method');
		}

		if (!this.getVocabularySize) {
			throw new Error('DataStore must override `getVocabularySize` method');
		}

		if (!this.getOrCreateCategory) {
			throw new Error('DataStore must override `getOrCreateCategory` method');
		}

		if (!this.getDocFrequencyCount) {
			throw new Error('DataStore must override `getDocFrequencyCount` method');
		}

		if (!this.incrementDocFrequencyCount) {
			throw new Error('DataStore must override `incrementDocFrequencyCount` method');
		}

		if (!this.getTokenFrequencyCount) {
			throw new Error('DataStore must override `getTokenFrequencyCount` method');
		}

		if (!this.incrementTokenFrequencyCount) {
			throw new Error('DataStore must override `incrementTokenFrequencyCount` method');
		}

		if (!this.getTokenCount) {
			throw new Error('DataStore must override `getTokenCount` method');
		}

		if (!this.incrementTotalNumberOfDocuments) {
			throw new Error('DataStore must override `incrementTotalNumberOfDocuments` method');
		}
	};

	exports['default'] = AbstractDataStore;
	module.exports = exports['default'];

/***/ },
/* 8 */
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