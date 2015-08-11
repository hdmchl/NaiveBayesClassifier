/**
 * Train our naive-bayes classifier by telling it what `category` some `text` corresponds to.
 */

'use strict';

export default function learn(text, category) {
	//TODO: do we want to add1DocForCategory on EVERY learn? What about streams...
	this.dataStore.add1DocForCategory(category); //update our count of how many documents mapped to this category

	var tokens = this.tokenizer(text); //break up the text into tokens
	var tokenFrequencyMap = this.generateFrequencyMapForTokens(tokens); //get a frequency count for each token in the text

	// Update our vocabulary and our word frequency counts for this category
	// =============================================================================
	for (var [token, frequency] of tokenFrequencyMap) {
		//update the frequency information for this token in this category
		// this will also add to the total count of tokens we have seen, that are mapped to this category
		// and it will ensure that the token is in our vocabulary
		this.dataStore.addAmountToTokenFrequencyForCategory(frequency, token, category);
	}
};

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