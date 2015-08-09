'use strict';

import {default as learn} from './learn';
import {default as categorize} from './categorize';

import {default as defaultTokenizer} from './utils/defaultTokenizer';

export default class NaiveBayesClassifier {
	constructor(options={}) {
		this.learn = learn;
		this.categorize = categorize;

		this.VERSION = NaiveBayesClassifier.VERSION;

		this.tokenizer = options.tokenizer || defaultTokenizer;
		this.dataStore = options.dataStore || new NaiveBayesClassifier.DataStore();
	}

	frequencyTable(tokens) {
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

	tokenProbability(token, category) {
		// Recall => P(wi|Cj) = count(wi,cj) / SUM[(for w in v) count(w,cj)]
		// =============================================================================

		//how many times this word has occurred in documents mapped to this category
		var tokenFrequencyCount = this.dataStore.getTokenFrequencyCount(category, token) || 0; //count(wi,cj)

		//what is the count of all words that have ever been mapped to this category
		var tokenCount = this.dataStore.getTokenCount(category); //SUM[(for w in v) count(w,cj)

		//use laplace Add-1 Smoothing equation
		//=> ( P(wi|Cj) = count(wi,cj) + 1 ) / ( SUM[(for w in v) count(w,cj)] + |VocabSize| )
		return ( tokenFrequencyCount + 1 ) / ( tokenCount + this.dataStore.getVocabularySize() );
	}
};