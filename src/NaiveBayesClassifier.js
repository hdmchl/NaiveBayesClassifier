/* 
 * @title: NaiveBayesClassifier
 * @description: NaiveBayesClassifier is a Multinomial Naive-Bayes Classifier that uses Laplace Smoothing.
 * @version: see static variable .VERSION
 * @author: Hadi Michael (http://hadi.io)
 * @repository: https://github.com/hadimichael/NaiveBayesClassifier
 * @license: BSD-3-Clause, see LICENSE file
*/

'use strict';

/**
 * The NaiveBayesClassifier object holds all the properties and methods used by the classifier.
 *
 * @property {String} VERSION - Library version number
 *
 * @constructor
 * @param  {Object} [options] - Options that can be used for intialisation
 * @param  {Function} options.tokenizer - Custom tokenization function
 * @return {Object} {@link NaiveBayesClassifier}
 */
var NaiveBayesClassifier = function(options) {
	/**
	 * @constant
	 * @property {String} - Instance version number
	*/
	this.VERSION = NaiveBayesClassifier.VERSION;

	// DEFAULT TOKENIZER
	// =============================================================================
	/**
	 * Given an input string, tokenize it into an array of word tokens.
	 * This tokenizer adopts a naive "independant bag of words" assumption.
	 * This is the default tokenization function used if the user does not provide one in {@link NaiveBayesClassifier#options}.
	 *
	 * @param  {String} text - Text to be tokenized
	 * @return {Array} String tokens
	 */
	var defaultTokenizer = function(text) {
		//remove punctuation from text (anything that isn't a word char or a space), and enforce lowercase
		var rgxPunctuation = new RegExp(/[^\w\s]/g);
		var sanitized = text.replace(rgxPunctuation, ' ').toLowerCase();

		return sanitized.split(/\s+/);
	};

	// OPTIONS
	// =============================================================================
	/**
	 * Options defined at intialisation
	 * @type {Object}
	 * @property {Function} tokenizer - Tokenization function (can be custom provided or default).
	 */
	this.options = {};

	if (!!options) {
		if (typeof options !== 'object' || Array.isArray(options)) {
			throw new TypeError('NaiveBayesClassifier got invalid `options`: `' + options + '`. Please pass in an object.');
		}
		this.options = options;
	}

	this.tokenizer = this.options.tokenizer || defaultTokenizer;
	
	// VOCABULARY - initialise our vocabulary and its size
	// =============================================================================
	/**
	 * Hashmap holding all words that have been learnt
	 * @type {Object}
	 */
	this.vocabulary = {};

	/**
	 * A counter that holds the size of {@link NaiveBayesClassifier#vocabulary} hashmap
	 * @type {Number}
	 */
	this.vocabularySize = 0;

	// CATEGORIES - initilise categories
	// =============================================================================
	/**
	 * Hashmap holding all category names
	 * @type {Object}
	 */
	this.categories = {};

	// PRIOR PROBABILITY: P(Cj) = docCount(C=cj) / Ndoc
	// =============================================================================

	/**
	 * Document frequency table for each of our categories.
	 * For each category, how many documents were mapped to it.
	 * @type {Object}
	 */
	this.docFrequencyCount = {}; //docCount(class)

	/**
	 * A counter that holds the total number of documents we have learnt from.
	 * @type {Number}
	 */
	this.totalNumberOfDocuments = 0; //Ndoc => number of documents we have learned from

	// LIKELIHOOD: P(wi|Cj) = count(wi,cj) / SUM[(for w in v) count(w,cj)]
	// =============================================================================

	/**
	 * Word frequency table for each of our categories.
	 * For each category, how frequently did a given word appear.
	 * @type {Object}
	 */
	this.wordFrequencyCount = {}; //count(wi,cj)

	/**
	 * Word count table for each of our categories
	 * For each category, how many words in total were mapped to it.
	 * @type {Object}
	 */
	this.wordCount = {}; //SUM[(for w in v) count(w,cj)
};

/**
 * @constant
 * @property {String} - Library version number
 */
NaiveBayesClassifier.VERSION = '0.3.0'; // current version | Note: JS Functions are first class Objects