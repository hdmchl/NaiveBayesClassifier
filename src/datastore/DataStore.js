'use strict';

var vocabulary = Symbol('vocabulary'),
	categories = Symbol('categories'), //use the word `categories` instead of `classes`, because `class` is a reserved keyword
	numberOfDocsPerCategory = Symbol('numberOfDocsPerCategory'),
	totalNumberOfDocuments = Symbol('totalNumberOfDocuments'),
	tokenFrequencyPerCategory = Symbol('tokenFrequencyPerCategory'),
	numberOfTokensPerCategory = Symbol('numberOfTokensPerCategory');

//private utils
var getCategoryWithName = Symbol('getCategoryWithName'),
	sanitizeInput = Symbol('sanitizeInput'),
	sanitizeAmount = Symbol('sanitizeAmount');

export default class DataStore {
	constructor() {
		// ITERATORS
		// =============================================================================
		this[vocabulary] = new Set(); //Set, holding all unique tokens that have been learnt
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
		this[getCategoryWithName] = function(categoryName) {
			categoryName = this[sanitizeInput](categoryName);

			if (!this[categories].has(categoryName)) {
				//add new category to our list
				this[categories].add(categoryName);

				//initlialise counters
				this[numberOfDocsPerCategory][categoryName] = 0;
				this[tokenFrequencyPerCategory][categoryName] = {};
				this[numberOfTokensPerCategory][categoryName] = 0;
			}

			return this[categories].has(categoryName) ? categoryName : undefined;
		};

		this[sanitizeInput] = function(input) {
			if (typeof input !== 'boolean' &&
				typeof input !== 'string' &&
				(typeof input !== 'number' || isNaN(input))) { throw TypeError('input cannot be `' + input + '`'); }

			try {
				return input.toString();
			} catch (err) {
				throw TypeError(err);
			}
		};

		this[sanitizeAmount] = function(amount) {
			if ((typeof amount !== 'string' && typeof amount !== 'number') || isNaN(parseInt(amount))) {
				throw TypeError('amount cannot be `' + amount + '`');
			}

			return parseInt(amount);
		};
	}

	// VOCABULARY
	// =============================================================================
	getVocabularySize() { //used to calculate token probability
		return this[vocabulary].size;
	}

	addTokenToVocabulary(token) { //used to ensure we don't double count tokens
		token = this[sanitizeInput](token);

		return this[vocabulary].add(token);
	}

	// CATEGORIES
	// =============================================================================
	getCategories() { //used for iterating
		return this[categories];
	}

	// DOCUMENTS
	// =============================================================================
	incrementNumberOfDocsForCategory(categoryName) { //used in learning
		let numberOfDocsForCategory = (this[numberOfDocsPerCategory][this[getCategoryWithName](categoryName)] += 1);
		this[totalNumberOfDocuments] += 1; //increment the total number of documents we have learned from, only after the above call succeeded
		return numberOfDocsForCategory;
	}

	getNumberOfDocsForCategory(categoryName) { //used to calculate category probability
		return this[numberOfDocsPerCategory][this[getCategoryWithName](categoryName)];
	}

	getTotalNumberOfDocuments() { //used to calculate category probability
		return this[totalNumberOfDocuments];
	}

	// TOKEN COUNT
	// =============================================================================
	getNumberOfTokensForCategory(categoryName) {  //used to calculate token probability
		return this[numberOfTokensPerCategory][this[getCategoryWithName](categoryName)];
	}

	incrementNumberOfTokensPerCategoryByAmount(categoryName, amount) {
		this[numberOfTokensPerCategory][this[getCategoryWithName](categoryName)] += this[sanitizeAmount](amount);

		return this[numberOfTokensPerCategory][this[getCategoryWithName](categoryName)];
	}

	// TOKEN FREQUENCY
	// =============================================================================
	getTokenFrequencyForCategory(token, categoryName) { //used to calculate token probability
		token = this[sanitizeInput](token);

		this[tokenFrequencyPerCategory][this[getCategoryWithName](categoryName)][token] = this[tokenFrequencyPerCategory][categoryName][token] || 0; //initialise if required

		return this[tokenFrequencyPerCategory][categoryName][token];
	}

	incrementTokenFrequencyForCategoryByAmount(token, categoryName, amount) {
		token = this[sanitizeInput](token);

		this[tokenFrequencyPerCategory][this[getCategoryWithName](categoryName)][token] = this[tokenFrequencyPerCategory][categoryName][token] || 0; //initialise if required
		this[tokenFrequencyPerCategory][this[getCategoryWithName](categoryName)][token] += this[sanitizeAmount](amount);

		return this[tokenFrequencyPerCategory][categoryName][token];
	}
}