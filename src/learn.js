/**
 * Train our naive-bayes classifier by telling it what `category` some `text` corresponds to.
 */

'use strict';

export function learn(text, category) {
	//TODO: do we want to incrementNumberOfDocsForCategory on EVERY learn? What about streams...
	this.dataStore.incrementNumberOfDocsForCategory(category); //update our count of how many documents mapped to this category

	const tokens = this.tokenizer(text); //break up the text into tokens
	const tokenFrequencyMap = this.generateFrequencyMapForTokens(tokens); //get a frequency count for each token in the text

	// Update our vocabulary and our word frequency counts for this category
	// =============================================================================
	for (let [token, frequency] of tokenFrequencyMap) {
		//ensure that the token is in our vocabulary
		this.dataStore.addTokenToVocabulary(token);

		//add to the total count of tokens we have seen, that are mapped to this category
		this.dataStore.incrementNumberOfTokensPerCategoryByAmount(category, frequency);

		//update the frequency information for this token in this category
		this.dataStore.incrementTokenFrequencyForCategoryByAmount(token, category, frequency);
	}
};

import { Stream } from 'stream-browserify';

export function createLearnStreamForCategory(category) {
	return Stream ? new Stream.Writable({
		decodeStrings: false,
		write: function write(chunk, encoding, next) {
			var text = chunk.toString('utf8');

			this.learn(text, category);

			next();
		}.bind(this)
	}) : undefined;
};