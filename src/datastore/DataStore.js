'use strict';

import {default as AbstractDataStore} from './AbstractDataStore';

var vocabulary = Symbol('vocabulary'),
	categories = Symbol('categories'),
	docFrequencyCount = Symbol('docFrequencyCount'),
	totalNumberOfDocuments = Symbol('totalNumberOfDocuments'),
	tokenFrequencyCount = Symbol('tokenFrequencyCount'),
	tokenCount = Symbol('tokenCount');

export default class DataStore extends AbstractDataStore {
	constructor() {
		super();

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

	addWordToVocabulary(word) {
		this[vocabulary].add(word);
	};

	getVocabularySize() {
		return this[vocabulary].size;
	}

	getCategories() {
		return this[categories];
	}

	getOrCreateCategory(categoryName) {
		if (!this[categories].has(categoryName)) {
			//setup counters
			this[docFrequencyCount][categoryName] = 0;
			this[tokenFrequencyCount][categoryName] = {};
			this[tokenCount][categoryName] = 0;

			//add new category to our list
			this[categories].add(categoryName);
		}

		return this[categories].has(categoryName) ? categoryName : undefined;
	};

	getDocFrequencyCount(categoryName) {
		return this[docFrequencyCount][categoryName];
	}

	incrementDocFrequencyCount(categoryName) {
		this[docFrequencyCount][categoryName] = this[docFrequencyCount][categoryName] || 0;
		return this[docFrequencyCount][categoryName] += 1;
	}

	getTokenFrequencyCount(categoryName, token) {
		return this[tokenFrequencyCount][categoryName] ? this[tokenFrequencyCount][categoryName][token] : undefined;
	}

	incrementTokenFrequencyCount(categoryName, token, amount) {
		if (this[tokenFrequencyCount][categoryName]){
			this[tokenFrequencyCount][categoryName][token] = this[tokenFrequencyCount][categoryName][token] || 0;
			this[tokenFrequencyCount][categoryName][token] += amount;
		}
	}

	getTokenCount(categoryName) {
		return this[tokenCount][categoryName];
	}

	incrementTokenCount(categoryName, amount) {
		this[tokenCount][categoryName] = this[tokenCount][categoryName] || 0;
		this[tokenCount][categoryName] += amount;
	}

	getTotalNumberOfDocuments() {
		return this[totalNumberOfDocuments];
	}

	incrementTotalNumberOfDocuments() {
		return this[totalNumberOfDocuments] += 1;
	}
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