'use strict';

var vocabulary = Symbol('vocabulary'),
	categories = Symbol('categories'), //use the word `categories` instead of `classes`, because `class` is a reserved keyword
	numberOfDocsPerCategory = Symbol('numberOfDocsPerCategory'),
	totalNumberOfDocuments = Symbol('totalNumberOfDocuments'),
	tokenFrequencyPerCategory = Symbol('tokenFrequencyPerCategory'),
	numberOfTokensPerCategory = Symbol('numberOfTokensPerCategory');

var getCategoryWithName = Symbol('getCategoryWithName');

export default class DataStore {
	constructor() {
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
		this[getCategoryWithName] = function(categoryName) {
			if (!categoryName) { throw Error('category name cannot be `undefined`'); }

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
		}
	}

	// VOCABULARY
	// =============================================================================
	getVocabularySize() { //used to calculate token probability
		return this[vocabulary].size;
	}

	// CATEGORIES
	// =============================================================================
	getCategories() { //used for iterating
		return this[categories];
	}

	// DOCUMENTS
	// =============================================================================
	add1DocForCategory(categoryName) { //used in learning
		this[totalNumberOfDocuments] += 1; //increment the total number of documents we have learned from
		return this[numberOfDocsPerCategory][this[getCategoryWithName](categoryName)] += 1;
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

	// TOKEN FREQUENCY
	// =============================================================================
	getTokenFrequencyForCategory(token, categoryName) { //used to calculate token probability
		token = token.toString();

		this[tokenFrequencyPerCategory][this[getCategoryWithName](categoryName)][token] = this[tokenFrequencyPerCategory][categoryName][token] || 0;
		return this[tokenFrequencyPerCategory][categoryName][token];
	}

	addAmountToTokenFrequencyForCategory(amount, token, categoryName) { //used in learning
		token = token.toString();

		this[vocabulary].add(token); //make sure token is captured in our vocabulary
		this.getTokenFrequencyForCategory(token, categoryName); //ensures sanitation and initialisation

		this[tokenFrequencyPerCategory][this[getCategoryWithName](categoryName)][token] += amount;
		this[numberOfTokensPerCategory][this[getCategoryWithName](categoryName)] += amount;
	}
}