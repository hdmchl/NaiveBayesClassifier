'use strict';

import { learn, createLearnStreamForCategory } from './learn';
import {default as categorize} from './categorize';

import {default as defaultTokenizer} from './utils/defaultTokenizer';

export default class NaiveBayesClassifier {
	constructor(options={}) {
		this.learn = learn;
		this.createLearnStreamForCategory = createLearnStreamForCategory;
		this.categorize = categorize;

		this.VERSION = NaiveBayesClassifier.VERSION;

		// TODO: OPTIONS
		// =============================================================================
		this.tokenizer = options.tokenizer || defaultTokenizer;
		this.dataStore = options.dataStore || new NaiveBayesClassifier.DataStore();
	}

	// UTILITY FUNCTIONS to help with calculations
	// =============================================================================
	generateFrequencyMapForTokens(tokens) {
		let frequencyMap = new Map();

		tokens.forEach(function updateFrequencyTableForToken(token) {
			if (!token) { return; } //skip empty tokens

			let value = (frequencyMap.get(token) || 0) + 1;
			frequencyMap.set(token, value);
		});

		return frequencyMap;
	}

	tokenProbabilityInCategory(token, category) {
		//Recall => P(wi|Cj) = count(wi,cj) / SUM[(for w in v) count(w,cj)]

		//how many times this word has occurred in documents mapped to this category
		let tokenFrequencyCount = this.dataStore.getTokenFrequencyForCategory(token, category); //count(wi,cj)

		//what is the count of all words that have ever been mapped to this category
		let tokenCount = this.dataStore.getNumberOfTokensForCategory(category); //SUM[(for w in v) count(w,cj)

		//use laplace Add-1 Smoothing equation
		//=> ( P(wi|Cj) = count(wi,cj) + 1 ) / ( SUM[(for w in v) count(w,cj)] + |VocabSize| )
		return ( tokenFrequencyCount + 1 ) / ( tokenCount + this.dataStore.getVocabularySize() );
	}
};